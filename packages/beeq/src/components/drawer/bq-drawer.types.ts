export const DRAWER_PLACEMENT = ['left', 'right'] as const;
export type TDrawerPlacement = (typeof DRAWER_PLACEMENT)[number];
