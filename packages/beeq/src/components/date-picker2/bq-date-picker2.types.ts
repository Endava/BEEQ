/** The first day of the week, where Sunday is 0, Monday is 1, etc. */
export type DaysOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const DAYS_OF_WEEK: readonly DaysOfWeek[] = [0, 1, 2, 3, 4, 5, 6] as const;

/** The type of the date picker */
export const DATE_PICKER_TYPE = ['single', 'multi', 'range'] as const;
/** The type of the date picker */
export type TDatePickerType = (typeof DATE_PICKER_TYPE)[number];

/** The calendar view */
export const CALENDAR_VIEW = ['days', 'months', 'years'] as const;
/** The calendar view */
export type TCalendarView = (typeof CALENDAR_VIEW)[number];

/** Positioning strategy for the panel. */
export const FLOATING_STRATEGY = ['fixed', 'absolute'] as const;
export type TFloatingStrategy = (typeof FLOATING_STRATEGY)[number];

/** Placement of the panel — mirrors `@floating-ui/dom` placements. */
export const FLOATING_PLACEMENT = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
] as const;
export type TFloatingPlacement = (typeof FLOATING_PLACEMENT)[number];

/** How the next/previous buttons should step through months. */
export const MONTHS_PER_VIEW = ['single', 'months'] as const;
export type TMonthsPerView = (typeof MONTHS_PER_VIEW)[number];

/**
 * Internal representation of a selection.
 * Always an array of ISO 8601 date strings (YYYY-MM-DD).
 * - single → 0 or 1 entry
 * - multi  → N entries
 * - range  → 0 or 2 entries [startISO, endISO]
 */
export type TSelection = string[];
