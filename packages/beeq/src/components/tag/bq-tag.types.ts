export const TAG_SIZE = ['extra_small', 'small', 'medium'] as const;
export type TTagSize = (typeof TAG_SIZE)[number];

export const TAG_TYPE = ['default', 'success', 'warning', 'error', 'info'] as const;
export type TTagType = (typeof TAG_TYPE)[number];

export const TAG_VARIANT = ['default', 'filled'] as const;
export type TTagVariant = (typeof TAG_VARIANT)[number];

export const SIZE_TO_VALUE_MAP: Record<TTagSize, number> = {
  extra_small: 20,
  small: 20,
  medium: 24,
};

// the definition of colors associated with each type and variant of the label
export const TAG_COLORS = {
  default: {
    default: 'text--primary',
    filled: 'text--primary-alt',
  },
  success: {
    default: 'text--success',
    filled: 'text--primary-alt',
  },
  warning: {
    default: 'text--warning',
    filled: 'text--primary-alt',
  },
  error: {
    default: 'text--danger',
    filled: 'text--primary-alt',
  },
  info: {
    default: 'text--brand',
    filled: 'text--primary-alt',
  },
} as const;
