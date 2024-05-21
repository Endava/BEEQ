export type DaysOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DATE_PICKER_TYPE = ['single', 'multi', 'range'] as const;
export type TDatePickerType = (typeof DATE_PICKER_TYPE)[number];
