import { getDateMask, type TDateMask, type TDateMaskPrecision } from '../../../shared/utils';
import type { TDatePickerType, TDatePrecision } from '../bq-date-picker.types';

export const RANGE_MASK_DELIMITER = ' - ';
export const MULTI_MASK_DELIMITER = ', ';

const toMaskPrecision = (precision: TDatePrecision): TDateMaskPrecision => precision;

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
