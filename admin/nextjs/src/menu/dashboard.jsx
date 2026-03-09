/***************************  MENU - TABLEAU DE BORD  ***************************/

const dashboard = {
  id: 'group-dashboard',
  title: 'Plateforme',
  icon: 'IconLayoutGrid',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      type: 'item',
      url: '/dashboard',
      icon: 'IconLayoutDashboard'
    },
    {
      id: 'tenants',
      title: 'Tenants',
      type: 'item',
      url: '/tenants',
      icon: 'IconBuilding'
    },
    {
      id: 'modules',
      title: 'Modules',
      type: 'item',
      url: '/modules',
      icon: 'IconPuzzle'
    },
    {
      id: 'plans',
      title: 'Plans',
      type: 'item',
      url: '/plans',
      icon: 'IconCreditCard'
    }
  ]
};

export default dashboard;
