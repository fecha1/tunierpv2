// @project
import SvgIcon from '@/components/SvgIcon';

export const integration = {
  headLine: 'Adapté à chaque secteur d\'activité',
  captionLine: 'TuniERP s\'adapte à votre métier avec des modules spécialisés pour chaque type d\'entreprise tunisienne.',
  primaryBtn: {
    children: 'Découvrir les modules',
    startIcon: <SvgIcon name="tabler-apps" color="background.default" />,
    href: '#features'
  },
  tagList: [
    { label: 'Commerce de Détail' },
    { label: 'Restauration & Café' },
    { label: 'Services & Conseil' },
    { label: 'Industrie & Fabrication' },
    { label: 'Santé & Pharmacie' },
    { label: 'Éducation & Formation' },
    { label: 'Immobilier' },
    { label: 'Transport & Logistique' },
    { label: 'Agriculture' },
    { label: 'Technologie & IT' },
    { label: 'Construction & BTP' },
    { label: 'Loisirs & Divertissement' },
    { label: 'Associations & ONG' },
    { label: 'Commerce de Gros' },
    { label: 'Finance & Assurance' }
  ]
};
