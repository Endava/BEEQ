export const DIALOG_SIZE = ['small', 'medium', 'large'] as const;
export type TDialogSize = (typeof DIALOG_SIZE)[number];

export const DIALOG_FOOTER_VARIANT = ['standard', 'light'] as const;
export type TDialogFooterVariant = (typeof DIALOG_FOOTER_VARIANT)[number];
