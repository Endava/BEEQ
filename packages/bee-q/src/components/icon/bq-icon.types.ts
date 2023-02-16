export const ICON_WEIGHT = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'] as const;
export type TIconWeight = (typeof ICON_WEIGHT)[number];
