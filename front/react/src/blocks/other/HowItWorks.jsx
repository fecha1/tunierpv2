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

/***************************  HOW IT WORKS - TIMELINE  ***************************/

export default function HowItWorks({ heading, caption, steps }) {
  const theme = useTheme();

  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Stack sx={{ gap: { xs: 4, md: 6 }, alignItems: 'center' }}>
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

        {/* Timeline steps */}
        <Grid container spacing={3} sx={{ maxWidth: 1000, mx: 'auto' }}>
          {steps.map((step, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%' }}
              >
                <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 2, height: 1, position: 'relative' }}>
                  {/* Connector line (hidden on first) */}
                  {index > 0 && (
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        top: 32,
                        left: -16,
                        width: 32,
                        height: '2px',
                        background: `linear-gradient(90deg, ${theme.vars.palette.primary.main}, ${withAlpha(theme.vars.palette.primary.main, 0.3)})`
                      }}
                    />
                  )}

                  {/* Step number circle */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: withAlpha(theme.vars.palette.primary.main, 0.1),
                        border: '2px solid',
                        borderColor: withAlpha(theme.vars.palette.primary.main, 0.3),
                        position: 'relative',
                        overflow: 'visible',
                        '&::after': {
                          content: `"${index + 1}"`,
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'background.default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800
                        }
                      }}
                    >
                      <SvgIcon name={step.icon} size={28} color="primary.main" stroke={1.5} />
                    </Avatar>
                  </motion.div>

                  {/* Content */}
                  <Stack sx={{ gap: 0.75 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {step.description}
                    </Typography>
                  </Stack>
                </Stack>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </ContainerWrapper>
  );
}

HowItWorks.propTypes = {
  heading: PropTypes.string,
  caption: PropTypes.string,
  steps: PropTypes.array
};
