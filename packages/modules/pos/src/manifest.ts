import type { ModuleManifest } from '@tunierp/core';

export const posManifest: ModuleManifest = {
  code: 'pos',
  name: 'Point de Vente (Caisse)',
  category: 'ventes',
  icon: 'IconDeviceDesktop',
  description: 'Interface de caisse tactile pour ventes directes avec gestion de tickets et tiroir-caisse.',
  dependencies: ['core', 'invoicing', 'inventory'],
  isCore: false,
  apiPrefix: '/api/v1/pos',
  frontendPrefix: '/pos',

  permissions: [
    { code: 'pos.access', name: 'Accéder à la caisse', description: 'Ouvrir l\'interface de caisse' },
    { code: 'pos.sell', name: 'Vendre', description: 'Effectuer des ventes au comptoir' },
    { code: 'pos.discount', name: 'Appliquer des remises', description: 'Réduire le prix au comptoir' },
    { code: 'pos.refund', name: 'Rembourser', description: 'Effectuer des retours et remboursements' },
    { code: 'pos.close_session', name: 'Fermer la caisse', description: 'Clôturer une session de caisse' },
    { code: 'pos.manage_sessions', name: 'Gérer les sessions', description: 'Voir toutes les sessions de caisse' },
  ],

  sidebarItems: [
    {
      id: 'pos-terminal',
      title: 'Caisse',
      icon: 'IconDeviceDesktop',
      url: '/pos/terminal',
      permission: 'pos.access',
      order: 0,
    },
    {
      id: 'pos-sessions',
      title: 'Sessions de caisse',
      icon: 'IconClipboardList',
      url: '/pos/sessions',
      permission: 'pos.manage_sessions',
      order: 10,
    },
    {
      id: 'pos-receipts',
      title: 'Tickets',
      icon: 'IconReceipt',
      url: '/pos/receipts',
      permission: 'pos.access',
      order: 20,
    },
  ],

  settingsSchema: [
    { key: 'defaultPaymentMethod', type: 'select', label: 'Mode de paiement par défaut', default: 'cash', options: ['cash', 'card', 'check', 'mobile'], description: 'Méthode de paiement pré-sélectionnée' },
    { key: 'printReceipt', type: 'boolean', label: 'Impression automatique', default: true, description: 'Imprimer le ticket après chaque vente' },
    { key: 'allowNegativeStock', type: 'boolean', label: 'Vente sans stock', default: false, description: 'Autoriser la vente même si le stock est insuffisant' },
    { key: 'receiptHeader', type: 'text', label: 'En-tête du ticket', default: '', description: 'Texte affiché en haut du ticket de caisse' },
    { key: 'receiptFooter', type: 'text', label: 'Pied de ticket', default: 'Merci de votre visite !', description: 'Texte affiché en bas du ticket' },
  ],
};
