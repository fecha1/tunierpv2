// @project
import { extendPaletteWithChannels, withAlpha } from '@/utils/colorUtils';

/***************************  TUNIERP - PALETTE  ***************************/

export function buildPalette() {
  const textPrimary = '#1B1F2E';
  const textSecondary = '#5A6178';

  const secondaryMain = '#264b8d';

  const divider = '#E8EAF0';
  const background = '#F8F9FC';

  const disabled = '#8B90A0';
  const disabledBackground = '#E0E2E8';

  const lightPalette = {
    primary: {
      lighter: '#E3EAF6',
      light: '#5A7BBF',
      main: '#264b8d',
      dark: '#1A3566',
      darker: '#101c37'
    },
    secondary: {
      lighter: '#E0E4F0',
      light: '#8A9CC4',
      main: secondaryMain,
      dark: '#1C3A6E',
      darker: '#101c37'
    },
    error: {
      lighter: '#FFEDEA',
      light: '#FFDAD6',
      main: '#DE3730',
      dark: '#BA1A1A',
      darker: '#690005'
    },
    warning: {
      lighter: '#FFF3E0',
      light: '#FFD180',
      main: '#F9A825',
      dark: '#F57F17',
      darker: '#E65100'
    },
    success: {
      lighter: '#E8F5E9',
      light: '#A5D6A7',
      main: '#2E7D32',
      dark: '#1B5E20',
      darker: '#0D3B0F'
    },
    info: {
      lighter: '#E1F5FE',
      light: '#81D4FA',
      main: '#0288D1',
      dark: '#01579B',
      darker: '#003A66'
    },
    grey: {
      50: '#FAFBFE',
      100: '#F4F5FA',
      200: divider,
      300: '#DDE0E8',
      400: disabledBackground,
      500: '#C8CCD5',
      600: '#A0A5B5',
      700: disabled,
      800: textSecondary,
      900: textPrimary
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: disabled
    },
    divider,
    background: {
      default: background,
      paper: '#FFFFFF'
    },
    action: {
      hover: withAlpha(secondaryMain, 0.06),
      disabled: withAlpha(disabled, 0.6),
      disabledBackground: withAlpha(disabledBackground, 0.9)
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
