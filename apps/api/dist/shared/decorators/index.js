"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantId = exports.Auth = exports.RequireModule = exports.Permissions = void 0;
// ============================================================
// Shared — Custom decorators
// ============================================================
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
/**
 * Decorator to require specific permissions on a route
 * @example @Permissions('products.create', 'products.update')
 */
const Permissions = (...permissions) => (0, common_1.SetMetadata)(jwt_auth_guard_1.PERMISSIONS_KEY, permissions);
exports.Permissions = Permissions;
/**
 * Decorator to require a specific module to be active
 * @example @RequireModule('inventory')
 */
const RequireModule = (moduleCode) => (0, common_1.SetMetadata)(jwt_auth_guard_1.MODULE_KEY, moduleCode);
exports.RequireModule = RequireModule;
/**
 * Extract the authenticated user context from the request
 * @example @Auth() auth: AuthContext
 */
exports.Auth = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.auth;
});
/**
 * Extract the tenant ID from the request
 * @example @TenantId() tenantId: string
 */
exports.TenantId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId;
});
//# sourceMappingURL=index.js.map