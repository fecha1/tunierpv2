'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'motion/react';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';
import { GraphicsCard } from '@/components/cards';
import { withAlpha } from '@/utils/colorUtils';
import { SECTION_COMMON_PY } from '@/utils/constant';

/***************************  TRUST BADGES SECTION  ***************************/

export default function TrustBadges({ heading, caption, badges }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: withAlpha(theme.vars.palette.primary.main, 0.03),
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: withAlpha(theme.vars.palette.divider, 0.15)
      }}
    >
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
        <Stack sx={{ gap: { xs: 4, md: 5 }, alignItems: 'center' }}>
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 1 }}>
              <Typography variant="h2" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {heading}
              </Typography>
              {caption && (
                <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600 }}>
                  {caption}
                </Typography>
              )}
            </Stack>
          </motion.div>

          {/* Badges grid */}
          <Grid container spacing={2.5} sx={{ maxWidth: 900, mx: 'auto' }}>
            {badges.map((badge, index) => (
              <Grid key={index} size={{ xs: 6, sm: 3 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: '100%' }}
                >
                  <GraphicsCard
                    sx={{
                      height: 1,
                      p: { xs: 2, sm: 2.5 },
                      textAlign: 'center',
                      background: withAlpha(theme.vars.palette.background.default, 0.7),
                      backdropFilter: 'blur(12px)',
                      border: '1px solid',
                      borderColor: withAlpha(theme.vars.palette.divider, 0.1),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: withAlpha(theme.vars.palette.primary.main, 0.3),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 30px -8px ${withAlpha(theme.vars.palette.primary.main, 0.1)}`
                      }
                    }}
                  >
                    <Stack sx={{ alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: withAlpha(theme.vars.palette.primary.main, 0.08),
                          borderRadius: 2.5
                        }}
                      >
                        <SvgIcon name={badge.icon} size={24} color="primary.main" stroke={1.5} />
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                        {badge.title}
                      </Typography>
                    </Stack>
                  </GraphicsCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </ContainerWrapper>
    </Box>
  );
}

TrustBadges.propTypes = {
  heading: PropTypes.string,
  caption: PropTypes.string,
  badges: PropTypes.array
};
