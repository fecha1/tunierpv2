// @project
import { FONT_INTER } from '@/config';

/***************************  TUNIERP - TYPOGRAPHY  ***************************/

export default function typography() {
  return {
    fontFamily: FONT_INTER,
    letterSpacing: 0,

    // heading - h1
    h1: {
      fontWeight: 600,
      fontSize: 40,
      lineHeight: '48px'
    },

    // heading - h2
    h2: {
      fontWeight: 600,
      fontSize: 32,
      lineHeight: '40px'
    },

    // heading - h3
    h3: {
      fontWeight: 600,
      fontSize: 28,
      lineHeight: '36px'
    },

    // heading - h4
    h4: {
      fontWeight: 600,
      fontSize: 24,
      lineHeight: '32px'
    },

    // heading - h5
    h5: {
      fontWeight: 600,
      fontSize: 20,
      lineHeight: '28px'
    },

    // heading - h6
    h6: {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: '24px'
    },

    // subtitle - 1
    subtitle1: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px'
    },

    // subtitle - 2
    subtitle2: {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '20px'
    },

    // paragraph - 1
    body1: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '24px'
    },

    // paragraph - 2
    body2: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '20px'
    },

    // caption - regular
    caption: {
      fontWeight: 400,
      fontSize: 12,
      lineHeight: '16px',
      letterSpacing: 0
    },

    // caption - medium
    caption1: {
      fontWeight: 500,
      fontSize: 12,
      lineHeight: '16px',
      letterSpacing: 0
    },

    // button
    button: {
      textTransform: 'capitalize'
    }
  };
}
