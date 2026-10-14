export {
  FLOATING_PLACEMENT,
  FLOATING_STRATEGY,
  type TFloatingPlacement,
  type TFloatingStrategy,
} from '../date-picker/bq-date-picker.types';
export { INPUT_VALIDATION, type TInputValidation } from '../input/bq-input.types';

/**
 * The smallest unit edited and submitted by the time picker.
 * - `hour`   → `HH:00`
 * - `minute` → `HH:mm` (default)
 * - `second` → `HH:mm:ss`
 */
export const TIME_PRECISION = ['hour', 'minute', 'second'] as const;
/** The smallest unit edited and submitted by the time picker. */
export type TTimePrecision = (typeof TIME_PRECISION)[number];

/** Clock used by the time picker: 12-hour with an AM/PM period, or 24-hour. */
export const HOUR_FORMAT = ['12', '24'] as const;
/** Clock used by the time picker: 12-hour with an AM/PM period, or 24-hour. */
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

/**
 * Text used by the time picker. Every key is optional:
 * - `hour`, `minute`, `second`, `am` and `pm` default to the `locale` names.
 * - `period` defaults to the `am` and `pm` labels joined by a slash (e.g. `AM/PM`).
 * - `now`, `clear`, `confirm`, `openPanel` and `panelLabel` default to English text.
 */
export type TTimePickerLabels = {
  /** Header of the hour column and accessible name of the hour segment. */
  hour?: string;
  /** Header of the minute column and accessible name of the minute segment. */
  minute?: string;
  /** Header of the second column and accessible name of the second segment. */
  second?: string;
  /** Header of the AM/PM column and accessible name of the AM/PM segment. */
  period?: string;
  /** Label of the morning period, shown in the field and the panel. */
  am?: string;
  /** Label of the afternoon period, shown in the field and the panel. */
  pm?: string;
  /** Label of the panel "Now" button. */
  now?: string;
  /** Accessible name of the clear button. */
  clear?: string;
  /** Label of the panel confirm button. */
  confirm?: string;
  /** Accessible name of the clock trigger button. */
  openPanel?: string;
  /** Accessible name of the panel. */
  panelLabel?: string;
};
