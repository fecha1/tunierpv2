"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _authservice = require("./auth.service");
const _jwtauthguard = require("../../shared/guards/jwt-auth.guard");
const _decorators = require("../../shared/decorators");
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
let LoginDto = class LoginDto {
};
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email invalide'
    }),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6, {
        message: 'Mot de passe: 6 caractères minimum'
    }),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let RegisterDto = class RegisterDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "tenantName", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsIn)([
        'retail',
        'restaurant',
        'cafe',
        'bakery',
        'pharmacy',
        'clothing',
        'electronics',
        'grocery',
        'beauty',
        'auto_parts',
        'building_materials',
        'furniture',
        'jewelry',
        'optics',
        'general'
    ]),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "businessType", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsIn)([
        'starter',
        'business',
        'professional',
        'enterprise'
    ]),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "planCode", void 0);
_ts_decorate([
    (0, _classvalidator.IsEmail)({}, {
        message: 'Email invalide'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6, {
        message: 'Mot de passe: 6 caractères minimum'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
let RefreshTokenDto = class RefreshTokenDto {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
let AuthController = class AuthController {
    constructor(authService){
        this.authService = authService;
    }
    async login(dto) {
        try {
            return await this.authService.login(dto.email, dto.password);
        } catch (err) {
            console.error('[AUTH LOGIN ERROR]', err?.message, err?.stack);
            throw err;
        }
    }
    // Temporary debug endpoint — remove later
    async testLogin(email) {
        try {
            const result = await this.authService.login(email || 'admin@demo.tunierp.tn', 'demo1234');
            return {
                ok: true,
                user: result.user.email,
                tokenLen: result.accessToken.length
            };
        } catch (err) {
            return {
                ok: false,
                error: err?.message,
                stack: err?.stack?.split('\n').slice(0, 5)
            };
        }
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async refresh(dto) {
        return this.authService.refreshTokens(dto.refreshToken);
    }
    async logout(auth) {
        await this.authService.logout(auth.userId);
        return {
            message: 'Déconnexion réussie'
        };
    }
    async me(auth) {
        return auth;
    }
};
_ts_decorate([
    (0, _common.Post)('login'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof LoginDto === "undefined" ? Object : LoginDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.Get)('test-login'),
    _ts_param(0, (0, _common.Query)('email')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "testLogin", null);
_ts_decorate([
    (0, _common.Post)('register'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RegisterDto === "undefined" ? Object : RegisterDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
_ts_decorate([
    (0, _common.Post)('refresh'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RefreshTokenDto === "undefined" ? Object : RefreshTokenDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
_ts_decorate([
    (0, _common.Post)('logout'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _decorators.Auth)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContext === "undefined" ? Object : AuthContext
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
_ts_decorate([
    (0, _common.Post)('me'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _decorators.Auth)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthContext === "undefined" ? Object : AuthContext
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
AuthController = _ts_decorate([
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map