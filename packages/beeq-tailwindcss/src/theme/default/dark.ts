/**
 * BEEQ default theme, dark mode roles.
 *
 * Mode roles only reference root semantics (`--bq-{intent}[-light|-dark|-strong|-bright]`,
 * `--bq-neutral-*`, `--bq-white`, `--bq-black`), never primitives.
 */
export const DefaultDarkTheme = {
  /* -------------------------------------------------------------------------- */
  /*                             Background colors                              */
  /* -------------------------------------------------------------------------- */
  'bq-background--primary': 'var(--bq-neutral-1000)',
  'bq-background--secondary': 'var(--bq-neutral-950)',
  'bq-background--tertiary': 'var(--bq-neutral-800)',
  'bq-background--alt': 'var(--bq-neutral-700)',
  'bq-background--inverse': 'var(--bq-neutral-100)',
  'bq-background--brand': 'var(--bq-brand)',
  'bq-background--overlay': 'var(--bq-neutral-900)', // with opacity: 60%
  /* -------------------------------------------------------------------------- */
  /*                                Icons colors                                */
  /* -------------------------------------------------------------------------- */
  /** Neutral */
  'bq-icon--primary': 'var(--bq-neutral-100)',
  'bq-icon--secondary': 'var(--bq-neutral-400)',
  'bq-icon--inverse': 'var(--bq-neutral-800)',
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
  'bq-stroke--primary': 'var(--bq-neutral-900)', // Decorative dividers and separators
  'bq-stroke--secondary': 'var(--bq-neutral-700)', // Subtle or disabled borders
  'bq-stroke--tertiary': 'var(--bq-neutral-400)', // Interactive control borders (>= 3:1)
  'bq-stroke--inverse': 'var(--bq-neutral-950)',
  'bq-stroke--alt': 'var(--bq-neutral-1000)',
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
  'bq-text--primary': 'var(--bq-neutral-100)',
  'bq-text--secondary': 'var(--bq-neutral-400)',
  'bq-text--inverse': 'var(--bq-neutral-800)',
  'bq-text--alt': 'var(--bq-white)', // @deprecated Use `--bq-text--on-{intent}` for content on solid fills
  /** Intents: `-bright` variant, legible on dark surfaces (>= 4.5:1) */
  'bq-text--brand': 'var(--bq-brand-bright)',
  'bq-text--accent': 'var(--bq-accent-bright)',
  'bq-text--info': 'var(--bq-info-bright)',
  'bq-text--success': 'var(--bq-success-bright)',
  'bq-text--warning': 'var(--bq-warning-bright)',
  'bq-text--danger': 'var(--bq-danger-bright)',
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
  'bq-ui--primary': 'var(--bq-neutral-900)',
  'bq-ui--secondary': 'var(--bq-neutral-950)',
  'bq-ui--tertiary': 'var(--bq-neutral-500)',
  'bq-ui--inverse': 'var(--bq-neutral-100)',
  'bq-ui--alt': 'var(--bq-neutral-950)',
  /** Intents: solid fill and subtle tint (`-alt`) */
  'bq-ui--brand': 'var(--bq-brand)',
  'bq-ui--brand-alt': 'var(--bq-brand-dark)',
  'bq-ui--accent': 'var(--bq-accent)',
  'bq-ui--accent-alt': 'var(--bq-accent-dark)',
  'bq-ui--info': 'var(--bq-info)',
  'bq-ui--info-alt': 'var(--bq-info-dark)',
  'bq-ui--success': 'var(--bq-success)',
  'bq-ui--success-alt': 'var(--bq-success-dark)',
  'bq-ui--warning': 'var(--bq-warning)',
  'bq-ui--warning-alt': 'var(--bq-warning-dark)',
  'bq-ui--danger': 'var(--bq-danger)',
  'bq-ui--danger-alt': 'var(--bq-danger-dark)',
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  // !Note: hover and active are only used as a base to mix the state colors (20%)
  'bq-hover': '#444546',
  'bq-active': '#1f2026',
  'bq-focus': 'var(--bq-brand-bright)',
};
