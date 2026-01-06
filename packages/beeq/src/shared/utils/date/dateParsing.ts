/** Date parsing pattern definition */
type TDatePattern = {
  regex: RegExp;
  parse: (
    match: RegExpExecArray,
    monthMap: Record<string, number>,
    locale?: Intl.LocalesArgument,
  ) => { day: number; month: number; year: number };
};

/** French Canadian locale used for ISO date formatting (YYYY-MM-DD) */
const ISO_DATE_LOCALE = 'fr-CA';

/**
 * Static date parsing patterns
 */
const DATE_PATTERNS: TDatePattern[] = [
  {
    // Matches "30 May 2024" or "30 January 2024"
    regex: /^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i,
    parse: (m, months) => ({
      day: +m[1],
      month: months[m[2].toLowerCase()],
      year: +m[3],
    }),
  },
  {
    // Matches "05/30/2024", "30-05-2024", "30.05.2024", "05.30.2024" (with heuristic for day/month)
    regex: /^(\d{1,2})[\s\-/.](\d{1,2})[\s\-/.](\d{4})$/,
    parse: (m, _, locale) => {
      const { day, month } = parseNumericDate(+m[1], +m[2], locale);
      return { day, month, year: +m[3] };
    },
  },
  {
    // Matches "May 30, 2024" or "January 1, 1970" (with optional comma)
    regex: /^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i,
    parse: (m, months) => ({
      month: months[m[1].toLowerCase()],
      day: +m[2],
      year: +m[3],
    }),
  },
  {
    // Matches "2024-05-30" (ISO format without parsing as Date first)
    regex: /^(\d{4})-(\d{2})-(\d{2})$/,
    parse: (m) => ({
      year: +m[1],
      month: +m[2] - 1,
      day: +m[3],
    }),
  },
];

const monthNamesCache = new Map<string, Record<string, number>>();

/**
 * Gets localized month names for the given locale (both short and long forms)
 * Caches results for performance
 * @param {Intl.LocalesArgument} locale - The locale identifier, e.g., 'en-GB', 'fr-FR', etc.
 * @returns {Record<string, number>} Mapping of month names to month indices
 */
const getMonthNamesForLocale = (locale: Intl.LocalesArgument): Record<string, number> => {
  const cacheKey = typeof locale === 'string' ? locale : JSON.stringify(locale);

  const cachedMonthNames = monthNamesCache.get(cacheKey);
  if (cachedMonthNames) return cachedMonthNames;

  const monthMap: Record<string, number> = {};
  const shortFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  const longFormatter = new Intl.DateTimeFormat(locale, { month: 'long' });

  for (let month = 0; month < 12; month++) {
    const date = new Date(2024, month, 1);
    monthMap[shortFormatter.format(date).toLowerCase()] = month;
    monthMap[longFormatter.format(date).toLowerCase()] = month;
  }

  monthNamesCache.set(cacheKey, monthMap);
  return monthMap;
};

/**
 * Parses day-month-year or month-day-year numeric date format
 * Uses heuristic: if any number > 12, treat it as day, otherwise defaults to locale preference
 * @param {number} first - The first numeric part (day or month)
 * @param {number} second - The second numeric part (month or day)
 * @param {Intl.LocalesArgument} locale - The locale for determining format preference
 * @returns {{day: number, month: number}} Object with day and month (0-based)
 */
const parseNumericDate = (
  first: number,
  second: number,
  locale: Intl.LocalesArgument = 'en-GB',
): { day: number; month: number } => {
  // If first number > 12, it must be the day (DD/MM format)
  if (first > 12) return { day: first, month: second - 1 };

  // If second number > 12, it must be the day (MM/DD format)
  if (second > 12) return { day: second, month: first - 1 };

  // Both numbers <= 12: ambiguous case
  // Use locale to determine format preference
  const localeStr = typeof locale === 'string' ? locale : locale?.[0] || 'en-GB';
  const usesMMDD = ['en-US', 'en-CA'].some((l) => localeStr.startsWith(l));

  if (usesMMDD) {
    // US/Canada format: MM/DD
    return { day: second, month: first - 1 };
  }

  // Default to DD/MM (European/most of world format)
  return { day: first, month: second - 1 };
};

/**
 * Validates that a date is actually valid (not auto-corrected by Date constructor)
 * @param {number} day - Day of the month
 * @param {number} month - Month (0-based)
 * @param {number} year - Full year
 * @returns {boolean} True if the date is valid
 */
const isDateValid = (day: number, month: number, year: number): boolean => {
  const date = new Date(year, month, day);
  return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
};

/**
 * Validates and creates a Date object from day, month, and year
 * @param {number} day - Day of the month
 * @param {number} month - Month (0-based)
 * @param {number} year - Full year
 * @returns {Date | null} Valid Date object or null if invalid
 */
const createValidDate = (day: number, month: number, year: number): Date | null => {
  if (month === undefined || !day || !year) return null;
  if (!isDateValid(day, month, year)) return null;

  return new Date(year, month, day);
};

/**
 * Parses various date input formats and returns a Date object
 * Supports:
 * - ISO format: "2024-05-30"
 * - Text format: "30 May 2024", "May 30, 2024", "30 January 2024", "January 1, 1970" (locale-aware)
 * - Numeric formats: "30/05/2024", "05-30-2024", "30.05.2024", "05.30.2024" (with heuristic for day/month)
 *
 * @param {string} inputValue - The date string to parse
 * @param {Intl.LocalesArgument} locale - The locale for month name recognition (defaults to 'en-GB')
 * @returns {Date | null} Parsed Date object or null if parsing fails
 */
const parseDateInput = (inputValue: string, locale: Intl.LocalesArgument = 'en-GB'): Date | null => {
  if (!inputValue?.trim()) return null;

  // Try ISO format first
  const isoDate = new Date(`${inputValue}T00:00:00`);
  if (!Number.isNaN(isoDate.getTime()) && isValidISODate(inputValue)) return isoDate;

  const monthMap = getMonthNamesForLocale(locale);

  for (const { regex, parse } of DATE_PATTERNS) {
    const match = regex.exec(inputValue);
    if (!match) continue;

    const { day, month, year } = parse(match, monthMap, locale);
    const date = createValidDate(day, month, year);
    if (date) return date;
  }

  return null;
};

/**
 * Validates if a string is in ISO date format (YYYY-MM-DD) with actual valid date values
 * @param {string} dateStr - The date string to validate
 * @returns {boolean} True if the date string is valid in ISO format and represents an actual valid date
 */
const isValidISODate = (dateStr: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = +yearStr;
  const month = +monthStr - 1;
  const day = +dayStr;

  return isDateValid(day, month, year);
};

/**
 * Converts a Date object to ISO format string (YYYY-MM-DD).
 * @param date - The date to convert
 * @returns ISO formatted date string
 */
const toISODateString = (date: Date): string => {
  return date.toLocaleDateString(ISO_DATE_LOCALE);
};

/**
 * Gets today's date in ISO format.
 * @returns Today's date as YYYY-MM-DD string
 */
const getTodayISO = (): string => {
  return new Date().toLocaleDateString(ISO_DATE_LOCALE);
};

export { parseDateInput, isValidISODate, toISODateString, getTodayISO };
