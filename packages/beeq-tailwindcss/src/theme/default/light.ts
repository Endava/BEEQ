export const DefaultLightTheme = {
  /* -------------------------------------------------------------------------- */
  /*                              Background colors                             */
  /* -------------------------------------------------------------------------- */
  'bq-background--primary': 'var(--bq-white)',
  'bq-background--secondary': 'var(--bq-neutral-100)',
  'bq-background--tertiary': 'var(--bq-neutral-200)',
  'bq-background--alt': 'var(--bq-neutral-300)',
  'bq-background--inverse': 'var(--bq-neutral-900)',
  'bq-background--brand': 'var(--bq-brand)',
  'bq-background--overlay': 'var(--bq-neutral-900)', // with opacity: 60%
  /* -------------------------------------------------------------------------- */
  /*                                 Data colors                                */
  /* -------------------------------------------------------------------------- */
  // probably will be removed from here and added to the root file
  'bq-data--blue': 'var(--bq-data-09)',
  'bq-data--brand': 'var(--bq-brand)',
  'bq-data--corai': 'var(--bq-corai-600)', // not found in root
  'bq-data--cyan': 'var(--bq-data-04)',
  'bq-data--green': 'var(--bq-green-600)', // not found in root
  'bq-data--grey': 'var(--bq-data-10)',
  'bq-data--inverse': 'var(--bq-neutral-950)',
  'bq-data--lime': 'var(--bq-lime-600)',
  'bq-data--magenta': 'var(--bq-data-03)',
  'bq-data--orange': 'var(--bq-data-06)',
  'bq-data--purple': 'var(--bq-accent)',
  'bq-data--red': 'var(--bq-danger)',
  'bq-data--sky': 'var(--bq-sky-600)', // not found in root
  'bq-data--teal': 'var(--bq-data-05)',
  'bq-data--yellow': 'var(--bq-data-07)',
  /* -------------------------------------------------------------------------- */
  /*                                    Focus                                   */
  /* -------------------------------------------------------------------------- */
  'bq-focus': 'var(--bq-focus)',
  /* -------------------------------------------------------------------------- */
  /*                                Icons colors                                */
  /* -------------------------------------------------------------------------- */
  /** Primary */
  'bq-icon--primary': 'var(--bq-neutral-800)',
  'bq-icon--primary-hover': 'var(--bq-neutral-700)',
  'bq-icon--primary-active': 'var(--bq-neutral-900)',
  'bq-icon--primary-disabled': 'var(--bq-neutral-500)',
  'bq-icon--primary-alt': 'var(--bq-white)',
  'bq-icon--primary-alt-disabled': 'var(--bq-neutral-200)',
  /** Secondary */
  'bq-icon--secondary': 'var(--bq-neutral-600)',
  'bq-icon--secondary-hover': 'var(--bq-neutral-500)',
  'bq-icon--secondary-active': 'var(--bq-neutral-700)',
  'bq-icon--secondary-disabled': 'var(--bq-neutral-400)',
  /** Inverse */
  'bq-icon--inverse': 'var(--bq-neutral-50)',
  'bq-icon--inverse-disabled': 'var(--bq-neutral-100)',
  /** Brand */
  'bq-icon--brand': 'var(--bq-brand)',
  'bq-icon--brand-hover': 'var(--bq-iris-500)', // not found in root
  'bq-icon--brand-active': 'var(--bq-iris-700)', // not found in root
  'bq-icon--brand-disabled': 'var(--bq-iris-400)', // not found in root
  /** Feedback */
  'bq-icon--info': 'var(--bq-brand)',
  'bq-icon--success': 'var(--bq-success)',
  'bq-icon--warning': 'var(--bq-warning)',
  'bq-icon--danger': 'var(--bq-danger)',
  /* -------------------------------------------------------------------------- */
  /*                                Stroke colors                               */
  /* -------------------------------------------------------------------------- */
  /** Primary */
  'bq-stroke--primary': 'var(--bq-neutral-200)',
  'bq-stroke--primary-hover': 'var(--bq-neutral-100)',
  'bq-stroke--primary-active': 'var(--bq-neutral-300)',
  'bq-stroke--primary-disabled': 'var(--bq-neutral-100)',
  'bq-stroke--primary-alt': 'var(--bq-neutral-50)',
  /** Secondary */
  'bq-stroke--secondary': 'var(--bq-neutral-600)',
  'bq-stroke--secondary-hover': 'var(--bq-neutral-500)',
  'bq-stroke--secondary-active': 'var(--bq-neutral-700)',
  'bq-stroke--secondary-disabled': 'var(--bq-neutral-300)',
  /** Tertiary */
  'bq-stroke--tertiary': 'var(--bq-neutral-900)',
  'bq-stroke--tertiary-hover': 'var(--bq-neutral-800)',
  'bq-stroke--tertiary-active': 'var(--bq-neutral-1000)',
  'bq-stroke--tertiary-disabled': 'var(--bq-neutral-600)',
  /** Inverse */
  'bq-stroke--inverse': 'var(--bq-white)',
  'bq-stroke--inverse-hover': 'var(--bq-neutral-50)',
  'bq-stroke--inverse-active': 'var(--bq-neutral-200)',
  'bq-stroke--inverse-disabled': 'var(--bq-neutral-100)',
  /** Brand */
  'bq-stroke--brand': 'var(--bq-brand)',
  'bq-stroke--brand-hover': 'var(--bq-iris-500)', // not found in root
  'bq-stroke--brand-active': 'var(--bq-iris-700)', // not found in root
  'bq-stroke--brand-disabled': 'var(--bq-iris-400)', // not found in root
  'bq-stroke--brand-alt': 'var(--bq-brand-light)',
  /** Success */
  'bq-stroke--success': 'var(--bq-success)',
  'bq-stroke--success-hover': 'var(--bq-teal-500)', // not found in root
  'bq-stroke--success-active': 'var(--bq-teal-700)', // not found in root
  'bq-stroke--success-disabled': 'var(--bq-teal-400)', // not found in root
  /** Warning */
  'bq-stroke--warning': 'var(--bq-warning)',
  'bq-stroke--warning-hover': 'var(--bq-gold-500)', // not found in root
  'bq-stroke--warning-active': 'var(--bq-gold-700)', // not found in root
  'bq-stroke--warning-disabled': 'var(--bq-gold-400)', // not found in root
  /** Danger */
  'bq-stroke--danger': 'var(--bq-danger)',
  'bq-stroke--danger-hover': 'var(--bq-red-500)', // not found in root
  'bq-stroke--danger-active': 'var(--bq-red-700)', // not found in root
  'bq-stroke--danger-disabled': 'var(--bq-red-400)', // not found in root
  /** Info */
  'bq-stroke--info': 'var(--bq-brand)',
  'bq-stroke--info-hover': 'var(--bq-blue-500)', // not found in root
  'bq-stroke--info-active': 'var(--bq-blue-700)', // not found in root
  'bq-stroke--info-disabled': 'var(--bq-blue-400)', // not found in root
  /* -------------------------------------------------------------------------- */
  /*                                 Text colors                                */
  /* -------------------------------------------------------------------------- */
  /** Primary */
  'bq-text--primary': 'var(--bq-neutral-800)',
  'bq-text--primary-hover': 'var(--bq-neutral-700)',
  'bq-text--primary-active': 'var(--bq-neutral-900)',
  'bq-text--primary-disabled': 'var(--bq-neutral-500)',
  'bq-text--primary-alt': 'var(--bq-white)',
  'bq-text--primary-alt-disabled': 'var(--bq-neutral-200)',
  /** Secondary */
  'bq-text--secondary': 'var(--bq-neutral-600)',
  'bq-text--secondary-hover': 'var(--bq-neutral-500)',
  'bq-text--secondary-active': 'var(--bq-neutral-700)',
  'bq-text--secondary-disabled': 'var(--bq-neutral-400)',
  /** Inverse */
  'bq-text--inverse': 'var(--bq-neutral-50)',
  'bq-text--inverse-disabled': 'var(--bq-neutral-100)',
  /** Brand */
  'bq-text--brand': 'var(--bq-brand)',
  'bq-text--brand-hover': 'var(--bq-iris-500)', // not found in root
  'bq-text--brand-active': 'var(--bq-iris-700)', // not found in root
  'bq-text--brand-disabled': 'var(--bq-iris-400)', // not found in root
  /** Feedback */
  'bq-text--info': 'var(--bq-brand)',
  'bq-text--success': 'var(--bq-success)',
  'bq-text--warning': 'var(--bq-warning)',
  'bq-text--danger': 'var(--bq-danger)',
  /* -------------------------------------------------------------------------- */
  /*                                  UI colors                                 */
  /* -------------------------------------------------------------------------- */
  /** Primary */
  'bq-ui--primary': 'var(--bq-white)',
  'bq-ui--primary-hover': 'var(--bq-neutral-100)',
  'bq-ui--primary-active': 'var(--bq-neutral-300)',
  'bq-ui--primary-disabled': 'var(--bq-neutral-50)',
  'bq-ui--primary-alt': 'var(--bq-neutral-50)',
  /** Secondary */
  'bq-ui--secondary': 'var(--bq-neutral-200)',
  'bq-ui--secondary-hover': 'var(--bq-neutral-300)',
  'bq-ui--secondary-active': 'var(--bq-neutral-400)',
  'bq-ui--secondary-disabled': 'var(--bq-neutral-100)',
  /** Tertiary */
  'bq-ui--tertiary': 'var(--bq-neutral-500)',
  'bq-ui--tertiary-hover': 'var(--bq-neutral-400)',
  'bq-ui--tertiary-active': 'var(--bq-neutral-600)',
  'bq-ui--tertiary-disabled': 'var(--bq-neutral-300)',
  /** Inverse */
  'bq-ui--inverse': 'var(--bq-neutral-900)',
  'bq-ui--inverse-hover': 'var(--bq-neutral-800)',
  'bq-ui--inverse-active': 'var(--bq-neutral-1000)',
  'bq-ui--inverse-disabled': 'var(--bq-neutral-600)',
  /** Brand */
  'bq-ui--brand': 'var(--bq-brand)',
  'bq-ui--brand-hover': 'var(--bq-iris-500)', // not found in root
  'bq-ui--brand-active': 'var(--bq-iris-700)', // not found in root
  'bq-ui--brand-disabled': 'var(--bq-iris-400)', // not found in root
  'bq-ui--brand-alt': 'var(--bq-brand-light)',
  /** Success */
  'bq-ui--success': 'var(--bq-success)',
  'bq-ui--success-hover': 'var(--bq-teal-500)', // not found in root
  'bq-ui--success-active': 'var(--bq-teal-700)', // not found in root
  'bq-ui--success-disabled': 'var(--bq-teal-400)', // not found in root
  'bq-ui--success-alt': 'var(--bq-success-light)',
  /** Warning */
  'bq-ui--warning': 'var(--bq-warning)',
  'bq-ui--warning-hover': 'var(--bq-gold-500)', // not found in root
  'bq-ui--warning-active': 'var(--bq-gold-700)', // not found in root
  'bq-ui--warning-disabled': 'var(--bq-gold-400)', // not found in root
  'bq-ui--warning-alt': 'var(--bq-warning-light)',
  /** Danger */
  'bq-ui--danger': 'var(--bq-danger)',
  'bq-ui--danger-hover': 'var(--bq-red-500)', // not found in root
  'bq-ui--danger-active': 'var(--bq-red-700)', // not found in root
  'bq-ui--danger-disabled': 'var(--bq-red-400)', // not found in root
  'bq-ui--danger-alt': 'var(--bq-danger-light)',
  /** Info */
  'bq-ui--info': 'var(--bq-brand)',
  'bq-ui--info-hover': 'var(--bq-blue-500)', // not found in root
  'bq-ui--info-active': 'var(--bq-blue-700)', // not found in root
  'bq-ui--info-disabled': 'var(--bq-blue-400)', // not found in root
  'bq-ui--info-alt': 'var(--bq-brand-light)',
};
