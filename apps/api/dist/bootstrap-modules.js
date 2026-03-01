"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapModules = bootstrapModules;
/**
 * Register all ERP module manifests on API bootstrap.
 * This file is imported once in main.ts to populate the in-memory registry.
 */
const core_1 = require("@tunierp/core");
const manifest_1 = require("@tunierp/mod-inventory/manifest");
const manifest_2 = require("@tunierp/mod-invoicing/manifest");
const manifest_3 = require("@tunierp/mod-purchases/manifest");
const manifest_4 = require("@tunierp/mod-pos/manifest");
function bootstrapModules() {
    (0, core_1.registerModule)(manifest_1.inventoryManifest);
    (0, core_1.registerModule)(manifest_2.invoicingManifest);
    (0, core_1.registerModule)(manifest_3.purchasesManifest);
    (0, core_1.registerModule)(manifest_4.posManifest);
}
//# sourceMappingURL=bootstrap-modules.js.map