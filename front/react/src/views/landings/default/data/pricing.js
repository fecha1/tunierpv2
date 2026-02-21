export const pricing = {
  heading: 'Nos Tarifs',
  caption: 'Des forfaits adaptés à chaque étape de croissance de votre entreprise.',
  features: [
    { id: 1, label: '1 Utilisateur' },
    { id: 2, label: '5 Utilisateurs' },
    { id: 3, label: '15 Utilisateurs' },
    { id: 4, label: 'Utilisateurs illimités' },
    { id: 5, label: 'POS basique' },
    { id: 6, label: 'POS complet + Restaurant' },
    { id: 7, label: 'Facturation conforme' },
    { id: 8, label: 'Gestion de stock avancée' },
    { id: 9, label: 'CRM & Fidélité' },
    { id: 10, label: 'Site Web & E-Commerce' },
    { id: 11, label: 'Ressources Humaines' },
    { id: 12, label: 'Analytique & BI' },
    { id: 13, label: 'Modules IA' },
    { id: 14, label: 'API illimitée' },
    { id: 15, label: 'Multi-succursales' },
    { id: 16, label: 'White-label complet' }
  ],
  plans: [
    {
      title: 'Starter',
      price: 0,
      active: false,
      featureTitle: 'Inclus',
      content: 'Idéal pour tester la plateforme',
      exploreLink: { children: 'Commencer gratuitement', href: '/auth/register' },
      featuresID: [1, 5, 7]
    },
    {
      title: 'Business',
      active: true,
      price: 79,
      featureTitle: 'Inclus',
      content: '79 TND/mois — ou 790 TND/an (2 mois offerts)',
      exploreLink: { children: 'Choisir Business', href: '/auth/register' },
      featuresID: [2, 6, 7, 8, 9, 10, 11]
    },
    {
      title: 'Professionnel',
      active: false,
      price: 199,
      featureTitle: 'Inclus',
      content: '199 TND/mois — ou 1 990 TND/an (2 mois offerts)',
      exploreLink: { children: 'Choisir Pro', href: '/auth/register' },
      featuresID: [3, 6, 7, 8, 9, 10, 11, 12, 15]
    },
    {
      title: 'Entreprise',
      active: false,
      price: 499,
      featureTitle: 'Tout inclus',
      content: 'Sur mesure — à partir de 499 TND/mois',
      exploreLink: { children: 'Nous contacter', href: '/contact' },
      featuresID: [4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    }
  ]
};
