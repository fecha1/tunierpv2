import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Auth, TenantId, Permissions } from '../../shared/decorators';
import type { AuthContext } from '@tunierp/auth';
import { IsString, IsOptional, IsEmail, MinLength, IsIn } from 'class-validator';

// ── DTOs ─────────────────────────────────────────────────

class UpdateTenantDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() taxId?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() settings?: Record<string, any>;
}

class CreateUserDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Mot de passe: 6 caractères minimum' })
  password: string;

  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() roleId: string;
  @IsOptional() @IsString() phone?: string;
}

class UpgradePlanDto {
  @IsString()
  @IsIn(['starter', 'business', 'professional', 'enterprise'])
  planCode: string;
}

// ── Controller ───────────────────────────────────────────

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('current')
  async getCurrentTenant(@TenantId() tenantId: string) {
    return this.tenantsService.getTenant(tenantId);
  }

  @Patch('current')
  @Permissions('settings.update')
  async updateCurrentTenant(@TenantId() tenantId: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.updateTenant(tenantId, dto);
  }

  @Get('current/users')
  @Permissions('settings.users.read')
  async listUsers(@TenantId() tenantId: string) {
    return this.tenantsService.listUsers(tenantId);
  }

  @Post('current/users')
  @Permissions('settings.users.create')
  async createUser(@TenantId() tenantId: string, @Body() dto: CreateUserDto) {
    const { hashPassword } = await import('@tunierp/auth');
    const passwordHash = await hashPassword(dto.password);
    return this.tenantsService.createUser(tenantId, {
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleId: dto.roleId,
      phone: dto.phone,
    });
  }

  @Get('current/roles')
  async listRoles(@TenantId() tenantId: string) {
    return this.tenantsService.listRoles(tenantId);
  }

  @Get('current/subscription')
  @Permissions('settings.billing.read')
  async getSubscription(@TenantId() tenantId: string) {
    return this.tenantsService.getSubscription(tenantId);
  }

  @Post('current/upgrade')
  @Permissions('settings.billing.update')
  async upgradePlan(@TenantId() tenantId: string, @Body() dto: UpgradePlanDto) {
    return this.tenantsService.upgradePlan(tenantId, dto.planCode);
  }
}
