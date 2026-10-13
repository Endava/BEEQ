import type { TTimeHourCycle, TTimeMaskField } from '../../../shared/utils';
import type { TTime, TTimePrecision } from '../bq-time-picker.types';

/** Accessible names of the editable fields and panel columns. */
export const TIME_FIELD_LABELS: Record<TTimeMaskField, string> = {
  hour: 'Hours',
  minute: 'Minutes',
  second: 'Seconds',
  dayPeriod: 'AM/PM',
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
