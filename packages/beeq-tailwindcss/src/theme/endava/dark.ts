import { DARK_BOX_SHADOWS } from '../shadows';

/**
 * Endava theme, dark mode roles.
 * Neutrals are the Endava Solid Blue shades (`--bq-neutral-950` is Solid Blue).
 * Solid intent fills use the `-bright` variant, so their on-color is Solid Blue (`--bq-black`).
 *
 * Mode roles only reference root semantics (`--bq-{intent}[-light|-dark|-strong|-bright]`,
 * `--bq-neutral-*`, `--bq-white`, `--bq-black`), never primitives.
 */
export const EndavaDarkTheme = {
  /* -------------------------------------------------------------------------- */
  /*                             Background colors                              */
  /* -------------------------------------------------------------------------- */
  'bq-background--primary': 'var(--bq-neutral-950)',
  'bq-background--secondary': 'var(--bq-neutral-900)',
  'bq-background--tertiary': 'var(--bq-neutral-800)',
  'bq-background--alt': 'var(--bq-neutral-700)',
  'bq-background--inverse': 'var(--bq-white)',
  'bq-background--brand': 'var(--bq-brand)',
  'bq-background--overlay': 'var(--bq-neutral-1000)', // with opacity: 60%
  /* -------------------------------------------------------------------------- */
  /*                                Icons colors                                */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-icon--primary': 'var(--bq-white)',
  'bq-icon--secondary': 'var(--bq-neutral-400)',
  'bq-icon--inverse': 'var(--bq-neutral-950)',
  'bq-icon--alt': 'var(--bq-white)', // @deprecated Use `--bq-text--on-{intent}` for content on solid fills
  /** Intents: `-bright` variant, legible on dark surfaces (>= 3:1 non-text) */
  'bq-icon--brand': 'var(--bq-brand-bright)',
  'bq-icon--accent': 'var(--bq-accent-bright)',
  'bq-icon--info': 'var(--bq-info-bright)',
  'bq-icon--success': 'var(--bq-success-bright)',
  'bq-icon--warning': 'var(--bq-warning-bright)',
  'bq-icon--danger': 'var(--bq-danger-bright)',
  /* -------------------------------------------------------------------------- */
  /*                               Stroke colors                                */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-stroke--primary': 'var(--bq-neutral-800)', // Decorative dividers and separators
  'bq-stroke--secondary': 'var(--bq-neutral-600)', // Subtle or disabled borders
  'bq-stroke--tertiary': 'var(--bq-white)', // Interactive control borders (>= 3:1)
  'bq-stroke--inverse': 'var(--bq-neutral-950)',
  'bq-stroke--alt': 'var(--bq-neutral-900)',
  /** Intents */
  'bq-stroke--brand': 'var(--bq-brand-bright)',
  'bq-stroke--brand-alt': 'var(--bq-brand-dark)',
  'bq-stroke--accent': 'var(--bq-accent-bright)',
  'bq-stroke--info': 'var(--bq-info-bright)',
  'bq-stroke--success': 'var(--bq-success-bright)',
  'bq-stroke--warning': 'var(--bq-warning-bright)',
  'bq-stroke--danger': 'var(--bq-danger-bright)',
  /* -------------------------------------------------------------------------- */
  /*                                Text colors                                 */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-text--primary': 'var(--bq-white)',
  'bq-text--secondary': 'var(--bq-neutral-400)',
  'bq-text--inverse': 'var(--bq-neutral-950)',
  'bq-text--alt': 'var(--bq-white)', // @deprecated Use `--bq-text--on-{intent}` for content on solid fills
  /** Intents: `-bright` variant, legible on dark surfaces (>= 4.5:1 and APCA Lc >= 60) */
  'bq-text--brand': 'var(--bq-brand-bright)',
  'bq-text--accent': 'var(--bq-accent-bright)',
  'bq-text--info': 'var(--bq-info-bright)',
  'bq-text--success': 'var(--bq-success-bright)',
  'bq-text--warning': 'var(--bq-warning-bright)',
  'bq-text--danger': 'var(--bq-danger-bright)',
  /** On-color: content placed on the solid `--bq-ui--{intent}` fill (>= 4.5:1 at rest, hover and active) */
  'bq-text--on-brand': 'var(--bq-white)', // Accepted exception: white on Red Orange is 3.15:1 (large/bold labels only)
  'bq-text--on-accent': 'var(--bq-white)', // Accepted exception: aliases brand
  'bq-text--on-info': 'var(--bq-black)',
  'bq-text--on-success': 'var(--bq-black)',
  'bq-text--on-warning': 'var(--bq-black)',
  'bq-text--on-danger': 'var(--bq-black)',
  /* -------------------------------------------------------------------------- */
  /*                                 UI colors                                  */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-ui--primary': 'var(--bq-neutral-950)',
  'bq-ui--secondary': 'var(--bq-neutral-900)',
  'bq-ui--tertiary': 'var(--bq-neutral-500)',
  'bq-ui--inverse': 'var(--bq-white)',
  'bq-ui--alt': 'var(--bq-neutral-900)',
  /** Intents: solid fill and subtle tint (`-alt`) */
  'bq-ui--brand': 'var(--bq-brand)',
  'bq-ui--brand-alt': 'var(--bq-brand-dark)',
  'bq-ui--accent': 'var(--bq-accent)',
  'bq-ui--accent-alt': 'var(--bq-accent-dark)',
  'bq-ui--info': 'var(--bq-info-bright)',
  'bq-ui--info-alt': 'var(--bq-info-dark)',
  'bq-ui--success': 'var(--bq-success-bright)',
  'bq-ui--success-alt': 'var(--bq-success-dark)',
  'bq-ui--warning': 'var(--bq-warning-bright)',
  'bq-ui--warning-alt': 'var(--bq-warning-dark)',
  'bq-ui--danger': 'var(--bq-danger-bright)',
  'bq-ui--danger-alt': 'var(--bq-danger-dark)',
  /* -------------------------------------------------------------------------- */
  /*                                Box shadows                                 */
  /* -------------------------------------------------------------------------- */
  ...DARK_BOX_SHADOWS,
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  // !Note: hover and active are only used as a base to mix the state colors (20%)
  'bq-hover': '#444546',
  'bq-active': '#1f2026',
  'bq-focus': 'var(--bq-brand-bright)',
};
