import type { ModuleManifest } from '@tunierp/core';

export const inventoryManifest: ModuleManifest = {
  code: 'inventory',
  name: 'Gestion de Stock',
  category: 'stock',
  icon: 'IconPackages',
  description: 'Gérez votre stock, entrepôts, mouvements d\'entrée/sortie et inventaires.',
  dependencies: ['core'],
  isCore: false,
  apiPrefix: '/api/v1/inventory',
  frontendPrefix: '/inventory',

  permissions: [
    { key: 'inventory.read', label: 'Voir le stock', description: 'Consulter les niveaux de stock' },
    { key: 'inventory.create', label: 'Entrée de stock', description: 'Ajouter du stock (réception, retour)' },
    { key: 'inventory.update', label: 'Modifier le stock', description: 'Ajustements de stock' },
    { key: 'inventory.delete', label: 'Supprimer un mouvement', description: 'Annuler un mouvement de stock' },
    { key: 'inventory.transfer', label: 'Transfert inter-entrepôt', description: 'Transférer du stock entre entrepôts' },
    { key: 'inventory.warehouses.manage', label: 'Gérer les entrepôts', description: 'Créer et modifier des entrepôts' },
  ],

  sidebarItems: [
    {
      id: 'inventory-dashboard',
      title: 'Vue d\'ensemble',
      icon: 'IconChartBar',
      url: '/inventory',
      permission: 'inventory.read',
      order: 0,
    },
    {
      id: 'inventory-stock',
      title: 'Niveaux de stock',
      icon: 'IconPackage',
      url: '/inventory/stock',
      permission: 'inventory.read',
      order: 10,
    },
    {
      id: 'inventory-movements',
      title: 'Mouvements',
      icon: 'IconArrowsExchange',
      url: '/inventory/movements',
      permission: 'inventory.read',
      order: 20,
    },
    {
      id: 'inventory-warehouses',
      title: 'Entrepôts',
      icon: 'IconBuildingWarehouse',
      url: '/inventory/warehouses',
      permission: 'inventory.warehouses.manage',
      order: 30,
    },
  ],

  settingsSchema: {
    lowStockThreshold: { type: 'number', label: 'Seuil stock faible', default: 10, description: 'Alerte quand le stock passe en dessous' },
    autoReorderEnabled: { type: 'boolean', label: 'Réapprovisionnement auto', default: false, description: 'Créer automatiquement des bons de commande' },
    trackExpiryDates: { type: 'boolean', label: 'Suivi des dates d\'expiration', default: false, description: 'Pour les produits périssables' },
  },
};
