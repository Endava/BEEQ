/* -------------------------------------------------------------------------- */
/*                  BEEQ's opinionated reset for TailwindCSS                  */
/* -------------------------------------------------------------------------- */

import type { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * Selectors are wrapped in `:where()` (zero specificity) so any consumer style overrides the reset.
 * `html` and `body` are not wrapped, so these defaults still win over Tailwind CSS preflight by source order.
 * `*` and pseudo-elements are not wrapped: `*` already has zero specificity and `:where()` cannot hold pseudo-elements.
 */
export const reset: CSSRuleObject | CSSRuleObject[] = {
  /* Box sizing rules */
  '*, *::before, *::after': {
    'box-sizing': 'border-box',
  },
  /* Remove default margin */
  '*': {
    margin: '0',
  },
  /* Set core root defaults */
  html: {
    'font-family': 'var(--bq-font-family)',
    'font-size': 'var(--bq-font-size--m)',
    'text-size-adjust': 'none',
  },
  /* Set core body defaults */
  body: {
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    'background-color': 'var(--bq-background--primary)',
    color: 'var(--bq-text--primary)',
    'line-height': 'var(--bq-font-line-height--regular)',
    'min-height': '100vb',
  },
  /* A elements that don't have a class get default styles */
  ':where(a:not([class]))': {
    'text-decoration-skip-ink': 'auto',
  },
  /* Make images easier to work with */
  ':where(img, picture, video, canvas, svg)': {
    'max-width': '100%',
    display: 'block',
  },
  /* Inherit fonts for form controls */
  ':where(button, input, optgroup, select, textarea)': {
    font: 'inherit',
  },
  /* Keep code at the surrounding text size */
  ':where(code, kbd, samp, pre)': {
    'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    'font-size': '1em',
  },
  /* Keep subscript and superscript from changing the line height */
  ':where(sub, sup)': {
    'font-size': '75%',
    'line-height': '0',
    position: 'relative',
    'vertical-align': 'baseline',
  },
  ':where(sub)': {
    bottom: '-0.25em',
  },
  ':where(sup)': {
    top: '-0.5em',
  },
  /* Avoid text overflows */
  ':where(p, h1, h2, h3, h4, h5, h6)': {
    'overflow-wrap': 'break-word',
  },
  /* Keep native centering for modal dialogs and popovers */
  ':where(dialog, [popover])': {
    margin: 'auto',
  },
  /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
  ':where(ul[role="list"], ol[role="list"])': {
    'list-style-type': 'none',
  },
  /* Keep native hidden state authoritative over component layout styles */
  ':where([hidden]:not([hidden="until-found"]))': {
    display: 'none !important',
  },
  /* Remove all animations and transitions for people that prefer not to see them */
  '@media (prefers-reduced-motion: reduce)': {
    '*, *::before, *::after': {
      'animation-duration': '0.01ms !important',
      'animation-iteration-count': '1 !important',
      'transition-duration': '0.01ms !important',
      'scroll-behavior': 'auto',
    },
  },
};
