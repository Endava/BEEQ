export const TOAST_TYPE = ['info', 'success', 'alert', 'error', 'loading', 'custom'] as const;
export type TToastType = (typeof TOAST_TYPE)[number];

export const TOAST_PLACEMENT = [
  'top-center',
  'top-right',
  'bottom-right',
  'bottom-center',
  'bottom-left',
  'top-left',
] as const;
export type TToastPlacement = (typeof TOAST_PLACEMENT)[number];

export const TOAST_BORDER_RADIUS = ['none', 'xs2', 'xs', 's', 'm', 'l', 'full'] as const;
export type TToastBorderRadius = (typeof TOAST_BORDER_RADIUS)[number];
