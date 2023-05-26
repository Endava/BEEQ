export const SIDE_MENU_THEME = ['light', 'brand', 'inverse'] as const;
export type TSideMenuTheme = (typeof SIDE_MENU_THEME)[number];

export const SIDE_MENU_SIZE = ['small', 'medium'] as const;
export type TSideMenuSize = (typeof SIDE_MENU_SIZE)[number];
