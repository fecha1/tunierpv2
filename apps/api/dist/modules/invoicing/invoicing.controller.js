"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvoicingController", {
    enumerable: true,
    get: function() {
        return InvoicingController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../../shared/guards/jwt-auth.guard");
const _decorators = require("../../shared/decorators");
const _modinvoicing = require("@tunierp/mod-invoicing");
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
// ── DTOs ─────────────────────────────────────────────────
let SaleItemDto = class SaleItemDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SaleItemDto.prototype, "productId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], SaleItemDto.prototype, "variantId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], SaleItemDto.prototype, "quantity", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], SaleItemDto.prototype, "unitPrice", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], SaleItemDto.prototype, "discount", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], SaleItemDto.prototype, "taxRate", void 0);
let CreateSaleDto = class CreateSaleDto {
};
_ts_decorate([
    (0, _classvalidator.IsIn)([
        'quote',
        'invoice',
        'delivery_note',
        'proforma',
        'credit_note',
        'warranty'
    ]),
    _ts_metadata("design:type", String)
], CreateSaleDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSaleDto.prototype, "customerId", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>SaleItemDto),
    _ts_metadata("design:type", Array)
], CreateSaleDto.prototype, "items", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSaleDto.prototype, "notes", void 0);
let UpdateStatusDto = class UpdateStatusDto {
};
_ts_decorate([
    (0, _classvalidator.IsIn)([
        'draft',
        'confirmed',
        'delivered',
        'paid',
        'cancelled'
    ]),
    _ts_metadata("design:type", String)
], UpdateStatusDto.prototype, "status", void 0);
let CreatePaymentDto = class CreatePaymentDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePaymentDto.prototype, "saleId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePaymentDto.prototype, "customerId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0.01),
    _ts_metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePaymentDto.prototype, "method", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePaymentDto.prototype, "reference", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
let InvoicingController = class InvoicingController {
    async getStats(tenantId) {
        return (0, _modinvoicing.getInvoicingStats)(tenantId);
    }
    async list(tenantId, type, status, customerId, search, limit, offset) {
        return (0, _modinvoicing.listSales)(tenantId, {
            type,
            status,
            customerId,
            search,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined
        });
    }
    async getOne(tenantId, id) {
        return (0, _modinvoicing.getSaleById)(tenantId, id);
    }
    async create(tenantId, auth, dto) {
        return (0, _modinvoicing.createSale)(tenantId, {
            ...dto,
            userId: auth.userId
        });
    }
    async updateStatus(tenantId, id, dto) {
        return (0, _modinvoicing.updateSaleStatus)(tenantId, id, dto.status);
    }
    async convertToInvoice(tenantId, auth, quoteId) {
        return (0, _modinvoicing.convertQuoteToInvoice)(tenantId, quoteId, auth.userId);
    }
    async listPayments(tenantId, saleId, method, limit) {
        return (0, _modinvoicing.listPayments)(tenantId, {
            saleId,
            method,
            limit: limit ? parseInt(limit) : undefined
        });
    }
    async addPayment(tenantId, dto) {
        return (0, _modinvoicing.createPayment)(tenantId, dto);
    }
};
_ts_decorate([
    (0, _common.Get)('stats'),
    (0, _decorators.Permissions)('sales.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InvoicingController.prototype, "getStats", null);
_ts_decorate([
    (0, _common.Get)('sales'),
    (0, _decorators.Permissions)('sales.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Query)('type')),
    _ts_param(2, (0, _common.Query)('status')),
    _ts_param(3, (0, _common.Query)('customerId')),
    _ts_param(4, (0, _common.Query)('search')),
    _ts_param(5, (0, _common.Query)('limit')),
    _ts_param(6, (0, _common.Query)('offset')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InvoicingController.prototype, "list", null);
_ts_decorate([
    (0, _common.Get)('sales/:id'),
    (0, _decorators.Permissions)('sales.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InvoicingController.prototype, "getOne", null);
_ts_decorate([
    (0, _common.Post)('sales'),
    (0, _decorators.Permissions)('sales.create'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _decorators.Auth)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AuthContext === "undefined" ? Object : AuthContext,
        typeof CreateSaleDto === "undefined" ? Object : CreateSaleDto
    ]),
    _ts_metadata("design:returntype", Promise)
], InvoicingController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)('sales/:id/status'),
    (0, _decorators.Permissions)('sales.validate'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof UpdateStatusDto === "undefined" ? Object : UpdateStatusDto
    ]),
    _ts_metadata("design:returntype", Promise)
], InvoicingController.prototype, "updateStatus", null);
_ts_decorate([
    (0, _common.Post)('sales/:id/convert'),
    (0, _decorators.Permissions)('sales.create'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _decorators.Auth)()),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AuthContext === "undefined" ? Object : AuthContext,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InvoicingController.prototype, "convertToInvoice", null);
_ts_decorate([
    (0, _common.Get)('payments'),
    (0, _decorators.Permissions)('payments.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Query)('saleId')),
    _ts_param(2, (0, _common.Query)('method')),
    _ts_param(3, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InvoicingController.prototype, "listPayments", null);
_ts_decorate([
    (0, _common.Post)('payments'),
    (0, _decorators.Permissions)('payments.create'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof CreatePaymentDto === "undefined" ? Object : CreatePaymentDto
    ]),
    _ts_metadata("design:returntype", Promise)
], InvoicingController.prototype, "addPayment", null);
InvoicingController = _ts_decorate([
    (0, _common.Controller)('invoicing'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard)
], InvoicingController);

//# sourceMappingURL=invoicing.controller.js.map