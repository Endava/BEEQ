import type { TDatePickerType, TSelection } from '../bq-date-picker2.types';
import { compareISO, isValidISO, sortRange } from './calendar';

/* -------------------------------------------------------------------------- */
/*                          Wire format parse/serialize                       */
/* -------------------------------------------------------------------------- */

/**
 * Parse a raw `value` string into an internal `TSelection` array.
 *
 * Wire format (compatible with the v1 Cally-based picker):
 * - single: `YYYY-MM-DD`
 * - multi:  `YYYY-MM-DD YYYY-MM-DD ...` (space-separated)
 * - range:  `YYYY-MM-DD/YYYY-MM-DD`
 *
 * Invalid tokens (malformed strings, impossible dates like `2026-99-99`,
 * non-ISO input) are silently discarded — the returned selection is
 * guaranteed to contain only valid ISO-8601 dates.
 */
export const parseValue = (value: string | undefined | null, type: TDatePickerType): TSelection => {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];

  if (type === 'range') {
    const parts = trimmed.split('/').filter(isValidISO);
    if (parts.length === 0) return [];
    if (parts.length === 1) return [parts[0]];
    const [start, end] = sortRange(parts[0], parts[1]);
    return [start, end];
  }

  if (type === 'multi') {
    const valid = trimmed.split(/\s+/).filter(isValidISO);
    return Array.from(new Set(valid)).sort(compareISO);
  }

  return isValidISO(trimmed) ? [trimmed] : [];
};

/**
 * Serialize an internal `TSelection` array back to the wire format.
 */
export const serializeValue = (selection: TSelection, type: TDatePickerType): string => {
  if (!selection.length) return '';

  if (type === 'range') {
    if (selection.length < 2) return selection[0] ?? '';
    const [start, end] = sortRange(selection[0], selection[1]);
    return `${start}/${end}`;
  }

  if (type === 'multi') {
    return Array.from(new Set(selection)).sort(compareISO).join(' ');
  }

  return selection[0];
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
