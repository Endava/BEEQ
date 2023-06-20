export const SIDE_MENU_APPEARANCE = ['brand', 'inverse', 'light'] as const;
export type TSideMenuAppearance = (typeof SIDE_MENU_APPEARANCE)[number];
