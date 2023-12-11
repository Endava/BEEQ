export const TAG_SIZE = ['extra_small', 'small', 'medium'] as const;
export type TTagSize = (typeof TAG_SIZE)[number];

export const TAG_TYPE = ['default', 'success', 'warning', 'error', 'info'] as const;
export type TTagType = (typeof TAG_TYPE)[number];

export const TAG_VARIANT = ['default', 'filled'];
export type TTagVariant = (typeof TAG_VARIANT)[number];

export const SIZE_TO_VALUE_MAP: Record<TTagSize, number> = {
  extra_small: 20,
  small: 20,
  medium: 24,
};
