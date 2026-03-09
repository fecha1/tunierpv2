// ============================================================
// @tunierp/auth — JWT Token utilities
// ============================================================
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  tenantId: string;
  email: string;
  roleCode: string;
  roleLevel: number;
  isSuperAdmin: boolean;
}

export interface RefreshTokenPayload {
  userId: string;
  tenantId: string;
  tokenId: string;
  isSuperAdmin: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'tunierp-dev-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'tunierp-dev-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate an access token (short-lived, 15min default)
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'tunierp',
    audience: 'tunierp-api',
  });
}

/**
 * Generate a refresh token (long-lived, 7 days default)
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'tunierp',
    audience: 'tunierp-refresh',
  });
}

/**
 * Verify and decode an access token
 */
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'tunierp',
    audience: 'tunierp-api',
  }) as TokenPayload;
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET, {
    issuer: 'tunierp',
    audience: 'tunierp-refresh',
  }) as RefreshTokenPayload;
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}
