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
  headLine: [
    'Gérez votre entreprise avec un ERP intelligent',
    'Facturez, vendez et analysez en un clic',
    'Digitalisez votre activité en Tunisie'
  ],
  captionLine: 'POS, facturation, stock, CRM, RH et site web — tout ce dont votre entreprise tunisienne a besoin, dans une seule plateforme.',
  primaryBtn: { children: 'Démarrer gratuitement', href: '/auth/register' },
  secondaryBtn: { children: 'Voir une démo', href: '#features' },
  videoSrc: '',
  videoThumbnail: '/assets/images/graphics/default/admin-dashboard.png',
  listData: [
    { title: '🛒 Point de Vente' },
    { title: '🧾 Facturation' },
    { title: '📦 Gestion de Stock' },
    { title: '👥 CRM' },
    { title: '👔 Ressources Humaines' },
    { title: '🌐 Site Web' }
  ],
  stats: [
    { value: '1 000+', label: 'Entreprises' },
    { value: '16+', label: 'Modules' },
    { value: '99.9%', label: 'Disponibilité' },
    { value: '24h', label: 'Support' }
  ]
};
