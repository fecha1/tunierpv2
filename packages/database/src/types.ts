// ============================================================
// @tunierp/database — Type exports
// ============================================================

// Re-export all Prisma types from generated client
export type {
  Tenant,
  Plan,
  Module,
  PlanModule,
  TenantModule,
  User,
  Role,
  Session,
  RefreshToken,
  MfaConfig,
  AuditLog,
  Category,
  Brand,
  Unit,
  Product,
  ProductVariant,
  Warehouse,
  Inventory,
  InventoryMovement,
  CustomerGroup,
  Customer,
  Sale,
  SaleItem,
  BankAccount,
  Payment,
  DocumentSequence,
  Supplier,
  Purchase,
  PurchaseItem,
  WebsiteTemplate,
  WebsitePage,
  WebsiteSettings,
} from './generated/prisma/client';

// Re-export enums
export {
  TenantStatus,
  BusinessType,
  RoleLevel,
  SaleType,
  SaleStatus,
  PaymentStatus,
  PaymentType,
  PaymentMethod,
  MovementType,
  ReferenceType,
  PurchaseType,
  PurchaseStatus,
  PageType,
  DocumentCode,
} from './generated/prisma/client';
