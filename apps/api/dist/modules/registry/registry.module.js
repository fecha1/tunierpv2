"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ModulesRegistryModule", {
    enumerable: true,
    get: function() {
        return ModulesRegistryModule;
    }
});
const _common = require("@nestjs/common");
const _registrycontroller = require("./registry.controller");
const _registryservice = require("./registry.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ModulesRegistryModule = class ModulesRegistryModule {
};
ModulesRegistryModule = _ts_decorate([
    (0, _common.Module)({
        controllers: [
            _registrycontroller.RegistryController
        ],
        providers: [
            _registryservice.RegistryService
        ],
        exports: [
            _registryservice.RegistryService
        ]
    })
], ModulesRegistryModule);

//# sourceMappingURL=registry.module.js.map