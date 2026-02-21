/***************************  MENU - PARAMÈTRES  ***************************/

const settings = {
  id: 'group-settings',
  title: 'Administration',
  icon: 'IconSettings',
  type: 'group',
  children: [
    {
      id: 'settings',
      title: 'Paramètres',
      type: 'item',
      url: '/settings',
      icon: 'IconSettings'
    },
    {
      id: 'users',
      title: 'Utilisateurs',
      type: 'item',
      url: '/users',
      icon: 'IconUserCog'
    },
    {
      id: 'logs',
      title: "Journal d'activité",
      type: 'item',
      url: '/logs',
      icon: 'IconHistory'
    }
  ]
};

export default settings;
