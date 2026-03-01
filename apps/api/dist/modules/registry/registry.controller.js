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
exports.RegistryController = void 0;
const common_1 = require("@nestjs/common");
const registry_service_1 = require("./registry.service");
const jwt_auth_guard_1 = require("../../shared/guards/jwt-auth.guard");
const decorators_1 = require("../../shared/decorators");
let RegistryController = class RegistryController {
    registryService;
    constructor(registryService) {
        this.registryService = registryService;
    }
    /**
     * GET /modules/catalog — list all modules in system (public for pricing page)
     */
    async listCatalog() {
        return this.registryService.listModuleCatalog();
    }
    /**
     * GET /modules/registered — list all registered module manifests
     */
    async listRegistered() {
        return this.registryService.listAllModules();
    }
    /**
     * GET /modules/active — list tenant's active modules
     */
    async getActiveModules(tenantId) {
        return this.registryService.getTenantModules(tenantId);
    }
    /**
     * GET /modules/sidebar — build sidebar menu for current user
     */
    async getSidebar(tenantId, auth) {
        return this.registryService.getSidebar(tenantId, auth.permissions);
    }
    /**
     * POST /modules/:code/activate — activate a module for current tenant
     */
    async activateModule(tenantId, code) {
        return this.registryService.activateModule(tenantId, code);
    }
    /**
     * POST /modules/:code/deactivate — deactivate a module for current tenant
     */
    async deactivateModule(tenantId, code) {
        return this.registryService.deactivateModule(tenantId, code);
    }
};
exports.RegistryController = RegistryController;
__decorate([
    (0, common_1.Get)('catalog'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegistryController.prototype, "listCatalog", null);
__decorate([
    (0, common_1.Get)('registered'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegistryController.prototype, "listRegistered", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RegistryController.prototype, "getActiveModules", null);
__decorate([
    (0, common_1.Get)('sidebar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, decorators_1.Auth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RegistryController.prototype, "getSidebar", null);
__decorate([
    (0, common_1.Post)(':code/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, decorators_1.Permissions)('settings.modules.manage'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RegistryController.prototype, "activateModule", null);
__decorate([
    (0, common_1.Post)(':code/deactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, decorators_1.Permissions)('settings.modules.manage'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RegistryController.prototype, "deactivateModule", null);
exports.RegistryController = RegistryController = __decorate([
    (0, common_1.Controller)('modules'),
    __metadata("design:paramtypes", [registry_service_1.RegistryService])
], RegistryController);
//# sourceMappingURL=registry.controller.js.map