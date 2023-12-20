export const TAG_SIZE = ['xsmall', 'small', 'medium'] as const;
export type TTagSize = (typeof TAG_SIZE)[number];

export const TAG_COLOR = ['error', 'gray', 'info', 'success', 'warning'] as const;
export type TTagColor = (typeof TAG_COLOR)[number];

export const TAG_VARIANT = ['outline', 'filled'] as const;
export type TTagVariant = (typeof TAG_VARIANT)[number];
