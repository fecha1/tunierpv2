import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { authenticate, requireSuperAdmin, type AuthContext } from '@tunierp/auth';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let authCtx: AuthContext;
    try {
      authCtx = await authenticate(request.headers.authorization);
    } catch (error: any) {
      throw new UnauthorizedException(error.message || 'Non authentifié');
    }

    try {
      requireSuperAdmin(authCtx);
    } catch {
      throw new ForbiddenException('Accès réservé aux super administrateurs');
    }

    request.auth = authCtx;
    request.tenantId = authCtx.tenantId;
    request.userId = authCtx.userId;

    return true;
  }
}
