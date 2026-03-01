// ============================================================
// @tunierp/database — Tenant-scoped Prisma Client Extension
// Auto-injects tenant_id WHERE clause on all queries
// ============================================================
import type { PrismaClientType } from './client';

// Models that require tenant_id scoping (all tenant-owned tables)
const TENANT_SCOPED_MODELS = new Set([
  'User', 'Role', 'AuditLog', 'Category', 'Brand', 'Unit',
  'Product', 'Warehouse', 'Inventory', 'InventoryMovement',
  'CustomerGroup', 'Customer', 'Sale', 'SaleItem', 'BankAccount',
  'Payment', 'DocumentSequence', 'Supplier', 'Purchase', 'PurchaseItem',
  'WebsitePage', 'WebsiteSettings', 'TenantModule',
]);

/**
 * Creates a tenant-scoped Prisma client that automatically filters
 * all queries by tenant_id. Use this in every API handler / service.
 *
 * @example
 * const db = withTenantScope(prisma, req.tenantId);
 * const products = await db.product.findMany(); // auto-filtered
 */
export function withTenantScope(prisma: PrismaClientType, tenantId: string) {
  return prisma.$extends({
    name: 'tenantScope',
    query: {
      $allOperations({ model, operation, args, query }) {
        if (!model || !TENANT_SCOPED_MODELS.has(model)) {
          return query(args);
        }

        // For read operations — inject where clause
        if (['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'].includes(operation)) {
          args.where = { ...args.where, tenantId };
          return query(args);
        }

        // For update/delete operations — inject where clause
        if (['update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
          args.where = { ...args.where, tenantId };
          return query(args);
        }

        // For create operations — inject tenantId into data
        if (['create', 'createMany'].includes(operation)) {
          if (operation === 'createMany' && Array.isArray((args as any).data)) {
            (args as any).data = (args as any).data.map((item: any) => ({
              ...item,
              tenantId,
            }));
          } else if ((args as any).data) {
            (args as any).data = { ...(args as any).data, tenantId };
          }
          return query(args);
        }

        // For upsert — inject into both where and create
        if (operation === 'upsert') {
          args.where = { ...args.where, tenantId };
          (args as any).create = { ...(args as any).create, tenantId };
          return query(args);
        }

        return query(args);
      },
    },
  });
}

export type TenantScopedClient = ReturnType<typeof withTenantScope>;
