import { parseDateInput, toISODateString } from '../../../shared/utils/date/dateParsing';
import type { TDatePrecision } from '../bq-date-picker.types';

import { padBound } from './bounds';
import { serializeValue } from './selection';

/**
 * Result of parsing user-typed input against the current picker configuration.
 *
 * - `value` present when parsing succeeded and produced a wire value at the
 *   configured precision. May differ from the typed string (locale format
 *   normalized, out-of-range dates clamped to `min`/`max`, precision-truncated).
 * - `invalid: true` when the string could not be parsed as a date at all,
 *   or when `isDateDisallowed` explicitly rejected the parsed date. The
 *   caller should surface this as a validation error rather than commit
 *   the raw typed string (which would violate the wire contract).
 */
export type TParsedInput = {
  value?: string;
  invalid?: boolean;
};

/**
 * Precision-aware, bounds-aware parser for the trigger input field.
 *
 * `handleInputChange` used to (1) always assume `YYYY-MM-DD` semantics, and
 * (2) emit the raw typed string when parsing failed. Both violated the
 * precision contract that GPT-5.5's review flagged: `precision="month"`
 * picker committed `YYYY-MM-DD` values through this path, and a garbage
 * typed string was emitted as-is via `bqChange`.
 *
 * This helper centralises the whole path so the host stays thin and can
 * be covered by pure unit tests instead of e2e input simulation.
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

  // 1. Clamp against the effective (precision-padded) bounds — reuse the
  //    same padding logic month/year cells use so a `min="2025-06"` bound
  //    matches the day picker's understanding of "anywhere in June 2025".
  const iso = clampISO(toISODateString(parsed), min, max);

  // 2. Truncate to the wire precision through the same serializer the
  //    click path uses. Guarantees that all commit paths agree on the
  //    format of the value they publish.
  return { value: serializeValue([iso], 'single', precision) };
};

/**
 * Lexically clamp a full `YYYY-MM-DD` ISO date to precision-padded bounds.
 * When bounds are absent or already full ISO, this behaves like the shared
 * `clampDateToRange` utility. When bounds are `YYYY` / `YYYY-MM`, they are
 * padded to the widest matching day so the comparison is meaningful.
 */
export const clampISO = (iso: string, min?: string, max?: string): string => {
  const paddedMin = padBound(min, 'min');
  const paddedMax = padBound(max, 'max');
  if (paddedMin && iso < paddedMin) return paddedMin;
  if (paddedMax && iso > paddedMax) return paddedMax;
  return iso;
};
