// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import MainCard from '@/components/MainCard';

/***************************  NAVIGATION CARD - TUNIERP  ***************************/

export default function NavCard() {
  return (
    <MainCard sx={{ p: 1.5, bgcolor: 'primary.lighter', boxShadow: 'none', mb: 3, border: '1px solid', borderColor: 'primary.light' }}>
      <Stack sx={{ gap: 1.5 }}>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14,
              fontWeight: 700
            }}
          >
            T
          </Box>
          <Typography variant="subtitle2" color="primary.darker">
            TuniERP v0.1.0
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Plateforme ERP modulaire pour les entreprises tunisiennes
        </Typography>
      </Stack>
    </MainCard>
  );
}
