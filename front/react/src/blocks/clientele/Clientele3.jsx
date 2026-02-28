'use client';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion } from 'motion/react';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import GraphicsImage from '@/components/GraphicsImage';

import { withAlpha } from '@/utils/colorUtils';
import { SECTION_COMMON_PY } from '@/utils/constant';
import { keyframes } from '@mui/system';

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

/***************************  CLIENTELE - 3  (CSS Marquee) ***************************/

export default function Clientele3({ title, clienteleList }) {
  const theme = useTheme();

  // Duplicate for seamless infinite scroll
  const doubledList = [...clienteleList, ...clienteleList];

  const shade = {
    content: `' '`,
    zIndex: 1,
    position: 'absolute',
    width: { sm: 80, xs: 50 },
    height: 1,
    top: 0,
    background: `linear-gradient(90deg, ${theme.vars.palette.background.default} -8.54%, ${withAlpha(theme.vars.palette.background.default, 0)} 100%)`,
    transform: null
  };

  return (
    <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
      <Stack sx={{ gap: 3 }}>
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography variant="subtitle2" align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {title}
            </Typography>
          </motion.div>
        )}
        <Box sx={{ position: 'relative', overflow: 'hidden', '&:before': { ...shade, left: 0 }, '&:after': { ...shade, right: 0, rotate: '180deg' } }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box
              sx={{
                display: 'flex',
                width: 'max-content',
                animation: `${marquee} 30s linear infinite`,
                '&:hover': { animationPlayState: 'paused' }
              }}
            >
              {doubledList.map((item, index) => (
                <Box key={index} sx={{ px: { xs: 0.5, sm: 1, md: 1.5 }, flexShrink: 0 }}>
                  <Box
                    sx={{
                      height: { xs: 44, sm: 52, md: 64 },
                      width: { xs: 100, sm: 140, md: 160 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 3,
                      bgcolor: withAlpha(theme.vars.palette.grey[200], 0.5),
                      border: '1px solid',
                      borderColor: withAlpha(theme.vars.palette.divider, 0.1),
                      px: 2,
                      transition: 'all 0.3s ease',
                      '& svg, & img': {
                        opacity: 0.4,
                        filter: 'grayscale(100%)',
                        transition: 'all 0.4s ease'
                      },
                      '&:hover': {
                        bgcolor: withAlpha(theme.vars.palette.background.default, 0.8),
                        borderColor: withAlpha(theme.vars.palette.primary.main, 0.2),
                        '& svg, & img': { opacity: 1, filter: 'grayscale(0%)' }
                      }
                    }}
                  >
                    <GraphicsImage {...item} />
                  </Box>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Stack>
    </ContainerWrapper>
  );
}

Clientele3.propTypes = { title: PropTypes.string, clienteleList: PropTypes.array };
