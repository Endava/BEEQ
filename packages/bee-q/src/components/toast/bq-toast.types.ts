export const TOAST_TYPE = ['info', 'success', 'alert', 'error', 'loading', 'custom'] as const;
export type TToastType = (typeof TOAST_TYPE)[number];
