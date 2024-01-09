export const TAG_SIZE = ['xsmall', 'small', 'medium'] as const;
export type TTagSize = (typeof TAG_SIZE)[number];

export const TAG_COLOR = ['error', 'gray', 'info', 'success', 'warning'] as const;
export type TTagColor = (typeof TAG_COLOR)[number];

export const TAG_VARIANT = ['outline', 'filled'] as const;
export type TTagVariant = (typeof TAG_VARIANT)[number];

export const TAG_BORDER_RADIUS = ['none', 'xs2', 'xs', 's', 'm', 'l', 'full'] as const;
export type TTagBorderRadius = (typeof TAG_BORDER_RADIUS)[number];
