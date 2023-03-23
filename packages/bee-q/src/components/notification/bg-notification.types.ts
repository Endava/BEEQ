export const NOTIFICATION_TYPES = ['info', 'success', 'warning', 'error'] as const;
export type TNotificationType = (typeof NOTIFICATION_TYPES)[number];
