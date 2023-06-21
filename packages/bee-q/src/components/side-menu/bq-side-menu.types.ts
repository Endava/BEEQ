export const SIDE_MENU_APPEARANCE = ['brand', 'inverse', 'default'] as const;
export type TSideMenuAppearance = (typeof SIDE_MENU_APPEARANCE)[number];

export const SIDE_MENU_SIZE = ['medium', 'small'] as const;
export type TSideMenuSize = (typeof SIDE_MENU_SIZE)[number];
