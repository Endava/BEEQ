import { LIGHT_BOX_SHADOWS } from '../shadows';

/**
 * BEEQ default theme, light mode roles.
 *
 * Mode roles only reference root semantics (`--bq-{intent}[-light|-dark|-strong|-bright]`,
 * `--bq-neutral-*`, `--bq-white`, `--bq-black`), never primitives.
 */
export const DefaultLightTheme = {
  /* -------------------------------------------------------------------------- */
  /*                             Background colors                              */
  /* -------------------------------------------------------------------------- */
  'bq-background--primary': 'var(--bq-white)',
  'bq-background--secondary': 'var(--bq-neutral-100)',
  'bq-background--tertiary': 'var(--bq-neutral-200)',
  'bq-background--alt': 'var(--bq-neutral-300)',
  'bq-background--inverse': 'var(--bq-neutral-900)',
  'bq-background--brand': 'var(--bq-brand)',
  'bq-background--overlay': 'var(--bq-neutral-900)', // with opacity: 60%
  /* -------------------------------------------------------------------------- */
  /*                                Icons colors                                */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-icon--primary': 'var(--bq-neutral-800)',
  'bq-icon--secondary': 'var(--bq-neutral-600)',
  'bq-icon--inverse': 'var(--bq-neutral-50)',
  'bq-icon--alt': 'var(--bq-white)', // @deprecated Use `--bq-text--on-{intent}` for content on solid fills
  /** Intents: `-strong` variant, legible on light surfaces (>= 3:1 non-text) */
  'bq-icon--brand': 'var(--bq-brand-strong)',
  'bq-icon--accent': 'var(--bq-accent-strong)',
  'bq-icon--info': 'var(--bq-info-strong)',
  'bq-icon--success': 'var(--bq-success-strong)',
  'bq-icon--warning': 'var(--bq-warning-strong)',
  'bq-icon--danger': 'var(--bq-danger-strong)',
  /* -------------------------------------------------------------------------- */
  /*                               Stroke colors                                */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-stroke--primary': 'var(--bq-neutral-200)', // Decorative dividers and separators
  'bq-stroke--secondary': 'var(--bq-neutral-600)', // Subtle or disabled borders
  'bq-stroke--tertiary': 'var(--bq-neutral-900)', // Interactive control borders (>= 3:1)
  'bq-stroke--inverse': 'var(--bq-white)',
  'bq-stroke--alt': 'var(--bq-neutral-50)',
  /** Intents */
  'bq-stroke--brand': 'var(--bq-brand-strong)',
  'bq-stroke--brand-alt': 'var(--bq-brand-light)',
  'bq-stroke--accent': 'var(--bq-accent-strong)',
  'bq-stroke--info': 'var(--bq-info-strong)',
  'bq-stroke--success': 'var(--bq-success-strong)',
  'bq-stroke--warning': 'var(--bq-warning-strong)',
  'bq-stroke--danger': 'var(--bq-danger-strong)',
  /* -------------------------------------------------------------------------- */
  /*                                Text colors                                 */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-text--primary': 'var(--bq-neutral-800)',
  'bq-text--secondary': 'var(--bq-neutral-600)',
  'bq-text--inverse': 'var(--bq-neutral-50)',
  'bq-text--alt': 'var(--bq-white)', // @deprecated Use `--bq-text--on-{intent}` for content on solid fills
  /** Intents: `-strong` variant, legible on light surfaces (>= 4.5:1) */
  'bq-text--brand': 'var(--bq-brand-strong)',
  'bq-text--accent': 'var(--bq-accent-strong)',
  'bq-text--info': 'var(--bq-info-strong)',
  'bq-text--success': 'var(--bq-success-strong)',
  'bq-text--warning': 'var(--bq-warning-strong)',
  'bq-text--danger': 'var(--bq-danger-strong)',
  /** On-color: content placed on the solid `--bq-ui--{intent}` fill (>= 4.5:1 at rest, hover and active) */
  'bq-text--on-brand': 'var(--bq-white)',
  'bq-text--on-accent': 'var(--bq-white)',
  'bq-text--on-info': 'var(--bq-white)',
  'bq-text--on-success': 'var(--bq-black)',
  'bq-text--on-warning': 'var(--bq-black)',
  'bq-text--on-danger': 'var(--bq-white)',
  /* -------------------------------------------------------------------------- */
  /*                                 UI colors                                  */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-ui--primary': 'var(--bq-white)',
  'bq-ui--secondary': 'var(--bq-neutral-100)',
  'bq-ui--tertiary': 'var(--bq-neutral-500)',
  'bq-ui--inverse': 'var(--bq-neutral-900)',
  'bq-ui--alt': 'var(--bq-neutral-50)',
  /** Intents: solid fill and subtle tint (`-alt`) */
  'bq-ui--brand': 'var(--bq-brand)',
  'bq-ui--brand-alt': 'var(--bq-brand-light)',
  'bq-ui--accent': 'var(--bq-accent)',
  'bq-ui--accent-alt': 'var(--bq-accent-light)',
  'bq-ui--info': 'var(--bq-info)',
  'bq-ui--info-alt': 'var(--bq-info-light)',
  'bq-ui--success': 'var(--bq-success)',
  'bq-ui--success-alt': 'var(--bq-success-light)',
  'bq-ui--warning': 'var(--bq-warning)',
  'bq-ui--warning-alt': 'var(--bq-warning-light)',
  'bq-ui--danger': 'var(--bq-danger)',
  'bq-ui--danger-alt': 'var(--bq-danger-light)',
  /* -------------------------------------------------------------------------- */
  /*                                Box shadows                                 */
  /* -------------------------------------------------------------------------- */
  ...LIGHT_BOX_SHADOWS,
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  // !Note: hover and active are only used as a base to mix the state colors (20%)
  'bq-hover': '#444546',
  'bq-active': '#1f2026',
  'bq-focus': 'var(--bq-brand-strong)',
};
