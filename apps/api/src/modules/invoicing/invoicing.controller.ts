import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { TenantId, Permissions, Auth } from '../../shared/decorators';
import type { AuthContext } from '@tunierp/auth';
import {
  listSales,
  getSaleById,
  createSale,
  updateSaleStatus,
  convertQuoteToInvoice,
  listPayments,
  createPayment,
  getInvoicingStats,
} from '@tunierp/mod-invoicing';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

// ── DTOs ─────────────────────────────────────────────────

class SaleItemDto {
  @IsString() productId!: string;
  @IsOptional() @IsString() variantId?: string;
  @IsNumber() @Min(1) quantity!: number;
  @IsNumber() @Min(0) unitPrice!: number;
  @IsOptional() @IsNumber() discount?: number;
  @IsOptional() @IsNumber() taxRate?: number;
}

class CreateSaleDto {
  @IsIn(['quote', 'invoice', 'delivery_note', 'proforma', 'credit_note', 'warranty'])
  type!: 'quote' | 'invoice' | 'delivery_note' | 'proforma' | 'credit_note' | 'warranty';

  @IsOptional() @IsString() customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items!: SaleItemDto[];

  @IsOptional() @IsString() notes?: string;
}

class UpdateStatusDto {
  @IsIn(['draft', 'confirmed', 'delivered', 'paid', 'cancelled'])
  status!: string;
}

class CreatePaymentDto {
  @IsString() saleId!: string;
  @IsOptional() @IsString() customerId?: string;
  @IsNumber() @Min(0.01) amount!: number;
  @IsString() method!: string;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsString() notes?: string;
}

// ── Controller ───────────────────────────────────────────

@Controller('invoicing')
@UseGuards(JwtAuthGuard)
export class InvoicingController {
  @Get('stats')
  @Permissions('sales.read')
  async getStats(@TenantId() tenantId: string) {
    return getInvoicingStats(tenantId);
  }

  @Get('sales')
  @Permissions('sales.read')
  async list(
    @TenantId() tenantId: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return listSales(tenantId, {
      type,
      status,
      customerId,
      search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('sales/:id')
  @Permissions('sales.read')
  async getOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return getSaleById(tenantId, id);
  }

  @Post('sales')
  @Permissions('sales.create')
  async create(
    @TenantId() tenantId: string,
    @Auth() auth: AuthContext,
    @Body() dto: CreateSaleDto,
  ) {
    return createSale(tenantId, { ...dto, userId: auth.userId });
  }

  @Patch('sales/:id/status')
  @Permissions('sales.validate')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return updateSaleStatus(tenantId, id, dto.status);
  }

  @Post('sales/:id/convert')
  @Permissions('sales.create')
  async convertToInvoice(
    @TenantId() tenantId: string,
    @Auth() auth: AuthContext,
    @Param('id') quoteId: string,
  ) {
    return convertQuoteToInvoice(tenantId, quoteId, auth.userId);
  }

  @Get('payments')
  @Permissions('payments.read')
  async listPayments(
    @TenantId() tenantId: string,
    @Query('saleId') saleId?: string,
    @Query('method') method?: string,
    @Query('limit') limit?: string,
  ) {
    return listPayments(tenantId, {
      saleId,
      method,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Post('payments')
  @Permissions('payments.create')
  async addPayment(@TenantId() tenantId: string, @Body() dto: CreatePaymentDto) {
    return createPayment(tenantId, dto);
  }
}
