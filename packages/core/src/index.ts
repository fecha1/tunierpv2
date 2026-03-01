// ============================================================
// @tunierp/core — Package entry point
// ============================================================

// Manifest types
export type {
  ModuleManifest,
  ModulePermission,
  SidebarItem,
  SettingField,
} from './manifest';

// Registry
export {
  registerModule,
  getAllModules,
  getModule,
  getActiveTenantModuleCodes,
  getActiveModulesForTenant,
  buildSidebar,
  checkModuleDependencies,
} from './registry';
export type { SidebarGroup } from './registry';
