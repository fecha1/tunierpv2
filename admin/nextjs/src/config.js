// @next
import { Inter } from 'next/font/google';

/***************************  THEME CONSTANT  ***************************/

export const APP_DEFAULT_PATH = '/dashboard';

export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 76 + 1; // 1px - for right-side border

export const CSS_VAR_PREFIX = '';

/***************************  THEME ENUM  ***************************/

export let Themes;

(function (Themes) {
  Themes['THEME_TUNIERP'] = 'tunierp';
})(Themes || (Themes = {}));

export let ThemeMode;

(function (ThemeMode) {
  ThemeMode['LIGHT'] = 'light';
  ThemeMode['DARK'] = 'dark';
})(ThemeMode || (ThemeMode = {}));

export let ThemeDirection;

(function (ThemeDirection) {
  ThemeDirection['LTR'] = 'ltr';
  ThemeDirection['RTL'] = 'rtl';
})(ThemeDirection || (ThemeDirection = {}));

export let ThemeI18n;

(function (ThemeI18n) {
  ThemeI18n['FR'] = 'fr';
  ThemeI18n['AR'] = 'ar';
  ThemeI18n['EN'] = 'en';
})(ThemeI18n || (ThemeI18n = {}));

/***************************  CONFIG  ***************************/

const config = {
  currentTheme: Themes.THEME_TUNIERP,
  themeDirection: ThemeDirection.LTR,
  miniDrawer: false,
  i18n: ThemeI18n.FR
};

export default config;

/***************************  THEME - FONT FAMILY  ***************************/

const fontInter = Inter({ subsets: ['latin'], display: 'swap', weight: ['400', '500', '600', '700'] });

export const FONT_INTER = fontInter.style.fontFamily;
