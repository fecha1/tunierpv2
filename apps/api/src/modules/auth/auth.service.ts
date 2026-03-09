import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { prisma } from '@tunierp/database';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  verifyPassword,
  type TokenPayload,
} from '@tunierp/auth';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  /**
   * Login with email + password
   */
  async login(email: string, password: string) {
    // Email is globally unique — findUnique guarantees one result
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        tenant: { select: { id: true, name: true, slug: true, status: true, logoUrl: true } },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Block suspended/cancelled tenants (super admins bypass)
    if (!user.isSuperAdmin && user.tenant) {
      if (user.tenant.status === 'suspended' || user.tenant.status === 'cancelled') {
        throw new UnauthorizedException('Votre compte entreprise est suspendu');
      }
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      tenantId: user.tenantId || '',
      email: user.email,
      roleCode: user.role?.code || 'viewer',
      roleLevel: user.role?.level || 0,
      isSuperAdmin: user.isSuperAdmin,
    };

    const accessToken = generateAccessToken(tokenPayload);

    const refreshTokenId = randomUUID();
    const refreshToken = generateRefreshToken({
      userId: user.id,
      tenantId: user.tenantId || '',
      tokenId: refreshTokenId,
      isSuperAdmin: user.isSuperAdmin,
    });

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        id: refreshTokenId,
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isSuperAdmin: user.isSuperAdmin,
        role: user.role ? { code: user.role.code, name: user.role.name, level: user.role.level } : null,
      },
      tenant: user.tenant,
    };
  }

  /**
   * Refresh access token using a refresh token
   */
  async refreshTokens(refreshTokenStr: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshTokenStr);
    } catch {
      throw new UnauthorizedException('Refresh token invalide');
    }

    // Check token in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId },
      include: {
        user: {
          include: {
            role: true,
            tenant: { select: { id: true, name: true, slug: true, status: true } },
          },
        },
      },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expiré ou révoqué');
    }

    const { user } = storedToken;

    // Check tenant status (super admins bypass)
    if (!user.isSuperAdmin && user.tenant) {
      if (user.tenant.status === 'suspended' || user.tenant.status === 'cancelled') {
        throw new UnauthorizedException('Votre compte entreprise est suspendu');
      }
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: payload.tokenId },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId || '',
      email: user.email,
      roleCode: user.role?.code || 'viewer',
      roleLevel: user.role?.level || 0,
      isSuperAdmin: user.isSuperAdmin,
    });

    const newRefreshTokenId = randomUUID();
    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      tenantId: user.tenantId || '',
      tokenId: newRefreshTokenId,
      isSuperAdmin: user.isSuperAdmin,
    });

    await prisma.refreshToken.create({
      data: {
        id: newRefreshTokenId,
        userId: user.id,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Register a new tenant + admin user (onboarding)
   */
  async register(data: {
    tenantName: string;
    businessType: string;
    planCode: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    // Check if email already exists (globally unique)
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    // Find plan
    const plan = await prisma.plan.findUnique({ where: { code: data.planCode } });
    if (!plan) {
      throw new BadRequestException('Plan invalide');
    }

    // Generate slug from tenant name
    const slug = data.tenantName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 90);

    // Check slug uniqueness
    const existingTenant = await prisma.tenant.findUnique({ where: { slug } });
    if (existingTenant) {
      throw new BadRequestException('Ce nom d\'entreprise est déjà pris');
    }

    const schemaName = `tenant_${slug.replace(/-/g, '_')}`;

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: data.tenantName,
        slug,
        schemaName,
        businessType: data.businessType as any,
        planId: plan.id,
        status: plan.trialDays > 0 ? 'trial' : 'active',
        settings: { language: 'fr', dateFormat: 'DD/MM/YYYY', numberFormat: '1.000,000' },
      },
    });

    // Activate core modules + plan modules
    const planModules = await prisma.planModule.findMany({
      where: { planId: plan.id, isIncluded: true },
      include: { module: true },
    });

    for (const pm of planModules) {
      await prisma.tenantModule.create({
        data: { tenantId: tenant.id, moduleId: pm.moduleId, isActive: true },
      });
    }

    // Create default roles
    const defaultRoles = [
      { name: 'Administrateur', code: 'tenant_admin', level: 90, isSystem: true, permissions: ['*'] },
      { name: 'Gérant', code: 'manager', level: 70, isSystem: true, permissions: ['dashboard.*', 'products.*', 'sales.*', 'inventory.*', 'customers.*', 'reports.read'] },
      { name: 'Commercial', code: 'sales_rep', level: 40, isSystem: true, permissions: ['dashboard.read', 'products.read', 'sales.*', 'customers.*'] },
      { name: 'Caissier', code: 'cashier', level: 30, isSystem: true, permissions: ['pos.*', 'products.read', 'customers.read'] },
      { name: 'Consultant', code: 'viewer', level: 10, isSystem: true, permissions: ['dashboard.read', 'reports.read'] },
    ];

    for (const r of defaultRoles) {
      await prisma.role.create({ data: { tenantId: tenant.id, ...r } });
    }

    // Get admin role
    const adminRole = await prisma.role.findUnique({
      where: { tenantId_code: { tenantId: tenant.id, code: 'tenant_admin' } },
    });

    // Create admin user
    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        roleId: adminRole!.id,
        isActive: true,
      },
    });

    // Create default warehouse
    await prisma.warehouse.create({
      data: {
        tenantId: tenant.id,
        name: 'Entrepôt Principal',
        code: 'MAIN',
        isDefault: true,
      },
    });

    // Create document sequences for current year
    const year = new Date().getFullYear();
    const docTypes = ['DEV', 'FAC', 'BL', 'BC', 'REC', 'PRO', 'AVF', 'GAR', 'DP'] as const;
    for (const docType of docTypes) {
      await prisma.documentSequence.create({
        data: { tenantId: tenant.id, docType, prefix: docType, year, lastNumber: 0, format: '{prefix}-{year}-{number:5}' },
      });
    }

    // Auto-login: generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      roleCode: 'tenant_admin',
      roleLevel: 90,
      isSuperAdmin: false,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshTokenId = randomUUID();
    const refreshToken = generateRefreshToken({
      userId: user.id,
      tenantId: tenant.id,
      tokenId: refreshTokenId,
      isSuperAdmin: false,
    });

    await prisma.refreshToken.create({
      data: {
        id: refreshTokenId,
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
    };
  }

  /**
   * Logout — revoke refresh token
   */
  async logout(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
