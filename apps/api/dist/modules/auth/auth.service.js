"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@tunierp/database");
const auth_1 = require("@tunierp/auth");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    /**
     * Login with email + password
     */
    async login(email, password) {
        // Find user by email (across all tenants — email is unique per tenant)
        const user = await database_1.prisma.user.findFirst({
            where: { email, isActive: true },
            include: {
                role: true,
                tenant: { select: { id: true, name: true, slug: true, status: true, logoUrl: true } },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        if (user.tenant.status === 'suspended' || user.tenant.status === 'cancelled') {
            throw new common_1.UnauthorizedException('Votre compte entreprise est suspendu');
        }
        // Verify password
        const isValid = await (0, auth_1.verifyPassword)(password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        // Generate tokens
        const tokenPayload = {
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email,
            roleCode: user.role?.code || 'viewer',
            roleLevel: user.role?.level || 0,
        };
        const accessToken = (0, auth_1.generateAccessToken)(tokenPayload);
        const refreshTokenId = (0, crypto_1.randomUUID)();
        const refreshToken = (0, auth_1.generateRefreshToken)({
            userId: user.id,
            tenantId: user.tenantId,
            tokenId: refreshTokenId,
        });
        // Store refresh token in DB
        await database_1.prisma.refreshToken.create({
            data: {
                id: refreshTokenId,
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        // Update last login
        await database_1.prisma.user.update({
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
                role: user.role ? { code: user.role.code, name: user.role.name, level: user.role.level } : null,
            },
            tenant: user.tenant,
        };
    }
    /**
     * Refresh access token using a refresh token
     */
    async refreshTokens(refreshTokenStr) {
        let payload;
        try {
            payload = (0, auth_1.verifyRefreshToken)(refreshTokenStr);
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token invalide');
        }
        // Check token in DB
        const storedToken = await database_1.prisma.refreshToken.findUnique({
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
            throw new common_1.UnauthorizedException('Refresh token expiré ou révoqué');
        }
        const { user } = storedToken;
        // Revoke old refresh token
        await database_1.prisma.refreshToken.update({
            where: { id: payload.tokenId },
            data: { revokedAt: new Date() },
        });
        // Generate new tokens
        const newAccessToken = (0, auth_1.generateAccessToken)({
            userId: user.id,
            tenantId: user.tenantId,
            email: user.email,
            roleCode: user.role?.code || 'viewer',
            roleLevel: user.role?.level || 0,
        });
        const newRefreshTokenId = (0, crypto_1.randomUUID)();
        const newRefreshToken = (0, auth_1.generateRefreshToken)({
            userId: user.id,
            tenantId: user.tenantId,
            tokenId: newRefreshTokenId,
        });
        await database_1.prisma.refreshToken.create({
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
    async register(data) {
        // Check if email already exists
        const existingUser = await database_1.prisma.user.findFirst({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Cet email est déjà utilisé');
        }
        // Find plan
        const plan = await database_1.prisma.plan.findUnique({ where: { code: data.planCode } });
        if (!plan) {
            throw new common_1.BadRequestException('Plan invalide');
        }
        // Generate slug from tenant name
        const slug = data.tenantName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 90);
        // Check slug uniqueness
        const existingTenant = await database_1.prisma.tenant.findUnique({ where: { slug } });
        if (existingTenant) {
            throw new common_1.BadRequestException('Ce nom d\'entreprise est déjà pris');
        }
        const schemaName = `tenant_${slug.replace(/-/g, '_')}`;
        // Create tenant
        const tenant = await database_1.prisma.tenant.create({
            data: {
                name: data.tenantName,
                slug,
                schemaName,
                businessType: data.businessType,
                planId: plan.id,
                status: plan.trialDays > 0 ? 'trial' : 'active',
                settings: { language: 'fr', dateFormat: 'DD/MM/YYYY', numberFormat: '1.000,000' },
            },
        });
        // Activate core modules + plan modules
        const planModules = await database_1.prisma.planModule.findMany({
            where: { planId: plan.id, isIncluded: true },
            include: { module: true },
        });
        for (const pm of planModules) {
            await database_1.prisma.tenantModule.create({
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
            await database_1.prisma.role.create({ data: { tenantId: tenant.id, ...r } });
        }
        // Get admin role
        const adminRole = await database_1.prisma.role.findUnique({
            where: { tenantId_code: { tenantId: tenant.id, code: 'tenant_admin' } },
        });
        // Create admin user
        const passwordHash = await (0, auth_1.hashPassword)(data.password);
        const user = await database_1.prisma.user.create({
            data: {
                tenantId: tenant.id,
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                roleId: adminRole.id,
                isActive: true,
            },
        });
        // Create default warehouse
        await database_1.prisma.warehouse.create({
            data: {
                tenantId: tenant.id,
                name: 'Entrepôt Principal',
                code: 'MAIN',
                isDefault: true,
            },
        });
        // Create document sequences for current year
        const year = new Date().getFullYear();
        const docTypes = ['DEV', 'FAC', 'BL', 'BC', 'REC', 'PRO', 'AVF', 'GAR', 'DP'];
        for (const docType of docTypes) {
            await database_1.prisma.documentSequence.create({
                data: { tenantId: tenant.id, docType, prefix: docType, year, lastNumber: 0, format: '{prefix}-{year}-{number:5}' },
            });
        }
        // Auto-login: generate tokens
        const tokenPayload = {
            userId: user.id,
            tenantId: tenant.id,
            email: user.email,
            roleCode: 'tenant_admin',
            roleLevel: 90,
        };
        const accessToken = (0, auth_1.generateAccessToken)(tokenPayload);
        const refreshTokenId = (0, crypto_1.randomUUID)();
        const refreshToken = (0, auth_1.generateRefreshToken)({
            userId: user.id,
            tenantId: tenant.id,
            tokenId: refreshTokenId,
        });
        await database_1.prisma.refreshToken.create({
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
    async logout(userId) {
        await database_1.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map