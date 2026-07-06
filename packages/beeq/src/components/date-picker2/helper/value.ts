import { formatDisplayValue, isDefined } from '../../../shared/utils';
import type { TDatePickerType } from '../bq-date-picker2.types';
import { parseValue, serializeValue } from './selection';

/**
 * Normalizes a raw public `value` string against the current picker `type`.
 *
 * Runs the value through `parseValue`/`serializeValue` so any invalid ISO
 * tokens are dropped before the value ever reaches the form, the display
 * input, or the visible selection. Returns `undefined` when normalization
 * leaves an empty string, so callers can distinguish "no value" from "empty
 * string value".
 */
export const normalizeValue = (raw: string | undefined, type: TDatePickerType): string | undefined => {
  const serialized = serializeValue(parseValue(raw, type), type);
  return serialized === '' ? undefined : serialized;
};

/** Whether a value string is present and non-empty — used to drive UI affordances. */
export const computeHasValue = (value: string | undefined): boolean => isDefined(value) && `${value}`.length > 0;

/**
 * Formats the current value for display in the trigger input. Thin wrapper
 * around `formatDisplayValue` that accepts `undefined` and coerces to an
 * empty string, so callers don't have to repeat the null check.
 */
export const computeDisplayDate = (
  value: string | undefined,
  type: TDatePickerType,
  locale: Intl.LocalesArgument,
  formatOptions: Intl.DateTimeFormatOptions,
): string | undefined => formatDisplayValue(value ?? '', type, locale, formatOptions);
