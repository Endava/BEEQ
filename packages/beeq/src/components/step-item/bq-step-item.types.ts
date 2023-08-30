export const STEP_ITEM_STATUS = ['default', 'current', 'completed', 'error', 'disabled'] as const;
export type TStepItemStatus = (typeof STEP_ITEM_STATUS)[number];
