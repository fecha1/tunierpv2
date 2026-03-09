'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';

// @project
import MainCard from '@/components/MainCard';
import api from '@/lib/api';

// @icons
import { IconArrowLeft, IconBuilding, IconPuzzle, IconUsers } from '@tabler/icons-react';

const statusColors = { active: 'success', trial: 'info', suspended: 'error', cancelled: 'default' };
const statusLabels = { active: 'Actif', trial: 'Essai', suspended: 'Suspendu', cancelled: 'Annulé' };

export default function TenantDetailPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id;

  const [tenant, setTenant] = useState(null);
  const [modules, setModules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [togglingModule, setTogglingModule] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [tenantRes, modulesRes, usersRes] = await Promise.all([
        api.get(`/admin/tenants/${tenantId}`),
        api.get(`/admin/tenants/${tenantId}/modules`),
        api.get(`/admin/tenants/${tenantId}/users`),
      ]);
      setTenant(tenantRes.data);
      setModules(modulesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch tenant details:', err);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleModule = async (moduleCode, isCurrentlyActive) => {
    setTogglingModule(moduleCode);
    try {
      if (isCurrentlyActive) {
        await api.delete(`/admin/tenants/${tenantId}/modules/${moduleCode}`);
      } else {
        await api.post(`/admin/tenants/${tenantId}/modules`, { moduleCodes: [moduleCode] });
      }
      // Refresh modules
      const res = await api.get(`/admin/tenants/${tenantId}/modules`);
      setModules(res.data);
    } catch (err) {
      console.error('Failed to toggle module:', err);
    } finally {
      setTogglingModule(null);
    }
  };

  const handleSuspend = async () => {
    try {
      await api.post(`/admin/tenants/${tenantId}/suspend`);
      fetchData();
    } catch (err) {
      console.error('Failed to suspend:', err);
    }
  };

  const handleActivate = async () => {
    try {
      await api.post(`/admin/tenants/${tenantId}/activate`);
      fetchData();
    } catch (err) {
      console.error('Failed to activate:', err);
    }
  };

  const handleChangePlan = async (planCode) => {
    try {
      await api.patch(`/admin/tenants/${tenantId}`, { planCode });
      fetchData();
    } catch (err) {
      console.error('Failed to change plan:', err);
    }
  };

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!tenant) {
    return (
      <MainCard>
        <Typography>Tenant introuvable</Typography>
      </MainCard>
    );
  }

  const groupedModules = {};
  modules.forEach((mod) => {
    if (!groupedModules[mod.category]) groupedModules[mod.category] = [];
    groupedModules[mod.category].push(mod);
  });

  const categoryLabels = {
    core: 'Core', sales: 'Ventes', inventory: 'Inventaire', purchasing: 'Achats',
    finance: 'Finance', analytics: 'Analytics', website: 'Site Web',
    hr: 'Ressources Humaines', marketing: 'Marketing', advanced: 'Avancé'
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {/* Header */}
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
          <Button
            variant="text"
            startIcon={<IconArrowLeft size={18} />}
            onClick={() => router.push('/tenants')}
          >
            Retour
          </Button>
        </Stack>
      </Grid>

      {/* Tenant Info Card */}
      <Grid size={12}>
        <MainCard>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56, height: 56, borderRadius: 2,
                  bgcolor: `${theme.palette.primary.main}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <IconBuilding size={28} color={theme.palette.primary.main} />
              </Box>
              <Stack>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{tenant.name}</Typography>
                  <Chip label={statusLabels[tenant.status]} size="small" color={statusColors[tenant.status]} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {tenant.slug} · {tenant.businessType} · Créé le {new Date(tenant.createdAt).toLocaleDateString('fr-TN')}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
              <Select
                size="small"
                value={tenant.plan?.code || ''}
                onChange={(e) => handleChangePlan(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="starter">Starter</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </Select>
              {tenant.status === 'suspended' ? (
                <Button variant="contained" color="success" size="small" onClick={handleActivate}>
                  Activer
                </Button>
              ) : (
                <Button variant="outlined" color="error" size="small" onClick={handleSuspend}>
                  Suspendre
                </Button>
              )}
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" sx={{ gap: 4 }}>
            <Stack sx={{ alignItems: 'center' }}>
              <Typography variant="h6">{tenant._count?.users || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Utilisateurs</Typography>
            </Stack>
            <Stack sx={{ alignItems: 'center' }}>
              <Typography variant="h6">{tenant._count?.tenantModules || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Modules</Typography>
            </Stack>
            <Stack sx={{ alignItems: 'center' }}>
              <Typography variant="h6">{tenant.plan?.priceMonthly ? `${tenant.plan.priceMonthly} TND` : 'Gratuit'}</Typography>
              <Typography variant="caption" color="text.secondary">Plan / mois</Typography>
            </Stack>
          </Stack>
        </MainCard>
      </Grid>

      {/* Tabs */}
      <Grid size={12}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<IconPuzzle size={18} />} label="Modules" iconPosition="start" />
          <Tab icon={<IconUsers size={18} />} label="Utilisateurs" iconPosition="start" />
        </Tabs>
      </Grid>

      {/* Tab Content */}
      {tab === 0 && (
        <Grid size={12}>
          <Grid container spacing={2}>
            {Object.entries(groupedModules).map(([category, categoryModules]) => (
              <Grid key={category} size={{ xs: 12, md: 6 }}>
                <MainCard title={categoryLabels[category] || category}>
                  <Stack sx={{ gap: 1 }}>
                    {categoryModules.map((mod) => (
                      <Stack key={mod.code} direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
                        <Stack>
                          <Typography variant="subtitle2">{mod.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {mod.isCore ? 'Core (inclus)' : mod.priceMonthly > 0 ? `${mod.priceMonthly} TND/mois` : 'Gratuit'}
                          </Typography>
                        </Stack>
                        {mod.isCore ? (
                          <Chip label="Core" size="small" color="primary" variant="outlined" />
                        ) : (
                          <Switch
                            checked={mod.isActivated}
                            onChange={() => handleToggleModule(mod.code, mod.isActivated)}
                            disabled={togglingModule === mod.code}
                            color="primary"
                          />
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Grid size={12}>
          <MainCard sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rôle</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Dernière connexion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {user.firstName} {user.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.role?.name || '—'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Actif' : 'Inactif'}
                          size="small"
                          color={user.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-TN') : 'Jamais'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">Aucun utilisateur</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>
      )}
    </Grid>
  );
}
