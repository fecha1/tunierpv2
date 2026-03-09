'use client';

import { useState, useEffect } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

// @project
import MainCard from '@/components/MainCard';
import api from '@/lib/api';

// @icons
import { IconPuzzle } from '@tabler/icons-react';

const categoryLabels = {
  core: 'Core', sales: 'Ventes', inventory: 'Inventaire', purchasing: 'Achats',
  finance: 'Finance', analytics: 'Analytics', website: 'Site Web',
  hr: 'Ressources Humaines', marketing: 'Marketing', advanced: 'Avancé'
};

export default function ModulesCatalogPage() {
  const theme = useTheme();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        const res = await api.get('/admin/modules');
        setModules(res.data);
      } catch (err) {
        console.error('Failed to fetch modules:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Stack>
    );
  }

  // Group by category
  const grouped = {};
  modules.forEach((mod) => {
    if (!grouped[mod.category]) grouped[mod.category] = [];
    grouped[mod.category].push(mod);
  });

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <IconPuzzle size={28} color={theme.palette.primary.main} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Catalogue Modules</Typography>
          <Chip label={modules.length} size="small" color="primary" variant="outlined" />
        </Stack>
      </Grid>

      {Object.entries(grouped).map(([category, categoryModules]) => (
        <Grid key={category} size={{ xs: 12, md: 6 }}>
          <MainCard title={categoryLabels[category] || category}>
            <Stack sx={{ gap: 2 }}>
              {categoryModules.map((mod) => (
                <Stack key={mod.code} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36, height: 36, borderRadius: 1,
                        bgcolor: mod.isCore ? `${theme.palette.primary.main}15` : `${theme.palette.grey[500]}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <IconPuzzle size={18} color={mod.isCore ? theme.palette.primary.main : theme.palette.grey[500]} />
                    </Box>
                    <Stack>
                      <Typography variant="subtitle2">{mod.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{mod.code}</Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${mod._count?.tenantModules || 0} tenants`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={mod.isCore ? 'Core' : mod.priceMonthly > 0 ? `${mod.priceMonthly} TND` : 'Gratuit'}
                      size="small"
                      color={mod.isCore ? 'primary' : 'default'}
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </MainCard>
        </Grid>
      ))}
    </Grid>
  );
}
