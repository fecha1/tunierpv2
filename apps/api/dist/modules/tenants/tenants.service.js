"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TenantsService", {
    enumerable: true,
    get: function() {
        return TenantsService;
    }
});
const _common = require("@nestjs/common");
const _database = require("@tunierp/database");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TenantsService = class TenantsService {
    /**
   * Get tenant details by ID
   */ async getTenant(tenantId) {
        const tenant = await _database.prisma.tenant.findUnique({
            where: {
                id: tenantId
            },
            include: {
                plan: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        limits: true,
                        features: true
                    }
                },
                _count: {
                    select: {
                        users: true,
                        tenantModules: true
                    }
                }
            }
        });
        if (!tenant) {
            throw new _common.NotFoundException('Entreprise introuvable');
        }
        return tenant;
    }
    /**
   * Update tenant settings
   */ async updateTenant(tenantId, data) {
        const tenant = await _database.prisma.tenant.findUnique({
            where: {
                id: tenantId
            }
        });
        if (!tenant) {
            throw new _common.NotFoundException('Entreprise introuvable');
        }
        return _database.prisma.tenant.update({
            where: {
                id: tenantId
            },
            data: {
                ...data.name && {
                    name: data.name
                },
                ...data.logoUrl !== undefined && {
                    logoUrl: data.logoUrl
                },
                ...data.country !== undefined && {
                    country: data.country
                },
                ...data.settings && {
                    settings: {
                        ...tenant.settings,
                        ...data.settings
                    }
                }
            }
        });
    }
    /**
   * List tenant users
   */ async listUsers(tenantId) {
        const scoped = (0, _database.withTenantScope)(_database.prisma, tenantId);
        return scoped.user.findMany({
            include: {
                role: {
                    select: {
                        name: true,
                        code: true,
                        level: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    /**
   * Create a user for tenant
   */ async createUser(tenantId, data) {
        // Check user limit
        const tenant = await _database.prisma.tenant.findUnique({
            where: {
                id: tenantId
            },
            include: {
                plan: true,
                _count: {
                    select: {
                        users: true
                    }
                }
            }
        });
        if (!tenant) throw new _common.NotFoundException('Entreprise introuvable');
        const maxUsers = tenant.plan?.limits?.users ?? 0;
        if (maxUsers > 0 && tenant._count.users >= maxUsers) {
            throw new _common.BadRequestException(`Limite d'utilisateurs atteinte (${maxUsers}). Passez à un plan supérieur.`);
        }
        // Check email uniqueness within tenant
        const existing = await _database.prisma.user.findFirst({
            where: {
                tenantId,
                email: data.email
            }
        });
        if (existing) {
            throw new _common.BadRequestException('Cet email est déjà utilisé dans votre entreprise');
        }
        return _database.prisma.user.create({
            data: {
                tenantId,
                ...data,
                isActive: true
            },
            include: {
                role: {
                    select: {
                        name: true,
                        code: true,
                        level: true
                    }
                }
            }
        });
    }
    /**
   * List tenant roles
   */ async listRoles(tenantId) {
        return _database.prisma.role.findMany({
            where: {
                tenantId
            },
            orderBy: {
                level: 'desc'
            }
        });
    }
    /**
   * Get tenant subscription / billing info
   */ async getSubscription(tenantId) {
        const tenant = await _database.prisma.tenant.findUnique({
            where: {
                id: tenantId
            },
            include: {
                plan: true,
                tenantModules: {
                    include: {
                        module: true
                    },
                    where: {
                        isActive: true
                    }
                },
                _count: {
                    select: {
                        users: true,
                        products: true
                    }
                }
            }
        });
        if (!tenant) throw new _common.NotFoundException('Entreprise introuvable');
        const limits = tenant.plan?.limits ?? {};
        return {
            plan: tenant.plan,
            status: tenant.status,
            activeModules: tenant.tenantModules.map((tm)=>({
                    code: tm.module.code,
                    name: tm.module.name,
                    activatedAt: tm.activatedAt
                })),
            usage: {
                users: tenant._count.users,
                maxUsers: limits.users ?? 0,
                products: tenant._count.products,
                maxProducts: limits.products ?? 0
            }
        };
    }
    /**
   * Upgrade plan
   */ async upgradePlan(tenantId, planCode) {
        const plan = await _database.prisma.plan.findUnique({
            where: {
                code: planCode
            }
        });
        if (!plan) throw new _common.BadRequestException('Plan invalide');
        const tenant = await _database.prisma.tenant.update({
            where: {
                id: tenantId
            },
            data: {
                planId: plan.id
            },
            include: {
                plan: true
            }
        });
        // Activate any new modules included in the plan
        const planModules = await _database.prisma.planModule.findMany({
            where: {
                planId: plan.id,
                isIncluded: true
            }
        });
        for (const pm of planModules){
            await _database.prisma.tenantModule.upsert({
                where: {
                    tenantId_moduleId: {
                        tenantId,
                        moduleId: pm.moduleId
                    }
                },
                create: {
                    tenantId,
                    moduleId: pm.moduleId,
                    isActive: true
                },
                update: {
                    isActive: true
                }
            });
        }
        return tenant;
    }
};
TenantsService = _ts_decorate([
    (0, _common.Injectable)()
], TenantsService);

//# sourceMappingURL=tenants.service.js.map