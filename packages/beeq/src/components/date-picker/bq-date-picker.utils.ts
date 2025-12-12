/**
 * Utility functions for the date picker component
 */

/**
 * Extracts and returns the first date part from a given string.
 * When the type of the date picker is 'range' or 'multi', the first or initial date part of the value
 * should be the focused date in the calendar.
 *
 * @param value - The value to be processed, can be a string.
 * @returns The extracted first date portion of the value.
 */
export const formatFocusedDate = (value: string): string | undefined => {
  if (!value) return undefined;

  const dateRegex = /\b\d{4}-\d{2}-\d{2}\b/;
  const match = dateRegex.exec(value);
  return match ? match[0] : undefined;
};

/**
 * Formats the display value based on the date picker type and locale
 *
 * @param value - The date value(s) to format
 * @param type - The date picker type (single, range, multi)
 * @param locale - The locale for formatting
 * @param formatOptions - Formatting options
 * @returns The formatted display string
 */
export const formatDisplayValue = (
  value: string,
  type: 'single' | 'multi' | 'range',
  locale: Intl.LocalesArgument,
  formatOptions: Intl.DateTimeFormatOptions,
): string | undefined => {
  if (!value) return undefined;

  const dateFormatter = new Intl.DateTimeFormat(locale, formatOptions);

  if (type === 'range') {
    const [start, end] = value.split('/').map((dateStr) => new Date(`${dateStr}T00:00:00`));
    return dateFormatter.formatRange(start, end);
  }

  if (type === 'multi') {
    const dates = value.split(' ').map((dateStr) => new Date(`${dateStr}T00:00:00`));
    return dates.map((date) => dateFormatter.format(date)).join(', ');
  }

  return dateFormatter.format(new Date(`${value}T00:00:00`));
};

/**
 * Clamps a date string to the provided min/max range
 *
 * @param dateStr - The date string to clamp
 * @param min - The minimum date
 * @param max - The maximum date
 * @returns The clamped date string
 */
export const clampDateToRange = (dateStr: string, min?: string, max?: string): string => {
  if (min && dateStr < min) return min;
  if (max && dateStr > max) return max;
  return dateStr;
};

/**
 * Gets the numeric focused year from a date string
 *
 * @param focusedDate - The focused date string (YYYY-MM-DD format)
 * @param value - Fallback value if focusedDate is not provided
 * @returns The year as a number
 */
export const getFocusedYear = (focusedDate?: string, value?: string): number => {
  const base = focusedDate || formatFocusedDate(value) || new Date().toLocaleDateString('fr-CA');
  const yearStr = base.slice(0, 4);
  const yearNum = parseInt(yearStr, 10);
  return Number.isNaN(yearNum) ? new Date().getFullYear() : yearNum;
};

/**
 * Computes the starting year of the current decade
 *
 * @param focusedYear - The focused year
 * @returns The start of the decade
 */
export const getStartDecade = (focusedYear: number): number => {
  return Math.floor(focusedYear / 10) * 10;
};

/**
 * Gets the heading title based on the current view
 *
 * @param calendarView - The current calendar view
 * @param focusedDate - The focused date string
 * @param value - The selected value
 * @param locale - The locale for formatting
 * @returns The heading title string
 */
export const getHeadingTitle = (
  calendarView: 'days' | 'months' | 'years' | 'decades',
  focusedDate: string,
  value: string,
  locale: Intl.LocalesArgument,
): string => {
  const baseStr = focusedDate || formatFocusedDate(value) || new Date().toLocaleDateString('fr-CA');
  const baseDate = new Date(baseStr + 'T00:00:00');
  const focusedYear = getFocusedYear(focusedDate, value);

  if (calendarView === 'days') {
    return new Intl.DateTimeFormat(locale as string, { month: 'long', year: 'numeric' }).format(baseDate);
  }

  if (calendarView === 'months') {
    return `${focusedYear}`;
  }

  if (calendarView === 'years') {
    const end = focusedYear + 11;
    return `${focusedYear}-${end}`;
  }

  // Decades view
  const startDecade = getStartDecade(focusedYear);
  const endYear = startDecade + 119;
  return `${startDecade}-${endYear}`;
};

/**
 * Shifts a focused date by a number of years
 *
 * @param focusedDate - The current focused date
 * @param value - Fallback value if focusedDate is not provided
 * @param deltaYears - Number of years to shift (positive or negative)
 * @returns The new focused date string
 */
export const shiftFocusedDateYears = (focusedDate: string, value: string, deltaYears: number): string => {
  const base = focusedDate || formatFocusedDate(value) || new Date().toLocaleDateString('fr-CA');
  const [y, m, d] = base.split('-').map((p) => parseInt(p, 10));
  const next = new Date(y, (m || 1) - 1, d || 1);
  next.setFullYear(next.getFullYear() + deltaYears);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
};

/**
 * Shifts a focused date by a number of months
 *
 * @param focusedDate - The current focused date
 * @param value - Fallback value if focusedDate is not provided
 * @param deltaMonths - Number of months to shift (positive or negative)
 * @returns The new focused date string
 */
export const shiftFocusedDateMonths = (focusedDate: string, value: string, deltaMonths: number): string => {
  const base = focusedDate || formatFocusedDate(value) || new Date().toLocaleDateString('fr-CA');
  const [y, m, d] = base.split('-').map((p) => parseInt(p, 10));
  const next = new Date(y, (m || 1) - 1, d || 1);
  next.setMonth(next.getMonth() + deltaMonths);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
};
