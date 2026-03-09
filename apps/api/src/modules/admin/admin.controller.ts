import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { SuperAdminGuard } from './super-admin.guard';
import { Auth } from '../../shared/decorators';
import type { AuthContext } from '@tunierp/auth';
import { IsString, IsOptional, IsArray, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

// ── DTOs ──────────────────────────────────────────────

class ListTenantsQuery {
  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsString()
  @IsIn(['active', 'trial', 'suspended', 'cancelled'])
  status?: string;

  @IsOptional() @IsString()
  planCode?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number;
}

class UpdateTenantDto {
  @IsOptional() @IsString()
  name?: string;

  @IsOptional() @IsString()
  @IsIn(['active', 'trial', 'suspended', 'cancelled'])
  status?: string;

  @IsOptional() @IsString()
  planCode?: string;
}

class AddModulesDto {
  @IsArray()
  @IsString({ each: true })
  moduleCodes!: string[];
}

// ── Controller ────────────────────────────────────────

@Controller('admin')
@UseGuards(SuperAdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Stats ───────────────────────────────────────────
  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  // ── Tenants ─────────────────────────────────────────
  @Get('tenants')
  async listTenants(@Query() query: ListTenantsQuery) {
    return this.adminService.listTenants(query);
  }

  @Get('tenants/:id')
  async getTenant(@Param('id') id: string) {
    return this.adminService.getTenant(id);
  }

  @Patch('tenants/:id')
  async updateTenant(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.adminService.updateTenant(id, dto);
  }

  @Post('tenants/:id/suspend')
  @HttpCode(HttpStatus.OK)
  async suspendTenant(@Param('id') id: string) {
    return this.adminService.suspendTenant(id);
  }

  @Post('tenants/:id/activate')
  @HttpCode(HttpStatus.OK)
  async activateTenant(@Param('id') id: string) {
    return this.adminService.activateTenant(id);
  }

  // ── Tenant Modules ─────────────────────────────────
  @Get('tenants/:id/modules')
  async getTenantModules(@Param('id') id: string) {
    return this.adminService.getTenantModules(id);
  }

  @Post('tenants/:id/modules')
  @HttpCode(HttpStatus.OK)
  async addModulesToTenant(@Param('id') id: string, @Body() dto: AddModulesDto) {
    return this.adminService.addModulesToTenant(id, dto.moduleCodes);
  }

  @Delete('tenants/:id/modules/:code')
  async removeModuleFromTenant(@Param('id') id: string, @Param('code') code: string) {
    return this.adminService.removeModuleFromTenant(id, code);
  }

  // ── Tenant Users ───────────────────────────────────
  @Get('tenants/:id/users')
  async getTenantUsers(@Param('id') id: string) {
    return this.adminService.getTenantUsers(id);
  }

  // ── Modules Catalog ────────────────────────────────
  @Get('modules')
  async getModulesCatalog() {
    return this.adminService.getModulesCatalog();
  }

  // ── Plans ──────────────────────────────────────────
  @Get('plans')
  async getPlans() {
    return this.adminService.getPlans();
  }
}
