/* -------------------------------------------------------------------------- */
/*                Bee-Q declarative colors for Tailwind config                */
/* -------------------------------------------------------------------------- */

export const DECLARATIVE_COLORS = {
  bg: {
    primary: 'var(--bq-background--primary)',
    secondary: 'var(--bq-background--secondary)',
    tertiary: 'var(--bq-background--tertiary)',
    inverse: 'var(--bq-background--inverse)',
    brand: 'var(--bq-background--brand)',
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
    /** Brand */
    brand: 'var(--bq-text--brand)',
    'brand-hover': 'var(--bq-text--brand-hover)',
    'brand-active': 'var(--bq-text--brand-active)',
    'brand-disabled': 'var(--bq-text--brand-disabled)',
    /** Feedback */
    success: 'var(--bq-text--success)',
    warning: 'var(--bq-text--warning)',
    danger: 'var(--bq-text--danger)',
  },
  icon: {
    /** Primary */
    primary: 'var(--bq-icon--primary)',
    'primary-hover': 'var(--bq-icon--primary-hover)',
    'primary-active': 'var(--bq-icon--primary-active)',
    'primary-disabled': 'var(--bq-icon--primary-disabled)',
    /** Secondary */
    secondary: 'var(--bq-icon--secondary)',
    'secondary-hover': 'var(--bq-icon--secondary-hover)',
    'secondary-active': 'var(--bq-icon--secondary-active)',
    'secondary-disabled': 'var(--bq-icon--secondary-disabled)',
    'secondary-inverse': 'var(--bq-icon--secondary-inverse)',
    /** Brand */
    brand: 'var(--bq-icon--brand)',
    'brand-hover': 'var(--bq-icon--brand-hover)',
    'brand-active': 'var(--bq-icon--brand-active)',
    'brand-disabled': 'var(--bq-icon--brand-disabled)',
    /** Feedback */
    success: 'var(--bq-icon--success)',
    warning: 'var(--bq-icon--warning)',
    danger: 'var(--bq-icon--danger)',
  },
  ui: {
    /** Primary */
    primary: 'var(--bq-ui--primary)',
    'primary-hover': 'var(--bq-ui--primary-hover)',
    'primary-active': 'var(--bq-ui--primary-active)',
    'primary-disabled': 'var(--bq-ui--primary-disabled)',
    /** Secondary */
    secondary: 'var(--bq-ui--secondary)',
    'secondary-hover': 'var(--bq-ui--secondary-hover)',
    'secondary-active': 'var(--bq-ui--secondary-active)',
    'secondary-disabled': 'var(--bq-ui--secondary-disabled)',
    'secondary-light': 'var(--bq-ui--secondary-light)',
    /** Tiertary */
    tiertary: 'var(--bq-ui--tiertary)',
    'tiertary-hover': 'var(--bq-ui--tiertary-hover)',
    'tiertary-active': 'var(--bq-ui--tiertary-active)',
    'tiertary-disabled': 'var(--bq-ui--tiertary-disabled)',
    /** Inverse */
    inverse: 'var(--bq-ui--inverse)',
    'inverse-hover': 'var(--bq-ui--inverse-hover)',
    'inverse-active': 'var(--bq-ui--inverse-active)',
    'inverse-disabled': 'var(--bq-ui--inverse-disabled)',
    /** Brand */
    brand: 'var(--bq-ui--brand)',
    'brand-hover': 'var(--bq-ui--brand-hover)',
    'brand-active': 'var(--bq-ui--brand-active)',
    'brand-disabled': 'var(--bq-ui--brand-disabled)',
    'brand-light': 'var(--bq-ui--brand-light)',
    /** Success */
    success: 'var(--bq-ui--success)',
    'success-hover': 'var(--bq-ui--success-hover)',
    'success-active': 'var(--bq-ui--success-active)',
    'success-disabled': 'var(--bq-ui--success-disabled)',
    'success-light': 'var(--bq-ui--success-light)',
    /** Warning */
    warning: 'var(--bq-ui--warning)',
    'warning-hover': 'var(--bq-ui--warning-hover)',
    'warning-active': 'var(--bq-ui--warning-active)',
    'warning-disabled': 'var(--bq-ui--warning-disabled)',
    'warning-light': 'var(--bq-ui--warning-light)',
    /** Danger */
    danger: 'var(--bq-ui--danger)',
    'danger-hover': 'var(--bq-ui--danger-hover)',
    'danger-active': 'var(--bq-ui--danger-active)',
    'danger-disabled': 'var(--bq-ui--danger-disabled)',
    'danger-light': 'var(--bq-ui--danger-light)',
  },
  stroke: {
    /** Primary */
    primary: 'var(--bq-stroke--primary)',
    'primary-hover': 'var(--bq-stroke--primary-hover)',
    'primary-active': 'var(--bq-stroke--primary-active)',
    'primary-disabled': 'var(--bq-stroke--primary-disabled)',
    /** Secondary */
    secondary: 'var(--bq-stroke--secondary)',
    'secondary-hover': 'var(--bq-stroke--secondary-hover)',
    'secondary-active': 'var(--bq-stroke--secondary-active)',
    'secondary-disabled': 'var(--bq-stroke--secondary-disabled)',
    'secondary-light': 'var(--bq-stroke--secondary-light)',
    /** Tiertary */
    tiertary: 'var(--bq-stroke--tiertary)',
    'tiertary-hover': 'var(--bq-stroke--tiertary-hover)',
    'tiertary-active': 'var(--bq-stroke--tiertary-active)',
    'tiertary-disabled': 'var(--bq-stroke--tiertary-disabled)',
    /** Inverse */
    inverse: 'var(--bq-stroke--inverse)',
    /** Brand */
    brand: 'var(--bq-stroke--brand)',
    'brand-hover': 'var(--bq-stroke--brand-hover)',
    'brand-active': 'var(--bq-stroke--brand-active)',
    'brand-disabled': 'var(--bq-stroke--brand-disabled)',
    /** Success */
    success: 'var(--bq-stroke--success)',
    'success-hover': 'var(--bq-stroke--success-hover)',
    'success-active': 'var(--bq-stroke--success-active)',
    'success-disabled': 'var(--bq-stroke--success-disabled)',
    /** Warning */
    warning: 'var(--bq-stroke--warning)',
    'warning-hover': 'var(--bq-stroke--warning-hover)',
    'warning-active': 'var(--bq-stroke--warning-active)',
    'warning-disabled': 'var(--bq-stroke--warning-disabled)',
    /** Danger */
    danger: 'var(--bq-stroke--danger)',
    'danger-hover': 'var(--bq-stroke--danger-hover)',
    'danger-active': 'var(--bq-stroke--danger-active)',
    'danger-disabled': 'var(--bq-stroke--danger-disabled)',
  },
};
