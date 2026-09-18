import { getDateMask, type TDateMask, type TDateMaskPrecision } from '../../../shared/utils';
import type { TDatePickerType, TDatePrecision } from '../bq-date-picker.types';

/** Separator displayed between the two editable dates in a range picker. */
export const RANGE_MASK_DELIMITER = ' - ';
/** Separator displayed between editable dates in a multi-date picker. */
export const MULTI_MASK_DELIMITER = ', ';

/**
 * Converts picker precision to the equivalent shared date-mask precision.
 *
 * @param precision Date picker precision.
 * @returns The compatible date-mask precision.
 */
const toMaskPrecision = (precision: TDatePrecision): TDateMaskPrecision => precision;

/**
 * Gets the locale-derived editable mask for the picker precision.
 *
 * @param locale Locale used to determine numeric field order and literals.
 * @param precision Precision represented by the mask.
 * @param formatOptions Optional consumer date formatting options.
 * @returns The date mask used to render editable segments.
 */
export const getPickerMask = (
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  formatOptions?: Intl.DateTimeFormatOptions,
): TDateMask => getDateMask(locale, toMaskPrecision(precision), formatOptions);

/**
 * Builds the placeholder text for the picker's current selection mode.
 *
 * @param type Selection mode of the date picker.
 * @param locale Locale used to determine numeric field order and literals.
 * @param precision Precision represented by the mask.
 * @param formatOptions Optional consumer date formatting options.
 * @returns The placeholder, including an additional entry for range and multi modes.
 */
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
