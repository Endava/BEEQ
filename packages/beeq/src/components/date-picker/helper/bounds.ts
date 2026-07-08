/**
 * Bounds predicates for the calendar.
 *
 * `min` and `max` may be supplied at any wire precision (`YYYY`, `YYYY-MM`,
 * or `YYYY-MM-DD`), while the internal representation of every clicked cell
 * is always a full `YYYY-MM-DD` string. These helpers normalize both sides
 * so the same predicate can be shared between the mouse (view components)
 * and keyboard (host) commit paths — centralising the check here is what
 * makes it impossible for one path to accept an out-of-bounds cell that
 * the other rejects.
 *
 * All predicates are pure: no `Date` mutation, no locale, no time zone —
 * bound strings are compared lexicographically (which is safe because ISO
 * 8601 is designed for that).
 */

/**
 * Extract the `YYYY` prefix (as a number) from a bound string.
 * Returns `null` if the string does not begin with a 4-digit year.
 */
export const boundYear = (iso: string | undefined | null): number | null => {
  if (!iso) return null;
  const match = /^(\d{4})/.exec(iso);
  return match ? Number(match[1]) : null;
};

/**
 * Extract `{ year, month }` (month is 0-based) from a bound string. Falls
 * back to `null` when the string doesn't contain a `YYYY-MM` prefix.
 */
export const boundYearMonth = (iso: string | undefined | null): { year: number; month: number } | null => {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})/.exec(iso);
  if (!match) return null;
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) return null;
  return { year: Number(match[1]), month };
};

/**
 * Whether a given year is within the (inclusive) `min`/`max` range.
 * A year cell is considered in-range when any day inside that year is
 * still selectable — i.e. we compare on the year prefix only, ignoring
 * the month/day components of `min` / `max`.
 */
export const isYearWithinBounds = (year: number, min?: string | null, max?: string | null): boolean => {
  const minYear = boundYear(min);
  const maxYear = boundYear(max);
  if (minYear !== null && year < minYear) return false;
  if (maxYear !== null && year > maxYear) return false;
  return true;
};

/**
 * Whether a `(year, month)` pair sits at-or-after the given lower bound.
 * A `null`/`undefined` bound is treated as "no lower bound".
 */
const monthAtOrAfter = (year: number, month: number, bound: string | undefined | null): boolean => {
  const ym = boundYearMonth(bound);
  if (ym) return year > ym.year || (year === ym.year && month >= ym.month);
  const y = boundYear(bound);
  return y === null || year >= y;
};

/** Whether a `(year, month)` pair sits at-or-before the given upper bound. */
const monthAtOrBefore = (year: number, month: number, bound: string | undefined | null): boolean => {
  const ym = boundYearMonth(bound);
  if (ym) return year < ym.year || (year === ym.year && month <= ym.month);
  const y = boundYear(bound);
  return y === null || year <= y;
};

/**
 * Whether a given `(year, month)` pair is within the (inclusive) `min`/`max`
 * range. A month cell is considered in-range when any day inside that month
 * would still satisfy the bounds — we compare on the year-month prefix and
 * ignore the day component of `min` / `max`.
 */
export const isMonthWithinBounds = (year: number, month: number, min?: string | null, max?: string | null): boolean =>
  monthAtOrAfter(year, month, min) && monthAtOrBefore(year, month, max);

/**
 * Whether a full `YYYY-MM-DD` iso date is within the (inclusive) `min`/`max`
 * range. Bounds may be at any precision — we pad `min` to the earliest day
 * (`YYYY-01-01`) and `max` to the latest day (`YYYY-12-31`) before doing a
 * lexical compare (safe because ISO 8601 sorts by calendar order).
 */
export const isDateWithinBounds = (iso: string, min?: string | null, max?: string | null): boolean => {
  if (!iso) return false;
  const paddedMin = padBound(min, 'min');
  const paddedMax = padBound(max, 'max');
  if (paddedMin !== null && iso < paddedMin) return false;
  if (paddedMax !== null && iso > paddedMax) return false;
  return true;
};

/**
 * Pad a bound string up to full `YYYY-MM-DD` length so it can be lexically
 * compared with a full ISO date. `min` widens down (missing pieces become
 * `-01`), `max` widens up (missing month → `-12`, missing day → last day of
 * that month, honoring leap years).
 */
export const padBound = (iso: string | undefined | null, kind: 'min' | 'max'): string | null => {
  if (!iso) return null;
  const yearMatch = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(iso);
  if (!yearMatch) return null;
  const year = yearMatch[1];
  const month = yearMatch[2] ?? (kind === 'min' ? '01' : '12');
  const day =
    yearMatch[3] ??
    (kind === 'min' ? '01' : String(new Date(Number(year), Number(month), 0).getDate()).padStart(2, '0'));
  return `${year}-${month}-${day}`;
};
