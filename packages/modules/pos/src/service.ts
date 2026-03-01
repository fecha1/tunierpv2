import { prisma, withTenantScope } from '@tunierp/database';
import type { SaleType, PaymentMethod } from '@tunierp/database';

// ── POS Session ────────────────────────────────────────────

/**
 * Open a new POS session (start of shift)
 */
export async function openSession(
  tenantId: string,
  userId: string,
  openingCash: number,
) {
  // Check if user already has an open session
  const existing = await prisma.sale.findFirst({
    where: {
      tenantId,
      saleType: 'receipt',
      // We'll track sessions via a separate approach — using metadata on sales
    },
  });

  // For now we store POS sessions as a Sale of type 'pos_ticket' with metadata
  // In a full implementation you'd have a POSSession model
  // This is a simplified version using existing schema

  return {
    sessionId: `session-${Date.now()}`,
    userId,
    openingCash,
    openedAt: new Date(),
    status: 'open',
  };
}

/**
 * Create a POS sale (ticket)
 */
export async function createPOSSale(
  tenantId: string,
  data: {
    items: Array<{
      productId: string;
      variantId?: string;
      name: string;
      quantity: number;
      unitPrice: number;
      discount?: number;
      taxRate?: number;
    }>;
    customerId?: string;
    paymentMethod: string;
    amountPaid: number;
    userId: string;
    warehouseId: string;
  },
) {
  // Generate ticket number
  const year = new Date().getFullYear();
  const seq = await prisma.documentSequence.findFirst({
    where: { tenantId, docType: 'FAC', year },
  });

  const ticketNumber = seq
    ? `TK-${year}-${String(seq.lastNumber + 1).padStart(5, '0')}`
    : `TK-${Date.now()}`;

  if (seq) {
    await prisma.documentSequence.update({
      where: { id: seq.id },
      data: { lastNumber: seq.lastNumber + 1 },
    });
  }

  // Calculate totals
  let subtotal = 0;
  let totalTax = 0;

  const saleItems = data.items.map((item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const discountAmt = lineTotal * ((item.discount || 0) / 100);
    const taxable = lineTotal - discountAmt;
    const tax = taxable * ((item.taxRate || 19) / 100);
    subtotal += taxable;
    totalTax += tax;

    return {
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountPercent: item.discount || 0,
      discountAmount: Math.round(discountAmt * 1000) / 1000,
      taxRate: item.taxRate || 19,
      taxAmount: Math.round(tax * 1000) / 1000,
      total: Math.round((taxable + tax) * 1000) / 1000,
    };
  });

  const stampDuty = 0; // POS tickets usually don't have stamp duty
  const grandTotal = Math.round((subtotal + totalTax) * 1000) / 1000;
  const change = data.amountPaid - grandTotal;

  // Create sale
  const sale = await prisma.sale.create({
    data: {
      tenantId,
      saleType: 'receipt' as SaleType,
      saleNumber: ticketNumber,
      saleDate: new Date(),
      customerId: data.customerId,
      status: 'paid',
      subtotal,
      taxAmount: totalTax,
      timbreFiscal: 0,
      total: grandTotal,
      amountPaid: grandTotal,
      createdBy: data.userId,
      items: {
        create: saleItems.map((item) => ({ ...item })),
      },
    },
    include: { items: true },
  });

  // Create payment
  await prisma.payment.create({
    data: {
      tenantId,
      saleId: sale.id,
      customerId: data.customerId,
      amount: grandTotal,
      paymentNumber: `PAY-${Date.now()}`,
      paymentType: 'received',
      paymentMethod: data.paymentMethod as PaymentMethod,
      paymentDate: new Date(),
      status: 'completed',
    },
  });

  // Deduct stock
  for (const item of data.items) {
    await prisma.inventoryMovement.create({
      data: {
        tenantId,
        productId: item.productId,
        variantId: item.variantId,
        warehouseId: data.warehouseId,
        movementType: 'out',
        quantity: item.quantity,
        notes: `Vente POS ${ticketNumber}`,
        referenceType: 'sale',
        referenceId: sale.id,
      },
    });

    const inv = await prisma.inventory.findFirst({
      where: { tenantId, productId: item.productId, warehouseId: data.warehouseId },
    });

    if (inv) {
      const newQty = Number(inv.quantity) - item.quantity;
      await prisma.inventory.update({
        where: { id: inv.id },
        data: { quantity: Math.max(0, newQty) },
      });
    }
  }

  return {
    sale,
    ticketNumber,
    total: grandTotal,
    amountPaid: data.amountPaid,
    change: Math.max(0, change),
    paymentMethod: data.paymentMethod,
  };
}

/**
 * Search products for POS (fast lookup by barcode/SKU/name)
 */
export async function searchProducts(tenantId: string, query: string, warehouseId?: string) {
  const scoped = withTenantScope(prisma, tenantId);

  const products = await scoped.product.findMany({
    where: {
      isActive: true,
      OR: [
        { barcode: query },
        { sku: { contains: query } },
        { name: { contains: query } },
      ],
    },
    include: {
      category: { select: { name: true } },
      variants: { where: { isActive: true } },
    },
    take: 20,
  });

  // Attach stock levels if warehouse specified
  if (warehouseId) {
    const productIds = products.map((p: any) => p.id);
    const inventory = await prisma.inventory.findMany({
      where: { tenantId, warehouseId, productId: { in: productIds } },
    });

    return products.map((p: any) => {
      const stock = inventory.find((i: any) => i.productId === p.id);
      return { ...p, stockQuantity: stock?.quantity || 0 };
    });
  }

  return products;
}

/**
 * Get today's POS stats
 */
export async function getPOSStats(tenantId: string, userId?: string) {
  const scoped = withTenantScope(prisma, tenantId);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const where: any = {
    saleType: 'receipt',
    createdAt: { gte: startOfDay },
  };

  const [ticketCount, totalSales, cashTotal] = await Promise.all([
    scoped.sale.count({ where }),
    scoped.sale.aggregate({ where, _sum: { total: true } }) as any,
    scoped.payment.aggregate({
      where: {
        paymentDate: { gte: startOfDay },
        paymentMethod: 'cash',
        sale: { saleType: 'receipt' },
      },
      _sum: { amount: true },
    }) as any,
  ]);

  const totalAmount = Number(totalSales._sum?.total ?? 0);

  return {
    ticketCount,
    totalSales: totalAmount,
    cashTotal: Number(cashTotal._sum?.amount ?? 0),
    averageTicket: ticketCount > 0 ? totalAmount / ticketCount : 0,
  };
}
