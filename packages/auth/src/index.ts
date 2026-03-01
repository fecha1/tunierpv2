// ============================================================
// @tunierp/auth — Package entry point
// ============================================================

// Tokens
export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractBearerToken,
} from './tokens';
export type { TokenPayload, RefreshTokenPayload } from './tokens';

// Guards
export {
  authenticate,
  requirePermission,
  requireAnyPermission,
  requireRoleLevel,
  requireModule,
  AuthError,
} from './guards';
export type { AuthContext } from './guards';

// Permissions
export {
  PERMISSIONS,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
} from './permissions';
export type { PermissionKey } from './permissions';

// Utils
export { hashPassword, verifyPassword } from './utils';
