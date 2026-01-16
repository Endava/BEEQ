/** The first day of the week, where Sunday is 0, Monday is 1, etc. */
export type DaysOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** The type of the date picker */
export const DATE_PICKER_TYPE = ['single', 'multi', 'range'] as const;
/** The type of the date picker */
export type TDatePickerType = (typeof DATE_PICKER_TYPE)[number];

export type TCalendarDate = {
  /** The first day of the week */
  firstDayOfWeek?: number;
  /** The focused date */
  focusedDate: string;
  /** The locale */
  locale?: string;
  /** The maximum date */
  max?: string;
  /** The minimum date */
  min?: string;
  /** The number of months to show */
  months?: number;
  /** How to navigate through the calendar, by single month or by the number of months */
  pageBy?: 'single' | 'months';
  /** Whether to show days outside the current month */
  showOutsideDays?: boolean;
  /** The tentative selected date, e.g. the start of a date range */
  tentative?: string;
  /** The selected date, in ISO-8601 format (YYYY-MM-DD) */
  value: string;
  /**
   * Focuses the <calendar-month> containing the currently focused date.
   * `option.target` controls which part of the component gets focused.
   */
  focus: ({ target }: { target: 'previous' | 'next' | 'day' }) => void;
  /** Checks if the date is not allowed to be selected */
  isDateDisallowed?: (date: Date) => boolean;
  /** Handles the change event, when the user selects a date or a date range */
  onChange?: (ev: Event) => void;
  /** Handles the focus date event. E.g. when the user navigates back/forward in the calendar */
  onFocusDate?: (ev: CustomEvent) => void;
  /** Handles the date range start event. E.g. when the user starts selecting a date range */
  onRangestart?: (ev: CustomEvent) => void;
  /** Handles the date range end event. E.g. when the user finishes selecting a date range */
  onRangeend?: (ev: CustomEvent) => void;
};
