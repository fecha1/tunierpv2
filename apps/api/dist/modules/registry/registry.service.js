"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@tunierp/database");
const core_1 = require("@tunierp/core");
let RegistryService = class RegistryService {
    /**
     * List all available modules in the system
     */
    listAllModules() {
        return (0, core_1.getAllModules)().map((m) => ({
            code: m.code,
            name: m.name,
            category: m.category,
            icon: m.icon,
            description: m.description,
            isCore: m.isCore,
            dependencies: m.dependencies,
        }));
    }
    /**
     * List all modules in DB (for catalog display)
     */
    async listModuleCatalog() {
        return database_1.prisma.module.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                category: true,
                icon: true,
                isCore: true,
                priceMonthly: true,
                isActive: true,
            },
        });
    }
    /**
     * List active modules for a tenant
     */
    async getTenantModules(tenantId) {
        const tenantModules = await database_1.prisma.tenantModule.findMany({
            where: { tenantId, isActive: true },
            include: {
                module: {
                    select: { id: true, code: true, name: true, category: true, icon: true, description: true, isCore: true },
                },
            },
        });
        return tenantModules.map((tm) => ({
            ...tm.module,
            activatedAt: tm.activatedAt,
        }));
    }
    /**
     * Get sidebar for a tenant (based on active modules + user permissions)
     */
    async getSidebar(tenantId, userPermissions) {
        return (0, core_1.buildSidebar)(tenantId, userPermissions);
    }
    /**
     * Activate a module for a tenant
     */
    async activateModule(tenantId, moduleCode) {
        // Find module in DB
        const mod = await database_1.prisma.module.findUnique({ where: { code: moduleCode } });
        if (!mod) {
            throw new common_1.NotFoundException(`Module "${moduleCode}" introuvable`);
        }
        // Check if module is already active
        const existing = await database_1.prisma.tenantModule.findFirst({
            where: { tenantId, moduleId: mod.id },
        });
        if (existing?.isActive) {
            throw new common_1.BadRequestException(`Le module "${mod.name}" est déjà activé`);
        }
        // Check dependencies from registry
        const depCheck = await (0, core_1.checkModuleDependencies)(tenantId, moduleCode);
        if (!depCheck.met) {
            throw new common_1.BadRequestException(`Dépendances manquantes: ${depCheck.missing.join(', ')}. Activez-les d'abord.`);
        }
        // Check plan allows this module
        const tenant = await database_1.prisma.tenant.findUnique({
            where: { id: tenantId },
            include: { plan: { include: { planModules: { include: { module: true } } } } },
        });
        if (!tenant)
            throw new common_1.NotFoundException('Entreprise introuvable');
        const planModule = tenant.plan?.planModules.find((pm) => pm.module.code === moduleCode);
        if (!planModule) {
            throw new common_1.BadRequestException(`Le module "${mod.name}" n'est pas disponible dans votre plan "${tenant.plan?.name}". Passez à un plan supérieur.`);
        }
        // Upsert
        if (existing) {
            await database_1.prisma.tenantModule.update({
                where: { tenantId_moduleId: { tenantId, moduleId: mod.id } },
                data: { isActive: true, activatedAt: new Date() },
            });
        }
        else {
            await database_1.prisma.tenantModule.create({
                data: { tenantId, moduleId: mod.id, isActive: true },
            });
        }
        return { success: true, message: `Module "${mod.name}" activé avec succès` };
    }
    /**
     * Deactivate a module for a tenant
     */
    async deactivateModule(tenantId, moduleCode) {
        const mod = await database_1.prisma.module.findUnique({ where: { code: moduleCode } });
        if (!mod) {
            throw new common_1.NotFoundException(`Module "${moduleCode}" introuvable`);
        }
        if (mod.isCore) {
            throw new common_1.BadRequestException('Les modules de base ne peuvent pas être désactivés');
        }
        const tenantModule = await database_1.prisma.tenantModule.findFirst({
            where: { tenantId, moduleId: mod.id, isActive: true },
        });
        if (!tenantModule) {
            throw new common_1.BadRequestException(`Le module "${mod.name}" n'est pas actif`);
        }
        // Check if other active modules depend on this one
        const allActiveModules = await this.getTenantModules(tenantId);
        const registeredModules = (0, core_1.getAllModules)();
        for (const activeMod of allActiveModules) {
            const manifest = registeredModules.find((m) => m.code === activeMod.code);
            if (manifest && manifest.dependencies.includes(moduleCode)) {
                throw new common_1.BadRequestException(`Impossible de désactiver "${mod.name}" car le module "${manifest.name}" en dépend. Désactivez "${manifest.name}" d'abord.`);
            }
        }
        await database_1.prisma.tenantModule.update({
            where: { tenantId_moduleId: { tenantId, moduleId: mod.id } },
            data: { isActive: false },
        });
        return { success: true, message: `Module "${mod.name}" désactivé` };
    }
};
exports.RegistryService = RegistryService;
exports.RegistryService = RegistryService = __decorate([
    (0, common_1.Injectable)()
], RegistryService);
//# sourceMappingURL=registry.service.js.map