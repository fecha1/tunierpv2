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

  // ── Dark palette ──────────────────────────────────────────────
  const darkTextPrimary = '#F1F5F9';
  const darkTextSecondary = '#94A3B8';
  const darkDivider = '#1E293B';
  const darkBackground = '#0B1120';

  const darkPalette = {
    primary: {
      lighter: '#1A2744',
      light: '#3B6DC9',
      main: '#4D8BFF', // brighter blue for dark mode contrast
      dark: '#7BAAFF',
      darker: '#B8D4FF'
    },
    secondary: {
      lighter: '#1A2744',
      light: '#5A7BBF',
      main: '#6B8FD4',
      dark: '#8FA3C7',
      darker: '#B8CCE6'
    },
    grey: {
      50: '#0F172A',
      100: '#131B2E',
      200: '#1A2332',
      300: '#1E293B',
      400: '#2D3B4E',
      500: '#475569',
      600: darkDivider,
      700: '#64748B',
      800: darkTextSecondary,
      900: darkTextPrimary
    },
    text: {
      primary: darkTextPrimary,
      secondary: darkTextSecondary
    },
    divider: darkDivider,
    background: {
      default: darkBackground,
      paper: '#0F172A'
    }
  };

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPalette);
  const extendedDark = extendPaletteWithChannels(darkPalette);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight
    },
    dark: {
      mode: 'dark',
      ...extendedCommon,
      ...extendedDark
    }
  };
}
