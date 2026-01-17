/** Cache for DateTimeFormat instances */
const formatterCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Gets or creates a cached DateTimeFormat instance
 * @param locale - The locale for formatting
 * @param options - DateTimeFormat options
 * @returns Cached or new DateTimeFormat instance
 */
const getDateFormatter = (locale: Intl.LocalesArgument, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
  const cacheKey = `${typeof locale === 'string' ? locale : JSON.stringify(locale)}-${JSON.stringify(options)}`;

  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(cacheKey, formatter);

    // Limit cache size to prevent memory leaks in long-running apps
    if (formatterCache.size > 50) {
      const firstKey = formatterCache.keys().next().value;
      formatterCache.delete(firstKey);
    }
  }

  return formatter;
};

/**
 * Formats a date value for display based on the picker type and locale.
 *
 * @param value - The ISO date string(s) to format
 * @param type - The picker type (single, multi, range)
 * @param locale - The locale for formatting
 * @param formatOptions - Intl.DateTimeFormat options
 * @returns Formatted display string or undefined
 */
const formatDisplayValue = (
  value: string,
  type: 'single' | 'multi' | 'range',
  locale: Intl.LocalesArgument,
  formatOptions: Intl.DateTimeFormatOptions,
): string | undefined => {
  if (!value) return undefined;

  const dateFormatter = getDateFormatter(locale, formatOptions);

  if (type === 'range') {
    const [start, end] = value.split('/').map((dateStr) => new Date(`${dateStr}T00:00:00`));
    if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return undefined;

    return dateFormatter.formatRange(start, end);
  }

  if (type === 'multi') {
    const dates = value.split(' ').map((dateStr) => new Date(`${dateStr}T00:00:00`));
    if (dates.some((d) => Number.isNaN(d.getTime()))) return undefined;

    return dates.map((date) => dateFormatter.format(date)).join(', ');
  }

  const singleDate = new Date(`${value}T00:00:00`);
  return Number.isNaN(singleDate.getTime()) ? undefined : dateFormatter.format(singleDate);
};

/**
 * Extracts and returns the first date part from a given string. Handles single, multi, and range picker types.
 * When the type of the date picker is 'range' or 'multi', the first or initial date part of the value
 * should be the focused date in the calendar.
 *
 * @param value - The date value string
 * @returns The first ISO date string or undefined
 */
const extractFocusedDate = (value: string): string | undefined => {
  if (!value) return undefined;

  const dateRegex = /\b\d{4}-\d{2}-\d{2}\b/;
  const match = dateRegex.exec(value);
  return match ? match[0] : undefined;
};

/**
 * Clamps a date string to a min/max range.
 *
 * @param dateStr - The ISO date string to clamp
 * @param min - Optional minimum date
 * @param max - Optional maximum date
 * @returns The clamped date string
 */
const clampDateToRange = (dateStr: string, min?: string, max?: string): string => {
  if (min && dateStr < min) return min;
  if (max && dateStr > max) return max;
  return dateStr;
};

export { formatDisplayValue, extractFocusedDate, clampDateToRange };
