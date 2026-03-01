"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TenantsController", {
    enumerable: true,
    get: function() {
        return TenantsController;
    }
});
const _common = require("@nestjs/common");
const _tenantsservice = require("./tenants.service");
const _jwtauthguard = require("../../shared/guards/jwt-auth.guard");
const _decorators = require("../../shared/decorators");
const _classvalidator = require("class-validator");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
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
let UpdateTenantDto = class UpdateTenantDto {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateTenantDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateTenantDto.prototype, "logoUrl", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateTenantDto.prototype, "phone", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateTenantDto.prototype, "taxId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateTenantDto.prototype, "address", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateTenantDto.prototype, "city", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], UpdateTenantDto.prototype, "country", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Record === "undefined" ? Object : Record)
], UpdateTenantDto.prototype, "settings", void 0);
let CreateUserDto = class CreateUserDto {
};
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email invalide'
    }),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6, {
        message: 'Mot de passe: 6 caractères minimum'
    }),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "roleId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
let UpgradePlanDto = class UpgradePlanDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsIn)([
        'starter',
        'business',
        'professional',
        'enterprise'
    ]),
    _ts_metadata("design:type", String)
], UpgradePlanDto.prototype, "planCode", void 0);
let TenantsController = class TenantsController {
    constructor(tenantsService){
        this.tenantsService = tenantsService;
    }
    async getCurrentTenant(tenantId) {
        return this.tenantsService.getTenant(tenantId);
    }
    async updateCurrentTenant(tenantId, dto) {
        return this.tenantsService.updateTenant(tenantId, dto);
    }
    async listUsers(tenantId) {
        return this.tenantsService.listUsers(tenantId);
    }
    async createUser(tenantId, dto) {
        const { hashPassword } = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("@tunierp/auth")));
        const passwordHash = await hashPassword(dto.password);
        return this.tenantsService.createUser(tenantId, {
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roleId: dto.roleId,
            phone: dto.phone
        });
    }
    async listRoles(tenantId) {
        return this.tenantsService.listRoles(tenantId);
    }
    async getSubscription(tenantId) {
        return this.tenantsService.getSubscription(tenantId);
    }
    async upgradePlan(tenantId, dto) {
        return this.tenantsService.upgradePlan(tenantId, dto.planCode);
    }
};
_ts_decorate([
    (0, _common.Get)('current'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TenantsController.prototype, "getCurrentTenant", null);
_ts_decorate([
    (0, _common.Patch)('current'),
    (0, _decorators.Permissions)('settings.update'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof UpdateTenantDto === "undefined" ? Object : UpdateTenantDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TenantsController.prototype, "updateCurrentTenant", null);
_ts_decorate([
    (0, _common.Get)('current/users'),
    (0, _decorators.Permissions)('settings.users.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TenantsController.prototype, "listUsers", null);
_ts_decorate([
    (0, _common.Post)('current/users'),
    (0, _decorators.Permissions)('settings.users.create'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof CreateUserDto === "undefined" ? Object : CreateUserDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TenantsController.prototype, "createUser", null);
_ts_decorate([
    (0, _common.Get)('current/roles'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TenantsController.prototype, "listRoles", null);
_ts_decorate([
    (0, _common.Get)('current/subscription'),
    (0, _decorators.Permissions)('settings.billing.read'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], TenantsController.prototype, "getSubscription", null);
_ts_decorate([
    (0, _common.Post)('current/upgrade'),
    (0, _decorators.Permissions)('settings.billing.update'),
    _ts_param(0, (0, _decorators.TenantId)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof UpgradePlanDto === "undefined" ? Object : UpgradePlanDto
    ]),
    _ts_metadata("design:returntype", Promise)
], TenantsController.prototype, "upgradePlan", null);
TenantsController = _ts_decorate([
    (0, _common.Controller)('tenants'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _tenantsservice.TenantsService === "undefined" ? Object : _tenantsservice.TenantsService
    ])
], TenantsController);

//# sourceMappingURL=tenants.controller.js.map