// ============================================================
// Shared — Auth Guard (NestJS Guard decorator)
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get JwtAuthGuard () {
        return JwtAuthGuard;
    },
    get MODULE_KEY () {
        return MODULE_KEY;
    },
    get PERMISSIONS_KEY () {
        return PERMISSIONS_KEY;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _auth = require("@tunierp/auth");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const PERMISSIONS_KEY = 'permissions';
const MODULE_KEY = 'module';
let JwtAuthGuard = class JwtAuthGuard {
    constructor(reflector){
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        // 1. Authenticate (JWT)
        let authCtx;
        try {
            authCtx = await (0, _auth.authenticate)(request.headers.authorization);
        } catch (error) {
            throw new _common.UnauthorizedException(error.message || 'Non authentifié');
        }
        // Attach auth context to request
        request.auth = authCtx;
        request.tenantId = authCtx.tenantId;
        request.userId = authCtx.userId;
        // 2. Check module requirement
        const requiredModule = this.reflector.get(MODULE_KEY, context.getHandler()) || this.reflector.get(MODULE_KEY, context.getClass());
        if (requiredModule) {
            try {
                await (0, _auth.requireModule)(authCtx.tenantId, requiredModule);
            } catch  {
                throw new _common.ForbiddenException(`Module "${requiredModule}" non activé`);
            }
        }
        // 3. Check permissions
        const requiredPermissions = this.reflector.get(PERMISSIONS_KEY, context.getHandler());
        if (requiredPermissions && requiredPermissions.length > 0) {
            const hasAccess = requiredPermissions.some((perm)=>(0, _auth.hasPermission)(authCtx.permissions, perm));
            if (!hasAccess) {
                throw new _common.ForbiddenException('Permissions insuffisantes');
            }
        }
        return true;
    }
};
JwtAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector
    ])
], JwtAuthGuard);

//# sourceMappingURL=jwt-auth.guard.js.map