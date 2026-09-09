export const DATE_MASK_PRECISION = ['day', 'month', 'year'] as const;

export type TDateMaskPrecision = (typeof DATE_MASK_PRECISION)[number];
export type TDateMaskField = 'day' | 'month' | 'year';

export type TDateMaskSegment = {
  field: TDateMaskField;
  placeholder: string;
  start: number;
  end: number;
};

export type TDateMask = {
  template: string;
  segments: TDateMaskSegment[];
  usedFallback: boolean;
};

const DATE_MASK_FIELDS: Record<TDateMaskPrecision, readonly TDateMaskField[]> = {
  day: ['day', 'month', 'year'],
  month: ['month', 'year'],
  year: ['year'],
};

const DATE_MASK_PLACEHOLDERS: Record<TDateMaskField, string> = {
  day: 'dd',
  month: 'mm',
  year: 'yyyy',
};

const DATE_MASK_FORMAT_OPTIONS: Record<TDateMaskPrecision, Intl.DateTimeFormatOptions> = {
  day: { day: '2-digit', month: '2-digit', year: 'numeric' },
  month: { month: '2-digit', year: 'numeric' },
  year: { year: 'numeric' },
};

const UNSUPPORTED_DATE_MASK_OPTIONS: (keyof Intl.DateTimeFormatOptions)[] = [
  'dateStyle',
  'dayPeriod',
  'era',
  'hour',
  'hour12',
  'hourCycle',
  'minute',
  'second',
  'timeStyle',
  'weekday',
];

/**
 * Checks whether formatting options can define a fixed-width numeric date mask.
 * Masks require all fields for the requested precision and cannot represent
 * textual or variable-length date parts.
 */
export const isDateMaskFormatOptionsCompatible = (
  formatOptions: Intl.DateTimeFormatOptions | undefined,
  precision: TDateMaskPrecision,
): boolean => {
  if (!formatOptions) return false;
  if (UNSUPPORTED_DATE_MASK_OPTIONS.some((option) => formatOptions[option] !== undefined)) return false;

  const fields = DATE_MASK_FIELDS[precision];
  if (fields.includes('day') && !['numeric', '2-digit'].includes(formatOptions.day ?? '')) return false;
  if (fields.includes('month') && !['numeric', '2-digit'].includes(formatOptions.month ?? '')) return false;
  if (fields.includes('year') && formatOptions.year !== 'numeric') return false;

  return true;
};

/**
 * Builds a locale-ordered date mask from numeric formatting options.
 * Incompatible options use the locale's default numeric layout instead.
 */
export const getDateMask = (
  locale: Intl.LocalesArgument,
  precision: TDateMaskPrecision,
  formatOptions?: Intl.DateTimeFormatOptions,
): TDateMask => {
  const usedFallback = !isDateMaskFormatOptionsCompatible(formatOptions, precision);
  const options = usedFallback ? DATE_MASK_FORMAT_OPTIONS[precision] : formatOptions;
  const dateParts = new Intl.DateTimeFormat(locale, options).formatToParts(new Date(2006, 10, 22));
  const segments: TDateMaskSegment[] = [];
  let template = '';

  for (const part of dateParts) {
    if (part.type === 'literal') {
      template += part.value;
      continue;
    }

    if (!DATE_MASK_FIELDS[precision].includes(part.type as TDateMaskField)) continue;

    const field = part.type as TDateMaskField;
    const placeholder = DATE_MASK_PLACEHOLDERS[field];
    const start = template.length;
    template += placeholder;
    segments.push({ field, placeholder, start, end: template.length });
  }

  return { template, segments, usedFallback };
};
