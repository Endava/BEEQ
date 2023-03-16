export const MENU_ITEM_SIZE = ['small', 'medium'] as const;
export type TMenuItemSize = (typeof MENU_ITEM_SIZE)[number];
