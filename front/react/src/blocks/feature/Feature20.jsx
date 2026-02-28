'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'motion/react';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import ContainerWrapper from '@/components/ContainerWrapper';
import { GraphicsCard } from '@/components/cards';
import SvgIcon from '@/components/SvgIcon';
import Typeset from '@/components/Typeset';
import { withAlpha } from '@/utils/colorUtils';
import { SECTION_COMMON_PY } from '@/utils/constant';
import { keyframes } from '@mui/system';

/***************************  FEATURE - 20  (Bento Grid) ***************************/

const glowBorder = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

// All cards same size: 3 per row on desktop
const getBentoSize = () => ({ xs: 12, sm: 6, md: 4 });

export default function Feature20({ heading, caption, features, actionBtn, secondaryBtn }) {
  const theme = useTheme();

  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Stack sx={{ gap: { xs: 3, sm: 4, md: 5 } }}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                maxWidth: 600
              }}
            >
              {heading}
            </Typography>
          </Stack>
        </motion.div>

        {/* Bento Grid */}
        <Grid container spacing={2}>
          {features.map((item, index) => {
            return (
              <Grid key={index} size={getBentoSize()}>
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: '100%' }}
                >
                  <GraphicsCard
                    sx={{
                      height: 1,
                      p: { xs: 2.5, sm: 3, md: 3 },
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'default',
                      background: withAlpha(theme.vars.palette.background.default, 0.6),
                      backdropFilter: 'blur(20px)',
                      border: '1px solid',
                      borderColor: withAlpha(theme.vars.palette.divider, 0.15),
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        borderColor: withAlpha(theme.vars.palette.primary.main, 0.4),
                        transform: 'translateY(-4px)',
                        boxShadow: `
                          0 0 0 1px ${withAlpha(theme.vars.palette.primary.main, 0.1)},
                          0 20px 50px -12px ${withAlpha(theme.vars.palette.primary.main, 0.2)},
                          0 0 40px -8px ${withAlpha(theme.vars.palette.primary.main, 0.1)}
                        `,
                        '& .feature-icon': {
                          bgcolor: 'primary.main',
                          '& svg, & svg path, & svg line, & svg circle, & svg polyline, & svg rect, & svg polygon': {
                            color: '#fff !important',
                            stroke: '#fff !important'
                          }
                        },
                        '& .feature-glow': { opacity: 1 }
                      },
                      // Top glow line on hover
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '10%',
                        right: '10%',
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, ${theme.vars.palette.primary.main}, transparent)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease'
                      },
                      '&:hover::before': { opacity: 1 }
                    }}
                  >
                    {/* Background gradient glow */}
                    <Box
                      className="feature-glow"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: `radial-gradient(ellipse at 50% 0%, ${withAlpha(theme.vars.palette.primary.main, 0.08)} 0%, transparent 70%)`,
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none'
                      }}
                    />

                    <Stack sx={{ gap: { xs: 2, md: 2 }, height: 1, position: 'relative', zIndex: 1 }}>
                      {/* Icon */}
                      <Avatar
                        className="feature-icon"
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: withAlpha(theme.vars.palette.primary.main, 0.08),
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          borderRadius: 3
                        }}
                      >
                        <SvgIcon {...(typeof item.icon === 'string' ? { name: item.icon } : { ...item.icon })} size={24} color="primary.main" stroke={1.5} />
                      </Avatar>

                      {/* Content */}
                      <Stack sx={{ gap: { xs: 0.75, md: 1 } }}>
                        {item.title && (
                          <Typography
                            variant="h4"
                            sx={{ fontWeight: 600, letterSpacing: '-0.01em' }}
                          >
                            {item.title}
                          </Typography>
                        )}
                        {item.content && (
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                          >
                            {item.content}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </GraphicsCard>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Caption + Buttons */}
        <Stack sx={{ alignItems: 'center', gap: 3 }}>
          {caption && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: { xs: '85%', sm: '50%' }, textAlign: 'center' }}>
                {caption}
              </Typography>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
              {secondaryBtn && (
                <motion.div whileHover={{ scale: 1.06 }}>
                  <ButtonAnimationWrapper>
                    <Button variant="outlined" size="large" sx={{ borderRadius: 3, px: 3 }} {...secondaryBtn} />
                  </ButtonAnimationWrapper>
                </motion.div>
              )}
              {actionBtn && (
                <motion.div whileHover={{ scale: 1.06 }}>
                  <ButtonAnimationWrapper>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SvgIcon name="tabler-sparkles" size={16} stroke={3} color="background.default" />}
                      sx={{ borderRadius: 3, px: 3 }}
                      {...actionBtn}
                    />
                  </ButtonAnimationWrapper>
                </motion.div>
              )}
            </Stack>
          </motion.div>
        </Stack>
      </Stack>
    </ContainerWrapper>
  );
}

Feature20.propTypes = {
  heading: PropTypes.string,
  caption: PropTypes.string,
  image: PropTypes.any,
  features: PropTypes.array,
  actionBtn: PropTypes.any,
  secondaryBtn: PropTypes.any
};
