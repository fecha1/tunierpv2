import { prisma, withTenantScope } from '@tunierp/database';
import type { DocumentCode, PurchaseType, PurchaseStatus } from '@tunierp/database';

// ── Suppliers ──────────────────────────────────────────────

export async function listSuppliers(tenantId: string, search?: string) {
  const scoped = withTenantScope(prisma, tenantId);

  const suppliers = await scoped.supplier.findMany({
    orderBy: { name: 'asc' },
  });

  if (search) {
    const q = search.toLowerCase();
    return suppliers.filter(
      (s: any) => s.name.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q),
    );
  }

  return suppliers;
}

export async function createSupplier(
  tenantId: string,
  data: { name: string; email?: string; phone?: string; address?: string; taxId?: string; notes?: string },
) {
  return prisma.supplier.create({ data: { tenantId, ...data } });
}

export async function updateSupplier(
  tenantId: string,
  supplierId: string,
  data: { name?: string; email?: string; phone?: string; address?: string; taxId?: string; notes?: string },
) {
  return prisma.supplier.update({ where: { id: supplierId }, data });
}

// ── Purchase Orders ────────────────────────────────────────

async function generatePurchaseNumber(tenantId: string, docType: DocumentCode): Promise<string> {
  const year = new Date().getFullYear();
  const seq = await prisma.documentSequence.findFirst({
    where: { tenantId, docType, year },
  });

  if (!seq) throw new Error(`Séquence manquante pour ${docType}-${year}`);

  const next = seq.lastNumber + 1;
  await prisma.documentSequence.update({
    where: { id: seq.id },
    data: { lastNumber: next },
  });

  return `${seq.prefix}-${year}-${String(next).padStart(5, '0')}`;
}

export async function listPurchases(
  tenantId: string,
  filters?: { type?: string; status?: string; supplierId?: string; limit?: number; offset?: number },
) {
  const scoped = withTenantScope(prisma, tenantId);

  const where: any = {};
  if (filters?.type) where.purchaseType = filters.type;
  if (filters?.status) where.status = filters.status;
  if (filters?.supplierId) where.supplierId = filters.supplierId;

  const [data, total] = await Promise.all([
    scoped.purchase.findMany({
      where,
      include: {
        supplier: { select: { id: true, name: true } },
        items: {
          include: { product: { select: { name: true, sku: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 25,
      skip: filters?.offset || 0,
    }),
    scoped.purchase.count({ where }),
  ]);

  return { data, total };
}

export async function createPurchaseOrder(
  tenantId: string,
  data: {
    supplierId: string;
    items: Array<{ productId: string; variantId?: string; quantity: number; unitPrice: number; taxRate?: number }>;
    notes?: string;
  },
) {
  const purchaseNumber = await generatePurchaseNumber(tenantId, 'BC' as DocumentCode);

  let subtotal = 0;
  let totalTax = 0;
  const purchaseItems = data.items.map((item) => {
    const lineTotal = item.quantity * item.unitPrice;
    const tax = lineTotal * ((item.taxRate || 19) / 100);
    subtotal += lineTotal;
    totalTax += tax;
    return {
      productId: item.productId || undefined,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate || 19,
      taxAmount: Math.round(tax * 1000) / 1000,
      total: Math.round((lineTotal + tax) * 1000) / 1000,
    };
  });

  return prisma.purchase.create({
    data: {
      tenantId,
      purchaseType: 'order' as PurchaseType,
      purchaseNumber,
      purchaseDate: new Date(),
      supplierId: data.supplierId,
      status: 'draft',
      subtotal,
      taxAmount: totalTax,
      total: Math.round((subtotal + totalTax) * 1000) / 1000,
      notes: data.notes,
      items: {
        create: purchaseItems.map((item) => ({ ...item })),
      },
    },
    include: { items: true, supplier: true },
  });
}

/**
 * Receive purchase order → create stock IN movements
 */
export async function receivePurchaseOrder(
  tenantId: string,
  purchaseId: string,
  warehouseId: string,
  userId: string,
) {
  const purchase = await prisma.purchase.findFirst({
    where: { id: purchaseId, tenantId },
    include: { items: true },
  });

  if (!purchase) throw new Error('Bon de commande introuvable');
  if (purchase.status === 'received') throw new Error('Déjà réceptionné');

  // Create inventory movements for each item
  for (const item of purchase.items) {
    // Create movement
    await prisma.inventoryMovement.create({
      data: {
        tenantId,
        productId: item.productId!,
        variantId: item.variantId,
        warehouseId,
        movementType: 'in',
        quantity: item.quantity,
        notes: `Réception BC ${purchase.purchaseNumber}`,
        referenceType: 'purchase',
        referenceId: purchase.id,
      },
    });

    // Update inventory
    const existing = await prisma.inventory.findFirst({
      where: { tenantId, productId: item.productId!, warehouseId, variantId: item.variantId },
    });

    if (existing) {
      await prisma.inventory.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity.add(item.quantity) },
      });
    } else {
      await prisma.inventory.create({
        data: {
          tenantId,
          productId: item.productId!,
          variantId: item.variantId,
          warehouseId,
          quantity: item.quantity,
        },
      });
    }
  }

  // Update purchase status
  return prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: 'received' },
  });
}

// ── Dashboard Stats ────────────────────────────────────────

export async function getPurchaseStats(tenantId: string) {
  const scoped = withTenantScope(prisma, tenantId);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthlyTotal, pendingOrders, supplierCount] = await Promise.all([
    scoped.purchase.aggregate({
      where: { status: 'received', createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    scoped.purchase.count({ where: { status: { in: ['draft', 'confirmed', 'sent'] } } }),
    scoped.supplier.count(),
  ]);

  return {
    monthlyPurchases: Number(monthlyTotal._sum?.total ?? 0),
    pendingOrders,
    supplierCount,
  };
}
