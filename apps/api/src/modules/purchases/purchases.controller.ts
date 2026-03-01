import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { TenantId, Permissions, Auth } from '../../shared/decorators';
import type { AuthContext } from '@tunierp/auth';
import {
  listSuppliers,
  createSupplier,
  updateSupplier,
  listPurchases,
  createPurchaseOrder,
  receivePurchaseOrder,
  getPurchaseStats,
} from '@tunierp/mod-purchases';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// ── DTOs ─────────────────────────────────────────────────

class CreateSupplierDto {
  @IsString() name!: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() taxId?: string;
  @IsOptional() @IsString() notes?: string;
}

class PurchaseItemDto {
  @IsString() productId!: string;
  @IsOptional() @IsString() variantId?: string;
  @IsNumber() @Min(1) quantity!: number;
  @IsNumber() @Min(0) unitPrice!: number;
  @IsOptional() @IsNumber() taxRate?: number;
}

class CreatePurchaseDto {
  @IsString() supplierId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items!: PurchaseItemDto[];

  @IsOptional() @IsString() notes?: string;
}

class ReceivePurchaseDto {
  @IsString() warehouseId!: string;
}

// ── Controller ───────────────────────────────────────────

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  @Get('stats')
  @Permissions('purchases.read')
  async getStats(@TenantId() tenantId: string) {
    return getPurchaseStats(tenantId);
  }

  @Get('orders')
  @Permissions('purchases.read')
  async listOrders(
    @TenantId() tenantId: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('supplierId') supplierId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return listPurchases(tenantId, {
      type,
      status,
      supplierId,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Post('orders')
  @Permissions('purchases.create')
  async createOrder(@TenantId() tenantId: string, @Body() dto: CreatePurchaseDto) {
    return createPurchaseOrder(tenantId, dto);
  }

  @Post('orders/:id/receive')
  @Permissions('purchases.validate')
  async receive(
    @TenantId() tenantId: string,
    @Auth() auth: AuthContext,
    @Param('id') id: string,
    @Body() dto: ReceivePurchaseDto,
  ) {
    return receivePurchaseOrder(tenantId, id, dto.warehouseId, auth.userId);
  }

  // ── Suppliers ────────────────────────────────────────

  @Get('suppliers')
  @Permissions('purchases.suppliers.manage')
  async listSuppliers(
    @TenantId() tenantId: string,
    @Query('search') search?: string,
  ) {
    return listSuppliers(tenantId, search);
  }

  @Post('suppliers')
  @Permissions('purchases.suppliers.manage')
  async createSupplier(@TenantId() tenantId: string, @Body() dto: CreateSupplierDto) {
    return createSupplier(tenantId, dto);
  }

  @Patch('suppliers/:id')
  @Permissions('purchases.suppliers.manage')
  async updateSupplier(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: CreateSupplierDto,
  ) {
    return updateSupplier(tenantId, id, dto);
  }
}
