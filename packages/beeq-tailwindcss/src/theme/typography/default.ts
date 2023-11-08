import type { CSSRuleObject } from 'tailwindcss/types/config';

export const TYPOGRAPHY_DEFAULT: CSSRuleObject | CSSRuleObject[] = {
  '.display': { fontSize: 'var(--bq-font-size--xxl5)' },
  '.display,.h1,h1': {
    fontFamily: 'inherit',
    fontWeight: 'var(--bq-font-weight--regular)',
    lineHeight: 'var(--bq-font-line-height--small)',
  },
  '.h1,h1': { fontSize: 'var(--bq-font-size--xxl4)' },
  '.h2,h2': { fontSize: 'var(--bq-font-size--xxl3)' },
  '.h2,.h3,h2,h3': {
    fontFamily: 'inherit',
    fontWeight: 'var(--bq-font-weight--regular)',
    lineHeight: 'var(--bq-font-line-height--small)',
  },
  '.h3,h3': { fontSize: 'var(--bq-font-size--xxl2)' },
  '.h4,h4': {
    fontFamily: 'inherit',
    fontSize: 'var(--bq-font-size--xxl)',
    fontWeight: 'var(--bq-font-weight--regular)',
    lineHeight: 'var(--bq-font-line-height--small)',
  },
  '.h5,h5': { fontSize: 'var(--bq-font-size--xl)' },
  '.h5,.h6,h5,h6': {
    fontFamily: 'inherit',
    fontWeight: 'var(--bq-font-weight--regular)',
    lineHeight: 'var(--bq-font-line-height--regular)',
  },
  '.h6,h6': { fontSize: 'var(--bq-font-size--l)' },
  '.caption,figcaption': { fontSize: 'var(--bq-font-size--s)' },
  '.caption,.overline,figcaption': {
    fontFamily: 'inherit',
    fontWeight: 'var(--bq-font-weight--regular)',
    lineHeight: 'var(--bq-font-line-height--regular)',
  },
  '.overline': { fontSize: 'var(--bq-font-size--xs)' },
  [`.caption.semibold,
    .display.semibold,
    .h1.semibold,
    .h2.semibold,
    .h3.semibold,
    .h4.semibold,
    .h5.semibold,
    .h6.semibold,
    .overline.semibold,
    caption.semibold,
    h1.semibold,
    h2.semibold,
    h3.semibold,
    h4.semibold,
    h5.semibold,
    h6.semibold`]: {
    fontWeight: 'var(--bq-font-weight--semibold)',
  },
  [`.caption.bold,
    .display.bold,
    .h1.bold,
    .h2.bold,
    .h3.bold,
    .h4.bold,
    .h5.bold,
    .h6.bold,
    .overline.bold,
    caption.bold,
    h1.bold,
    h2.bold,
    h3.bold,
    h4.bold,
    h5.bold,
    h6.bold`]: {
    fontWeight: 'var(--bq-font-weight--bold)',
  },
};
