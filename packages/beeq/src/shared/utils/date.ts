/**
 * Date parsing pattern definition
 */
interface DatePattern {
  regex: RegExp;
  parse: (match: RegExpExecArray, monthMap: Record<string, number>) => { day: number; month: number; year: number };
}

/**
 * Static date parsing patterns
 */
const DATE_PATTERNS: DatePattern[] = [
  {
    regex: /(\d{1,2})\s+([a-z]+)\s+(\d{4})/i,
    parse: (m, months) => ({
      day: +m[1],
      month: months[m[2].toLowerCase()],
      year: +m[3],
    }),
  },
  {
    regex: /(\d{1,2})[\s\-/](\d{1,2})[\s\-/](\d{4})/,
    parse: (m) => {
      const { day, month } = parseNumericDate(+m[1], +m[2]);
      return { day, month, year: +m[3] };
    },
  },
  {
    regex: /([a-z]+)\s+(\d{1,2}),?\s+(\d{4})/i,
    parse: (m, months) => ({
      month: months[m[1].toLowerCase()],
      day: +m[2],
      year: +m[3],
    }),
  },
];

/**
 * Gets localized month names for the given locale (both short and long forms)
 */
const getMonthNamesForLocale = (locale: Intl.LocalesArgument): Record<string, number> => {
  const monthMap: Record<string, number> = {};
  const shortFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  const longFormatter = new Intl.DateTimeFormat(locale, { month: 'long' });

  for (let month = 0; month < 12; month++) {
    const date = new Date(2024, month, 1);
    monthMap[shortFormatter.format(date).toLowerCase()] = month;
    monthMap[longFormatter.format(date).toLowerCase()] = month;
  }

  return monthMap;
};

/**
 * Parses day-month-year or month-day-year numeric date format
 * Uses heuristic: if first number > 12, treat as DD/MM/YYYY, otherwise MM/DD/YYYY
 */
const parseNumericDate = (first: number, second: number): { day: number; month: number } => {
  if (first > 12) {
    return { day: first, month: second - 1 };
  }
  if (second > 12) {
    return { day: second, month: first - 1 };
  }
  // Ambiguous case: default to DD/MM/YYYY (European format)
  return { day: first, month: second - 1 };
};

/**
 * Validates that a date is actually valid (not auto-corrected by Date constructor)
 */
const isDateValid = (day: number, month: number, year: number): boolean => {
  const date = new Date(year, month, day);
  return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
};

/**
 * Validates and creates a Date object from day, month, and year
 */
const createValidDate = (day: number, month: number, year: number): Date | null => {
  if (month === undefined || !day || !year) return null;
  if (!isDateValid(day, month, year)) return null;

  return new Date(year, month, day);
};

/**
 * Parses various date input formats and returns a Date object
 *
 * Supports:
 * - ISO format: "2024-05-30"
 * - Text format: "30 May 2024", "May 30, 2024", "30 January 2024", "January 1, 1970" (locale-aware)
 * - Numeric formats: "30/05/2024", "05-30-2024"
 *
 * @param inputValue - The date string to parse
 * @param locale - The locale for month name recognition (defaults to 'en-GB')
 * @returns Parsed Date object or null if parsing fails
 */
export const parseDateInput = (inputValue: string, locale: Intl.LocalesArgument = 'en-GB'): Date | null => {
  if (!inputValue?.trim()) return null;

  // Try ISO format first
  const isoDate = new Date(`${inputValue}T00:00:00`);
  if (!Number.isNaN(isoDate.getTime()) && isValidISODate(inputValue)) return isoDate;

  const monthMap = getMonthNamesForLocale(locale);

  for (const { regex, parse } of DATE_PATTERNS) {
    const match = regex.exec(inputValue);
    if (!match) continue;

    const { day, month, year } = parse(match, monthMap);
    const date = createValidDate(day, month, year);
    if (date) return date;
  }

  return null;
};

/**
 * Validates if a string is in ISO date format (YYYY-MM-DD) with actual valid date values
 *
 * @param dateStr - The date string to validate
 * @returns True if the date string is valid in ISO format and represents an actual valid date
 */
export const isValidISODate = (dateStr: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = +yearStr;
  const month = +monthStr - 1;
  const day = +dayStr;

  return isDateValid(day, month, year);
};
