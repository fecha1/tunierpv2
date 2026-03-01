import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '@tunierp/database';
import {
  getAllModules,
  getModule,
  getActiveModulesForTenant,
  buildSidebar,
  checkModuleDependencies,
} from '@tunierp/core';

@Injectable()
export class RegistryService {
  /**
   * List all available modules in the system
   */
  listAllModules() {
    return getAllModules().map((m) => ({
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
    return prisma.module.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        category: true,
        icon: true,
        isCore: true,
        monthlyPrice: true,
        yearlyPrice: true,
        isActive: true,
      },
    });
  }

  /**
   * List active modules for a tenant
   */
  async getTenantModules(tenantId: string) {
    const tenantModules = await prisma.tenantModule.findMany({
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
  async getSidebar(tenantId: string, userPermissions: string[]) {
    return buildSidebar(tenantId, userPermissions);
  }

  /**
   * Activate a module for a tenant
   */
  async activateModule(tenantId: string, moduleCode: string) {
    // Find module in DB
    const mod = await prisma.module.findUnique({ where: { code: moduleCode } });
    if (!mod) {
      throw new NotFoundException(`Module "${moduleCode}" introuvable`);
    }

    // Check if module is already active
    const existing = await prisma.tenantModule.findFirst({
      where: { tenantId, moduleId: mod.id },
    });

    if (existing?.isActive) {
      throw new BadRequestException(`Le module "${mod.name}" est déjà activé`);
    }

    // Check dependencies from registry
    const depCheck = await checkModuleDependencies(tenantId, moduleCode);
    if (!depCheck.satisfied) {
      throw new BadRequestException(
        `Dépendances manquantes: ${depCheck.missing.join(', ')}. Activez-les d'abord.`,
      );
    }

    // Check plan allows this module
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { plan: { include: { modules: { include: { module: true } } } } },
    });

    if (!tenant) throw new NotFoundException('Entreprise introuvable');

    const planModule = tenant.plan.modules.find((pm) => pm.module.code === moduleCode);
    if (!planModule) {
      throw new BadRequestException(
        `Le module "${mod.name}" n'est pas disponible dans votre plan "${tenant.plan.name}". Passez à un plan supérieur.`,
      );
    }

    // Upsert
    if (existing) {
      await prisma.tenantModule.update({
        where: { id: existing.id },
        data: { isActive: true, activatedAt: new Date(), deactivatedAt: null },
      });
    } else {
      await prisma.tenantModule.create({
        data: { tenantId, moduleId: mod.id, isActive: true },
      });
    }

    return { success: true, message: `Module "${mod.name}" activé avec succès` };
  }

  /**
   * Deactivate a module for a tenant
   */
  async deactivateModule(tenantId: string, moduleCode: string) {
    const mod = await prisma.module.findUnique({ where: { code: moduleCode } });
    if (!mod) {
      throw new NotFoundException(`Module "${moduleCode}" introuvable`);
    }

    if (mod.isCore) {
      throw new BadRequestException('Les modules de base ne peuvent pas être désactivés');
    }

    const tenantModule = await prisma.tenantModule.findFirst({
      where: { tenantId, moduleId: mod.id, isActive: true },
    });

    if (!tenantModule) {
      throw new BadRequestException(`Le module "${mod.name}" n'est pas actif`);
    }

    // Check if other active modules depend on this one
    const allActiveModules = await this.getTenantModules(tenantId);
    const registeredModules = getAllModules();

    for (const activeMod of allActiveModules) {
      const manifest = registeredModules.find((m) => m.code === activeMod.code);
      if (manifest && manifest.dependencies.includes(moduleCode)) {
        throw new BadRequestException(
          `Impossible de désactiver "${mod.name}" car le module "${manifest.name}" en dépend. Désactivez "${manifest.name}" d'abord.`,
        );
      }
    }

    await prisma.tenantModule.update({
      where: { id: tenantModule.id },
      data: { isActive: false, deactivatedAt: new Date() },
    });

    return { success: true, message: `Module "${mod.name}" désactivé` };
  }
}
