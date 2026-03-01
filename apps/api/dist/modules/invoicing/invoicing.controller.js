"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const decorators_1 = require("../../shared/decorators");
const mod_invoicing_1 = require("@tunierp/mod-invoicing");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ── DTOs ─────────────────────────────────────────────────
class SaleItemDto {
    productId;
    variantId;
    quantity;
    unitPrice;
    discount;
    taxRate;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaleItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaleItemDto.prototype, "variantId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "taxRate", void 0);
class CreateSaleDto {
    type;
    customerId;
    items;
    notes;
}
__decorate([
    (0, class_validator_1.IsIn)(['quote', 'invoice', 'delivery_note', 'proforma', 'credit_note', 'warranty']),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SaleItemDto),
    __metadata("design:type", Array)
], CreateSaleDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "notes", void 0);
class UpdateStatusDto {
    status;
}
__decorate([
    (0, class_validator_1.IsIn)(['draft', 'confirmed', 'delivered', 'paid', 'cancelled']),
    __metadata("design:type", String)
], UpdateStatusDto.prototype, "status", void 0);
class CreatePaymentDto {
    saleId;
    customerId;
    amount;
    method;
    reference;
    notes;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "saleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "reference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
// ── Controller ───────────────────────────────────────────
let InvoicingController = class InvoicingController {
    async getStats(tenantId) {
        return (0, mod_invoicing_1.getInvoicingStats)(tenantId);
    }
    async list(tenantId, type, status, customerId, search, limit, offset) {
        return (0, mod_invoicing_1.listSales)(tenantId, {
            type,
            status,
            customerId,
            search,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
        });
    }
    async getOne(tenantId, id) {
        return (0, mod_invoicing_1.getSaleById)(tenantId, id);
    }
    async create(tenantId, auth, dto) {
        return (0, mod_invoicing_1.createSale)(tenantId, { ...dto, userId: auth.userId });
    }
    async updateStatus(tenantId, id, dto) {
        return (0, mod_invoicing_1.updateSaleStatus)(tenantId, id, dto.status);
    }
    async convertToInvoice(tenantId, auth, quoteId) {
        return (0, mod_invoicing_1.convertQuoteToInvoice)(tenantId, quoteId, auth.userId);
    }
    async listPayments(tenantId, saleId, method, limit) {
        return (0, mod_invoicing_1.listPayments)(tenantId, {
            saleId,
            method,
            limit: limit ? parseInt(limit) : undefined,
        });
    }
    async addPayment(tenantId, dto) {
        return (0, mod_invoicing_1.createPayment)(tenantId, dto);
    }
};
exports.InvoicingController = InvoicingController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, decorators_1.Permissions)('sales.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicingController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, decorators_1.Permissions)('sales.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('customerId')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('limit')),
    __param(6, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InvoicingController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('sales/:id'),
    (0, decorators_1.Permissions)('sales.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InvoicingController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)('sales'),
    (0, decorators_1.Permissions)('sales.create'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, decorators_1.Auth)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, CreateSaleDto]),
    __metadata("design:returntype", Promise)
], InvoicingController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('sales/:id/status'),
    (0, decorators_1.Permissions)('sales.validate'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateStatusDto]),
    __metadata("design:returntype", Promise)
], InvoicingController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('sales/:id/convert'),
    (0, decorators_1.Permissions)('sales.create'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, decorators_1.Auth)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], InvoicingController.prototype, "convertToInvoice", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, decorators_1.Permissions)('payments.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('saleId')),
    __param(2, (0, common_1.Query)('method')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], InvoicingController.prototype, "listPayments", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, decorators_1.Permissions)('payments.create'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], InvoicingController.prototype, "addPayment", null);
exports.InvoicingController = InvoicingController = __decorate([
    (0, common_1.Controller)('invoicing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
], InvoicingController);
//# sourceMappingURL=invoicing.controller.js.map