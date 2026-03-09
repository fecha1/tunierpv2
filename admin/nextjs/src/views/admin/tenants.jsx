'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

// @project
import MainCard from '@/components/MainCard';
import api from '@/lib/api';

// @icons
import { IconSearch, IconBuilding } from '@tabler/icons-react';

const statusColors = { active: 'success', trial: 'info', suspended: 'error', cancelled: 'default' };
const statusLabels = { active: 'Actif', trial: 'Essai', suspended: 'Suspendu', cancelled: 'Annulé' };

export default function TenantsPage() {
  const theme = useTheme();
  const router = useRouter();

  const [tenants, setTenants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: rowsPerPage };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/admin/tenants', { params });
      setTenants(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, statusFilter]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleSuspend = async (tenantId) => {
    try {
      await api.post(`/admin/tenants/${tenantId}/suspend`);
      fetchTenants();
    } catch (err) {
      console.error('Failed to suspend tenant:', err);
    }
  };

  const handleActivate = async (tenantId) => {
    try {
      await api.post(`/admin/tenants/${tenantId}/activate`);
      fetchTenants();
    } catch (err) {
      console.error('Failed to activate tenant:', err);
    }
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
            <IconBuilding size={28} color={theme.palette.primary.main} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Tenants</Typography>
            <Chip label={total} size="small" color="primary" variant="outlined" />
          </Stack>
        </Stack>
      </Grid>

      {/* Filters */}
      <Grid size={12}>
        <MainCard>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
            <OutlinedInput
              size="small"
              placeholder="Rechercher par nom ou slug..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              startAdornment={
                <InputAdornment position="start">
                  <IconSearch size={18} />
                </InputAdornment>
              }
              sx={{ minWidth: 280 }}
            />
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              displayEmpty
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              <MenuItem value="active">Actif</MenuItem>
              <MenuItem value="trial">Essai</MenuItem>
              <MenuItem value="suspended">Suspendu</MenuItem>
              <MenuItem value="cancelled">Annulé</MenuItem>
            </Select>
          </Stack>
        </MainCard>
      </Grid>

      {/* Table */}
      <Grid size={12}>
        <MainCard sx={{ p: 0 }}>
          {loading ? (
            <Stack sx={{ alignItems: 'center', p: 4 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Entreprise</TableCell>
                      <TableCell>Plan</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell align="center">Utilisateurs</TableCell>
                      <TableCell align="center">Modules</TableCell>
                      <TableCell>Créé le</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow
                        key={tenant.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/tenants/${tenant.id}`)}
                      >
                        <TableCell>
                          <Stack>
                            <Typography variant="subtitle2">{tenant.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{tenant.slug}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip label={tenant.plan?.name || '—'} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusLabels[tenant.status] || tenant.status}
                            size="small"
                            color={statusColors[tenant.status] || 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">{tenant.usersCount}</TableCell>
                        <TableCell align="center">{tenant.modulesCount}</TableCell>
                        <TableCell>
                          {new Date(tenant.createdAt).toLocaleDateString('fr-TN')}
                        </TableCell>
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          {tenant.status === 'suspended' ? (
                            <Button size="small" color="success" onClick={() => handleActivate(tenant.id)}>
                              Activer
                            </Button>
                          ) : (
                            <Button size="small" color="error" onClick={() => handleSuspend(tenant.id)}>
                              Suspendre
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {tenants.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">Aucun tenant trouvé</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Lignes par page"
              />
            </>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}
