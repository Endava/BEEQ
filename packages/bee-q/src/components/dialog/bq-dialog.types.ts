export const DIALOG_SIZE = ['small', 'medium', 'large'] as const;
export type TDialogSize = (typeof DIALOG_SIZE)[number];

export const DIALOG_FOOTER_APPEARANCE = ['standard', 'highlight'] as const;
export type TDialogFooterAppearance = (typeof DIALOG_FOOTER_APPEARANCE)[number];
