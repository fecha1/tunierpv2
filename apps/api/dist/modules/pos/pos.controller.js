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
exports.POSController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const decorators_1 = require("../../shared/decorators");
const mod_pos_1 = require("@tunierp/mod-pos");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ── DTOs ─────────────────────────────────────────────────
class POSItemDto {
    productId;
    variantId;
    name;
    quantity;
    unitPrice;
    discount;
    taxRate;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], POSItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], POSItemDto.prototype, "variantId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], POSItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], POSItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], POSItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], POSItemDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], POSItemDto.prototype, "taxRate", void 0);
class CreatePOSSaleDto {
    items;
    customerId;
    paymentMethod;
    amountPaid;
    warehouseId;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => POSItemDto),
    __metadata("design:type", Array)
], CreatePOSSaleDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePOSSaleDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePOSSaleDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePOSSaleDto.prototype, "amountPaid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePOSSaleDto.prototype, "warehouseId", void 0);
// ── Controller ───────────────────────────────────────────
let POSController = class POSController {
    async getStats(tenantId) {
        return (0, mod_pos_1.getPOSStats)(tenantId);
    }
    async searchProducts(tenantId, query, warehouseId) {
        return (0, mod_pos_1.searchProducts)(tenantId, query || '', warehouseId);
    }
    async sell(tenantId, auth, dto) {
        return (0, mod_pos_1.createPOSSale)(tenantId, { ...dto, userId: auth.userId });
    }
};
exports.POSController = POSController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, decorators_1.Permissions)('pos.access'),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], POSController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, decorators_1.Permissions)('pos.access'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], POSController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Post)('sell'),
    (0, decorators_1.Permissions)('pos.sell'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, decorators_1.Auth)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, CreatePOSSaleDto]),
    __metadata("design:returntype", Promise)
], POSController.prototype, "sell", null);
exports.POSController = POSController = __decorate([
    (0, common_1.Controller)('pos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
], POSController);
//# sourceMappingURL=pos.controller.js.map