'use client';
import PropTypes from 'prop-types';

// @next
import NextLink from 'next/link';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { DOCS_URL } from '@/path';
import { generateFocusVisibleStyles } from '@/utils/CommonFocusStyle';

/***************************  SITEMAP - DATA  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
const menuItems = [
  {
    id: 'resources',
    grid: { size: { xs: 12, sm: 'auto' } },
    title: 'Ressources',
    menu: [
      {
        label: 'Documentation',
        link: { href: DOCS_URL, ...linkProps }
      },
      {
        label: 'Tarifs',
        link: { href: '/pricing', ...linkProps }
      },
      {
        label: 'FAQ',
        link: { href: '/faq', ...linkProps }
      }
    ]
  },
  {
    id: 'support',
    grid: { size: { xs: 6, sm: 'auto' } },
    title: 'Support',
    menu: [
      {
        label: 'Centre d\'aide',
        link: { href: 'https://tunierp.tn/support', ...linkProps }
      },
      {
        label: 'Nous contacter',
        link: { href: '/contact', ...linkProps }
      },
      {
        label: 'Conditions d\'utilisation',
        link: { href: '/terms', ...linkProps }
      }
    ]
  },
  {
    id: 'company',
    grid: { size: { xs: 6, sm: 'auto' } },
    title: 'Entreprise',
    menu: [
      {
        label: 'À propos',
        link: { href: '/about', ...linkProps }
      },
      {
        label: 'Politique de confidentialité',
        link: { href: '/privacy', ...linkProps }
      },
      {
        label: 'Nous contacter',
        link: { href: '/contact', ...linkProps }
      }
    ]
  }
];

/***************************  FOOTER - SITEMAP  ***************************/

export default function Sitemap({ list, isMenuDesign }) {
  const theme = useTheme();

  const menuItemStyle = {
    color: 'text.secondary',
    justifyContent: 'flex-start',
    px: 0,
    minHeight: { xs: 36, sm: 40 },
    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
    '&.Mui-focusVisible': { bgcolor: 'transparent', ...generateFocusVisibleStyles(theme.vars.palette.primary.main) }
  };

  return (
    <Grid container spacing={{ xs: 2.5, md: 4 }} sx={{ justifyContent: 'space-between' }}>
      {(list || menuItems).map((item, index) => (
        <Grid key={index} {...item.grid}>
          <Stack sx={{ alignItems: 'flex-start', gap: { md: 3 } }}>
            <Typography variant="h4">{item.title}</Typography>
            <MenuList>
              {item?.menu &&
                item?.menu.map((menu, i) => (
                  <MenuItem
                    key={i}
                    disableRipple
                    sx={{ ...menuItemStyle, ...(isMenuDesign && { typography: 'caption2', fontWeight: 400, my: 0.25 }) }}
                    {...(menu.link && { component: NextLink, ...menu.link })}
                    tabIndex={0}
                    aria-label={menu.label}
                  >
                    {menu.label}
                  </MenuItem>
                ))}
            </MenuList>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

Sitemap.propTypes = { list: PropTypes.array, isMenuDesign: PropTypes.bool };
