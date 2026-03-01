import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RegistryService } from './registry.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Auth, TenantId, Permissions } from '../../shared/decorators';
import type { AuthContext } from '@tunierp/auth';

@Controller('modules')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  /**
   * GET /modules/catalog — list all modules in system (public for pricing page)
   */
  @Get('catalog')
  async listCatalog() {
    return this.registryService.listModuleCatalog();
  }

  /**
   * GET /modules/registered — list all registered module manifests
   */
  @Get('registered')
  @UseGuards(JwtAuthGuard)
  async listRegistered() {
    return this.registryService.listAllModules();
  }

  /**
   * GET /modules/active — list tenant's active modules
   */
  @Get('active')
  @UseGuards(JwtAuthGuard)
  async getActiveModules(@TenantId() tenantId: string) {
    return this.registryService.getTenantModules(tenantId);
  }

  /**
   * GET /modules/sidebar — build sidebar menu for current user
   */
  @Get('sidebar')
  @UseGuards(JwtAuthGuard)
  async getSidebar(@TenantId() tenantId: string, @Auth() auth: AuthContext) {
    return this.registryService.getSidebar(tenantId, auth.permissions);
  }

  /**
   * POST /modules/:code/activate — activate a module for current tenant
   */
  @Post(':code/activate')
  @UseGuards(JwtAuthGuard)
  @Permissions('settings.modules.manage')
  async activateModule(@TenantId() tenantId: string, @Param('code') code: string) {
    return this.registryService.activateModule(tenantId, code);
  }

  /**
   * POST /modules/:code/deactivate — deactivate a module for current tenant
   */
  @Post(':code/deactivate')
  @UseGuards(JwtAuthGuard)
  @Permissions('settings.modules.manage')
  async deactivateModule(@TenantId() tenantId: string, @Param('code') code: string) {
    return this.registryService.deactivateModule(tenantId, code);
  }
}
