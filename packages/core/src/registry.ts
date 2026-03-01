// ============================================================
// @tunierp/core — Module Registry
// Central registry that collects all module manifests,
// resolves active modules per tenant, builds dynamic sidebar
// ============================================================
import { prisma } from '@tunierp/database';
import type { ModuleManifest, SidebarItem } from './manifest';
import { hasPermission } from '@tunierp/auth';

// In-memory registry of all available module manifests
const moduleRegistry = new Map<string, ModuleManifest>();

/**
 * Register a module manifest. Called at app startup by each module.
 */
export function registerModule(manifest: ModuleManifest): void {
  if (moduleRegistry.has(manifest.code)) {
    console.warn(`Module "${manifest.code}" already registered — overwriting.`);
  }
  moduleRegistry.set(manifest.code, manifest);
}

/**
 * Get all registered module manifests
 */
export function getAllModules(): ModuleManifest[] {
  return Array.from(moduleRegistry.values());
}

/**
 * Get a specific module manifest by code
 */
export function getModule(code: string): ModuleManifest | undefined {
  return moduleRegistry.get(code);
}

/**
 * Get the list of active module codes for a tenant (from DB)
 */
export async function getActiveTenantModuleCodes(tenantId: string): Promise<string[]> {
  const tenantModules = await prisma.tenantModule.findMany({
    where: { tenantId, isActive: true },
    select: { module: { select: { code: true } } },
  });
  return tenantModules.map((tm) => tm.module.code);
}

/**
 * Get active module manifests for a tenant.
 * Only returns modules that are both registered AND activated for the tenant.
 */
export async function getActiveModulesForTenant(tenantId: string): Promise<ModuleManifest[]> {
  const activeCodes = await getActiveTenantModuleCodes(tenantId);
  return getAllModules().filter((m) => activeCodes.includes(m.code));
}

/**
 * Build the dynamic sidebar for a tenant + user.
 * Filters by: active modules → user permissions → sorted by category + order.
 */
export async function buildSidebar(
  tenantId: string,
  userPermissions: string[]
): Promise<SidebarGroup[]> {
  const activeModules = await getActiveModulesForTenant(tenantId);

  const groups = new Map<string, SidebarGroup>();

  for (const mod of activeModules) {
    // Filter sidebar items by user permissions
    const visibleItems = mod.sidebarItems.filter((item) => {
      if (!item.permission) return true;
      return hasPermission(userPermissions, item.permission);
    });

    if (visibleItems.length === 0) continue;

    const categoryLabel = CATEGORY_LABELS[mod.category] || mod.category;

    if (!groups.has(mod.category)) {
      groups.set(mod.category, {
        id: mod.category,
        title: categoryLabel,
        items: [],
        order: CATEGORY_ORDER[mod.category] || 99,
      });
    }

    const group = groups.get(mod.category)!;
    group.items.push(...visibleItems);
  }

  // Sort groups by order, then sort items within each group
  return Array.from(groups.values())
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => (a.order || 0) - (b.order || 0)),
    }));
}

/**
 * Check if a module has all its dependencies met for a tenant
 */
export async function checkModuleDependencies(
  tenantId: string,
  moduleCode: string
): Promise<{ met: boolean; missing: string[] }> {
  const manifest = getModule(moduleCode);
  if (!manifest) return { met: false, missing: [moduleCode] };

  const activeCodes = await getActiveTenantModuleCodes(tenantId);
  const missing = manifest.dependencies.filter((dep) => !activeCodes.includes(dep));

  return { met: missing.length === 0, missing };
}

// ── Types ────────────────────────────────────────────────

export interface SidebarGroup {
  id: string;
  title: string;
  items: SidebarItem[];
  order: number;
}

// ── Constants ────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  core: 'Général',
  sales: 'Ventes',
  inventory: 'Stock',
  purchasing: 'Achats',
  finance: 'Finance',
  hr: 'Ressources Humaines',
  analytics: 'Rapports',
  website: 'Site Web',
  marketing: 'Marketing',
  advanced: 'Avancé',
};

const CATEGORY_ORDER: Record<string, number> = {
  core: 0,
  sales: 10,
  inventory: 20,
  purchasing: 30,
  finance: 40,
  hr: 50,
  analytics: 60,
  website: 70,
  marketing: 80,
  advanced: 90,
};
