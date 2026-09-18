import { ISO_DATE_LOCALE } from '../../../shared/utils/date';
import { DECADE_GRID_SIZE } from './constants';

/* -------------------------------------------------------------------------- */
/*                                Date parsing                                */
/* -------------------------------------------------------------------------- */

/**
 * Parse an ISO 8601 date string (`YYYY-MM-DD`) into a local-time `Date`.
 * Returns `null` when the string is missing or invalid.
 *
 * @param iso ISO date string to parse.
 * @returns A local-time date, or `null` for missing or invalid input.
 */
export const parseISO = (iso: string | undefined | null): Date | null => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
};

/**
 * Convert a `Date` to `YYYY-MM-DD` in local time.
 *
 * @param date Date to serialize.
 * @returns The local calendar date as an ISO-formatted string.
 */
export const toISO = (date: Date): string => date.toLocaleDateString(ISO_DATE_LOCALE);

/**
 * Extract the calendar year and 0-based month from an ISO date string.
 * Returns `null` for missing or malformed input — safer than `Number(iso.slice(...))`
 * which silently produces `NaN` for invalid bounds.
 *
 * @param iso ISO date string to inspect.
 * @returns The local calendar year and zero-based month, or `null` for invalid input.
 */
export const getISOYearMonth = (iso: string | undefined | null): { year: number; month: number } | null => {
  const parsed = parseISO(iso);
  if (!parsed) return null;
  return { year: parsed.getFullYear(), month: parsed.getMonth() };
};

/**
 * Whether the ISO string is a valid `YYYY-MM-DD` date (round-trips through
 * `parseISO`). Convenience predicate for input filtering.
 *
 * @param iso ISO date string to validate.
 * @returns `true` when the input is a real ISO calendar date.
 */
export const isValidISO = (iso: string | undefined | null): boolean => parseISO(iso) !== null;

/* -------------------------------------------------------------------------- */
/*                                Date builders                               */
/* -------------------------------------------------------------------------- */

/**
 * Creates a local date at the start of the supplied calendar day.
 *
 * @param date Source date.
 * @returns A new date at local midnight on the same day.
 */
export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Creates a local date at the start of the supplied calendar month.
 *
 * @param date Source date.
 * @returns A new date on the first day of the same month.
 */
export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

/**
 * Creates a local date on the last day of the supplied calendar month.
 *
 * @param date Source date.
 * @returns A new date on the month's final day.
 */
export const endOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0);

/**
 * Adds calendar days without mutating the source date.
 *
 * @param date Source date.
 * @param amount Number of days to add; negative values subtract days.
 * @returns A new date offset by the requested number of days.
 */
export const addDays = (date: Date, amount: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

/**
 * Adds calendar months without mutating the source date.
 *
 * Clamps the day to the last valid day in the destination month.
 *
 * @param date Source date.
 * @param amount Number of months to add; negative values subtract months.
 * @returns A new date in the destination month.
 */
export const addMonths = (date: Date, amount: number): Date => {
  const next = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  // Preserve the day when possible.
  const day = Math.min(date.getDate(), endOfMonth(next).getDate());
  next.setDate(day);
  return next;
};

/**
 * Adds calendar years without mutating the source date.
 *
 * @param date Source date.
 * @param amount Number of years to add; negative values subtract years.
 * @returns A new date offset by the requested number of years.
 */
export const addYears = (date: Date, amount: number): Date => {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + amount);
  return next;
};

/* -------------------------------------------------------------------------- */
/*                                Comparators                                 */
/* -------------------------------------------------------------------------- */

/**
 * Checks whether two dates represent the same local calendar day.
 *
 * @param a First date to compare.
 * @param b Second date to compare.
 * @returns `true` when both dates are present and have equal year, month, and day.
 */
export const isSameDay = (a: Date | null, b: Date | null): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * Checks whether two dates represent the same local calendar month.
 *
 * @param a First date to compare.
 * @param b Second date to compare.
 * @returns `true` when both dates are present and have equal year and month.
 */
export const isSameMonth = (a: Date | null, b: Date | null): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/**
 * Checks whether two dates represent the same local calendar year.
 *
 * @param a First date to compare.
 * @param b Second date to compare.
 * @returns `true` when both dates are present and have equal years.
 */
export const isSameYear = (a: Date | null, b: Date | null): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear();

/**
 * Compares two full ISO date strings lexicographically.
 *
 * @param a First ISO date.
 * @param b Second ISO date.
 * @returns A negative number when `a` precedes `b`, zero when equal, otherwise a positive number.
 */
export const compareISO = (a: string, b: string): number => {
  if (a === b) return 0;
  return a < b ? -1 : 1;
};

/* -------------------------------------------------------------------------- */
/*                                Month matrix                                */
/* -------------------------------------------------------------------------- */

export type TCalendarCell = {
  /** The day's `Date`. */
  date: Date;
  /** `YYYY-MM-DD` representation. */
  iso: string;
  /** `true` when the cell belongs to a month other than the current view. */
  outside: boolean;
};

/**
 * Build a 6x7 matrix for the given month starting on `firstDayOfWeek`.
 * The matrix always has 42 cells so the calendar keeps a stable height.
 *
 * @param anchor         Any date within the target month.
 * @param firstDayOfWeek 0 = Sunday, 1 = Monday, ...
 * @returns A six-row calendar matrix containing 42 date cells.
 */
export const buildMonthMatrix = (anchor: Date, firstDayOfWeek: number): TCalendarCell[][] => {
  const start = startOfMonth(anchor);
  const offset = (start.getDay() - firstDayOfWeek + 7) % 7;
  const gridStart = addDays(start, -offset);

  const cells: TCalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    cells.push({
      date,
      iso: toISO(date),
      outside: date.getMonth() !== anchor.getMonth(),
    });
  }

  const rows: TCalendarCell[][] = [];
  for (let r = 0; r < 6; r++) rows.push(cells.slice(r * 7, r * 7 + 7));
  return rows;
};

/* -------------------------------------------------------------------------- */
/*                                Decade grid                                 */
/* -------------------------------------------------------------------------- */

/**
 * Given any year, return the anchor year of the decade grid.
 *
 * The reference image shows a grid like `2016 – 2027` containing the current
 * year (`2026`). We anchor the grid so the "round" decade start (e.g. 2020,
 * 2010, ...) appears at index 1 - i.e. one extra year before the decade and
 * one extra year after, filling the 3x4 grid cleanly.
 *
 * @param year Year contained by the requested grid.
 * @returns The first year displayed by that grid.
 */
export const getDecadeStart = (year: number): number => Math.floor(year / 10) * 10 - 1;

/**
 * Build the 12-year decade grid for the year that contains `anchor`.
 * Returns `{ start, end, years }` where `years.length === DECADE_GRID_SIZE`.
 *
 * @param anchor Date whose year determines the grid.
 * @returns The inclusive bounds and list of years in the decade grid.
 */
export const buildDecade = (anchor: Date): { start: number; end: number; years: number[] } => {
  const start = getDecadeStart(anchor.getFullYear());
  const end = start + DECADE_GRID_SIZE - 1;
  const years = Array.from({ length: DECADE_GRID_SIZE }, (_, i) => start + i);
  return { start, end, years };
};

/* -------------------------------------------------------------------------- */
/*                                Range helpers                               */
/* -------------------------------------------------------------------------- */

import { padBound } from './bounds';

/**
 * Clamp a `Date` between an optional min and max. Bounds may be at any
 * ISO precision (`YYYY`, `YYYY-MM`, `YYYY-MM-DD`) and are padded to the
 * widest matching day before comparing (`min` → first day, `max` → last day).
 *
 * @param date Date to clamp.
 * @param minISO Optional inclusive lower ISO bound.
 * @param maxISO Optional inclusive upper ISO bound.
 * @returns The original date or the nearest bound date.
 */
export const clampDate = (date: Date, minISO?: string, maxISO?: string): Date => {
  const min = parseISO(padBound(minISO, 'min'));
  const max = parseISO(padBound(maxISO, 'max'));
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
};

/**
 * Checks whether a date is within optional inclusive ISO bounds.
 *
 * @param date Date to evaluate.
 * @param minISO Optional inclusive lower ISO bound.
 * @param maxISO Optional inclusive upper ISO bound.
 * @returns `true` when the date is within both bounds.
 */
export const isWithinBounds = (date: Date, minISO?: string, maxISO?: string): boolean => {
  const iso = toISO(date);
  const minPadded = padBound(minISO, 'min');
  const maxPadded = padBound(maxISO, 'max');
  if (minPadded && iso < minPadded) return false;
  if (maxPadded && iso > maxPadded) return false;
  return true;
};

/**
 * Sorts two ISO date strings into ascending order.
 *
 * @param a First ISO date.
 * @param b Second ISO date.
 * @returns The dates as `[start, end]`.
 */
export const sortRange = (a: string, b: string): [string, string] => (a <= b ? [a, b] : [b, a]);
