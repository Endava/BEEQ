export const CARD_TYPE = ['default', 'minimal'] as const;
export type TCardType = (typeof CARD_TYPE)[number];

export const CARD_BORDER_RADIUS = ['none', 'xs2', 'xs', 's', 'm', 'l', 'full'] as const;
export type TCardBorderRadius = (typeof CARD_BORDER_RADIUS)[number];
