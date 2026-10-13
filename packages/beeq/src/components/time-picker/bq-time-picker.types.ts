export {
  FLOATING_PLACEMENT,
  FLOATING_STRATEGY,
  type TFloatingPlacement,
  type TFloatingStrategy,
} from '../date-picker/bq-date-picker.types';

/**
 * The smallest unit edited and submitted by the time picker.
 * - `hour`   → `HH:00`
 * - `minute` → `HH:mm` (default)
 * - `second` → `HH:mm:ss`
 */
export const TIME_PRECISION = ['hour', 'minute', 'second'] as const;
/** The smallest unit edited and submitted by the time picker. */
export type TTimePrecision = (typeof TIME_PRECISION)[number];

/** Hour format override. When unset, the locale decides. */
export const HOUR_FORMAT = ['12', '24'] as const;
/** Hour format override. When unset, the locale decides. */
export type THourFormat = (typeof HOUR_FORMAT)[number];

/** Editable time fields, in canonical order. */
export type TTimeField = 'hour' | 'minute' | 'second' | 'dayPeriod';

/** Canonical day period used for the 12-hour clock. */
export type TDayPeriod = 'am' | 'pm';

/** A complete time on the 24-hour clock. */
export type TTime = {
  hour: number;
  minute: number;
  second: number;
};

/**
 * A time expressed in display terms, where any field may still be missing.
 * In 12-hour mode `hour` is the display hour (1–12) and `dayPeriod` tells AM from PM.
 */
export type TPartialTime = {
  hour?: number;
  minute?: number;
  second?: number;
  dayPeriod?: TDayPeriod;
};

/** One option rendered in a panel column. */
export type TTimeOption = {
  value: number | TDayPeriod;
  label: string;
  disabled: boolean;
  selected: boolean;
};
