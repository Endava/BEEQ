export const CARD_TYPE = ['default', 'minimal'] as const;
export type TCardType = (typeof CARD_TYPE)[number];
