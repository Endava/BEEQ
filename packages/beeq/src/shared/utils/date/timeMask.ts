export const TIME_MASK_PRECISION = ['hour', 'minute', 'second'] as const;

export type TTimeMaskPrecision = (typeof TIME_MASK_PRECISION)[number];
export type TTimeMaskField = 'hour' | 'minute' | 'second' | 'dayPeriod';
/** Normalized hour cycle: `h12` (1–12 with a day period) or `h23` (0–23). */
export type TTimeHourCycle = 'h12' | 'h23';

export type TTimeMaskSegment = {
  field: TTimeMaskField;
  placeholder: string;
  start: number;
  end: number;
};

export type TTimeMask = {
  /** Visual template, e.g. `hh:mm` or `hh:mm:ss AM`. */
  template: string;
  /** Editable segments in locale order. */
  segments: TTimeMaskSegment[];
  /** Resolved hour cycle used by the mask. */
  hourCycle: TTimeHourCycle;
  /** Localized `[AM, PM]` labels. */
  dayPeriods: [string, string];
};

const TIME_MASK_PLACEHOLDERS: Record<Exclude<TTimeMaskField, 'dayPeriod'>, string> = {
  hour: 'hh',
  minute: 'mm',
  second: 'ss',
};

/** Fixed reference time used to read locale parts (13:45:56). */
const REFERENCE_PM = new Date(2006, 10, 22, 13, 45, 56);
const REFERENCE_AM = new Date(2006, 10, 22, 1, 45, 56);

/**
 * Resolves the default hour cycle of a locale.
 *
 * @param locale Locale to inspect.
 * @returns `h12` for 12-hour locales (including `h11`), otherwise `h23`.
 */
export const getLocaleHourCycle = (locale: Intl.LocalesArgument): TTimeHourCycle => {
  const { hourCycle, hour12 } = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions();
  if (hourCycle) return hourCycle === 'h11' || hourCycle === 'h12' ? 'h12' : 'h23';
  return hour12 ? 'h12' : 'h23';
};

/**
 * Reads the localized day period label for a reference time.
 *
 * @param locale Locale used for the label.
 * @param date Reference time.
 * @returns The localized day period label, or the English fallback.
 */
const getDayPeriodLabel = (locale: Intl.LocalesArgument, date: Date): string => {
  const parts = new Intl.DateTimeFormat(locale, { hour: 'numeric', hourCycle: 'h12' }).formatToParts(date);
  const label = parts.find((part) => part.type === 'dayPeriod')?.value;
  return label || (date.getHours() < 12 ? 'AM' : 'PM');
};

/**
 * Returns the localized `[AM, PM]` labels of a locale.
 *
 * @param locale Locale used for the labels.
 * @returns The localized AM and PM labels.
 */
export const getDayPeriodLabels = (locale: Intl.LocalesArgument): [string, string] => [
  getDayPeriodLabel(locale, REFERENCE_AM),
  getDayPeriodLabel(locale, REFERENCE_PM),
];

/**
 * Maps an `Intl` part type to an editable time field.
 *
 * @param type Part type returned by `formatToParts`.
 * @param hourCycle Resolved hour cycle; day periods are only editable in `h12`.
 * @returns The editable field, or `undefined` when the part is not editable.
 */
const resolveMaskField = (
  type: Intl.DateTimeFormatPartTypes,
  hourCycle: TTimeHourCycle,
): TTimeMaskField | undefined => {
  if (type === 'dayPeriod') return hourCycle === 'h12' ? 'dayPeriod' : undefined;
  if (type === 'hour' || type === 'minute' || type === 'second') return type;
  return undefined;
};

/**
 * Builds a locale-ordered time mask.
 *
 * The minute part is always present in the template so `hour` precision still
 * renders `hh:00`; in that case the minute is a fixed literal, not an editable segment.
 *
 * @param locale Locale that defines separators and day period position.
 * @param precision Smallest editable unit.
 * @param hourCycle Optional hour cycle override. Defaults to the locale hour cycle.
 * @returns The time mask used to render editable segments.
 */
export const getTimeMask = (
  locale: Intl.LocalesArgument,
  precision: TTimeMaskPrecision,
  hourCycle?: TTimeHourCycle,
): TTimeMask => {
  const resolvedHourCycle = hourCycle ?? getLocaleHourCycle(locale);
  const dayPeriods = getDayPeriodLabels(locale);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: resolvedHourCycle,
    ...(precision === 'second' ? { second: '2-digit' } : {}),
  };
  const parts = new Intl.DateTimeFormat(locale, options).formatToParts(REFERENCE_PM);
  const segments: TTimeMaskSegment[] = [];
  let template = '';

  for (const part of parts) {
    if (part.type === 'literal') {
      template += part.value;
      continue;
    }

    if (part.type === 'minute' && precision === 'hour') {
      template += '00';
      continue;
    }

    const field = resolveMaskField(part.type, resolvedHourCycle);
    if (!field) continue;

    const placeholder = field === 'dayPeriod' ? dayPeriods[0] : TIME_MASK_PLACEHOLDERS[field];
    const start = template.length;
    template += placeholder;
    segments.push({ field, placeholder, start, end: template.length });
  }

  return { template, segments, hourCycle: resolvedHourCycle, dayPeriods };
};
