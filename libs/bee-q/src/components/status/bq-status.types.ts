export const STATUS_TYPE = ['success', 'info', 'danger', 'neutral', 'guide', 'alert'] as const;
export type TStatusType = typeof STATUS_TYPE[number];
