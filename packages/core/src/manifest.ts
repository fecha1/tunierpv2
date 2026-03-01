// ============================================================
// @tunierp/core — Module Manifest Type Definition
// Each ERP module registers itself via a manifest.ts file
// ============================================================

export interface ModuleManifest {
  /** Unique module code — must match Module.code in the database */
  code: string;

  /** Display name (French) */
  name: string;

  /** Module category for grouping in sidebar */
  category: 'core' | 'sales' | 'inventory' | 'purchasing' | 'finance' | 'hr' | 'analytics' | 'website' | 'marketing' | 'advanced';

  /** Tabler icon name for sidebar */
  icon: string;

  /** Module description (French) */
  description: string;

  /** Other module codes this module depends on */
  dependencies: string[];

  /** Is this a core module (always enabled)? */
  isCore: boolean;

  /** Permissions this module defines */
  permissions: ModulePermission[];

  /** Sidebar navigation items this module contributes */
  sidebarItems: SidebarItem[];

  /** API route prefix (e.g., '/inventory', '/sales') */
  apiPrefix: string;

  /** Frontend route prefix (e.g., '/inventory', '/invoicing') */
  frontendPrefix: string;

  /** Settings schema for per-tenant module config */
  settingsSchema?: Record<string, SettingField>;
}

export interface ModulePermission {
  key: string;
  label: string;
  description?: string;
}

export interface SidebarItem {
  id: string;
  title: string;
  icon?: string;
  url: string;
  /** Required permission to show this item */
  permission?: string;
  children?: SidebarItem[];
  badge?: string;
  /** Sort order within the category group */
  order?: number;
}

export interface SettingField {
  type: 'string' | 'number' | 'boolean' | 'select' | 'json';
  label: string;
  default: any;
  options?: { value: string; label: string }[];
  description?: string;
}
