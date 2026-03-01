import type { ModuleManifest } from '@tunierp/core';

export const invoicingManifest: ModuleManifest = {
  code: 'invoicing',
  name: 'Facturation',
  category: 'ventes',
  icon: 'IconFileInvoice',
  description: 'Créez des devis, factures, bons de livraison et gérez vos encaissements.',
  dependencies: ['core'],
  isCore: false,
  apiPrefix: '/api/v1/invoicing',
  frontendPrefix: '/invoicing',

  permissions: [
    { code: 'sales.read', name: 'Voir les ventes', description: 'Consulter les devis et factures' },
    { code: 'sales.create', name: 'Créer une vente', description: 'Créer devis, factures, bons de livraison' },
    { code: 'sales.update', name: 'Modifier une vente', description: 'Modifier les documents de vente' },
    { code: 'sales.delete', name: 'Supprimer une vente', description: 'Annuler ou supprimer un document' },
    { code: 'sales.validate', name: 'Valider une facture', description: 'Passer une facture en validé/payé' },
    { code: 'payments.create', name: 'Enregistrer un paiement', description: 'Recevoir un paiement client' },
    { code: 'payments.read', name: 'Voir les paiements', description: 'Consulter les paiements reçus' },
  ],

  sidebarItems: [
    {
      id: 'invoicing-dashboard',
      title: 'Vue d\'ensemble',
      icon: 'IconChartLine',
      url: '/invoicing',
      permission: 'sales.read',
      order: 0,
    },
    {
      id: 'invoicing-quotes',
      title: 'Devis',
      icon: 'IconFileDescription',
      url: '/invoicing/quotes',
      permission: 'sales.read',
      order: 10,
    },
    {
      id: 'invoicing-invoices',
      title: 'Factures',
      icon: 'IconFileInvoice',
      url: '/invoicing/invoices',
      permission: 'sales.read',
      order: 20,
    },
    {
      id: 'invoicing-delivery',
      title: 'Bons de livraison',
      icon: 'IconTruckDelivery',
      url: '/invoicing/delivery-notes',
      permission: 'sales.read',
      order: 30,
    },
    {
      id: 'invoicing-payments',
      title: 'Paiements',
      icon: 'IconCash',
      url: '/invoicing/payments',
      permission: 'payments.read',
      order: 40,
    },
    {
      id: 'invoicing-customers',
      title: 'Clients',
      icon: 'IconUsers',
      url: '/invoicing/customers',
      permission: 'customers.read',
      order: 50,
    },
  ],

  settingsSchema: [
    { key: 'defaultTaxRate', type: 'number', label: 'Taux TVA par défaut (%)', default: 19, description: 'TVA appliquée par défaut (19% en Tunisie)' },
    { key: 'quoteValidityDays', type: 'number', label: 'Validité devis (jours)', default: 30, description: 'Nombre de jours de validité des devis' },
    { key: 'paymentTermDays', type: 'number', label: 'Échéance paiement (jours)', default: 30, description: 'Délai de paiement par défaut' },
    { key: 'stampDuty', type: 'number', label: 'Timbre fiscal (TND)', default: 1, description: 'Droit de timbre sur les factures' },
    { key: 'showDiscount', type: 'boolean', label: 'Afficher les remises', default: true, description: 'Colonne remise sur les documents' },
    { key: 'autoNumbering', type: 'boolean', label: 'Numérotation automatique', default: true, description: 'Numérotation séquentielle des documents' },
  ],
};
