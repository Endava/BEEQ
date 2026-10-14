import type { TTimeHourCycle } from '../../../shared/utils';
import { isString } from '../../../shared/utils';
import type { TTime, TTimePickerLabels, TTimePrecision } from '../bq-time-picker.types';

/** English text used when `labels` doesn't set a button or panel label. */
const DEFAULT_LABELS = {
  now: 'Now',
  clear: 'Clear',
  confirm: 'OK',
  openPanel: 'Open time picker',
  panelLabel: 'Choose time',
} as const satisfies TTimePickerLabels;

/** Column headers used when the browser can't provide localized field names. */
const FIELD_NAME_FALLBACK = {
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
} as const;

/**
 * Reads the `labels` prop, which may be an object or a JSON string set through the attribute.
 *
 * @param labels Value of the `labels` prop.
 * @returns The labels object, or `undefined` when the value is missing or isn't a valid JSON object.
 */
export const parseLabels = (labels: TTimePickerLabels | string | undefined): TTimePickerLabels | undefined => {
  if (!isString(labels)) return labels ?? undefined;

  try {
    const parsed: unknown = JSON.parse(labels);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Fills the missing labels with the locale names and the English defaults.
 *
 * @param locale Locale used for the field names.
 * @param dayPeriods Localized AM and PM labels.
 * @param labels Labels set by the consumer.
 * @returns Every label of the time picker.
 */
export const resolveLabels = (
  locale: Intl.LocalesArgument,
  dayPeriods: readonly [string, string],
  labels: TTimePickerLabels = {},
): Required<TTimePickerLabels> => {
  let names: Intl.DisplayNames | undefined;
  try {
    names = new Intl.DisplayNames(locale, { type: 'dateTimeField' });
  } catch {
    names = undefined;
  }
  const getName = (field: keyof typeof FIELD_NAME_FALLBACK) =>
    labels[field] || names?.of(field) || FIELD_NAME_FALLBACK[field];
  const am = labels.am || dayPeriods[0];
  const pm = labels.pm || dayPeriods[1];

  return {
    hour: getName('hour'),
    minute: getName('minute'),
    second: getName('second'),
    am,
    pm,
    period: labels.period || `${am}/${pm}`,
    now: labels.now || DEFAULT_LABELS.now,
    clear: labels.clear || DEFAULT_LABELS.clear,
    confirm: labels.confirm || DEFAULT_LABELS.confirm,
    openPanel: labels.openPanel || DEFAULT_LABELS.openPanel,
    panelLabel: labels.panelLabel || DEFAULT_LABELS.panelLabel,
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
