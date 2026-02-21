'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import MainCard from '@/components/MainCard';

// @assets
import { IconPackage, IconShoppingCart, IconUsers, IconCash, IconFileInvoice, IconAlertTriangle, IconTrendingUp, IconChecklist } from '@tabler/icons-react';

/***************************  STAT CARD COMPONENT  ***************************/

function StatCard({ title, value, icon, color }) {
  return (
    <MainCard sx={{ p: 0 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Stack>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Stack>
    </MainCard>
  );
}

/***************************  QUICK ACTION CARD  ***************************/

function QuickAction({ title, description, icon, color }) {
  return (
    <MainCard
      sx={{
        p: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' }
      }}
    >
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {icon}
        </Box>
        <Stack>
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" color="text.secondary">{description}</Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}

/***************************  TUNIERP - DASHBOARD  ***************************/

export default function Dashboard() {
  const theme = useTheme();

  const stats = [
    { title: 'Produits', value: '0', icon: <IconPackage size={24} color={theme.palette.primary.main} />, color: theme.palette.primary.main },
    { title: 'Commandes', value: '0', icon: <IconShoppingCart size={24} color={theme.palette.success.main} />, color: theme.palette.success.main },
    { title: 'Clients', value: '0', icon: <IconUsers size={24} color={theme.palette.info.main} />, color: theme.palette.info.main },
    { title: "Chiffre d'affaires", value: '0 TND', icon: <IconCash size={24} color={theme.palette.warning.main} />, color: theme.palette.warning.main }
  ];

  const quickActions = [
    { title: 'Nouvelle Vente', description: 'Ouvrir le Point de Vente', icon: <IconShoppingCart size={20} color={theme.palette.primary.main} />, color: theme.palette.primary.main },
    { title: 'Ajouter Produit', description: 'Créer un nouveau produit', icon: <IconPackage size={20} color={theme.palette.success.main} />, color: theme.palette.success.main },
    { title: 'Créer Facture', description: 'Générer une facture', icon: <IconFileInvoice size={20} color={theme.palette.info.main} />, color: theme.palette.info.main },
    { title: 'Voir les Tâches', description: 'Gérer vos tâches', icon: <IconChecklist size={20} color={theme.palette.warning.main} />, color: theme.palette.warning.main }
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {/* Welcome Banner */}
      <Grid size={12}>
        <MainCard
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.darker} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
            p: 3,
            border: 'none'
          }}
        >
          <Stack sx={{ gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
              Bienvenue sur TuniERP 👋
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600 }}>
              Votre plateforme ERP modulaire. Gérez vos ventes, inventaire, factures et clients — tout en un seul endroit.
            </Typography>
          </Stack>
        </MainCard>
      </Grid>

      {/* Stats Cards */}
      {stats.map((stat, index) => (
        <Grid key={index} size={{ xs: 6, md: 3 }}>
          <StatCard {...stat} />
        </Grid>
      ))}

      {/* Quick Actions */}
      <Grid size={12}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Actions Rapides
        </Typography>
      </Grid>
      {quickActions.map((action, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <QuickAction {...action} />
        </Grid>
      ))}

      {/* Alerts Placeholder */}
      <Grid size={12}>
        <MainCard sx={{ p: 2.5 }}>
          <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
            <IconAlertTriangle size={20} color={theme.palette.warning.main} />
            <Stack>
              <Typography variant="subtitle2">Aucune alerte</Typography>
              <Typography variant="caption" color="text.secondary">
                Tout est en ordre. Les alertes de stock et paiements apparaîtront ici.
              </Typography>
            </Stack>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
