// @next
import { Inter } from 'next/font/google';

export let Themes;

(function (Themes) {
  Themes['THEME_TUNIERP'] = 'tunierp';
})(Themes || (Themes = {}));

export const CSS_VAR_PREFIX = '';

/***************************  CONFIG  ***************************/

const config = {
  currentTheme: Themes.THEME_TUNIERP
};

export default config;

/***************************  THEME - FONT FAMILY  ***************************/

const fontInter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export const FONT_INTER = fontInter.style.fontFamily;
