export const TOAST_TYPE = ['default', 'info', 'success', 'alert', 'error', 'loading'] as const;
export type TToastType = (typeof TOAST_TYPE)[number];
