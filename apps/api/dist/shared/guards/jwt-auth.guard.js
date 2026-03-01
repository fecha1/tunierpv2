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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = exports.MODULE_KEY = exports.PERMISSIONS_KEY = void 0;
// ============================================================
// Shared — Auth Guard (NestJS Guard decorator)
// ============================================================
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_1 = require("@tunierp/auth");
const auth_2 = require("@tunierp/auth");
exports.PERMISSIONS_KEY = 'permissions';
exports.MODULE_KEY = 'module';
let JwtAuthGuard = class JwtAuthGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        // 1. Authenticate (JWT)
        let authCtx;
        try {
            authCtx = await (0, auth_1.authenticate)(request.headers.authorization);
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message || 'Non authentifié');
        }
        // Attach auth context to request
        request.auth = authCtx;
        request.tenantId = authCtx.tenantId;
        request.userId = authCtx.userId;
        // 2. Check module requirement
        const requiredModule = this.reflector.get(exports.MODULE_KEY, context.getHandler())
            || this.reflector.get(exports.MODULE_KEY, context.getClass());
        if (requiredModule) {
            try {
                await (0, auth_1.requireModule)(authCtx.tenantId, requiredModule);
            }
            catch {
                throw new common_1.ForbiddenException(`Module "${requiredModule}" non activé`);
            }
        }
        // 3. Check permissions
        const requiredPermissions = this.reflector.get(exports.PERMISSIONS_KEY, context.getHandler());
        if (requiredPermissions && requiredPermissions.length > 0) {
            const hasAccess = requiredPermissions.some((perm) => (0, auth_2.hasPermission)(authCtx.permissions, perm));
            if (!hasAccess) {
                throw new common_1.ForbiddenException('Permissions insuffisantes');
            }
        }
        return true;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map