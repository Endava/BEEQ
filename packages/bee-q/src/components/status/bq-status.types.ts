export const STATUS_TYPE = ['alert', 'danger', 'info', 'neutral', 'success'] as const;
export type TStatusType = (typeof STATUS_TYPE)[number];
