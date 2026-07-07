import { formatDisplayValue, isDefined } from '../../../shared/utils';
import type { TDatePickerType, TDatePrecision } from '../bq-date-picker2.types';
import { parseValue, serializeValue } from './selection';

/**
 * Normalizes a raw public `value` string against the current picker `type`
 * and `precision`.
 *
 * Runs the value through `parseValue`/`serializeValue` so any invalid ISO
 * tokens are dropped before the value ever reaches the form, the display
 * input, or the visible selection. Returns `undefined` when normalization
 * leaves an empty string, so callers can distinguish "no value" from "empty
 * string value".
 */
export const normalizeValue = (
  raw: string | undefined,
  type: TDatePickerType,
  precision: TDatePrecision = 'day',
): string | undefined => {
  const serialized = serializeValue(parseValue(raw, type, precision), type, precision);
  return serialized === '' ? undefined : serialized;
};

/** Whether a value string is present and non-empty — used to drive UI affordances. */
export const computeHasValue = (value: string | undefined): boolean => isDefined(value) && `${value}`.length > 0;

/**
 * Formats the current value for display in the trigger input. Thin wrapper
 * around `formatDisplayValue` that accepts `undefined` and coerces to an
 * empty string, so callers don't have to repeat the null check.
 *
 * Precision-agnostic: internally the selection is stored as full ISO dates
 * (the first day of the month / January 1st for coarser precisions), so
 * `Intl.DateTimeFormat(locale, formatOptions)` produces the right label
 * whether the user asked for `{ year: 'numeric' }` or `{ dateStyle: 'full' }`.
 */
export const computeDisplayDate = (
  value: string | undefined,
  type: TDatePickerType,
  locale: Intl.LocalesArgument,
  formatOptions: Intl.DateTimeFormatOptions,
  precision: TDatePrecision = 'day',
): string | undefined => {
  // Expand precision-truncated wire values back to full ISO so
  // `formatDisplayValue` (which expects YYYY-MM-DD) can parse them.
  const expanded = serializeValue(parseValue(value ?? '', type, precision), type, 'day');
  return formatDisplayValue(expanded, type, locale, formatOptions);
};

/**
 * Default `Intl.DateTimeFormat` options per precision.
 * Applied when the consumer hasn't explicitly overridden `formatOptions`, so
 * a `precision="month"` picker doesn't show "1 May 2026".
 */
export const DEFAULT_FORMAT_OPTIONS_BY_PRECISION: Record<TDatePrecision, Intl.DateTimeFormatOptions> = {
  day: { day: 'numeric', month: 'short', year: 'numeric' },
  month: { month: 'long', year: 'numeric' },
  year: { year: 'numeric' },
};
