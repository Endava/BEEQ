export const NOTIFICATION_TYPE = ['error', 'info', 'neutral', 'success', 'warning'] as const;
export type TNotificationType = (typeof NOTIFICATION_TYPE)[number];
