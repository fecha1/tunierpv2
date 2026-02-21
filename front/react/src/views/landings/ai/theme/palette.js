// @project
import { extendPaletteWithChannels } from '@/utils/colorUtils';

/***************************  TUNIERP THEME - PALETTE  ***************************/

export function buildPalette() {
  const textPrimary = '#101c37'; // TuniERP navy — primary text
  const textSecondary = '#4A5568'; // neutral slate — secondary text
  const divider = '#CBD5E1'; // neutral border
  const background = '#FFF';

  const lightPalette = {
    primary: {
      lighter: '#E3EAF6', // TuniERP tint 90
      light: '#5A7BBF', // TuniERP tint 60
      main: '#264b8d', // TuniERP blue — brand primary
      dark: '#1A3566', // TuniERP shade 30
      darker: '#101c37' // TuniERP navy — deepest
    },
    secondary: {
      lighter: '#E8EDF5',
      light: '#8FA3C7',
      main: '#4A6FA5',
      dark: '#33507A',
      darker: '#1C2E4A'
    },
    grey: {
      50: '#F8F9FC', // surface bright
      100: '#F1F4F9', // surface container low
      200: '#EBEEF3', // surface container
      300: '#E2E8F0', // surface container high
      400: '#CBD5E1', // surface container highest
      500: '#94A3B8', // surface dim
      600: divider,
      700: '#64748B', // outline
      800: textSecondary,
      900: textPrimary
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary
    },
    divider,
    background: {
      default: background
    }
  };

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPalette);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight
    }
  };
}
