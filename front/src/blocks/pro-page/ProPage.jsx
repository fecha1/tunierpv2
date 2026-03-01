import PropTypes from 'prop-types';

// @mui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import { SECTION_COMMON_PY } from '@/utils/constant';
import ContainerWrapper from '@/components/ContainerWrapper';
import GraphicsImage from '@/components/GraphicsImage';
import SvgIcon from '@/components/SvgIcon';
import { NextLink } from '@/components/routes';

export default function ProPage({ image }) {
  return (
    <>
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
        <Box
          sx={{
            bgcolor: 'background.default',
            borderRadius: 7.5
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <GraphicsImage
              image={image}
              sx={{
                width: { xs: '75px', md: '150px' },
                height: { xs: '75px', md: '150px' },
                borderRadius: 0
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, mt: { xs: 4, md: 7 }, textAlign: 'center' }}>
              Découvrez les composants premium TuniERP
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3, color: 'grey.700', textAlign: 'center' }}>
              <Link href="https://tunierp.tn" target="_blank" underline="hover" component={NextLink}>
                Découvrir TuniERP Pro
              </Link>{' '}
              avec des composants avancés, le mode sombre et bien plus encore !
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              <Grid>
                <Button
                  variant="outlined"
                  component={NextLink}
                  href="https://tunierp.tn"
                  target="_blank"
                  sx={{ minWidth: 215 }}
                  startIcon={<SvgIcon name="tabler-external-link" size={16} stroke={3} />}
                >
                  En savoir plus
                </Button>
              </Grid>
              <Grid>
                <ButtonAnimationWrapper>
                  <Button
                    variant="contained"
                    color="primary"
                    component={NextLink}
                    href={'https://tunierp.tn'}
                    target="_blank"
                    startIcon={<SvgIcon name="tabler-sparkles" size={16} stroke={3} color="background.default" />}
                  >
                    Voir les composants Pro
                  </Button>
                </ButtonAnimationWrapper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ContainerWrapper>
    </>
  );
}

ProPage.propTypes = { image: PropTypes.any };
