export const ALERT_TYPE = ['info', 'success', 'warning', 'error', 'default'] as const;
export type TAlertType = (typeof ALERT_TYPE)[number];
