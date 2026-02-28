'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'motion/react';

// @project
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import Rating from '@/components/Rating';
import Typeset from '@/components/Typeset';
import SvgIcon from '@/components/SvgIcon';

import { withAlpha } from '@/utils/colorUtils';
import { SECTION_COMMON_PY } from '@/utils/constant';

/***************************  TESTIMONIAL - 10  (Modernized) ***************************/

export default function Testimonial10({ heading, caption, testimonials }) {
  const theme = useTheme();

  const gc = theme.vars.palette.background.default;
  const gradient = `radial-gradient(146.46% 68.12% at 50% 29.86%, ${withAlpha(gc, 0)} 0%, ${gc} 100%)`;

  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Stack sx={{ gap: { xs: 3, sm: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Stack sx={{ alignItems: 'center', textAlign: 'center', gap: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, letterSpacing: '-0.02em', maxWidth: 600 }}>
              {heading}
            </Typography>
            {caption && (
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600 }}>
                {caption}
              </Typography>
            )}
          </Stack>
        </motion.div>

        <Masonry
          columns={{ xs: 1, sm: 2, md: 3 }}
          spacing={{ xs: 1.5, sm: 2 }}
          sx={{
            position: 'relative',
            '&:before': { position: 'absolute', content: `' '`, left: 0, bottom: 0, width: 1, height: '30%', background: gradient, zIndex: 1 }
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
            >
              <GraphicsCard
                sx={{
                  borderRadius: { xs: 4, md: 5 },
                  background: withAlpha(theme.vars.palette.background.default, 0.6),
                  backdropFilter: 'blur(16px)',
                  border: '1px solid',
                  borderColor: withAlpha(theme.vars.palette.divider, 0.1),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: withAlpha(theme.vars.palette.primary.main, 0.25),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 30px -8px ${withAlpha(theme.vars.palette.primary.main, 0.1)}`
                  }
                }}
              >
                <Stack sx={{ justifyContent: 'space-between', height: 1, gap: 2.5, p: { xs: 2, md: 2.5 } }}>
                  {/* Quote icon + Rating */}
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: withAlpha(theme.vars.palette.primary.main, 0.08)
                      }}
                    >
                      <SvgIcon name="tabler-quote" size={18} color="primary.main" stroke={1.5} />
                    </Box>
                    <Rating {...{ rate: testimonial.ratings, starSize: 14 }} />
                  </Stack>

                  {/* Content */}
                  <Stack sx={{ gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {testimonial.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {testimonial.review}
                    </Typography>
                  </Stack>

                  {/* Profile */}
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                    <Avatar
                      src={testimonial.profile.avatar || undefined}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: withAlpha(theme.vars.palette.primary.main, 0.1),
                        color: 'primary.main',
                        fontSize: '0.875rem',
                        fontWeight: 700
                      }}
                    >
                      {!testimonial.profile.avatar && testimonial.profile.name?.charAt(0)}
                    </Avatar>
                    <Stack sx={{ gap: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                        {testimonial.profile.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {testimonial.profile.role}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </GraphicsCard>
            </motion.div>
          ))}
        </Masonry>
      </Stack>
    </ContainerWrapper>
  );
}

Testimonial10.propTypes = { heading: PropTypes.any, caption: PropTypes.any, testimonials: PropTypes.any };
