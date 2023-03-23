export const MENU_THEME = ['light', 'dark'] as const;
export type TMenuTheme = (typeof MENU_THEME)[number];
