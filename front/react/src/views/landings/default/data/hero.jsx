// @mui
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export const hero = {
  chip: {
    label: (
      <>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          🇹🇳 Solution ERP
        </Typography>
        <Chip
          label={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              100% Tunisienne
            </Typography>
          }
          sx={{ height: 24, bgcolor: 'primary.lighter', mr: -1, ml: 0.75, '& .MuiChip-label': { px: 1.25 } }}
        />
      </>
    )
  },
  headLine: 'Gérez votre entreprise avec un ERP modulaire et intelligent',
  captionLine: 'POS, facturation, stock, CRM, RH et site web — tout ce dont votre entreprise tunisienne a besoin, dans une seule plateforme.',
  primaryBtn: { children: 'Démarrer gratuitement', href: '/auth/register' },
  videoSrc: '',
  videoThumbnail: '/assets/images/graphics/default/admin-dashboard.png',
  listData: [
    { image: '/assets/images/shared/react.svg', title: 'Point de Vente' },
    { image: '/assets/images/shared/next-js.svg', title: 'Facturation' },
    { image: '/assets/images/shared/material-ui.svg', title: 'Gestion de Stock' },
    { image: '/assets/images/shared/react.svg', title: 'CRM' },
    { image: '/assets/images/shared/next-js.svg', title: 'Ressources Humaines' },
    { image: '/assets/images/shared/material-ui.svg', title: 'Site Web' }
  ]
};
