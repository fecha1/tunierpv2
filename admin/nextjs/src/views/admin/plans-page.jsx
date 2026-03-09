'use client';

import { useState, useEffect } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

// @project
import MainCard from '@/components/MainCard';
import api from '@/lib/api';

// @icons
import { IconCreditCard, IconCheck } from '@tabler/icons-react';

export default function PlansPage() {
  const theme = useTheme();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await api.get('/admin/plans');
        setPlans(res.data);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <IconCreditCard size={28} color={theme.palette.primary.main} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Plans &amp; Tarifs</Typography>
          <Chip label={plans.length} size="small" color="primary" variant="outlined" />
        </Stack>
      </Grid>

      {plans.map((plan) => (
        <Grid key={plan.id} size={{ xs: 12, sm: 6, lg: 3 }}>
          <MainCard
            sx={{
              height: '100%',
              border: plan.code === 'professional' ? `2px solid ${theme.palette.primary.main}` : undefined
            }}
          >
            <Stack sx={{ gap: 2, height: '100%' }}>
              {/* Header */}
              <Stack sx={{ alignItems: 'center', gap: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{plan.name}</Typography>
                <Stack direction="row" sx={{ alignItems: 'baseline', gap: 0.5 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 800 }}>
                    {plan.priceMonthly}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">TND/mois</Typography>
                </Stack>
                <Chip
                  label={`${plan._count?.tenants || 0} tenants`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Divider />

              {/* Limits */}
              <Stack sx={{ gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Limites</Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">Utilisateurs max</Typography>
                  <Typography variant="subtitle2">{plan.maxUsers === -1 ? 'Illimité' : plan.maxUsers}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2">Stockage</Typography>
                  <Typography variant="subtitle2">{plan.storageGB === -1 ? 'Illimité' : `${plan.storageGB} GB`}</Typography>
                </Stack>
              </Stack>

              <Divider />

              {/* Modules */}
              <Stack sx={{ gap: 1, flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Modules ({plan.modules?.length || 0})
                </Typography>
                {plan.modules?.map((pm) => (
                  <Stack key={pm.module?.code || pm.id} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                    <IconCheck size={14} color={theme.palette.success.main} />
                    <Typography variant="body2">{pm.module?.name || pm.moduleCode}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
      ))}
    </Grid>
  );
}
