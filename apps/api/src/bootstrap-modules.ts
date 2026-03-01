/**
 * Register all ERP module manifests on API bootstrap.
 * This file is imported once in main.ts to populate the in-memory registry.
 */
import { registerModule } from '@tunierp/core';
import { inventoryManifest } from '@tunierp/mod-inventory/manifest';
import { invoicingManifest } from '@tunierp/mod-invoicing/manifest';
import { purchasesManifest } from '@tunierp/mod-purchases/manifest';
import { posManifest } from '@tunierp/mod-pos/manifest';

export function bootstrapModules() {
  registerModule(inventoryManifest);
  registerModule(invoicingManifest);
  registerModule(purchasesManifest);
  registerModule(posManifest);
}
