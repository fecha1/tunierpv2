import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '@tunierp/database';

@Injectable()
export class AdminService {
  // ── TENANTS ────────────────────────────────────────────

  async listTenants(query: { search?: string; status?: string; planCode?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      slug: { not: 'platform' }, // exclude platform tenant
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.planCode) {
      where.plan = { code: query.planCode };
    }

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          plan: { select: { name: true, code: true, priceMonthly: true } },
          _count: { select: { users: true, tenantModules: true } },
        },
      }),
      prisma.tenant.count({ where }),
    ]);

    return {
      data: tenants.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        status: t.status,
        businessType: t.businessType,
        plan: t.plan,
        usersCount: t._count.users,
        modulesCount: t._count.tenantModules,
        createdAt: t.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTenant(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        plan: true,
        _count: { select: { users: true, tenantModules: true } },
      },
    });
    if (!tenant) throw new NotFoundException('Tenant introuvable');
    return tenant;
  }

  async updateTenant(tenantId: string, data: { name?: string; status?: string; planCode?: string }) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant introuvable');

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.status) updateData.status = data.status;

    if (data.planCode) {
      const plan = await prisma.plan.findUnique({ where: { code: data.planCode } });
      if (!plan) throw new BadRequestException('Plan invalide');
      updateData.planId = plan.id;
    }

    return prisma.tenant.update({ where: { id: tenantId }, data: updateData });
  }

  async suspendTenant(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant introuvable');
    if (tenant.slug === 'platform') throw new BadRequestException('Impossible de suspendre le tenant platform');

    return prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'suspended' },
    });
  }

  async activateTenant(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant introuvable');

    return prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'active' },
    });
  }

  // ── TENANT MODULES ────────────────────────────────────

  async getTenantModules(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant introuvable');

    const allModules = await prisma.module.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });

    const tenantModules = await prisma.tenantModule.findMany({
      where: { tenantId },
      select: { moduleId: true, isActive: true, activatedAt: true },
    });

    const activatedMap = new Map(tenantModules.map((tm) => [tm.moduleId, tm]));

    return allModules.map((mod) => {
      const activated = activatedMap.get(mod.id);
      return {
        id: mod.id,
        code: mod.code,
        name: mod.name,
        category: mod.category,
        icon: mod.icon,
        isCore: mod.isCore,
        priceMonthly: mod.priceMonthly,
        isActivated: !!activated?.isActive,
        activatedAt: activated?.activatedAt || null,
      };
    });
  }

  async addModulesToTenant(tenantId: string, moduleCodes: string[]) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant introuvable');

    const modules = await prisma.module.findMany({
      where: { code: { in: moduleCodes }, isActive: true },
    });

    if (modules.length === 0) throw new BadRequestException('Aucun module valide');

    const results = [];
    for (const mod of modules) {
      const existing = await prisma.tenantModule.findUnique({
        where: { tenantId_moduleId: { tenantId, moduleId: mod.id } },
      });

      if (existing) {
        if (!existing.isActive) {
          await prisma.tenantModule.update({
            where: { tenantId_moduleId: { tenantId, moduleId: mod.id } },
            data: { isActive: true },
          });
          results.push({ code: mod.code, action: 'reactivated' });
        } else {
          results.push({ code: mod.code, action: 'already_active' });
        }
      } else {
        await prisma.tenantModule.create({
          data: { tenantId, moduleId: mod.id, isActive: true },
        });
        results.push({ code: mod.code, action: 'activated' });
      }
    }

    return { tenantId, results };
  }

  async removeModuleFromTenant(tenantId: string, moduleCode: string) {
    const mod = await prisma.module.findUnique({ where: { code: moduleCode } });
    if (!mod) throw new NotFoundException('Module introuvable');
    if (mod.isCore) throw new BadRequestException('Impossible de désactiver un module core');

    const tenantModule = await prisma.tenantModule.findUnique({
      where: { tenantId_moduleId: { tenantId, moduleId: mod.id } },
    });

    if (!tenantModule) throw new NotFoundException('Module non activé pour ce tenant');

    await prisma.tenantModule.update({
      where: { tenantId_moduleId: { tenantId, moduleId: mod.id } },
      data: { isActive: false },
    });

    return { tenantId, moduleCode, action: 'deactivated' };
  }

  // ── TENANT USERS ──────────────────────────────────────

  async getTenantUsers(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant introuvable');

    return prisma.user.findMany({
      where: { tenantId, isSuperAdmin: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        role: { select: { name: true, code: true, level: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── PLATFORM STATS ────────────────────────────────────

  async getStats() {
    const [
      totalTenants, activeTenants, trialTenants, suspendedTenants,
      totalUsers, activeUsers,
      modulesWithCounts,
    ] = await Promise.all([
      prisma.tenant.count({ where: { slug: { not: 'platform' } } }),
      prisma.tenant.count({ where: { status: 'active', slug: { not: 'platform' } } }),
      prisma.tenant.count({ where: { status: 'trial' } }),
      prisma.tenant.count({ where: { status: 'suspended' } }),
      prisma.user.count({ where: { isSuperAdmin: false } }),
      prisma.user.count({ where: { isSuperAdmin: false, isActive: true } }),
      prisma.module.findMany({
        include: { _count: { select: { tenantModules: true } } },
        orderBy: { code: 'asc' },
      }),
    ]);

    // Revenue: sum of active tenants' plan prices
    const tenantsWithPlans = await prisma.tenant.findMany({
      where: { status: { in: ['active', 'trial'] }, slug: { not: 'platform' } },
      include: { plan: { select: { priceMonthly: true } } },
    });
    const monthlyRevenue = tenantsWithPlans.reduce((sum, t) => sum + Number(t.plan?.priceMonthly || 0), 0);

    // New signups this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newSignupsThisMonth = await prisma.tenant.count({
      where: { createdAt: { gte: startOfMonth }, slug: { not: 'platform' } },
    });

    return {
      tenants: { total: totalTenants, active: activeTenants, trial: trialTenants, suspended: suspendedTenants },
      users: { total: totalUsers, active: activeUsers },
      revenue: { monthly: monthlyRevenue },
      newSignupsThisMonth,
      modules: modulesWithCounts.map((m) => ({
        code: m.code,
        name: m.name,
        isCore: m.isCore,
        activationCount: m._count.tenantModules,
      })),
    };
  }

  // ── MODULES CATALOG ───────────────────────────────────

  async getModulesCatalog() {
    return prisma.module.findMany({
      include: { _count: { select: { tenantModules: true } } },
      orderBy: [{ category: 'asc' }, { isCore: 'desc' }, { code: 'asc' }],
    });
  }

  // ── PLANS ─────────────────────────────────────────────

  async getPlans() {
    return prisma.plan.findMany({
      include: {
        _count: { select: { tenants: true } },
        planModules: { include: { module: { select: { code: true, name: true } } } },
      },
      orderBy: { priceMonthly: 'asc' },
    });
  }
}
