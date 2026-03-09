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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// @project
import MainCard from '@/components/MainCard';
import api from '@/lib/api';

// @icons
import { IconBuilding, IconUsers, IconCash, IconTrendingUp, IconPuzzle } from '@tabler/icons-react';

/***************************  STAT CARD COMPONENT  ***************************/

function StatCard({ title, value, icon, color, subtitle }) {
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
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
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

/***************************  PLATFORM DASHBOARD  ***************************/

export default function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [recentTenants, setRecentTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, tenantsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/tenants', { params: { limit: 5 } }),
        ]);
        setStats(statsRes.data);
        setRecentTenants(tenantsRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Stack>
    );
  }

  const statusColors = { active: 'success', trial: 'info', suspended: 'error', cancelled: 'default' };

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
              Administration TuniERP 🛡️
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600 }}>
              Gérez vos tenants, modules et plans depuis cette interface. Vue d&apos;ensemble de la plateforme.
            </Typography>
          </Stack>
        </MainCard>
      </Grid>

      {/* Stats Cards */}
      <Grid size={{ xs: 6, md: 3 }}>
        <StatCard
          title="Tenants"
          value={stats?.tenants?.total || 0}
          subtitle={`${stats?.tenants?.active || 0} actifs · ${stats?.tenants?.trial || 0} en essai`}
          icon={<IconBuilding size={24} color={theme.palette.primary.main} />}
          color={theme.palette.primary.main}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <StatCard
          title="Utilisateurs"
          value={stats?.users?.total || 0}
          subtitle={`${stats?.users?.active || 0} actifs`}
          icon={<IconUsers size={24} color={theme.palette.info.main} />}
          color={theme.palette.info.main}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <StatCard
          title="Revenu Mensuel"
          value={`${stats?.revenue?.monthly || 0} TND`}
          icon={<IconCash size={24} color={theme.palette.success.main} />}
          color={theme.palette.success.main}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <StatCard
          title="Inscriptions ce mois"
          value={stats?.newSignupsThisMonth || 0}
          icon={<IconTrendingUp size={24} color={theme.palette.warning.main} />}
          color={theme.palette.warning.main}
        />
      </Grid>

      {/* Recent Tenants */}
      <Grid size={{ xs: 12, md: 7 }}>
        <MainCard title="Derniers Tenants">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Utilisateurs</TableCell>
                  <TableCell align="right">Modules</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTenants.map((tenant) => (
                  <TableRow key={tenant.id} hover>
                    <TableCell>
                      <Stack>
                        <Typography variant="subtitle2">{tenant.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{tenant.slug}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{tenant.plan?.name || '—'}</TableCell>
                    <TableCell>
                      <Chip label={tenant.status} size="small" color={statusColors[tenant.status] || 'default'} />
                    </TableCell>
                    <TableCell align="right">{tenant.usersCount}</TableCell>
                    <TableCell align="right">{tenant.modulesCount}</TableCell>
                  </TableRow>
                ))}
                {recentTenants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">Aucun tenant</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      {/* Module Popularity */}
      <Grid size={{ xs: 12, md: 5 }}>
        <MainCard title="Modules populaires">
          <Stack sx={{ gap: 1.5 }}>
            {(stats?.modules || [])
              .filter((m) => !m.isCore)
              .sort((a, b) => b.activationCount - a.activationCount)
              .slice(0, 6)
              .map((mod) => (
                <Stack key={mod.code} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                    <IconPuzzle size={16} color={theme.palette.primary.main} />
                    <Typography variant="body2">{mod.name}</Typography>
                  </Stack>
                  <Chip label={`${mod.activationCount} tenants`} size="small" variant="outlined" />
                </Stack>
              ))}
            {(!stats?.modules || stats.modules.filter((m) => !m.isCore).length === 0) && (
              <Typography variant="body2" color="text.secondary">Aucun module payant activé</Typography>
            )}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
