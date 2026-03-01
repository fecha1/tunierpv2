// ============================================================
// @tunierp/database — Package entry point
// ============================================================

export { prisma } from './client';
export type { PrismaClientType } from './client';
export { withTenantScope } from './tenant-scope';
export type { TenantScopedClient } from './tenant-scope';
export * from './types';
