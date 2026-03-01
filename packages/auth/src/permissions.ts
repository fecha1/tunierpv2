// ============================================================
// @tunierp/auth — Permission definitions
// ============================================================

/**
 * All available permissions in the system.
 * Format: "module.action" (e.g., "products.create", "sales.read")
 * Wildcard "*" grants all permissions.
 * "module.*" grants all actions within a module.
 */
export const PERMISSIONS = {
  // Dashboard
  'dashboard.read': 'Voir le tableau de bord',

  // Products
  'products.read': 'Voir les produits',
  'products.create': 'Créer des produits',
  'products.update': 'Modifier des produits',
  'products.delete': 'Supprimer des produits',

  // Sales & Invoicing
  'sales.read': 'Voir les ventes',
  'sales.create': 'Créer des ventes',
  'sales.update': 'Modifier des ventes',
  'sales.delete': 'Supprimer des ventes',
  'sales.convert': 'Convertir des documents (Devis → Facture)',

  // Customers
  'customers.read': 'Voir les clients',
  'customers.create': 'Créer des clients',
  'customers.update': 'Modifier des clients',
  'customers.delete': 'Supprimer des clients',

  // Inventory
  'inventory.read': 'Voir le stock',
  'inventory.create': 'Entrée de stock',
  'inventory.update': 'Ajuster le stock',
  'inventory.delete': 'Supprimer des mouvements',

  // POS
  'pos.read': 'Voir le POS',
  'pos.create': 'Utiliser le POS',
  'pos.manage': 'Gérer les sessions caisse',

  // Purchases
  'purchases.read': 'Voir les achats',
  'purchases.create': 'Créer des achats',
  'purchases.update': 'Modifier des achats',
  'purchases.delete': 'Supprimer des achats',

  // Payments
  'payments.read': 'Voir les paiements',
  'payments.create': 'Enregistrer des paiements',
  'payments.update': 'Modifier des paiements',

  // Accounting
  'accounting.read': 'Voir la comptabilité',
  'accounting.manage': 'Gérer la comptabilité',

  // Reports
  'reports.read': 'Voir les rapports',
  'reports.export': 'Exporter les rapports',

  // HR
  'hr.read': 'Voir les RH',
  'hr.manage': 'Gérer les RH',

  // CRM
  'crm.read': 'Voir le CRM',
  'crm.manage': 'Gérer le CRM',

  // Settings
  'settings.read': 'Voir les paramètres',
  'settings.manage': 'Gérer les paramètres',
  'settings.users': 'Gérer les utilisateurs',
  'settings.roles': 'Gérer les rôles',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

/**
 * Check if a user's permissions array includes the required permission.
 * Supports wildcards: "*" (superadmin) and "module.*" (module-level).
 */
export function hasPermission(userPermissions: string[], required: string): boolean {
  // Superadmin
  if (userPermissions.includes('*')) return true;

  // Direct match
  if (userPermissions.includes(required)) return true;

  // Module wildcard (e.g., "products.*" matches "products.create")
  const [module] = required.split('.');
  if (userPermissions.includes(`${module}.*`)) return true;

  return false;
}

/**
 * Check if user has ALL of the required permissions
 */
export function hasAllPermissions(userPermissions: string[], required: string[]): boolean {
  return required.every((perm) => hasPermission(userPermissions, perm));
}

/**
 * Check if user has ANY of the required permissions
 */
export function hasAnyPermission(userPermissions: string[], required: string[]): boolean {
  return required.some((perm) => hasPermission(userPermissions, perm));
}
