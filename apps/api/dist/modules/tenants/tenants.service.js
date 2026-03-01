"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@tunierp/database");
let TenantsService = class TenantsService {
    /**
     * Get tenant details by ID
     */
    async getTenant(tenantId) {
        const tenant = await database_1.prisma.tenant.findUnique({
            where: { id: tenantId },
            include: {
                plan: { select: { id: true, name: true, code: true, limits: true, features: true } },
                _count: { select: { users: true, tenantModules: true } },
            },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Entreprise introuvable');
        }
        return tenant;
    }
    /**
     * Update tenant settings
     */
    async updateTenant(tenantId, data) {
        const tenant = await database_1.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) {
            throw new common_1.NotFoundException('Entreprise introuvable');
        }
        return database_1.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
                ...(data.country !== undefined && { country: data.country }),
                ...(data.settings && {
                    settings: { ...tenant.settings, ...data.settings },
                }),
            },
        });
    }
    /**
     * List tenant users
     */
    async listUsers(tenantId) {
        const scoped = (0, database_1.withTenantScope)(database_1.prisma, tenantId);
        return scoped.user.findMany({
            include: { role: { select: { name: true, code: true, level: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    /**
     * Create a user for tenant
     */
    async createUser(tenantId, data) {
        // Check user limit
        const tenant = await database_1.prisma.tenant.findUnique({
            where: { id: tenantId },
            include: { plan: true, _count: { select: { users: true } } },
        });
        if (!tenant)
            throw new common_1.NotFoundException('Entreprise introuvable');
        const maxUsers = tenant.plan?.limits?.users ?? 0;
        if (maxUsers > 0 && tenant._count.users >= maxUsers) {
            throw new common_1.BadRequestException(`Limite d'utilisateurs atteinte (${maxUsers}). Passez à un plan supérieur.`);
        }
        // Check email uniqueness within tenant
        const existing = await database_1.prisma.user.findFirst({
            where: { tenantId, email: data.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Cet email est déjà utilisé dans votre entreprise');
        }
        return database_1.prisma.user.create({
            data: { tenantId, ...data, isActive: true },
            include: { role: { select: { name: true, code: true, level: true } } },
        });
    }
    /**
     * List tenant roles
     */
    async listRoles(tenantId) {
        return database_1.prisma.role.findMany({
            where: { tenantId },
            orderBy: { level: 'desc' },
        });
    }
    /**
     * Get tenant subscription / billing info
     */
    async getSubscription(tenantId) {
        const tenant = await database_1.prisma.tenant.findUnique({
            where: { id: tenantId },
            include: {
                plan: true,
                tenantModules: { include: { module: true }, where: { isActive: true } },
                _count: { select: { users: true, products: true } },
            },
        });
        if (!tenant)
            throw new common_1.NotFoundException('Entreprise introuvable');
        const limits = tenant.plan?.limits ?? {};
        return {
            plan: tenant.plan,
            status: tenant.status,
            activeModules: tenant.tenantModules.map((tm) => ({
                code: tm.module.code,
                name: tm.module.name,
                activatedAt: tm.activatedAt,
            })),
            usage: {
                users: tenant._count.users,
                maxUsers: limits.users ?? 0,
                products: tenant._count.products,
                maxProducts: limits.products ?? 0,
            },
        };
    }
    /**
     * Upgrade plan
     */
    async upgradePlan(tenantId, planCode) {
        const plan = await database_1.prisma.plan.findUnique({ where: { code: planCode } });
        if (!plan)
            throw new common_1.BadRequestException('Plan invalide');
        const tenant = await database_1.prisma.tenant.update({
            where: { id: tenantId },
            data: { planId: plan.id },
            include: { plan: true },
        });
        // Activate any new modules included in the plan
        const planModules = await database_1.prisma.planModule.findMany({
            where: { planId: plan.id, isIncluded: true },
        });
        for (const pm of planModules) {
            await database_1.prisma.tenantModule.upsert({
                where: { tenantId_moduleId: { tenantId, moduleId: pm.moduleId } },
                create: { tenantId, moduleId: pm.moduleId, isActive: true },
                update: { isActive: true },
            });
        }
        return tenant;
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)()
], TenantsService);
//# sourceMappingURL=tenants.service.js.map