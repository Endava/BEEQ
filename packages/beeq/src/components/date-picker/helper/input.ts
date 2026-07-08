import { parseDateInput, toISODateString } from '../../../shared/utils/date/dateParsing';
import type { TDatePrecision } from '../bq-date-picker.types';

import { padBound } from './bounds';
import { serializeValue } from './selection';

/**
 * Result of parsing user-typed input.
 * - `value` is set when parsing succeeded — always at the configured precision.
 * - `invalid: true` when the string could not be parsed or `isDateDisallowed`
 *   rejected the result.
 */
export type TParsedInput = {
  value?: string;
  invalid?: boolean;
};

/**
 * Precision-aware, bounds-aware parser for the trigger input field.
 * Returns the parsed date as a wire-format string at the configured
 * precision, clamped against `min`/`max`, or `{ invalid: true }` on failure.
 */
export const parseTypedInput = (
  text: string,
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  min?: string,
  max?: string,
  isDateDisallowed?: (date: Date) => boolean,
): TParsedInput => {
  const trimmed = text.trim();
  if (!trimmed) return { value: undefined };

  const parsed = parseDateInput(trimmed, locale);
  if (!parsed || isDateDisallowed?.(parsed)) return { invalid: true };

  const iso = clampISO(toISODateString(parsed), min, max);
  return { value: serializeValue([iso], 'single', precision) };
};

/**
 * Lexically clamp a full `YYYY-MM-DD` ISO date to precision-padded bounds.
 * Coarser bounds (`YYYY`, `YYYY-MM`) are padded to the widest matching day
 * before comparing.
 */
export const clampISO = (iso: string, min?: string, max?: string): string => {
  const paddedMin = padBound(min, 'min');
  const paddedMax = padBound(max, 'max');
  if (paddedMin && iso < paddedMin) return paddedMin;
  if (paddedMax && iso > paddedMax) return paddedMax;
  return iso;
};
