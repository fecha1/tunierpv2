import { prisma, withTenantScope } from '@tunierp/database';

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
      type: 'pos_ticket',
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
      discount: item.discount || 0,
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
      type: 'pos_ticket',
      number: ticketNumber,
      customerId: data.customerId,
      status: 'paid',
      subtotal,
      taxAmount: totalTax,
      stampDuty,
      total: grandTotal,
      paidAt: new Date(),
      items: {
        create: saleItems.map((item) => ({ tenantId, ...item })),
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
      method: data.paymentMethod as any,
      status: 'completed',
      paymentDate: new Date(),
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
        type: 'out',
        quantity: item.quantity,
        reason: `Vente POS ${ticketNumber}`,
        referenceType: 'sale',
        referenceId: sale.id,
      },
    });

    const inv = await prisma.inventory.findFirst({
      where: { tenantId, productId: item.productId, warehouseId: data.warehouseId },
    });

    if (inv) {
      await prisma.inventory.update({
        where: { id: inv.id },
        data: { quantity: Math.max(0, inv.quantity - item.quantity) },
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
    type: 'pos_ticket',
    createdAt: { gte: startOfDay },
  };

  const [ticketCount, totalSales, cashTotal] = await Promise.all([
    scoped.sale.count({ where }),
    scoped.sale.aggregate({ where, _sum: { total: true } }),
    scoped.payment.aggregate({
      where: {
        paymentDate: { gte: startOfDay },
        method: 'cash',
        sale: { type: 'pos_ticket' },
      },
      _sum: { amount: true },
    }),
  ]);

  return {
    ticketCount,
    totalSales: totalSales._sum.total || 0,
    cashTotal: cashTotal._sum.amount || 0,
    averageTicket: ticketCount > 0 ? (totalSales._sum.total || 0) / ticketCount : 0,
  };
}
