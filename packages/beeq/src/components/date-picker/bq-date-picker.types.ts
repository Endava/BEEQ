export type DaysOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DATE_PICKER_TYPE = ['single', 'multi', 'range'] as const;
export type TDatePickerType = (typeof DATE_PICKER_TYPE)[number];

export type TCalendarDate = {
  focusedDate: string;
  value: string;
  min?: string;
  max?: string;
  months?: number;
  tentative?: string;
  pageBy?: 'single' | 'months';
  firstDayOfWeek?: number;
  showOutsideDays?: boolean;
  isDateDisallowed?: (date: Date) => boolean;
  locale?: string;
  onChange?: (ev: Event) => void;
  onRangestart?: (ev: CustomEvent) => void;
  onRangeend?: (ev: CustomEvent) => void;
};
