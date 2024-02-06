export const ALERT_TYPE = ['info', 'success', 'warning', 'error', 'default'] as const;
export type TAlertType = (typeof ALERT_TYPE)[number];

export const ALERT_BORDER_RADIUS = ['none', 'xs2', 'xs', 's', 'm', 'l', 'full'] as const;
export type TAlertBorderRadius = (typeof ALERT_BORDER_RADIUS)[number];
