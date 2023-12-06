export const EMPTY_STATE_SIZE = ['small', 'medium', 'large'] as const;
export type TEmptyStateSize = (typeof EMPTY_STATE_SIZE)[number];

export const SIZE_TO_VALUE_MAP: Record<TEmptyStateSize, number> = {
  small: 40,
  medium: 80,
  large: 180,
};
