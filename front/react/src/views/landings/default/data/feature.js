// @project
import branding from '@/branding.json';
import { IconType } from '@/enum';
import { SECTION_PATH, BUY_NOW_URL, ADMIN_PATH, DOCS_URL } from '@/path';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

export const feature2 = {
  heading: 'Culture of Innovation',
  caption:
    'Join a team that embraces forward-thinking ideas, fosters innovation, and cultivates an environment where your creativity can flourish.',
  features: [
    {
      icon: { name: 'tabler-users', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Teamwork',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    },
    {
      icon: { name: 'tabler-star', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Inclusivity',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    },
    {
      icon: { name: 'tabler-chart-histogram', type: IconType.STROKE, color: 'grey.900', stroke: 1 },
      title: 'Growth',
      content: 'Our culture prioritizes continuous learning, encouraging personal and professional development. '
    }
  ]
};

export const feature5 = {
  heading: 'Beyond the 9-to-5',
  caption: 'Our benefits go beyond the standard, ensuring your life outside of work is just as fulfilling.',
  image1: '/assets/images/graphics/ai/graphics3-light.svg',
  image2: '/assets/images/graphics/ai/graphics2-light.svg',
  features: [
    {
      icon: 'tabler-coin',
      title: 'Compensation',
      content: 'Enjoy a competitive salary that recognizes your skills and contributions.'
    },
    {
      icon: 'tabler-health-recognition',
      title: 'Healthcare',
      content: "Access to a comprehensive healthcare plan, ensuring you and your family's well-being."
    }
  ],
  features2: [
    {
      icon: 'tabler-briefcase',
      title: 'Automated Scaling',
      content: 'Embrace a flexible work environment, allowing you to balance work.'
    },
    {
      icon: 'tabler-users',
      title: 'Real-Time',
      content: 'Support your family commitments with family-friendly policies and benefits.'
    }
  ],
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '10k+ Reviews (4.5 out of 5)'
  },
  content: 'Explore diverse career paths within the company through our internal mobility programs.',
  actionBtn: { children: 'Explore all Features', href: '#' }
};

export const feature20 = {
  heading: 'Tous les outils pour gérer votre activité',
  caption: 'Des modules professionnels conçus pour les entreprises tunisiennes, prêts à l\'emploi.',
  actionBtn: { children: 'Essai gratuit', href: '/auth/register' },
  secondaryBtn: { children: 'Voir les tarifs', href: '#pricing' },
  features: [
    {
      icon: 'tabler-cash-register',
      title: 'Point de Vente (POS)',
      content: 'Caisse tactile rapide avec gestion multi-modes de paiement, tickets et suivi en temps réel.'
    },
    {
      icon: 'tabler-file-invoice',
      title: 'Facturation',
      content: 'Factures, devis, bons de livraison et avoirs conformes à la réglementation tunisienne.'
    },
    {
      icon: 'tabler-packages',
      title: 'Gestion de Stock',
      content: 'Suivi des produits, lots, numéros de série, transferts et alertes de réapprovisionnement.'
    },
    {
      icon: 'tabler-users',
      title: 'CRM & Clients',
      content: 'Base clients, programme de fidélité, segmentation et suivi des interactions commerciales.'
    },
    {
      icon: 'tabler-briefcase',
      title: 'Ressources Humaines',
      content: 'Gestion des employés, présence, congés, planification et suivi des commissions.'
    },
    {
      icon: 'tabler-world',
      title: 'Site Web & E-Commerce',
      content: 'Créez votre vitrine en ligne avec boutique e-commerce, réservation et blog intégrés.'
    }
  ]
};

export const feature21 = {
  heading: `Design Faster, Smarter with ${branding.brandName} Figma`,
  caption: 'Unlock Figma’s advanced tools for streamlined, scalable, and responsive SaaS UI design.',
  image: '/assets/images/graphics/ai/desktop1-light.svg',
  primaryBtn: { children: 'Free Figma', href: 'https://www.figma.com/community/file/1425095061180549847', ...linkProps },
  secondaryBtn: {
    children: 'Preview Pro Figma',
    href: 'https://www.figma.com/design/mlkXfeqxUKqIo0GQhPBqPb/SaasAble---UI-Kit---Preview-only?node-id=11-1833&t=JBHOIIEuYZpmN6v8-1',
    ...linkProps
  },
  features: [
    {
      animationDelay: 0.1,
      icon: 'tabler-components',
      title: 'Component Architecture'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-moon',
      title: 'Dark Mode'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-brightness-auto',
      title: 'Auto Layout'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-accessible',
      title: 'WCAG Compliant'
    },
    {
      animationDelay: 0.1,
      icon: 'tabler-icons',
      title: 'Custom Icons'
    },
    {
      animationDelay: 0.2,
      icon: 'tabler-file-stack',
      title: 'Page Demos'
    },
    {
      animationDelay: 0.3,
      icon: 'tabler-brand-matrix',
      title: 'Material 3 Guideline'
    },
    {
      animationDelay: 0.4,
      icon: 'tabler-click',
      title: 'Quick Customization'
    }
  ]
};

export const feature = {
  heading: `What’s Inside of ${branding.brandName} Plus Version`,
  features: [
    {
      image: '/assets/images/shared/react.svg',
      title: 'CRA JavaScript',
      content: 'Ensure accessibility with WCAG compliant design for browsing.'
    },
    {
      image: '/assets/images/shared/next-js.svg',
      title: 'Next.js JavaScript',
      content: 'Tailor typography for optimal readability across all screen sizes.'
    },
    {
      image: '/assets/images/shared/react.svg',
      title: 'CRA TypeScript',
      content: 'Customize Material 3 design MUI components for enhanced aesthetics.'
    },
    {
      image: '/assets/images/shared/next-js.svg',
      title: 'Next.js TypeScript',
      content: 'Adjust content layout for visual coherence on various screen sizes.'
    },
    {
      image: '/assets/images/shared/figma.svg',
      title: 'Figma ',
      content: 'Boost visibility with SEO-friendly features for better search rankings.'
    },
    {
      title: 'Check Out Our Pricing Plan',
      content: 'Choose the plan that aligns with your SaaS product requirements.',
      actionBtn: { children: 'Pricing Plan', href: BUY_NOW_URL, ...linkProps }
    }
  ]
};

export const feature7 = {
  heading: 'Real-Time Performance Insights',
  caption: 'Gain a competitive edge with real-time performance monitoring.',
  testimonials: [
    {
      image: '/assets/images/graphics/ai/graphics6-light.svg',
      features: [
        {
          icon: 'tabler-star',
          title: 'Core Value',
          content: 'Unlock growth potential through continuous monitoring, enabling proactive strategies in a competitive landscape.'
        }
      ]
    },
    {
      image: '/assets/images/graphics/ai/graphics8-light.svg',
      features: [
        {
          icon: 'tabler-route',
          title: 'Multi-Cloud Orchestration',
          content: 'Enhances flexibility and resilience in a multi-cloud environment.'
        }
      ]
    },
    {
      image: '/assets/images/graphics/ai/graphics3-light.svg',
      features: [
        {
          icon: 'tabler-history',
          title: 'Story',
          content: 'Real-time performance insights empower teams to respond swiftly, optimizing operations and driving growth.'
        }
      ]
    }
  ],
  breadcrumbs: [{ title: 'Core Value' }, { title: 'Culture' }, { title: 'Story' }]
};

export const feature23 = {
  heading: 'Culture of Innovation',
  caption:
    'Join a team that embraces forward-thinking ideas, fosters innovation, and cultivates an environment where your creativity can flourish.',
  heading2: 'Growth',
  caption2: 'Our culture prioritizes continuous learning, encouraging personal and professional development. ',
  image: '/assets/images/graphics/default/feature23-light.png',
  primaryBtn: { children: 'Join  Our Team', href: '#' },

  features: [
    {
      icon: 'tabler-users',
      title: 'Teamwork',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    },
    {
      icon: 'tabler-star',
      title: 'Inclusivity',
      content: 'We embrace varied perspectives and backgrounds, creating an inclusive environment.'
    }
  ]
};

export const feature18 = {
  heading: 'Un tableau de bord puissant et intuitif',
  caption: 'Gérez vos données, utilisateurs et workflows avec une interface d\'administration moderne et personnalisable.',
  topics: [
    {
      icon: 'tabler-dashboard',
      title: 'Tableau de Bord',
      title2: 'Vue d\'ensemble en temps réel',
      description: 'Suivez vos KPIs, chiffre d\'affaires et activité depuis un tableau de bord centralisé.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'Chiffre d\'affaires en temps réel' },
        { primary: 'Graphiques et tendances' },
        { primary: 'Alertes et notifications' },
        { primary: 'Actions rapides' }
      ],
      actionBtn: { children: 'Voir le Dashboard', href: ADMIN_PATH, ...linkProps },
      actionBtn2: { children: 'Documentation', href: DOCS_URL, ...linkProps }
    },
    {
      icon: 'tabler-shopping-cart',
      title: 'Gestion des Ventes',
      title2: 'Suivez chaque transaction',
      description: 'POS, factures, devis et bons de livraison dans une interface unifiée.',
      image: '/assets/images/graphics/default/admin-dashboard-2.png',
      list: [
        { primary: 'Caisse POS intégrée' },
        { primary: 'Facturation automatique' },
        { primary: 'Suivi des paiements' },
        { primary: 'Historique des transactions' }
      ],
      actionBtn: { children: 'Voir le Dashboard', href: ADMIN_PATH, ...linkProps },
      actionBtn2: { children: 'Documentation', href: DOCS_URL, ...linkProps }
    },
    {
      icon: 'tabler-packages',
      title: 'Suivi des Stocks',
      title2: 'Contrôle total de l\'inventaire',
      description: 'Gérez vos produits, variantes, lots et transferts entre succursales.',
      image: '/assets/images/graphics/default/admin-dashboard-3.png',
      list: [
        { primary: 'Stock en temps réel' },
        { primary: 'Alertes de rupture' },
        { primary: 'Transferts inter-succursales' },
        { primary: 'Traçabilité complète' }
      ],
      actionBtn: { children: 'Voir le Dashboard', href: ADMIN_PATH, ...linkProps },
      actionBtn2: { children: 'Documentation', href: DOCS_URL, ...linkProps }
    },
    {
      icon: 'tabler-chart-bar',
      title: 'Analytique Business',
      title2: 'Des données pour décider',
      description: 'Rapports personnalisés, business intelligence et analyses avancées.',
      image: '/assets/images/graphics/default/admin-dashboard.png',
      list: [
        { primary: 'Rapports personnalisés' },
        { primary: 'Intelligence artificielle' },
        { primary: 'Export PDF & Excel' },
        { primary: 'Tableaux croisés dynamiques' }
      ],
      actionBtn: { children: 'Voir le Dashboard', href: ADMIN_PATH, ...linkProps },
      actionBtn2: { children: 'Documentation', href: DOCS_URL, ...linkProps }
    }
  ]
};
