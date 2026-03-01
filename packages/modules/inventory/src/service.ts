import { prisma, withTenantScope } from '@tunierp/database';

// ── Inventory Service ────────────────────────────────────

/**
 * Get stock levels with filters
 */
export async function getStockLevels(
  tenantId: string,
  filters?: { warehouseId?: string; categoryId?: string; lowStockOnly?: boolean; search?: string },
) {
  const scoped = withTenantScope(prisma, tenantId);

  const where: any = {};
  if (filters?.warehouseId) where.warehouseId = filters.warehouseId;
  if (filters?.lowStockOnly) where.quantity = { lte: prisma.inventory.fields?.quantity || 10 };

  const inventory = await scoped.inventory.findMany({
    where,
    include: {
      product: { select: { id: true, name: true, sku: true, barcode: true, category: { select: { name: true } } } },
      warehouse: { select: { id: true, name: true, code: true } },
      variant: { select: { id: true, name: true, sku: true } },
    },
    orderBy: { product: { name: 'asc' } },
  });

  // Filter by search / category / low stock using application logic
  let results = inventory;
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (i: any) => i.product.name.toLowerCase().includes(q) || i.product.sku?.toLowerCase().includes(q),
    );
  }
  if (filters?.categoryId) {
    results = results.filter((i: any) => i.product.categoryId === filters.categoryId);
  }
  if (filters?.lowStockOnly) {
    results = results.filter((i: any) => i.quantity <= (i.product.minStock || 10));
  }

  return results;
}

/**
 * Get movements history
 */
export async function getMovements(
  tenantId: string,
  filters?: { warehouseId?: string; type?: string; startDate?: Date; endDate?: Date; limit?: number },
) {
  const scoped = withTenantScope(prisma, tenantId);

  const where: any = {};
  if (filters?.warehouseId) where.warehouseId = filters.warehouseId;
  if (filters?.type) where.movementType = filters.type;
  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters?.startDate) where.createdAt.gte = filters.startDate;
    if (filters?.endDate) where.createdAt.lte = filters.endDate;
  }

  return scoped.inventoryMovement.findMany({
    where,
    include: {
      product: { select: { name: true, sku: true } },
      warehouse: { select: { name: true, code: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit || 50,
  });
}

/**
 * Create a stock movement (IN / OUT / ADJUSTMENT / TRANSFER)
 */
export async function createMovement(
  tenantId: string,
  data: {
    productId: string;
    variantId?: string;
    warehouseId: string;
    type: 'in' | 'out' | 'adjustment' | 'transfer';
    quantity: number;
    reason?: string;
    referenceType?: string;
    referenceId?: string;
    userId: string;
  },
) {
  const scoped = withTenantScope(prisma, tenantId);

  // Create movement record
  const movement = await scoped.inventoryMovement.create({
    data: {
      tenantId,
      productId: data.productId,
      variantId: data.variantId,
      warehouseId: data.warehouseId,
      movementType: data.type as any,
      quantity: data.quantity,
      notes: data.reason,
      referenceType: data.referenceType as any,
      referenceId: data.referenceId,
    },
  });

  // Update inventory level
  const inventoryRecord = await prisma.inventory.findFirst({
    where: {
      tenantId,
      productId: data.productId,
      warehouseId: data.warehouseId,
      ...(data.variantId ? { variantId: data.variantId } : {}),
    },
  });

  const quantityDelta =
    data.type === 'in' ? data.quantity : -data.quantity;

  if (inventoryRecord) {
    await prisma.inventory.update({
      where: { id: inventoryRecord.id },
      data: { quantity: inventoryRecord.quantity.add(quantityDelta) },
    });
  } else {
    await prisma.inventory.create({
      data: {
        tenantId,
        productId: data.productId,
        variantId: data.variantId,
        warehouseId: data.warehouseId,
        quantity: Math.max(0, quantityDelta),
      },
    });
  }

  return movement;
}

/**
 * CRUD Warehouses
 */
export async function getWarehouses(tenantId: string) {
  return withTenantScope(prisma, tenantId).warehouse.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function createWarehouse(
  tenantId: string,
  data: { name: string; code: string; address?: string; isDefault?: boolean },
) {
  if (data.isDefault) {
    // Unset existing default
    await prisma.warehouse.updateMany({
      where: { tenantId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return prisma.warehouse.create({
    data: { tenantId, ...data },
  });
}

export async function updateWarehouse(
  tenantId: string,
  warehouseId: string,
  data: { name?: string; code?: string; address?: string; isDefault?: boolean },
) {
  if (data.isDefault) {
    await prisma.warehouse.updateMany({
      where: { tenantId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return prisma.warehouse.update({
    where: { id: warehouseId },
    data,
  });
}

/**
 * Dashboard stats
 */
export async function getInventoryStats(tenantId: string) {
  const scoped = withTenantScope(prisma, tenantId);

  const [totalProducts, totalInventory, lowStockCount, recentMovements] = await Promise.all([
    scoped.product.count(),
    scoped.inventory.aggregate({ _sum: { quantity: true } }),
    scoped.inventory.count({
      where: { quantity: { lte: 10 } }, // TODO: use product.minStock
    }),
    scoped.inventoryMovement.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  return {
    totalProducts,
    totalStock: totalInventory._sum.quantity || 0,
    lowStockCount,
    weeklyMovements: recentMovements,
  };
}
