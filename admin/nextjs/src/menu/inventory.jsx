/***************************  MENU - INVENTAIRE  ***************************/

const inventory = {
  id: 'group-inventory',
  title: 'Inventaire',
  icon: 'IconBox',
  type: 'group',
  children: [
    {
      id: 'products',
      title: 'Produits',
      type: 'item',
      url: '/products',
      icon: 'IconBoxSeam'
    },
    {
      id: 'categories',
      title: 'Catégories',
      type: 'item',
      url: '/categories',
      icon: 'IconCategory'
    },
    {
      id: 'stock',
      title: 'Stock',
      type: 'item',
      url: '/stock',
      icon: 'IconBuildingWarehouse'
    },
    {
      id: 'suppliers',
      title: 'Fournisseurs',
      type: 'item',
      url: '/suppliers',
      icon: 'IconTruck'
    }
  ]
};

export default inventory;
