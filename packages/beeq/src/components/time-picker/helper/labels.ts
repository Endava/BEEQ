import type { TTimeHourCycle, TTimeMaskField } from '../../../shared/utils';
import type { TTime, TTimePrecision } from '../bq-time-picker.types';

/** Accessible names of the editable fields and panel columns. */
export const TIME_FIELD_LABELS: Record<TTimeMaskField, string> = {
  hour: 'Hours',
  minute: 'Minutes',
  second: 'Seconds',
  dayPeriod: 'AM/PM',
};

/** Column headers used when the browser can't provide localized field names. */
const COLUMN_HEADER_FALLBACK: Record<Exclude<TTimeMaskField, 'dayPeriod'>, string> = {
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
};

/**
 * Returns the localized headers of the panel columns.
 * The AM/PM header joins the locale day period labels so it matches the options below it.
 *
 * @param locale Locale used for the field names.
 * @param dayPeriods Localized AM and PM labels.
 * @returns The header of each column.
 */
export const getColumnHeaders = (
  locale: Intl.LocalesArgument,
  dayPeriods: readonly [string, string],
): Record<TTimeMaskField, string> => {
  let names: Intl.DisplayNames | undefined;
  try {
    names = new Intl.DisplayNames(locale, { type: 'dateTimeField' });
  } catch {
    names = undefined;
  }
  const getName = (field: keyof typeof COLUMN_HEADER_FALLBACK) => names?.of(field) ?? COLUMN_HEADER_FALLBACK[field];

  return {
    hour: getName('hour'),
    minute: getName('minute'),
    second: getName('second'),
    dayPeriod: dayPeriods.join('/'),
  };
};

/**
 * Formats a time for screen reader announcements.
 *
 * @param time Time to format.
 * @param locale Locale used for formatting.
 * @param precision Smallest unit to include.
 * @param hourCycle Hour cycle used by the field.
 * @returns The localized time.
 */
export const formatTime = (
  time: TTime,
  locale: Intl.LocalesArgument,
  precision: TTimePrecision,
  hourCycle: TTimeHourCycle,
): string =>
  new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...(precision === 'second' ? { second: '2-digit' } : {}),
    hourCycle,
  }).format(new Date(2000, 0, 1, time.hour, time.minute, time.second));
