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
 * Extracts the first date from a value string for focusing the calendar.
 * Handles single, multi, and range picker types.
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
