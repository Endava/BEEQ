export const MENU_THEME = ['light', 'brand', 'inverse'] as const;
export type TMenuTheme = (typeof MENU_THEME)[number];

export const MENU_SIZE = ['small', 'medium'] as const;
export type TMenuSize = (typeof MENU_SIZE)[number];
