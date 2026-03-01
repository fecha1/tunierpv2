"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
// ============================================================
// TuniERP API — Root Application Module
// ============================================================
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const registry_module_1 = require("./modules/registry/registry.module");
const health_module_1 = require("./modules/health/health.module");
const database_module_1 = require("./shared/database.module");
// ERP domain modules
const inventory_module_1 = require("./modules/inventory/inventory.module");
const invoicing_module_1 = require("./modules/invoicing/invoicing.module");
const purchases_module_1 = require("./modules/purchases/purchases.module");
const pos_module_1 = require("./modules/pos/pos.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Global config from .env
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['../../packages/database/.env', '.env'],
            }),
            // Shared Prisma client
            database_module_1.DatabaseModule,
            // Core modules
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            registry_module_1.ModulesRegistryModule,
            // ERP domain modules
            inventory_module_1.InventoryModule,
            invoicing_module_1.InvoicingModule,
            purchases_module_1.PurchasesModule,
            pos_module_1.POSModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map