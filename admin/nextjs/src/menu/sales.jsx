/***************************  MENU - VENTES  ***************************/

const sales = {
  id: 'group-sales',
  title: 'Ventes',
  icon: 'IconShoppingCart',
  type: 'group',
  children: [
    {
      id: 'pos',
      title: 'Point de Vente',
      type: 'item',
      url: '/pos',
      icon: 'IconDeviceDesktop'
    },
    {
      id: 'orders',
      title: 'Commandes',
      type: 'item',
      url: '/orders',
      icon: 'IconPackage'
    },
    {
      id: 'customers',
      title: 'Clients',
      type: 'item',
      url: '/customers',
      icon: 'IconUsers'
    },
    {
      id: 'documents',
      title: 'Documents',
      type: 'collapse',
      icon: 'IconFileInvoice',
      children: [
        { id: 'factures', title: 'Factures', type: 'item', url: '/documents/factures' },
        { id: 'devis', title: 'Devis', type: 'item', url: '/documents/devis' },
        { id: 'bon-livraison', title: 'Bons de Livraison', type: 'item', url: '/documents/bon-livraison' },
        { id: 'bon-commande', title: 'Bons de Commande', type: 'item', url: '/documents/bon-commande' },
        { id: 'avoirs', title: 'Avoirs', type: 'item', url: '/documents/avoirs' }
      ]
    }
  ]
};

export default sales;
