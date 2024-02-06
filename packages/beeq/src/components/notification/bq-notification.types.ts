export const NOTIFICATION_TYPE = ['error', 'info', 'neutral', 'success', 'warning'] as const;
export type TNotificationType = (typeof NOTIFICATION_TYPE)[number];

export const NOTIFICATION_BORDER_RADIUS = ['none', 'xs2', 'xs', 's', 'm', 'l', 'full'] as const;
export type TNotificationBorderRadius = (typeof NOTIFICATION_BORDER_RADIUS)[number];
