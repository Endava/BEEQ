/* -------------------------------------------------------------------------- */
/*                Bee-Q declarative colors for Tailwind config                */
/* -------------------------------------------------------------------------- */

export const DECLARATIVE_COLORS = {
  bg: {
    primary: 'var(--bq-background--primary)',
    secondary: 'var(--bq-background--secondary)',
    tertiary: 'var(--bq-background--tertiary)',
    alt: 'var(--bq-background--alt)',
    inverse: 'var(--bq-background--inverse)',
    brand: 'var(--bq-background--brand)',
    overlay: 'var(--bq-background--overlay)',
  },
  data: {
    black: 'var(--bq-data--black)',
    blue: 'var(--bq-data--blue)',
    corai: 'var(--bq-data--corai)',
    cyan: 'var(--bq-data--cyan)',
    green: 'var(--bq-data--green)',
    grey: 'var(--bq-data--grey)',
    indigo: 'var(--bq-data--indigo)',
    lime: 'var(--bq-data--lime)',
    magenta: 'var(--bq-data--magenta)',
    orange: 'var(--bq-data--orange)',
    purple: 'var(--bq-data--purple)',
    red: 'var(--bq-data--red)',
    sky: 'var(--bq-data--sky)',
    teal: 'var(--bq-data--teal)',
    yellow: 'var(--bq-data--yellow)',
  },
  focus: 'var(--bq-focus)',
  icon: {
    primary: 'var(--bq-icon--primary)',
    'primary-hover': 'var(--bq-icon--primary-hover)',
    'primary-active': 'var(--bq-icon--primary-active)',
    'primary-disabled': 'var(--bq-icon--primary-disabled)',
    secondary: 'var(--bq-icon--secondary)',
    'secondary-hover': 'var(--bq-icon--secondary-hover)',
    'secondary-active': 'var(--bq-icon--secondary-active)',
    'secondary-disabled': 'var(--bq-icon--secondary-disabled)',
    'secondary-inverse': 'var(--bq-icon--secondary-inverse)',
    'secondary-inverse-disabled': 'var(--bq-icon--secondary-inverse-disabled)',
    brand: 'var(--bq-icon--brand)',
    'brand-hover': 'var(--bq-icon--brand-hover)',
    'brand-active': 'var(--bq-icon--brand-active)',
    'brand-disabled': 'var(--bq-icon--brand-disabled)',
    info: 'var(--bq-icon--info)',
    success: 'var(--bq-icon--success)',
    warning: 'var(--bq-icon--warning)',
    danger: 'var(--bq-icon--danger)',
  },
  stroke: {
    primary: 'var(--bq-stroke--primary)',
    'primary-hover': 'var(--bq-stroke--primary-hover)',
    'primary-active': 'var(--bq-stroke--primary-active)',
    'primary-disabled': 'var(--bq-stroke--primary-disabled)',
    secondary: 'var(--bq-stroke--secondary)',
    'secondary-hover': 'var(--bq-stroke--secondary-hover)',
    'secondary-active': 'var(--bq-stroke--secondary-active)',
    'secondary-disabled': 'var(--bq-stroke--secondary-disabled)',
    tertiary: 'var(--bq-stroke--tertiary)',
    'tertiary-hover': 'var(--bq-stroke--tertiary-hover)',
    'tertiary-active': 'var(--bq-stroke--tertiary-active)',
    'tertiary-disabled': 'var(--bq-stroke--tertiary-disabled)',
    inverse: 'var(--bq-stroke--inverse)',
    'inverse-hover': 'var(--bq-stroke--inverse-hover)',
    'inverse-active': 'var(--bq-stroke--inverse-active)',
    'inverse-disabled': 'var(--bq-stroke--inverse-disabled)',
    brand: 'var(--bq-stroke--brand)',
    'brand-hover': 'var(--bq-stroke--brand-hover)',
    'brand-active': 'var(--bq-stroke--brand-active)',
    'brand-disabled': 'var(--bq-stroke--brand-disabled)',
    'brand-alt': 'var(--bq-stroke--brand-alt)',
    'brand-focus': 'var(--bq-stroke--brand-focus)',
    success: 'var(--bq-stroke--success)',
    'success-hover': 'var(--bq-stroke--success-hover)',
    'success-active': 'var(--bq-stroke--success-active)',
    'success-disabled': 'var(--bq-stroke--success-disabled)',
    warning: 'var(--bq-stroke--warning)',
    'warning-hover': 'var(--bq-stroke--warning-hover)',
    'warning-active': 'var(--bq-stroke--warning-active)',
    'warning-disabled': 'var(--bq-stroke--warning-disabled)',
    danger: 'var(--bq-stroke--danger)',
    'danger-hover': 'var(--bq-stroke--danger-hover)',
    'danger-active': 'var(--bq-stroke--danger-active)',
    'danger-disabled': 'var(--bq-stroke--danger-disabled)',
  },
  text: {
    /** Primary */
    primary: 'var(--bq-text--primary)',
    'primary-hover': 'var(--bq-text--primary-hover)',
    'primary-active': 'var(--bq-text--primary-active)',
    'primary-disabled': 'var(--bq-text--primary-disabled)',
    /** Secondary */
    secondary: 'var(--bq-text--secondary)',
    'secondary-hover': 'var(--bq-text--secondary-hover)',
    'secondary-active': 'var(--bq-text--secondary-active)',
    'secondary-disabled': 'var(--bq-text--secondary-disabled)',
    'secondary-inverse': 'var(--bq-text--secondary-inverse)',
    /** Inverse */
    inverse: 'var(--bq-text--inverse)',
    'inverse-disabled': 'var(--bq-text--inverse-disabled)',
    /** Brand */
    brand: 'var(--bq-text--brand)',
    'brand-hover': 'var(--bq-text--brand-hover)',
    'brand-active': 'var(--bq-text--brand-active)',
    'brand-disabled': 'var(--bq-text--brand-disabled)',
    /** Feedback */
    info: 'var(--bq-text--info)',
    success: 'var(--bq-text--success)',
    warning: 'var(--bq-text--warning)',
    danger: 'var(--bq-text--danger)',
  },
  ui: {
    primary: 'var(--bq-ui--primary)',
    'primary-hover': 'var(--bq-ui--primary-hover)',
    'primary-active': 'var(--bq-ui--primary-active)',
    'primary-disabled': 'var(--bq-ui--primary-disabled)',
    'primary-alt': 'var(--bq-ui--primary-alt)',
    secondary: 'var(--bq-ui--secondary)',
    'secondary-hover': 'var(--bq-ui--secondary-hover)',
    'secondary-active': 'var(--bq-ui--secondary-active)',
    'secondary-disabled': 'var(--bq-ui--secondary-disabled)',
    tertiary: 'var(--bq-ui--tertiary)',
    'tertiary-hover': 'var(--bq-ui--tertiary-hover)',
    'tertiary-active': 'var(--bq-ui--tertiary-active)',
    'tertiary-disabled': 'var(--bq-ui--tertiary-disabled)',
    inverse: 'var(--bq-ui--inverse)',
    'inverse-hover': 'var(--bq-ui--inverse-hover)',
    'inverse-active': 'var(--bq-ui--inverse-active)',
    'inverse-disabled': 'var(--bq-ui--inverse-disabled)',
    brand: 'var(--bq-ui--brand)',
    'brand-hover': 'var(--bq-ui--brand-hover)',
    'brand-active': 'var(--bq-ui--brand-active)',
    'brand-disabled': 'var(--bq-ui--brand-disabled)',
    'brand-alt': 'var(--bq-ui--brand-alt)',
    success: 'var(--bq-ui--success)',
    'success-hover': 'var(--bq-ui--success-hover)',
    'success-active': 'var(--bq-ui--success-active)',
    'success-disabled': 'var(--bq-ui--success-disabled)',
    'success-alt': 'var(--bq-ui--success-alt)',
    warning: 'var(--bq-ui--warning)',
    'warning-hover': 'var(--bq-ui--warning-hover)',
    'warning-active': 'var(--bq-ui--warning-active)',
    'warning-disabled': 'var(--bq-ui--warning-disabled)',
    'warning-alt': 'var(--bq-ui--warning-alt)',
    danger: 'var(--bq-ui--danger)',
    'danger-hover': 'var(--bq-ui--danger-hover)',
    'danger-active': 'var(--bq-ui--danger-active)',
    'danger-disabled': 'var(--bq-ui--danger-disabled)',
    'danger-alt': 'var(--bq-ui--danger-alt)',
  },
};
