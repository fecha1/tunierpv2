'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';

// @next
import NextLink from 'next/link';

// @mui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion, AnimatePresence } from 'motion/react';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';
import Typeset from '@/components/Typeset';

import { IconType } from '@/enum';
import { withAlpha } from '@/utils/colorUtils';
import { SECTION_COMMON_PY } from '@/utils/constant';
import { keyframes } from '@mui/system';

/***************************  PRICING - 9  (Modernized) ***************************/

const popularPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0px rgba(var(--mui-palette-primary-mainChannel) / 0.3); }
  50% { box-shadow: 0 0 30px 5px rgba(var(--mui-palette-primary-mainChannel) / 0.15); }
`;

export default function Pricing9({ heading, caption, features, plans }) {
  const theme = useTheme();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Stack sx={{ gap: { xs: 4, md: 6 } }}>
        {/* Heading */}
        {heading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Stack sx={{ alignItems: 'center', gap: 2 }}>
              <Typeset {...{ heading, caption, stackProps: { sx: { textAlign: 'center' } } }} />

              {/* Monthly / Yearly toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    px: 2.5,
                    borderRadius: 6,
                    bgcolor: withAlpha(theme.vars.palette.grey[200], 0.6),
                    backdropFilter: 'blur(8px)',
                    border: '1px solid',
                    borderColor: withAlpha(theme.vars.palette.divider, 0.2)
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: isYearly ? 'text.secondary' : 'primary.main', fontWeight: isYearly ? 400 : 700, transition: 'all 0.3s' }}>
                    Mensuel
                  </Typography>
                  <Switch
                    checked={isYearly}
                    onChange={() => setIsYearly(!isYearly)}
                    color="primary"
                    size="small"
                  />
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                    <Typography variant="subtitle2" sx={{ color: isYearly ? 'primary.main' : 'text.secondary', fontWeight: isYearly ? 700 : 400, transition: 'all 0.3s' }}>
                      Annuel
                    </Typography>
                    <Chip
                      label="−2 mois"
                      size="small"
                      sx={{
                        height: 22,
                        bgcolor: 'primary.lighter',
                        color: 'primary.dark',
                        fontWeight: 700,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Stack>
                </Stack>
              </motion.div>
            </Stack>
          </motion.div>
        )}

        {/* Plans grid */}
        <Grid container spacing={2} sx={{ height: 1, justifyContent: 'center' }}>
          {plans.map((plan, index) => {
            const monthlyPrice = plan.price;
            const yearlyPrice = plan.price > 0 ? Math.round(plan.price * 10) : 0;
            const displayPrice = isYearly ? yearlyPrice : monthlyPrice;
            const priceSuffix = plan.price > 0 ? (isYearly ? '/an' : '/mois') : '';

            return (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: plan.active ? 0.95 : 1 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 + index * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <GraphicsCard
                    sx={{
                      height: 1,
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: plan.active ? 'primary.main' : withAlpha(theme.vars.palette.divider, 0.15),
                      background: plan.active
                        ? withAlpha(theme.vars.palette.primary.main, 0.03)
                        : withAlpha(theme.vars.palette.background.default, 0.6),
                      backdropFilter: 'blur(16px)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      ...(plan.active && {
                        animation: `${popularPulse} 3s infinite ease-in-out`,
                        boxShadow: `0 20px 60px -15px ${withAlpha(theme.vars.palette.primary.main, 0.2)}`
                      }),
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: `0 30px 60px -12px ${withAlpha(theme.vars.palette.primary.main, plan.active ? 0.3 : 0.15)}`,
                        borderColor: plan.active ? 'primary.main' : withAlpha(theme.vars.palette.primary.main, 0.3)
                      },
                      // Top glow line
                      ...(plan.active && {
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: `linear-gradient(90deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.main}, ${theme.vars.palette.primary.light})`
                        }
                      })
                    }}
                  >
                    {/* Popular badge */}
                    {plan.active && (
                      <Chip
                        label="Le plus populaire"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'primary.main',
                          color: 'background.default',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 24
                        }}
                      />
                    )}

                    <Box sx={{ pt: { xs: 4, sm: 5, md: 6 }, px: { xs: 2, md: 3.5 }, pb: { xs: 2, sm: 3, md: 4 }, height: 1 }}>
                      <Stack sx={{ gap: 4, height: 1 }}>
                        {/* Plan title + price */}
                        <Stack sx={{ gap: { xs: 1.5, md: 2 } }}>
                          <Stack sx={{ gap: { xs: 1, sm: 1.5 }, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {plan.title}
                            </Typography>
                            <Stack sx={{ alignItems: 'center' }}>
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={displayPrice}
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
                                    <Typography variant="h1" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                                      {displayPrice}
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                                      TND{priceSuffix}
                                    </Typography>
                                  </Stack>
                                </motion.div>
                              </AnimatePresence>
                              {plan.content && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                  {plan.content}
                                </Typography>
                              )}
                            </Stack>
                          </Stack>
                        </Stack>

                        {/* Features + CTA */}
                        <Stack sx={{ height: 1, justifyContent: 'space-between', gap: { xs: 3, sm: 4 } }}>
                          <Stack sx={{ gap: 3 }}>
                            <Divider>
                              <Chip
                                label={plan.featureTitle}
                                size="small"
                                slotProps={{ label: { sx: { py: 0.5, px: 1.5, typography: 'caption', color: 'text.secondary' } } }}
                                sx={{ bgcolor: withAlpha(theme.vars.palette.grey[200], 0.8) }}
                              />
                            </Divider>
                            <Stack sx={{ gap: { xs: 0.75, md: 1 } }}>
                              {features.map((item, fIndex) => {
                                const active = plan.featuresID.includes(item.id);
                                return (
                                  <Stack key={fIndex} direction="row" sx={{ gap: 1.25, alignItems: 'center' }}>
                                    <Avatar
                                      sx={{
                                        bgcolor: active ? withAlpha(theme.vars.palette.primary.main, 0.1) : 'grey.100',
                                        width: 24,
                                        height: 24,
                                        transition: 'all 0.3s'
                                      }}
                                    >
                                      <SvgIcon
                                        name={active ? 'tabler-check' : 'tabler-x'}
                                        type={IconType.STROKE}
                                        size={14}
                                        color={active ? 'primary.main' : 'text.secondary'}
                                        stroke={2.5}
                                      />
                                    </Avatar>
                                    <Typography
                                      variant={active ? 'subtitle2' : 'body2'}
                                      sx={{
                                        color: active ? 'text.primary' : 'text.secondary',
                                        opacity: active ? 1 : 0.6
                                      }}
                                    >
                                      {item.label}
                                    </Typography>
                                  </Stack>
                                );
                              })}
                            </Stack>
                          </Stack>

                          {/* CTA button */}
                          <Stack sx={{ gap: 0.75 }}>
                            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                              <ButtonAnimationWrapper>
                                <Button
                                  variant={plan.active ? 'contained' : 'outlined'}
                                  size="large"
                                  sx={{
                                    borderRadius: 3,
                                    py: 1.25,
                                    fontWeight: 700,
                                    ...(!plan.active && {
                                      borderColor: withAlpha(theme.vars.palette.primary.main, 0.3),
                                      '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: withAlpha(theme.vars.palette.primary.main, 0.04)
                                      }
                                    })
                                  }}
                                  fullWidth
                                  {...plan.exploreLink}
                                />
                              </ButtonAnimationWrapper>
                            </motion.div>

                            {plan.link && (
                              <Typography variant="subtitle1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                ou
                                <Link
                                  component={NextLink}
                                  variant="subtitle1"
                                  color="primary.main"
                                  {...plan.link}
                                  underline="hover"
                                  sx={{ marginLeft: 0.5 }}
                                />
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  </GraphicsCard>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </ContainerWrapper>
  );
}

Pricing9.propTypes = { heading: PropTypes.string, caption: PropTypes.string, features: PropTypes.array, plans: PropTypes.array };
