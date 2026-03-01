/**
 * Register all ERP module manifests on API bootstrap.
 * This file is imported once in main.ts to populate the in-memory registry.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "bootstrapModules", {
    enumerable: true,
    get: function() {
        return bootstrapModules;
    }
});
const _core = require("@tunierp/core");
const _modinventory = require("@tunierp/mod-inventory");
const _modinvoicing = require("@tunierp/mod-invoicing");
const _modpurchases = require("@tunierp/mod-purchases");
const _modpos = require("@tunierp/mod-pos");
function bootstrapModules() {
    (0, _core.registerModule)(_modinventory.inventoryManifest);
    (0, _core.registerModule)(_modinvoicing.invoicingManifest);
    (0, _core.registerModule)(_modpurchases.purchasesManifest);
    (0, _core.registerModule)(_modpos.posManifest);
}

//# sourceMappingURL=bootstrap-modules.js.map