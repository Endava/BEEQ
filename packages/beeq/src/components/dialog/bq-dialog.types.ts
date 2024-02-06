export const DIALOG_SIZE = ['small', 'medium', 'large'] as const;
export type TDialogSize = (typeof DIALOG_SIZE)[number];

export const DIALOG_FOOTER_APPEARANCE = ['standard', 'highlight'] as const;
export type TDialogFooterAppearance = (typeof DIALOG_FOOTER_APPEARANCE)[number];

export const DIALOG_BORDER_RADIUS = ['none', 'xs2', 'xs', 's', 'm', 'l', 'full'] as const;
export type TDialogBorderRadius = (typeof DIALOG_BORDER_RADIUS)[number];
