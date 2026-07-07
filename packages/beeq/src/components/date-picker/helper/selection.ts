import type { TDatePickerType, TDatePrecision, TSelection } from '../bq-date-picker.types';
import { compareISO, isValidISO, sortRange } from './calendar';

/* -------------------------------------------------------------------------- */
/*                          Wire format parse/serialize                       */
/* -------------------------------------------------------------------------- */

/**
 * Regex matching the wire-format ISO shape for each precision.
 * The internal selection is always `YYYY-MM-DD`; these only apply at the
 * public value boundary.
 */
const PRECISION_ISO_REGEX: Record<TDatePrecision, RegExp> = {
  day: /^\d{4}-\d{2}-\d{2}$/,
  month: /^\d{4}-\d{2}$/,
  year: /^\d{4}$/,
};

/** Expand a wire-format token to a full `YYYY-MM-DD` ISO date. */
const expandToken = (token: string, precision: TDatePrecision): string => {
  if (precision === 'month') return `${token}-01`;
  if (precision === 'year') return `${token}-01-01`;
  return token;
};

/** Truncate a full `YYYY-MM-DD` ISO date to the wire-format for the precision. */
const truncateISO = (iso: string, precision: TDatePrecision): string => {
  if (precision === 'month') return iso.slice(0, 7);
  if (precision === 'year') return iso.slice(0, 4);
  return iso;
};

/**
 * Whether the token matches the precision-specific shape *and* is a real date.
 * For month/year we still expand to a full ISO date so `2026-13` / `2026-02-30`
 * style errors are caught by `isValidISO`.
 */
const isValidToken = (token: string, precision: TDatePrecision): boolean => {
  if (!PRECISION_ISO_REGEX[precision].test(token)) return false;
  return isValidISO(expandToken(token, precision));
};

/**
 * Parse a raw `value` string into an internal `TSelection` array.
 *
 * Wire format (compatible with the v1 Cally-based picker):
 * - single: `YYYY-MM-DD` (or `YYYY-MM` / `YYYY` at coarser precision)
 * - multi:  space-separated tokens
 * - range:  `<start>/<end>`
 *
 * Internally the selection is always stored as full `YYYY-MM-DD` — month
 * precision expands to the first day of the month; year precision to Jan 1st.
 *
 * Invalid tokens (malformed strings, impossible dates like `2026-99-99`,
 * non-ISO input) are silently discarded — the returned selection is
 * guaranteed to contain only valid ISO-8601 dates.
 */
export const parseValue = (
  value: string | undefined | null,
  type: TDatePickerType,
  precision: TDatePrecision = 'day',
): TSelection => {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (type === 'range') {
    const parts = trimmed
      .split('/')
      .filter((token) => isValidToken(token, precision))
      .map((token) => expandToken(token, precision));
    if (parts.length === 0) return [];
    if (parts.length === 1) return [parts[0]];
    const [start, end] = sortRange(parts[0], parts[1]);
    return [start, end];
  }

  if (type === 'multi') {
    const valid = trimmed
      .split(/\s+/)
      .filter((token) => isValidToken(token, precision))
      .map((token) => expandToken(token, precision));
    return Array.from(new Set(valid)).sort(compareISO);
  }

  return isValidToken(trimmed, precision) ? [expandToken(trimmed, precision)] : [];
};

/**
 * Serialize an internal `TSelection` array back to the wire format.
 * Truncates each entry to the precision's ISO shape.
 */
export const serializeValue = (
  selection: TSelection,
  type: TDatePickerType,
  precision: TDatePrecision = 'day',
): string => {
  if (!selection.length) return '';
  const format = (iso: string) => truncateISO(iso, precision);

  if (type === 'range') {
    if (selection.length < 2) return format(selection[0] ?? '');
    const [start, end] = sortRange(selection[0], selection[1]);
    return `${format(start)}/${format(end)}`;
  }

  if (type === 'multi') {
    return Array.from(new Set(selection.map(format)))
      .sort(compareISO)
      .join(' ');
  }

  return format(selection[0]);
};

/* -------------------------------------------------------------------------- */
/*                                Predicates                                  */
/* -------------------------------------------------------------------------- */

/** Whether the given ISO day is included in the selection. */
export const isSelected = (iso: string, selection: TSelection, type: TDatePickerType): boolean => {
  if (!selection.length) return false;
  if (type === 'range') {
    if (selection.length < 2) return iso === selection[0];
    const [start, end] = selection;
    return iso >= start && iso <= end;
  }
  return selection.includes(iso);
};

/** Whether the ISO day is the start of a range selection. */
export const isRangeStart = (iso: string, selection: TSelection, type: TDatePickerType): boolean =>
  type === 'range' && selection.length === 2 && iso === selection[0];

/** Whether the ISO day is the end of a range selection. */
export const isRangeEnd = (iso: string, selection: TSelection, type: TDatePickerType): boolean =>
  type === 'range' && selection.length === 2 && iso === selection[1];

/** Whether the ISO day sits strictly inside the range (not start/end). */
export const isRangeInner = (iso: string, selection: TSelection, type: TDatePickerType): boolean => {
  if (type !== 'range' || selection.length < 2) return false;
  const [start, end] = selection;
  return iso > start && iso < end;
};

/* -------------------------------------------------------------------------- */
/*                               Selection ops                                */
/* -------------------------------------------------------------------------- */

/**
 * Apply a click on `iso` and return the next selection.
 *
 * - single: always replace.
 * - multi:  toggle (add if missing, remove if present).
 * - range:  if there is no start OR a full range exists, start a new range;
 *           otherwise complete the range (auto-sorted).
 */
export const applySelection = (iso: string, selection: TSelection, type: TDatePickerType): TSelection => {
  if (type === 'single') return [iso];

  if (type === 'multi') {
    return selection.includes(iso) ? selection.filter((v) => v !== iso) : [...selection, iso].sort(compareISO);
  }

  // range
  if (selection.length === 0 || selection.length === 2) return [iso];
  const [start, end] = sortRange(selection[0], iso);
  return [start, end];
};

/**
 * Build the highlighted range while the user is hovering with an in-progress
 * range selection (`tentative` = the pending start).
 */
export const buildTentativeRange = (tentative: string | undefined, hovered: string | undefined): TSelection => {
  if (!tentative || !hovered) return [];
  const [start, end] = sortRange(tentative, hovered);
  return [start, end];
};
