export const DIALOG_SIZE = ['small', 'medium', 'large'] as const;
export type TDialogSize = (typeof DIALOG_SIZE)[number];
