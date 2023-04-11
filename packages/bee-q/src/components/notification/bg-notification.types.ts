export const NOTIFICATION_TYPE = ['default', 'info', 'success', 'warning', 'error'] as const;
export type TNotificationType = (typeof NOTIFICATION_TYPE)[number];
