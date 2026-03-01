"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PurchasesController", {
    enumerable: true,
    get: function() {
        return PurchasesController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../../shared/guards/jwt-auth.guard");
const _decorators = require("../../shared/decorators");
const _modpurchases = require("@tunierp/mod-purchases");
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
let CreateSupplierDto = class CreateSupplierDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSupplierDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSupplierDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSupplierDto.prototype, "phone", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSupplierDto.prototype, "address", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSupplierDto.prototype, "taxId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateSupplierDto.prototype, "notes", void 0);
let PurchaseItemDto = class PurchaseItemDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], PurchaseItemDto.prototype, "productId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], PurchaseItemDto.prototype, "variantId", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], PurchaseItemDto.prototype, "quantity", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], PurchaseItemDto.prototype, "unitPrice", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], PurchaseItemDto.prototype, "taxRate", void 0);
let CreatePurchaseDto = class CreatePurchaseDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePurchaseDto.prototype, "supplierId", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>PurchaseItemDto),
    _ts_metadata("design:type", Array)
], CreatePurchaseDto.prototype, "items", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePurchaseDto.prototype, "notes", void 0);
let ReceivePurchaseDto = class ReceivePurchaseDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ReceivePurchaseDto.prototype, "warehouseId", void 0);
let PurchasesController = class PurchasesController {
    async getStats(tenantId) {
        return (0, _modpurchases.getPurchaseStats)(tenantId);
    }
    async listOrders(tenantId, type, status, supplierId, limit, offset) {
        return (0, _modpurchases.listPurchases)(tenantId, {
            type,
            status,
            supplierId,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined
        });
    }
    async createOrder(tenantId, dto) {
        return (0, _modpurchases.createPurchaseOrder)(tenantId, dto);
    }
    async receive(tenantId, auth, id, dto) {
        return (0, _modpurchases.receivePurchaseOrder)(tenantId, id, dto.warehouseId, auth.userId);
    }
    // ── Suppliers ────────────────────────────────────────
    async listSuppliers(tenantId, search) {
        return (0, _modpurchases.listSuppliers)(tenantId, search);
    }
    async createSupplier(tenantId, dto) {
        return (0, _modpurchases.createSupplier)(tenantId, dto);
    }
    async updateSupplier(tenantId, id, dto) {
        return (0, _modpurchases.updateSupplier)(tenantId, id, dto);
    }
};
_ts_decorate([
    (0, _common.Get)('stats'),
    (0, _decorators.Permissions)('purchases.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], PurchasesController.prototype, "getStats", null);
_ts_decorate([
    (0, _common.Get)('orders'),
    (0, _decorators.Permissions)('purchases.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Query)('type')),
    _ts_param(2, (0, _common.Query)('status')),
    _ts_param(3, (0, _common.Query)('supplierId')),
    _ts_param(4, (0, _common.Query)('limit')),
    _ts_param(5, (0, _common.Query)('offset')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], PurchasesController.prototype, "listOrders", null);
_ts_decorate([
    (0, _common.Post)('orders'),
    (0, _decorators.Permissions)('purchases.create'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof CreatePurchaseDto === "undefined" ? Object : CreatePurchaseDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PurchasesController.prototype, "createOrder", null);
_ts_decorate([
    (0, _common.Post)('orders/:id/receive'),
    (0, _decorators.Permissions)('purchases.validate'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _decorators.Auth)()),
    _ts_param(2, (0, _common.Param)('id')),
    _ts_param(3, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AuthContext === "undefined" ? Object : AuthContext,
        String,
        typeof ReceivePurchaseDto === "undefined" ? Object : ReceivePurchaseDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PurchasesController.prototype, "receive", null);
_ts_decorate([
    (0, _common.Get)('suppliers'),
    (0, _decorators.Permissions)('purchases.suppliers.manage'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Query)('search')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], PurchasesController.prototype, "listSuppliers", null);
_ts_decorate([
    (0, _common.Post)('suppliers'),
    (0, _decorators.Permissions)('purchases.suppliers.manage'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof CreateSupplierDto === "undefined" ? Object : CreateSupplierDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PurchasesController.prototype, "createSupplier", null);
_ts_decorate([
    (0, _common.Patch)('suppliers/:id'),
    (0, _decorators.Permissions)('purchases.suppliers.manage'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof CreateSupplierDto === "undefined" ? Object : CreateSupplierDto
    ]),
    _ts_metadata("design:returntype", Promise)
], PurchasesController.prototype, "updateSupplier", null);
PurchasesController = _ts_decorate([
    (0, _common.Controller)('purchases'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard)
], PurchasesController);

//# sourceMappingURL=purchases.controller.js.map