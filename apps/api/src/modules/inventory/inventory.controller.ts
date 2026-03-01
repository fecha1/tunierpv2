import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { TenantId, Permissions, Auth } from '../../shared/decorators';
import type { AuthContext } from '@tunierp/auth';
import {
  getStockLevels,
  getMovements,
  createMovement,
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  getInventoryStats,
} from '@tunierp/mod-inventory';
import { IsString, IsNumber, IsOptional, IsIn, Min } from 'class-validator';

// ── DTOs ─────────────────────────────────────────────────

class CreateMovementDto {
  @IsString() productId: string;
  @IsOptional() @IsString() variantId?: string;
  @IsString() warehouseId: string;
  @IsIn(['in', 'out', 'adjustment', 'transfer', 'return'])
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'return';
  @IsNumber() @Min(0.01) quantity: number;
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() referenceType?: string;
  @IsOptional() @IsString() referenceId?: string;
}

class CreateWarehouseDto {
  @IsString() name: string;
  @IsString() code: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() isDefault?: boolean;
}

// ── Controller ───────────────────────────────────────────

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  @Get('stats')
  @Permissions('inventory.read')
  async getStats(@TenantId() tenantId: string) {
    return getInventoryStats(tenantId);
  }

  @Get('stock')
  @Permissions('inventory.read')
  async getStock(
    @TenantId() tenantId: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('lowStockOnly') lowStockOnly?: string,
    @Query('search') search?: string,
  ) {
    return getStockLevels(tenantId, {
      warehouseId,
      categoryId,
      lowStockOnly: lowStockOnly === 'true',
      search,
    });
  }

  @Get('movements')
  @Permissions('inventory.read')
  async listMovements(
    @TenantId() tenantId: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    return getMovements(tenantId, {
      warehouseId,
      type,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post('movements')
  @Permissions('inventory.create')
  async addMovement(
    @TenantId() tenantId: string,
    @Auth() auth: AuthContext,
    @Body() dto: CreateMovementDto,
  ) {
    return createMovement(tenantId, { ...dto, userId: auth.userId });
  }

  @Get('warehouses')
  @Permissions('inventory.read')
  async listWarehouses(@TenantId() tenantId: string) {
    return getWarehouses(tenantId);
  }

  @Post('warehouses')
  @Permissions('inventory.warehouses.manage')
  async addWarehouse(@TenantId() tenantId: string, @Body() dto: CreateWarehouseDto) {
    return createWarehouse(tenantId, dto);
  }

  @Patch('warehouses/:id')
  @Permissions('inventory.warehouses.manage')
  async editWarehouse(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: CreateWarehouseDto,
  ) {
    return updateWarehouse(tenantId, id, dto);
  }
}
