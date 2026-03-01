// ============================================================
// Shared — Database Module (Prisma singleton for DI)
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
    get DatabaseModule () {
        return DatabaseModule;
    },
    get PRISMA_TOKEN () {
        return PRISMA_TOKEN;
    }
});
const _common = require("@nestjs/common");
const _database = require("@tunierp/database");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const PRISMA_TOKEN = 'PRISMA_SERVICE';
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        providers: [
            {
                provide: PRISMA_TOKEN,
                useValue: _database.prisma
            }
        ],
        exports: [
            PRISMA_TOKEN
        ]
    })
], DatabaseModule);

//# sourceMappingURL=database.module.js.map