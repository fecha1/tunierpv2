// ============================================================
// Shared — Auth Guard (NestJS Guard decorator)
// ============================================================
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { authenticate, requireModule, type AuthContext } from '@tunierp/auth';
import { hasPermission } from '@tunierp/auth';

export const PERMISSIONS_KEY = 'permissions';
export const MODULE_KEY = 'module';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Authenticate (JWT)
    let authCtx: AuthContext;
    try {
      authCtx = await authenticate(request.headers.authorization);
    } catch (error: any) {
      throw new UnauthorizedException(error.message || 'Non authentifié');
    }

    // Attach auth context to request
    request.auth = authCtx;
    request.tenantId = authCtx.tenantId;
    request.userId = authCtx.userId;

    // 2. Check module requirement
    const requiredModule = this.reflector.get<string>(MODULE_KEY, context.getHandler())
      || this.reflector.get<string>(MODULE_KEY, context.getClass());

    if (requiredModule) {
      try {
        await requireModule(authCtx.tenantId, requiredModule, authCtx.isSuperAdmin);
      } catch {
        throw new ForbiddenException(`Module "${requiredModule}" non activé`);
      }
    }

    // 3. Check permissions
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAccess = requiredPermissions.some((perm) =>
        hasPermission(authCtx.permissions, perm)
      );
      if (!hasAccess) {
        throw new ForbiddenException('Permissions insuffisantes');
      }
    }

    return true;
  }
}
