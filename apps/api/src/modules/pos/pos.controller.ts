import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { TenantId, Permissions, Auth } from '../../shared/decorators';
import type { AuthContext } from '@tunierp/auth';
import {
  createPOSSale,
  searchProducts,
  getPOSStats,
} from '@tunierp/mod-pos';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// ── DTOs ─────────────────────────────────────────────────

class POSItemDto {
  @IsString() productId!: string;
  @IsOptional() @IsString() variantId?: string;
  @IsString() name!: string;
  @IsNumber() @Min(1) quantity!: number;
  @IsNumber() @Min(0) unitPrice!: number;
  @IsOptional() @IsNumber() discount?: number;
  @IsOptional() @IsNumber() taxRate?: number;
}

class CreatePOSSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => POSItemDto)
  items!: POSItemDto[];

  @IsOptional() @IsString() customerId?: string;
  @IsString() paymentMethod!: string;
  @IsNumber() @Min(0) amountPaid!: number;
  @IsString() warehouseId!: string;
}

// ── Controller ───────────────────────────────────────────

@Controller('pos')
@UseGuards(JwtAuthGuard)
export class POSController {
  @Get('stats')
  @Permissions('pos.access')
  async getStats(@TenantId() tenantId: string) {
    return getPOSStats(tenantId);
  }

  @Get('products')
  @Permissions('pos.access')
  async searchProducts(
    @TenantId() tenantId: string,
    @Query('q') query: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return searchProducts(tenantId, query || '', warehouseId);
  }

  @Post('sell')
  @Permissions('pos.sell')
  async sell(
    @TenantId() tenantId: string,
    @Auth() auth: AuthContext,
    @Body() dto: CreatePOSSaleDto,
  ) {
    return createPOSSale(tenantId, { ...dto, userId: auth.userId });
  }
}
