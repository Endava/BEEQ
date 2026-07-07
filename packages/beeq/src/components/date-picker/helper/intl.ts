/**
 * Cached `Intl.DateTimeFormat` factories.
 *
 * The Intl API is powerful but relatively expensive to instantiate. Since the
 * calendar re-renders on every user interaction we keep a small LRU-ish cache
 * keyed by locale + option shape.
 */

const cache = new Map<string, Intl.DateTimeFormat>();

/** Prevents unbounded growth in long-running apps. */
const CACHE_MAX_SIZE = 64;

const cacheKey = (locale: Intl.LocalesArgument, options: Intl.DateTimeFormatOptions): string => {
  const localeKey = typeof locale === 'string' ? locale : JSON.stringify(locale ?? '');
  return `${localeKey}|${JSON.stringify(options)}`;
};

const getFormatter = (locale: Intl.LocalesArgument, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
  const key = cacheKey(locale, options);
  let formatter = cache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    cache.set(key, formatter);
    if (cache.size > CACHE_MAX_SIZE) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) cache.delete(firstKey);
    }
  }
  return formatter;
};

/**
 * Format a full date, e.g. "1 January 2026".
 */
export const formatDate = (
  date: Date,
  locale: Intl.LocalesArgument,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' },
): string => getFormatter(locale, options).format(date);

/**
 * Format a month, e.g. "January 2026" or "Jan".
 */
export const formatMonth = (
  date: Date,
  locale: Intl.LocalesArgument,
  monthStyle: 'long' | 'short' | 'narrow' = 'long',
  includeYear = true,
): string =>
  getFormatter(locale, {
    month: monthStyle,
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(date);

/**
 * Format a year, e.g. "2026".
 */
export const formatYear = (date: Date, locale: Intl.LocalesArgument): string =>
  getFormatter(locale, { year: 'numeric' }).format(date);

/**
 * Returns the weekday names for the given locale ordered from `firstDayOfWeek`.
 *
 * @param locale        The locale used for formatting.
 * @param firstDayOfWeek The first day of the week (0 = Sunday, 1 = Monday, ...).
 * @param style         Weekday style (long, short, narrow).
 * @returns             An array of `{short, long}` names in display order.
 */
export const getWeekdayNames = (
  locale: Intl.LocalesArgument,
  firstDayOfWeek: number,
  style: 'long' | 'short' | 'narrow' = 'short',
): Array<{ short: string; long: string }> => {
  const shortFormatter = getFormatter(locale, { weekday: style });
  const longFormatter = getFormatter(locale, { weekday: 'long' });
  // Any known Sunday works as the anchor date. 2024-01-07 is a Sunday.
  const anchor = new Date(2024, 0, 7);

  return Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (firstDayOfWeek + i) % 7;
    const day = new Date(anchor);
    day.setDate(anchor.getDate() + dayIndex);
    return { short: shortFormatter.format(day), long: longFormatter.format(day) };
  });
};

/**
 * Returns the localized month names.
 *
 * @param locale The locale used for formatting.
 * @param style  Month style (long, short, narrow).
 */
export const getMonthNames = (locale: Intl.LocalesArgument, style: 'long' | 'short' | 'narrow' = 'short'): string[] => {
  const formatter = getFormatter(locale, { month: style });
  return Array.from({ length: 12 }, (_, month) => formatter.format(new Date(2024, month, 1)));
};
