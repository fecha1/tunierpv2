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
    { code: 'purchases.read', name: 'Voir les achats', description: 'Consulter les bons de commande et réceptions' },
    { code: 'purchases.create', name: 'Créer un achat', description: 'Créer un bon de commande fournisseur' },
    { code: 'purchases.update', name: 'Modifier un achat', description: 'Modifier les documents d\'achat' },
    { code: 'purchases.delete', name: 'Supprimer un achat', description: 'Annuler un bon de commande' },
    { code: 'purchases.validate', name: 'Valider un achat', description: 'Confirmer et réceptionner' },
    { code: 'purchases.suppliers.manage', name: 'Gérer les fournisseurs', description: 'CRUD fournisseurs' },
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

  settingsSchema: [
    { key: 'defaultPaymentTermDays', type: 'number', label: 'Échéance paiement fournisseur (jours)', default: 30, description: 'Délai de paiement fournisseur par défaut' },
    { key: 'autoReceiveStock', type: 'boolean', label: 'Réception auto en stock', default: true, description: 'Entrée automatique en stock à la réception' },
    { key: 'requireApproval', type: 'boolean', label: 'Validation requise', default: false, description: 'Les BC doivent être approuvés avant envoi' },
  ],
};
