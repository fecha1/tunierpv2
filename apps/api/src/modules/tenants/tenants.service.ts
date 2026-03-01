import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma, withTenantScope } from '@tunierp/database';

@Injectable()
export class TenantsService {
  /**
   * Get tenant details by ID
   */
  async getTenant(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        plan: { select: { id: true, name: true, code: true, limits: true, features: true } },
        _count: { select: { users: true, tenantModules: true } },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Entreprise introuvable');
    }

    return tenant;
  }

  /**
   * Update tenant settings
   */
  async updateTenant(tenantId: string, data: {
    name?: string;
    logoUrl?: string;
    settings?: Record<string, any>;
    country?: string;
  }) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new NotFoundException('Entreprise introuvable');
    }

    return prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.settings && {
          settings: { ...(tenant.settings as Record<string, any>), ...data.settings },
        }),
      },
    });
  }

  /**
   * List tenant users
   */
  async listUsers(tenantId: string) {
    const scoped = withTenantScope(prisma, tenantId);
    return scoped.user.findMany({
      include: { role: { select: { name: true, code: true, level: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a user for tenant
   */
  async createUser(tenantId: string, data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    roleId: string;
    phone?: string;
  }) {
    // Check user limit
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { plan: true, _count: { select: { users: true } } },
    });

    if (!tenant) throw new NotFoundException('Entreprise introuvable');

    const maxUsers = (tenant.plan?.limits as any)?.users ?? 0;
    if (maxUsers > 0 && tenant._count.users >= maxUsers) {
      throw new BadRequestException(
        `Limite d'utilisateurs atteinte (${maxUsers}). Passez à un plan supérieur.`,
      );
    }

    // Check email uniqueness within tenant
    const existing = await prisma.user.findFirst({
      where: { tenantId, email: data.email },
    });
    if (existing) {
      throw new BadRequestException('Cet email est déjà utilisé dans votre entreprise');
    }

    return prisma.user.create({
      data: { tenantId, ...data, isActive: true },
      include: { role: { select: { name: true, code: true, level: true } } },
    });
  }

  /**
   * List tenant roles
   */
  async listRoles(tenantId: string) {
    return prisma.role.findMany({
      where: { tenantId },
      orderBy: { level: 'desc' },
    });
  }

  /**
   * Get tenant subscription / billing info
   */
  async getSubscription(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        plan: true,
        tenantModules: { include: { module: true }, where: { isActive: true } },
        _count: { select: { users: true, products: true } },
      },
    });

    if (!tenant) throw new NotFoundException('Entreprise introuvable');

    const limits = (tenant.plan?.limits as any) ?? {};

    return {
      plan: tenant.plan,
      status: tenant.status,
      activeModules: tenant.tenantModules.map((tm: any) => ({
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
  async upgradePlan(tenantId: string, planCode: string) {
    const plan = await prisma.plan.findUnique({ where: { code: planCode } });
    if (!plan) throw new BadRequestException('Plan invalide');

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { planId: plan.id },
      include: { plan: true },
    });

    // Activate any new modules included in the plan
    const planModules = await prisma.planModule.findMany({
      where: { planId: plan.id, isIncluded: true },
    });

    for (const pm of planModules) {
      await prisma.tenantModule.upsert({
        where: { tenantId_moduleId: { tenantId, moduleId: pm.moduleId } },
        create: { tenantId, moduleId: pm.moduleId, isActive: true },
        update: { isActive: true },
      });
    }

    return tenant;
  }
}
