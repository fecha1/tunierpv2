"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "POSController", {
    enumerable: true,
    get: function() {
        return POSController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../../shared/guards/jwt-auth.guard");
const _decorators = require("../../shared/decorators");
const _modpos = require("@tunierp/mod-pos");
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
let POSItemDto = class POSItemDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], POSItemDto.prototype, "productId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], POSItemDto.prototype, "variantId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], POSItemDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], POSItemDto.prototype, "quantity", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], POSItemDto.prototype, "unitPrice", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], POSItemDto.prototype, "discount", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], POSItemDto.prototype, "taxRate", void 0);
let CreatePOSSaleDto = class CreatePOSSaleDto {
};
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>POSItemDto),
    _ts_metadata("design:type", Array)
], CreatePOSSaleDto.prototype, "items", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePOSSaleDto.prototype, "customerId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePOSSaleDto.prototype, "paymentMethod", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0),
    _ts_metadata("design:type", Number)
], CreatePOSSaleDto.prototype, "amountPaid", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreatePOSSaleDto.prototype, "warehouseId", void 0);
let POSController = class POSController {
    async getStats(tenantId) {
        return (0, _modpos.getPOSStats)(tenantId);
    }
    async searchProducts(tenantId, query, warehouseId) {
        return (0, _modpos.searchProducts)(tenantId, query || '', warehouseId);
    }
    async sell(tenantId, auth, dto) {
        return (0, _modpos.createPOSSale)(tenantId, {
            ...dto,
            userId: auth.userId
        });
    }
};
_ts_decorate([
    (0, _common.Get)('stats'),
    (0, _decorators.Permissions)('pos.access'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], POSController.prototype, "getStats", null);
_ts_decorate([
    (0, _common.Get)('products'),
    (0, _decorators.Permissions)('pos.access'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Query)('q')),
    _ts_param(2, (0, _common.Query)('warehouseId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], POSController.prototype, "searchProducts", null);
_ts_decorate([
    (0, _common.Post)('sell'),
    (0, _decorators.Permissions)('pos.sell'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _decorators.Auth)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AuthContext === "undefined" ? Object : AuthContext,
        typeof CreatePOSSaleDto === "undefined" ? Object : CreatePOSSaleDto
    ]),
    _ts_metadata("design:returntype", Promise)
], POSController.prototype, "sell", null);
POSController = _ts_decorate([
    (0, _common.Controller)('pos'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard)
], POSController);

//# sourceMappingURL=pos.controller.js.map