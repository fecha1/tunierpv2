// ============================================================
// Shared — Custom decorators
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
    get Auth () {
        return Auth;
    },
    get Permissions () {
        return Permissions;
    },
    get RequireModule () {
        return RequireModule;
    },
    get TenantId () {
        return TenantId;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../guards/jwt-auth.guard");
const Permissions = (...permissions)=>(0, _common.SetMetadata)(_jwtauthguard.PERMISSIONS_KEY, permissions);
const RequireModule = (moduleCode)=>(0, _common.SetMetadata)(_jwtauthguard.MODULE_KEY, moduleCode);
const Auth = (0, _common.createParamDecorator)((data, ctx)=>{
    const request = ctx.switchToHttp().getRequest();
    return request.auth;
});
const TenantId = (0, _common.createParamDecorator)((data, ctx)=>{
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId;
});

//# sourceMappingURL=index.js.map