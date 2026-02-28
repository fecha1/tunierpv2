'use client';
import PropTypes from 'prop-types';

import { memo, useEffect, useRef, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion, useScroll, useTransform } from 'motion/react';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import GraphicsImage from '@/components/GraphicsImage';
import SvgIcon from '@/components/SvgIcon';
import TextType from '@/components/TextType';
import { SECTION_COMMON_PY } from '@/utils/constant';
import { getBackgroundDots } from '@/utils/getBackgroundDots';
import { withAlpha } from '@/utils/colorUtils';
import { keyframes } from '@mui/system';

// @assets
import Wave from '@/images/graphics/Wave';

// threshold
const options = { root: null, rootMargin: '0px', threshold: 0.6 };

/***************************  HERO - 17  (Modernized) ***************************/

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0px rgba(var(--mui-palette-primary-mainChannel) / 0.4); }
  50% { box-shadow: 0 0 20px 10px rgba(var(--mui-palette-primary-mainChannel) / 0.8); }
  100% { box-shadow: 0 0 0 0px rgba(var(--mui-palette-primary-mainChannel) / 0.4); }
`;

const float1 = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

const float2 = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-30px, 40px) scale(1.2); }
  66% { transform: translate(20px, -20px) scale(0.8); }
  100% { transform: translate(0, 0) scale(1); }
`;

const float3 = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(40px, 30px) scale(1.15); }
  50% { transform: translate(-30px, -20px) scale(0.85); }
  75% { transform: translate(20px, -40px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Floating particle component (memoized to prevent re-renders)
const FloatingParticle = memo(function FloatingParticle({ delay, x, y, size }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: y,
        left: x,
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        opacity: 0.12,
        animation: `${float1} ${12 + delay * 3}s infinite ease-in-out`,
        animationDelay: `${delay}s`,
        willChange: 'transform',
        contain: 'layout style paint'
      }}
    />
  );
});

FloatingParticle.propTypes = { delay: PropTypes.number, x: PropTypes.string, y: PropTypes.string, size: PropTypes.number };

export default function Hero17({ chip, headLine, captionLine, primaryBtn, secondaryBtn, videoSrc, videoThumbnail, listData, stats }) {
  const theme = useTheme();
  const boxRadius = { xs: 24, sm: 32, md: 40 };

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.4, 0.6], [0.9, 0.92, 0.94, 0.96, 1]);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle video play/pause
  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (videoRef.current && !isPlaying) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        } else {
          if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    const videoElement = videoRef.current;
    if (videoElement) observer.observe(videoElement);
    return () => { if (videoElement) observer.unobserve(videoElement); };
  }, [isPlaying]);

  return (
    <>
      {/* Background layer */}
      <Box
        sx={{
          height: { xs: 700, sm: 850, md: 1000 },
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          zIndex: -1,
          borderBottomLeftRadius: boxRadius,
          borderBottomRightRadius: boxRadius,
          overflow: 'hidden',
          background: `
            radial-gradient(ellipse 80% 80% at 50% -20%, ${withAlpha(theme.vars.palette.primary.main, 0.15)} 0%, transparent 50%),
            radial-gradient(ellipse 60% 60% at 80% 50%, ${withAlpha(theme.vars.palette.primary.light, 0.08)} 0%, transparent 50%),
            radial-gradient(ellipse 60% 60% at 20% 80%, ${withAlpha(theme.vars.palette.secondary.main, 0.06)} 0%, transparent 50%)
          `,
          bgcolor: 'grey.50',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            ...getBackgroundDots(theme.vars.palette.grey[300], 1.5, 40),
            opacity: 0.5
          }
        }}
      >
        {/* Animated glowing orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-15%',
            left: '5%',
            width: { xs: '300px', md: '600px' },
            height: { xs: '300px', md: '600px' },
            background: `radial-gradient(circle, ${withAlpha(theme.vars.palette.primary.main, 0.35)} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            borderRadius: '50%',
            animation: `${float1} 18s infinite ease-in-out`,
            zIndex: 0,
            opacity: 0.6,
            willChange: 'transform',
            contain: 'layout style paint'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-5%',
            width: { xs: '400px', md: '700px' },
            height: { xs: '400px', md: '700px' },
            background: `radial-gradient(circle, ${withAlpha(theme.vars.palette.info?.main || '#00b4d8', 0.25)} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            borderRadius: '50%',
            animation: `${float2} 22s infinite ease-in-out`,
            zIndex: 0,
            opacity: 0.5,
            willChange: 'transform',
            contain: 'layout style paint'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '60%',
            width: { xs: '200px', md: '400px' },
            height: { xs: '200px', md: '400px' },
            background: `radial-gradient(circle, ${withAlpha(theme.vars.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
            filter: 'blur(70px)',
            borderRadius: '50%',
            animation: `${float3} 25s infinite ease-in-out`,
            zIndex: 0,
            opacity: 0.4,
            willChange: 'transform',
            contain: 'layout style paint'
          }}
        />

        {/* Floating micro-particles (reduced for performance) */}
        {[
          { delay: 0, x: '10%', y: '20%', size: 6 },
          { delay: 2, x: '80%', y: '15%', size: 4 },
          { delay: 4, x: '30%', y: '70%', size: 5 },
          { delay: 1, x: '70%', y: '60%', size: 3 }
        ].map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </Box>

      {/* Content */}
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY, position: 'relative', zIndex: 1 }}>
        <Box ref={containerRef}>
          <Box sx={{ pb: { xs: 3, sm: 4, md: 5 } }}>
            <Stack sx={{ alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
              {/* Badge chip with shimmer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: [0.6, 1.15, 0.95, 1] }}
                animate={{
                  boxShadow: [
                    `0 0 0px ${withAlpha(theme.vars.palette.primary.dark, 0)}`,
                    `0 0 20px ${withAlpha(theme.vars.palette.primary.main, 0.8)}`,
                    `0 0 0px ${withAlpha(theme.vars.palette.primary.dark, 0)}`
                  ],
                  borderRadius: '74px'
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8, ease: 'linear' }}
              >
                <Chip
                  variant="outlined"
                  label={chip.label}
                  slotProps={{
                    label: {
                      sx: { py: 0.5, px: 1.5, ...(typeof chip.label === 'string' && { typography: 'caption', color: 'text.secondary' }) }
                    }
                  }}
                  sx={{
                    bgcolor: withAlpha(theme.vars.palette.background.default, 0.7),
                    backdropFilter: 'blur(12px)',
                    borderColor: withAlpha(theme.vars.palette.primary.main, 0.3),
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '50%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${withAlpha(theme.vars.palette.primary.main, 0.1)}, transparent)`,
                      animation: `${shimmer} 3s infinite`
                    }
                  }}
                />
              </motion.div>

              {/* Main headline with TextType */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Typography
                  variant="h1"
                  align="center"
                  sx={{
                    maxWidth: 900,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'text.primary',
                    lineHeight: 1.1,
                    fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' }
                  }}
                >
                  <TextType
                    texts={Array.isArray(headLine) ? headLine : [headLine]}
                    typingSpeed={55}
                    pauseDuration={2500}
                    showCursor
                    cursorCharacter="|"
                    deletingSpeed={35}
                    cursorBlinkDuration={0.7}
                  />
                </Typography>
              </motion.div>

              {/* Decorative wave */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
              >
                <Box sx={{ pt: 0.5, pb: 0.75 }}>
                  <Wave />
                </Box>
              </motion.div>

              {/* Caption */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
              >
                <Typography variant="h6" align="center" sx={{ color: 'text.secondary', maxWidth: 680, lineHeight: 1.6 }}>
                  {captionLine}
                </Typography>
              </motion.div>
            </Stack>

            {/* CTAs — primary + secondary */}
            <Stack sx={{ alignItems: 'center', gap: 2.5, mt: { xs: 3, sm: 4, md: 5 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5, alignItems: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
                  whileHover={{ scale: 1.06 }}
                >
                  <ButtonAnimationWrapper>
                    <Button
                      color="primary"
                      variant="contained"
                      size="large"
                      startIcon={<SvgIcon name="tabler-sparkles" size={18} stroke={3} color="background.default" />}
                      sx={{
                        animation: `${pulseGlow} 2.5s infinite ease-in-out`,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 700,
                        borderRadius: 3
                      }}
                      {...primaryBtn}
                    />
                  </ButtonAnimationWrapper>
                </motion.div>
                {secondaryBtn && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
                    whileHover={{ scale: 1.06 }}
                  >
                    <ButtonAnimationWrapper>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<SvgIcon name="tabler-player-play" size={18} stroke={2} />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: 3,
                          borderColor: withAlpha(theme.vars.palette.primary.main, 0.4),
                          backdropFilter: 'blur(8px)',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: withAlpha(theme.vars.palette.primary.main, 0.06)
                          }
                        }}
                        {...secondaryBtn}
                      />
                    </ButtonAnimationWrapper>
                  </motion.div>
                )}
              </Stack>

              {/* Module chips */}
              <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {listData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.5 + index * 0.07, ease: 'linear' }}
                  >
                    <Chip
                      label={item.title}
                      variant="outlined"
                      icon={item.image ? <GraphicsImage image={item.image} sx={{ width: 16, height: 16 }} /> : undefined}
                      slotProps={{ label: { sx: { py: 0.75, px: 1, typography: 'caption2' } } }}
                      sx={{
                        height: 32,
                        px: 1,
                        bgcolor: withAlpha(theme.vars.palette.background.default, 0.6),
                        backdropFilter: 'blur(8px)',
                        borderColor: withAlpha(theme.vars.palette.divider, 0.3),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: withAlpha(theme.vars.palette.primary.main, 0.5),
                          bgcolor: withAlpha(theme.vars.palette.primary.main, 0.05)
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>

              {/* Mini stats banner */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      gap: { xs: 3, sm: 5 },
                      mt: 1,
                      py: 2,
                      px: 4,
                      borderRadius: 4,
                      bgcolor: withAlpha(theme.vars.palette.background.default, 0.5),
                      backdropFilter: 'blur(12px)',
                      border: '1px solid',
                      borderColor: withAlpha(theme.vars.palette.divider, 0.2)
                    }}
                  >
                    {stats.map((stat, i) => (
                      <Stack key={i} sx={{ alignItems: 'center', gap: 0.25 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          {stat.label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </motion.div>
              )}
            </Stack>
          </Box>

          {/* Dashboard preview card with enhanced glass effect */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ scale }}
          >
            <GraphicsCard
              sx={{
                border: '1px solid',
                borderColor: withAlpha(theme.vars.palette.divider, 0.2),
                background: withAlpha(theme.vars.palette.background.default, 0.4),
                backdropFilter: 'blur(24px)',
                boxShadow: `
                  0 0 0 1px ${withAlpha(theme.vars.palette.primary.main, 0.05)},
                  0 20px 60px -15px ${withAlpha(theme.vars.palette.primary.main, 0.25)},
                  0 40px 100px -30px ${withAlpha(theme.vars.palette.grey[900], 0.15)}
                `,
                p: { xs: 0.75, md: 1.5 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${withAlpha(theme.vars.palette.primary.main, 0.5)}, transparent)`
                }
              }}
            >
              {videoSrc ? (
                <video
                  playsInline
                  ref={videoRef}
                  width="100%"
                  height="100%"
                  style={{ display: 'flex', objectFit: 'cover', borderRadius: 12 }}
                  preload="none"
                  autoPlay={false}
                  loop={true}
                  muted={true}
                  poster={videoThumbnail}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              ) : videoThumbnail ? (
                <img
                  src={videoThumbnail}
                  alt="TuniERP Dashboard"
                  width="100%"
                  style={{ display: 'flex', objectFit: 'cover', borderRadius: 12 }}
                />
              ) : null}
            </GraphicsCard>
          </motion.div>
        </Box>
      </ContainerWrapper>
    </>
  );
}

Hero17.propTypes = {
  chip: PropTypes.object,
  headLine: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  captionLine: PropTypes.string,
  primaryBtn: PropTypes.any,
  secondaryBtn: PropTypes.any,
  videoSrc: PropTypes.string,
  videoThumbnail: PropTypes.string,
  listData: PropTypes.array,
  stats: PropTypes.array
};
