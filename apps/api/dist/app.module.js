// ============================================================
// TuniERP API — Root Application Module
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _authmodule = require("./modules/auth/auth.module");
const _tenantsmodule = require("./modules/tenants/tenants.module");
const _registrymodule = require("./modules/registry/registry.module");
const _healthmodule = require("./modules/health/health.module");
const _databasemodule = require("./shared/database.module");
const _inventorymodule = require("./modules/inventory/inventory.module");
const _invoicingmodule = require("./modules/invoicing/invoicing.module");
const _purchasesmodule = require("./modules/purchases/purchases.module");
const _posmodule = require("./modules/pos/pos.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            // Global config from .env
            _config.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [
                    '../../packages/database/.env',
                    '.env'
                ]
            }),
            // Shared Prisma client
            _databasemodule.DatabaseModule,
            // Core modules
            _healthmodule.HealthModule,
            _authmodule.AuthModule,
            _tenantsmodule.TenantsModule,
            _registrymodule.ModulesRegistryModule,
            // ERP domain modules
            _inventorymodule.InventoryModule,
            _invoicingmodule.InvoicingModule,
            _purchasesmodule.PurchasesModule,
            _posmodule.POSModule
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map