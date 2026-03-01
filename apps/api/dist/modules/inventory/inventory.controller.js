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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const decorators_1 = require("../../shared/decorators");
const mod_inventory_1 = require("@tunierp/mod-inventory");
const class_validator_1 = require("class-validator");
// ── DTOs ─────────────────────────────────────────────────
class CreateMovementDto {
    productId;
    variantId;
    warehouseId;
    type;
    quantity;
    reason;
    referenceType;
    referenceId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "variantId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "warehouseId", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['in', 'out', 'adjustment', 'transfer', 'return']),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateMovementDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "referenceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovementDto.prototype, "referenceId", void 0);
class CreateWarehouseDto {
    name;
    code;
    address;
    isDefault;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateWarehouseDto.prototype, "isDefault", void 0);
// ── Controller ───────────────────────────────────────────
let InventoryController = class InventoryController {
    async getStats(tenantId) {
        return (0, mod_inventory_1.getInventoryStats)(tenantId);
    }
    async getStock(tenantId, warehouseId, categoryId, lowStockOnly, search) {
        return (0, mod_inventory_1.getStockLevels)(tenantId, {
            warehouseId,
            categoryId,
            lowStockOnly: lowStockOnly === 'true',
            search,
        });
    }
    async listMovements(tenantId, warehouseId, type, limit) {
        return (0, mod_inventory_1.getMovements)(tenantId, {
            warehouseId,
            type,
            limit: limit ? parseInt(limit) : undefined,
        });
    }
    async addMovement(tenantId, auth, dto) {
        return (0, mod_inventory_1.createMovement)(tenantId, { ...dto, userId: auth.userId });
    }
    async listWarehouses(tenantId) {
        return (0, mod_inventory_1.getWarehouses)(tenantId);
    }
    async addWarehouse(tenantId, dto) {
        return (0, mod_inventory_1.createWarehouse)(tenantId, dto);
    }
    async editWarehouse(tenantId, id, dto) {
        return (0, mod_inventory_1.updateWarehouse)(tenantId, id, dto);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, decorators_1.Permissions)('inventory.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('stock'),
    (0, decorators_1.Permissions)('inventory.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('warehouseId')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('lowStockOnly')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStock", null);
__decorate([
    (0, common_1.Get)('movements'),
    (0, decorators_1.Permissions)('inventory.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('warehouseId')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "listMovements", null);
__decorate([
    (0, common_1.Post)('movements'),
    (0, decorators_1.Permissions)('inventory.create'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, decorators_1.Auth)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, CreateMovementDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "addMovement", null);
__decorate([
    (0, common_1.Get)('warehouses'),
    (0, decorators_1.Permissions)('inventory.read'),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "listWarehouses", null);
__decorate([
    (0, common_1.Post)('warehouses'),
    (0, decorators_1.Permissions)('inventory.warehouses.manage'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateWarehouseDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "addWarehouse", null);
__decorate([
    (0, common_1.Patch)('warehouses/:id'),
    (0, decorators_1.Permissions)('inventory.warehouses.manage'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CreateWarehouseDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "editWarehouse", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map