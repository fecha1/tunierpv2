"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RegistryController", {
    enumerable: true,
    get: function() {
        return RegistryController;
    }
});
const _common = require("@nestjs/common");
const _registryservice = require("./registry.service");
const _jwtauthguard = require("../../shared/guards/jwt-auth.guard");
const _decorators = require("../../shared/decorators");
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
let RegistryController = class RegistryController {
    constructor(registryService){
        this.registryService = registryService;
    }
    /**
   * GET /modules/catalog — list all modules in system (public for pricing page)
   */ async listCatalog() {
        return this.registryService.listModuleCatalog();
    }
    /**
   * GET /modules/registered — list all registered module manifests
   */ async listRegistered() {
        return this.registryService.listAllModules();
    }
    /**
   * GET /modules/active — list tenant's active modules
   */ async getActiveModules(tenantId) {
        return this.registryService.getTenantModules(tenantId);
    }
    /**
   * GET /modules/sidebar — build sidebar menu for current user
   */ async getSidebar(tenantId, auth) {
        return this.registryService.getSidebar(tenantId, auth.permissions);
    }
    /**
   * POST /modules/:code/activate — activate a module for current tenant
   */ async activateModule(tenantId, code) {
        return this.registryService.activateModule(tenantId, code);
    }
    /**
   * POST /modules/:code/deactivate — deactivate a module for current tenant
   */ async deactivateModule(tenantId, code) {
        return this.registryService.deactivateModule(tenantId, code);
    }
};
_ts_decorate([
    (0, _common.Get)('catalog'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], RegistryController.prototype, "listCatalog", null);
_ts_decorate([
    (0, _common.Get)('registered'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], RegistryController.prototype, "listRegistered", null);
_ts_decorate([
    (0, _common.Get)('active'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RegistryController.prototype, "getActiveModules", null);
_ts_decorate([
    (0, _common.Get)('sidebar'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _decorators.Auth)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AuthContext === "undefined" ? Object : AuthContext
    ]),
    _ts_metadata("design:returntype", Promise)
], RegistryController.prototype, "getSidebar", null);
_ts_decorate([
    (0, _common.Post)(':code/activate'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _decorators.Permissions)('settings.modules.manage'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Param)('code')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RegistryController.prototype, "activateModule", null);
_ts_decorate([
    (0, _common.Post)(':code/deactivate'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _decorators.Permissions)('settings.modules.manage'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Param)('code')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], RegistryController.prototype, "deactivateModule", null);
RegistryController = _ts_decorate([
    (0, _common.Controller)('modules'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _registryservice.RegistryService === "undefined" ? Object : _registryservice.RegistryService
    ])
], RegistryController);

//# sourceMappingURL=registry.controller.js.map