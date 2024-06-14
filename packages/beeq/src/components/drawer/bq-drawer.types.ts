export const DRAWER_POSITIONS = ['start', 'end'] as const;
export type TDrawerPosition = (typeof DRAWER_POSITIONS)[number];
// !⚠️ Note: `placement` is deprecated and it will be removed in the future
export const DRAWER_PLACEMENT = ['left', 'right'] as const;
export type TDrawerPlacement = (typeof DRAWER_PLACEMENT)[number];
