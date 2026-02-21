/***************************  MENU - TABLEAU DE BORD  ***************************/

const dashboard = {
  id: 'group-dashboard',
  title: 'Général',
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
      id: 'tasks',
      title: 'Tâches',
      type: 'item',
      url: '/tasks',
      icon: 'IconChecklist'
    }
  ]
};

export default dashboard;
