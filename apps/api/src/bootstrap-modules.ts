/**
 * Register all ERP module manifests on API bootstrap.
 * This file is imported once in main.ts to populate the in-memory registry.
 */
import { registerModule } from '@tunierp/core';
import { inventoryManifest } from '@tunierp/mod-inventory';
import { invoicingManifest } from '@tunierp/mod-invoicing';
import { purchasesManifest } from '@tunierp/mod-purchases';
import { posManifest } from '@tunierp/mod-pos';

export function bootstrapModules() {
  registerModule(inventoryManifest);
  registerModule(invoicingManifest);
  registerModule(purchasesManifest);
  registerModule(posManifest);
}
