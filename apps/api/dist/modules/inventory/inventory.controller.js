"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InventoryController", {
    enumerable: true,
    get: function() {
        return InventoryController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../../shared/guards/jwt-auth.guard");
const _decorators = require("../../shared/decorators");
const _modinventory = require("@tunierp/mod-inventory");
const _classvalidator = require("class-validator");
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
let CreateMovementDto = class CreateMovementDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMovementDto.prototype, "productId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMovementDto.prototype, "variantId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMovementDto.prototype, "warehouseId", void 0);
_ts_decorate([
    (0, _classvalidator.IsIn)([
        'in',
        'out',
        'adjustment',
        'transfer'
    ]),
    _ts_metadata("design:type", String)
], CreateMovementDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.Min)(0.01),
    _ts_metadata("design:type", Number)
], CreateMovementDto.prototype, "quantity", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMovementDto.prototype, "reason", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMovementDto.prototype, "referenceType", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateMovementDto.prototype, "referenceId", void 0);
let CreateWarehouseDto = class CreateWarehouseDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateWarehouseDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateWarehouseDto.prototype, "code", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateWarehouseDto.prototype, "address", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Boolean)
], CreateWarehouseDto.prototype, "isDefault", void 0);
let InventoryController = class InventoryController {
    async getStats(tenantId) {
        return (0, _modinventory.getInventoryStats)(tenantId);
    }
    async getStock(tenantId, warehouseId, categoryId, lowStockOnly, search) {
        return (0, _modinventory.getStockLevels)(tenantId, {
            warehouseId,
            categoryId,
            lowStockOnly: lowStockOnly === 'true',
            search
        });
    }
    async listMovements(tenantId, warehouseId, type, limit) {
        return (0, _modinventory.getMovements)(tenantId, {
            warehouseId,
            type,
            limit: limit ? parseInt(limit) : undefined
        });
    }
    async addMovement(tenantId, auth, dto) {
        return (0, _modinventory.createMovement)(tenantId, {
            ...dto,
            userId: auth.userId
        });
    }
    async listWarehouses(tenantId) {
        return (0, _modinventory.getWarehouses)(tenantId);
    }
    async addWarehouse(tenantId, dto) {
        return (0, _modinventory.createWarehouse)(tenantId, dto);
    }
    async editWarehouse(tenantId, id, dto) {
        return (0, _modinventory.updateWarehouse)(tenantId, id, dto);
    }
};
_ts_decorate([
    (0, _common.Get)('stats'),
    (0, _decorators.Permissions)('inventory.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InventoryController.prototype, "getStats", null);
_ts_decorate([
    (0, _common.Get)('stock'),
    (0, _decorators.Permissions)('inventory.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Query)('warehouseId')),
    _ts_param(2, (0, _common.Query)('categoryId')),
    _ts_param(3, (0, _common.Query)('lowStockOnly')),
    _ts_param(4, (0, _common.Query)('search')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InventoryController.prototype, "getStock", null);
_ts_decorate([
    (0, _common.Get)('movements'),
    (0, _decorators.Permissions)('inventory.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Query)('warehouseId')),
    _ts_param(2, (0, _common.Query)('type')),
    _ts_param(3, (0, _common.Query)('limit')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InventoryController.prototype, "listMovements", null);
_ts_decorate([
    (0, _common.Post)('movements'),
    (0, _decorators.Permissions)('inventory.create'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _decorators.Auth)()),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AuthContext === "undefined" ? Object : AuthContext,
        typeof CreateMovementDto === "undefined" ? Object : CreateMovementDto
    ]),
    _ts_metadata("design:returntype", Promise)
], InventoryController.prototype, "addMovement", null);
_ts_decorate([
    (0, _common.Get)('warehouses'),
    (0, _decorators.Permissions)('inventory.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], InventoryController.prototype, "listWarehouses", null);
_ts_decorate([
    (0, _common.Post)('warehouses'),
    (0, _decorators.Permissions)('inventory.warehouses.manage'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof CreateWarehouseDto === "undefined" ? Object : CreateWarehouseDto
    ]),
    _ts_metadata("design:returntype", Promise)
], InventoryController.prototype, "addWarehouse", null);
_ts_decorate([
    (0, _common.Patch)('warehouses/:id'),
    (0, _decorators.Permissions)('inventory.warehouses.manage'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof CreateWarehouseDto === "undefined" ? Object : CreateWarehouseDto
    ]),
    _ts_metadata("design:returntype", Promise)
], InventoryController.prototype, "editWarehouse", null);
InventoryController = _ts_decorate([
    (0, _common.Controller)('inventory'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard)
], InventoryController);

//# sourceMappingURL=inventory.controller.js.map