/***************************  MENU - FINANCES  ***************************/

const finance = {
  id: 'group-finance',
  title: 'Finances',
  icon: 'IconCash',
  type: 'group',
  children: [
    {
      id: 'payments',
      title: 'Paiements',
      type: 'item',
      url: '/payments',
      icon: 'IconCreditCard'
    },
    {
      id: 'caisse',
      title: 'Caisse',
      type: 'item',
      url: '/caisse',
      icon: 'IconCashRegister'
    },
    {
      id: 'reports',
      title: 'Rapports',
      type: 'item',
      url: '/reports',
      icon: 'IconChartBar'
    }
  ]
};

export default finance;
