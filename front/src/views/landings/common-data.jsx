// @mui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import branding from '@/branding.json';
import { MegaMenuType } from '@/enum';
import { ADMIN_PATH, BUY_NOW_URL, DOCS_URL, PAGE_PATH, PRIVIEW_PATH } from '@/path';
import { Themes } from '@/config';

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

/***************************  MEGAMENU 4 - FOOTER  ***************************/

function FooterData() {
  return (
    <Stack direction={{ sm: 'row' }} sx={{ gap: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant="h5">Découvrez la plateforme ERP modulaire pour votre entreprise</Typography>
          <Chip
            label="Nouveau"
            size="small"
            slotProps={{ label: { sx: { pl: 1.25, pr: 1.5, py: 0.5, typography: 'caption', my: 0.2 } } }}
            sx={{ bgcolor: 'background.default', display: { xs: 'none', sm: 'inline-flex' } }}
            icon={
              <CardMedia
                component="img"
                image="/assets/images/shared/celebration.svg"
                sx={{ width: 16, height: 16, pl: 0.5 }}
                alt="celebration"
                loading="lazy"
              />
            }
          />
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {branding.brandName} propose plus de 16 catégories de modules pour gérer votre activité : POS, facturation, stock, CRM, RH et
          bien plus encore.
        </Typography>
      </Stack>
      <Button
        variant="contained"
        sx={{ display: { xs: 'none', sm: 'inline-flex' }, minWidth: 100, px: { xs: 2 }, py: 1.25 }}
        href="/auth/register"
      >
        Essai gratuit
      </Button>
    </Stack>
  );
}

/***************************  NAVBAR - MEGAMENU LANDINGS  ***************************/

export const landingMegamenu = {
  id: 'landings',
  title: 'Landings',
  megaMenu: {
    type: MegaMenuType.MEGAMENU4,
    popperOffsetX: 195,
    toggleBtn: { children: 'Landings' },
    menuItems: [
      {
        title: 'TuniERP',
        theme: Themes.THEME_TUNIERP,
        image: '/tunierplogoDark.png',
        status: ''
      }
    ],
    footerData: FooterData()
  }
};

/***************************  MEGAMENU 5 - BANNER  ***************************/

function BannerData() {
  return (
    <Stack sx={{ alignItems: 'flex-start', gap: 3, height: 1, justifyContent: 'center' }}>
      <Stack sx={{ gap: 1 }}>
        <Stack sx={{ alignItems: 'flex-start', gap: 1.5 }}>
          <Chip
            label={`${branding.brandName} — Tableau de bord`}
            icon={
              <CardMedia
                component="img"
                image="/assets/images/shared/celebration.svg"
                sx={{ width: 16, height: 16 }}
                alt="celebration"
                loading="lazy"
              />
            }
            size="small"
            slotProps={{ label: { sx: { px: 1.5, py: 0.5, typography: 'subtitle2' } } }}
            sx={{ bgcolor: 'background.default', '& .MuiChip-icon': { ml: 1.25 } }}
          />
          <Typography variant="h5">Un tableau de bord puissant pour gérer votre activité.</Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gérez vos ventes, stocks, employés et clients depuis une interface d'administration moderne et intuitive.
        </Typography>
      </Stack>
      <Button href={ADMIN_PATH} variant="contained" sx={{ minWidth: 92, px: { xs: 2 }, py: 1.25 }}>
        Voir le Dashboard
      </Button>
    </Stack>
  );
}

/***************************  NAVBAR - MEGAMENU PAGES  ***************************/

export const pagesMegamenu = {
  id: 'pages',
  title: 'Pages',
  megaMenu: {
    type: MegaMenuType.MEGAMENU5,
    toggleBtn: { children: 'Pages' },
    popperWidth: 860,
    menuItems: [
      {
        title: 'Général',
        itemsList: [
          { title: 'À propos', link: { href: '/about', ...linkProps } },
          { title: 'Carrières', status: 'Pro' },
          { title: 'Politique de confidentialité', link: { href: PAGE_PATH.privacyPolicyPage, ...linkProps } },
          { title: 'Contact', status: 'Pro' },
          { title: 'FAQ', status: 'Pro' },
          { title: 'Tarifs', status: 'Pro' }
        ]
      },
      {
        title: 'Maintenance',
        itemsList: [
          { title: 'Bientôt disponible', status: 'Pro' },
          { title: 'Erreur 404', link: { href: PRIVIEW_PATH.error404, ...linkProps } },
          { title: 'Erreur 500', link: { href: PRIVIEW_PATH.error500, ...linkProps } },
          { title: 'En maintenance', status: 'Pro' }
        ]
      },
      {
        title: 'Externe',
        itemsList: [
          { title: 'Documentation', link: { href: DOCS_URL, ...linkProps } },
          { title: 'Support', link: { href: branding.company.socialLink.support, ...linkProps } },
          { title: 'Conditions', link: { href: '/terms', ...linkProps } }
        ]
      }
    ],
    bannerData: <BannerData />
  }
};
