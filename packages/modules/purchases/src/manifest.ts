import type { ModuleManifest } from '@tunierp/core';

export const purchasesManifest: ModuleManifest = {
  code: 'purchases',
  name: 'Achats & Fournisseurs',
  category: 'achats',
  icon: 'IconShoppingCart',
  description: 'Gérez vos bons de commande, réceptions et relations fournisseurs.',
  dependencies: ['core', 'inventory'],
  isCore: false,
  apiPrefix: '/api/v1/purchases',
  frontendPrefix: '/purchases',

  permissions: [
    { key: 'purchases.read', label: 'Voir les achats', description: 'Consulter les bons de commande et réceptions' },
    { key: 'purchases.create', label: 'Créer un achat', description: 'Créer un bon de commande fournisseur' },
    { key: 'purchases.update', label: 'Modifier un achat', description: 'Modifier les documents d\'achat' },
    { key: 'purchases.delete', label: 'Supprimer un achat', description: 'Annuler un bon de commande' },
    { key: 'purchases.validate', label: 'Valider un achat', description: 'Confirmer et réceptionner' },
    { key: 'purchases.suppliers.manage', label: 'Gérer les fournisseurs', description: 'CRUD fournisseurs' },
  ],

  sidebarItems: [
    {
      id: 'purchases-dashboard',
      title: 'Vue d\'ensemble',
      icon: 'IconChartDonut',
      url: '/purchases',
      permission: 'purchases.read',
      order: 0,
    },
    {
      id: 'purchases-orders',
      title: 'Bons de commande',
      icon: 'IconFileText',
      url: '/purchases/orders',
      permission: 'purchases.read',
      order: 10,
    },
    {
      id: 'purchases-receipts',
      title: 'Réceptions',
      icon: 'IconPackageImport',
      url: '/purchases/receipts',
      permission: 'purchases.read',
      order: 20,
    },
    {
      id: 'purchases-suppliers',
      title: 'Fournisseurs',
      icon: 'IconTruck',
      url: '/purchases/suppliers',
      permission: 'purchases.suppliers.manage',
      order: 30,
    },
  ],

  settingsSchema: {
    defaultPaymentTermDays: { type: 'number', label: 'Échéance paiement fournisseur (jours)', default: 30, description: 'Délai de paiement fournisseur par défaut' },
    autoReceiveStock: { type: 'boolean', label: 'Réception auto en stock', default: true, description: 'Entrée automatique en stock à la réception' },
    requireApproval: { type: 'boolean', label: 'Validation requise', default: false, description: 'Les BC doivent être approuvés avant envoi' },
  },
};
