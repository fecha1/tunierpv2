// @project
import { ADMIN_PATH } from '@/path';

/***************************  DEFAULT - NAVBAR  ***************************/

export const navbar = {
  primaryBtn: { children: 'Essai gratuit', href: '/auth/register' },
  navItems: [
    { id: 'home', title: 'Accueil', link: '/' },
    { id: 'features', title: 'Fonctionnalités', link: '#features' },
    { id: 'pricing', title: 'Tarifs', link: '#pricing' },
    { id: 'contact', title: 'Contact', link: '/contact' },
    { id: 'dashboard', title: 'Tableau de bord', link: ADMIN_PATH }
  ]
};
