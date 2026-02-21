/***************************  MENU - CRM & SERVICES  ***************************/

const crm = {
  id: 'group-crm',
  title: 'CRM & Services',
  icon: 'IconHeadset',
  type: 'group',
  children: [
    {
      id: 'contacts',
      title: 'Contacts',
      type: 'item',
      url: '/contacts',
      icon: 'IconAddressBook'
    },
    {
      id: 'tickets',
      title: 'Tickets Support',
      type: 'item',
      url: '/tickets',
      icon: 'IconTicket'
    },
    {
      id: 'services',
      title: 'Services',
      type: 'collapse',
      icon: 'IconTool',
      children: [
        { id: 'repairs', title: 'Réparations', type: 'item', url: '/services/repairs' },
        { id: 'warranties', title: 'Garanties', type: 'item', url: '/services/warranties' }
      ]
    }
  ]
};

export default crm;
