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
exports.PurchasesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const decorators_1 = require("../../shared/decorators");
const mod_purchases_1 = require("@tunierp/mod-purchases");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ── DTOs ─────────────────────────────────────────────────
class CreateSupplierDto {
    name;
    email;
    phone;
    address;
    taxId;
    notes;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "taxId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "notes", void 0);
class PurchaseItemDto {
    productId;
    variantId;
    quantity;
    unitPrice;
    taxRate;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseItemDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseItemDto.prototype, "variantId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PurchaseItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PurchaseItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PurchaseItemDto.prototype, "taxRate", void 0);
class CreatePurchaseDto {
    supplierId;
    items;
    notes;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "supplierId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PurchaseItemDto),
    __metadata("design:type", Array)
], CreatePurchaseDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "notes", void 0);
class ReceivePurchaseDto {
    warehouseId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceivePurchaseDto.prototype, "warehouseId", void 0);
// ── Controller ───────────────────────────────────────────
let PurchasesController = class PurchasesController {
    async getStats(tenantId) {
        return (0, mod_purchases_1.getPurchaseStats)(tenantId);
    }
    async listOrders(tenantId, type, status, supplierId, limit, offset) {
        return (0, mod_purchases_1.listPurchases)(tenantId, {
            type,
            status,
            supplierId,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
        });
    }
    async createOrder(tenantId, dto) {
        return (0, mod_purchases_1.createPurchaseOrder)(tenantId, dto);
    }
    async receive(tenantId, auth, id, dto) {
        return (0, mod_purchases_1.receivePurchaseOrder)(tenantId, id, dto.warehouseId, auth.userId);
    }
    // ── Suppliers ────────────────────────────────────────
    async listSuppliers(tenantId, search) {
        return (0, mod_purchases_1.listSuppliers)(tenantId, search);
    }
    async createSupplier(tenantId, dto) {
        return (0, mod_purchases_1.createSupplier)(tenantId, dto);
    }
    async updateSupplier(tenantId, id, dto) {
        return (0, mod_purchases_1.updateSupplier)(tenantId, id, dto);
    }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, decorators_1.Permissions)('purchases.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, decorators_1.Permissions)('purchases.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('supplierId')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "listOrders", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, decorators_1.Permissions)('purchases.create'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreatePurchaseDto]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('orders/:id/receive'),
    (0, decorators_1.Permissions)('purchases.validate'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, decorators_1.Auth)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, ReceivePurchaseDto]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "receive", null);
__decorate([
    (0, common_1.Get)('suppliers'),
    (0, decorators_1.Permissions)('purchases.suppliers.manage'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "listSuppliers", null);
__decorate([
    (0, common_1.Post)('suppliers'),
    (0, decorators_1.Permissions)('purchases.suppliers.manage'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateSupplierDto]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "createSupplier", null);
__decorate([
    (0, common_1.Patch)('suppliers/:id'),
    (0, decorators_1.Permissions)('purchases.suppliers.manage'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CreateSupplierDto]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "updateSupplier", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, common_1.Controller)('purchases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
], PurchasesController);
//# sourceMappingURL=purchases.controller.js.map