"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = exports.PRISMA_TOKEN = void 0;
// ============================================================
// Shared — Database Module (Prisma singleton for DI)
// ============================================================
const common_1 = require("@nestjs/common");
const database_1 = require("@tunierp/database");
exports.PRISMA_TOKEN = 'PRISMA_SERVICE';
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.PRISMA_TOKEN,
                useValue: database_1.prisma,
            },
        ],
        exports: [exports.PRISMA_TOKEN],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map