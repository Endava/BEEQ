export const ALERT_TYPE = ['info', 'success', 'warning', 'error', 'custom'] as const;
export type TAlertType = (typeof ALERT_TYPE)[number];
