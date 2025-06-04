/* -------------------------------------------------------------------------- */
/*                  BEEQ's opinionated reset for TailwindCSS                  */
/* -------------------------------------------------------------------------- */

import type { CSSRuleObject } from 'tailwindcss/types/config';

export const reset: CSSRuleObject | CSSRuleObject[] = {
  /* Box sizing rules */
  '*, *::before, *::after': {
    'box-sizing': 'border-box',
  },
  /* Remove default margin and inherit font styles */
  '*': {
    margin: '0',
    font: 'inherit',
  },
  /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
  'ul[role="list"], ol[role="list"]': {
    'list-style-type': 'none',
  },
  /* Set core root defaults */
  html: {
    'font-family': 'var(--bq-font-family)',
    'font-size': 'var(--bq-font-size--m)',
    'text-size-adjust': 'none',
  },
  'html:focus-within': {
    'scroll-behavior': 'smooth',
  },
  /* Set core body defaults */
  body: {
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    'background-color': 'var(--bq-background--primary)',
    color: 'var(--bq-text--primary)',
    'line-height': 'var(--bq-font-line-height--regular)',
    'min-height': '100vb',
    'text-rendering': 'optimizeSpeed',
  },
  /* A elements that don't have a class get default styles */
  'a:not([class])': {
    'text-decoration-skip-ink': 'auto',
  },
  /* Make images easier to work with */
  'img, picture, video, canvas, svg': {
    'max-width': '100%',
    display: 'block',
  },
  /* Inherit fonts for inputs and buttons */
  'input, button, select, textarea': {
    font: 'inherit',
  },
  /* Avoid text overflows */
  'p, h1, h2, h3, h4, h5, h6': {
    'overflow-wrap': 'break-word',
  },
  /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
  '@media (prefers-reduced-motion: reduce)': {
    'html:focus-within': {
      'scroll-behavior': 'auto',
    },
    '*, *::before, *::after': {
      'animation-duration': '0.01ms !important',
      'animation-iteration-count': '1 !important',
      'transition-duration': '0.01ms !important',
      'scroll-behavior': 'auto',
    },
  },
};
