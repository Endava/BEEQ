import { getDateMask, type TDateMask, type TDateMaskPrecision } from '../../../shared/utils';
import type { TDatePickerType, TDatePrecision } from '../bq-date-picker.types';
import { parseValue } from './selection';

export const RANGE_MASK_DELIMITER = ' - ';
export const MULTI_MASK_DELIMITER = ', ';

const toMaskPrecision = (precision: TDatePrecision): TDateMaskPrecision => precision;

const formatMaskToken = (iso: string, mask: TDateMask): string => {
  const values = {
    day: iso.slice(8, 10),
    month: iso.slice(5, 7),
    year: iso.slice(0, 4),
  };
  let formatted = mask.template;

  for (const segment of [...mask.segments].reverse()) {
    formatted = `${formatted.slice(0, segment.start)}${values[segment.field]}${formatted.slice(segment.end)}`;
  }

  return formatted;
};

export const getPickerMask = (
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  formatOptions?: Intl.DateTimeFormatOptions,
): TDateMask => getDateMask(locale, toMaskPrecision(precision), formatOptions);

export const getMaskPlaceholder = (
  type: TDatePickerType,
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  formatOptions?: Intl.DateTimeFormatOptions,
): string => {
  const { template } = getPickerMask(locale, precision, formatOptions);
  if (type === 'range') return `${template}${RANGE_MASK_DELIMITER}${template}`;
  if (type === 'multi') return `${template}${MULTI_MASK_DELIMITER}${template}`;
  return template;
};

export const formatMaskedValue = (
  value: string | undefined,
  type: TDatePickerType,
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  formatOptions?: Intl.DateTimeFormatOptions,
): string | undefined => {
  const selection = parseValue(value, type, precision);
  if (selection.length === 0) return undefined;

  const mask = getPickerMask(locale, precision, formatOptions);
  const tokens = selection.map((iso) => formatMaskToken(iso, mask));
  if (type === 'range') return `${tokens[0]}${RANGE_MASK_DELIMITER}${tokens[1] ?? mask.template}`;
  if (type === 'multi') return [...tokens, mask.template].join(MULTI_MASK_DELIMITER);
  return tokens[0];
};
