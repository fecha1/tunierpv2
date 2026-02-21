// @mui
import branding from '@/branding.json';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// @project
import { NextLink } from '@/components/routes';

export const cta4 = {
  headLine: 'Pourquoi choisir TuniERP pour votre entreprise ?',
  primaryBtn: {
    children: 'Découvrir TuniERP',
    href: 'https://tunierp.com',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: 'Des entreprises tunisiennes nous font confiance'
  },
  list: [
    { primary: 'Solution 100% tunisienne' },
    { primary: 'Facturation conforme' },
    { primary: 'Modules POS & CRM intégrés' },
    { primary: 'Support réactif garanti' },
    { primary: 'Mises à jour régulières' },
    { primary: 'Multi-devises & TVA' }
  ],
  clientContent: 'En savoir plus'
};

function DescriptionLine() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      Des questions ? Notre équipe est là pour vous aider.{' '}
      <Link component={NextLink} variant="caption2" color="primary" href={branding.company.socialLink.support} underline="hover">
        Contactez le support
      </Link>
    </Typography>
  );
}

export const cta5 = {
  label: 'Rejoignez-nous',
  heading: 'Démarrez avec TuniERP',
  caption: 'Simplifiez votre gestion commerciale dès aujourd\'hui.',
  primaryBtn: {
    children: 'Commencer gratuitement',
    href: '/auth/register',
    rel: 'noopener noreferrer'
  },
  description: <DescriptionLine />,
  saleData: { count: 15, defaultUnit: '+', caption: 'Modules disponibles' },
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: 'Solution ERP modulaire pour la Tunisie'
  }
};

export const cta10 = {
  heading: "Couldn't find the perfect role for you?",
  caption: 'No worries – we encourage you to apply anyway! Your unique skills and talents might be just what we need.',
  primaryBtn: { children: 'Send Your Resume', href: '#' },
  secondaryBtn: { children: 'Contact Us', href: '#' },
  image: '/assets/images/graphics/ai/graphics15-light.svg',
  profileGroups: {
    avatarGroups: [
      { avatar: '/assets/images/user/avatar1.png' },
      { avatar: '/assets/images/user/avatar2.png' },
      { avatar: '/assets/images/user/avatar3.png' },
      { avatar: '/assets/images/user/avatar4.png' },
      { avatar: '/assets/images/user/avatar5.png' }
    ],
    review: '10k+ Reviews (4.5 out of 5)'
  }
};
