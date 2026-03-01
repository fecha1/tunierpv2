// ============================================================
// Shared — Custom decorators
// ============================================================
import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PERMISSIONS_KEY, MODULE_KEY } from '../guards/jwt-auth.guard';

/**
 * Decorator to require specific permissions on a route
 * @example @Permissions('products.create', 'products.update')
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Decorator to require a specific module to be active
 * @example @RequireModule('inventory')
 */
export const RequireModule = (moduleCode: string) =>
  SetMetadata(MODULE_KEY, moduleCode);

/**
 * Extract the authenticated user context from the request
 * @example @Auth() auth: AuthContext
 */
export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth;
  },
);

/**
 * Extract the tenant ID from the request
 * @example @TenantId() tenantId: string
 */
export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId;
  },
);
