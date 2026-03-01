// ============================================================
// @tunierp/auth — Auth Guards (framework-agnostic)
// Can be used by NestJS, Next.js middleware, or Express
// ============================================================
import { prisma } from '@tunierp/database';
import { verifyAccessToken, extractBearerToken, type TokenPayload } from '../tokens';
import { hasPermission, hasAnyPermission } from '../permissions';

export interface AuthContext {
  userId: string;
  tenantId: string;
  email: string;
  roleCode: string;
  roleLevel: number;
  permissions: string[];
}

/**
 * Authenticate a request — extracts and verifies JWT from Authorization header.
 * Returns the AuthContext or throws an error.
 */
export async function authenticate(authHeader?: string): Promise<AuthContext> {
  const token = extractBearerToken(authHeader);
  if (!token) {
    throw new AuthError('Token d\'authentification manquant', 401);
  }

  try {
    const payload = verifyAccessToken(token);

    // Fetch the user's role permissions from DB
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        isActive: true,
        tenantId: true,
        role: { select: { permissions: true, code: true, level: true } },
        tenant: { select: { status: true } },
      },
    });

    if (!user || !user.isActive) {
      throw new AuthError('Utilisateur inactif ou introuvable', 401);
    }

    if (user.tenant.status === 'suspended' || user.tenant.status === 'cancelled') {
      throw new AuthError('Compte entreprise suspendu', 403);
    }

    const permissions = (user.role?.permissions as string[]) || [];

    return {
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      roleCode: user.role?.code || 'viewer',
      roleLevel: user.role?.level || 0,
      permissions,
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('Token invalide ou expiré', 401);
  }
}

/**
 * Guard: Verify that the user has a specific permission
 */
export function requirePermission(ctx: AuthContext, permission: string): void {
  if (!hasPermission(ctx.permissions, permission)) {
    throw new AuthError(`Permission requise: ${permission}`, 403);
  }
}

/**
 * Guard: Verify that the user has any of the required permissions
 */
export function requireAnyPermission(ctx: AuthContext, permissions: string[]): void {
  if (!hasAnyPermission(ctx.permissions, permissions)) {
    throw new AuthError(`Permissions insuffisantes`, 403);
  }
}

/**
 * Guard: Verify that the user's role level is at least the required level
 */
export function requireRoleLevel(ctx: AuthContext, minLevel: number): void {
  if (ctx.roleLevel < minLevel) {
    throw new AuthError('Niveau de rôle insuffisant', 403);
  }
}

/**
 * Guard: Verify that a module is active for the tenant
 */
export async function requireModule(tenantId: string, moduleCode: string): Promise<void> {
  const tenantModule = await prisma.tenantModule.findFirst({
    where: {
      tenantId,
      module: { code: moduleCode },
      isActive: true,
    },
  });

  if (!tenantModule) {
    throw new AuthError(`Module "${moduleCode}" non activé pour ce compte`, 403);
  }
}

/**
 * Custom error class for authentication/authorization errors
 */
export class AuthError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}
