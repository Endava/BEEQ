import { getDateMask, type TDateMask, type TDateMaskPrecision } from '../../../shared/utils';
import type { TDatePickerType, TDatePrecision } from '../bq-date-picker.types';
import { parseTypedInput, type TParsedInput } from './input';
import { parseValue, serializeValue } from './selection';

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

const applyDateMask = (input: string, mask: TDateMask): string => {
  const digits = input.replace(/\D/g, '');
  let cursor = 0;
  let formatted = mask.template;

  for (const segment of mask.segments) {
    const segmentDigits = digits.slice(cursor, cursor + segment.placeholder.length);
    cursor += segmentDigits.length;
    const value = `${segmentDigits}${segment.placeholder.slice(segmentDigits.length)}`;
    formatted = `${formatted.slice(0, segment.start)}${value}${formatted.slice(segment.end)}`;
  }

  return formatted;
};

/**
 * Normalizes an editing draft to its locale-derived mask while retaining
 * incomplete segments. The input always exposes a stable set of separators
 * and placeholders, so typing, deletion, and paste do not change its shape.
 */
export const applyPickerMask = (
  input: string,
  type: TDatePickerType,
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  formatOptions?: Intl.DateTimeFormatOptions,
): string => {
  const mask = getPickerMask(locale, precision, formatOptions);

  if (type === 'range') {
    const [start = '', end = ''] = input.split(/\s[-–—]\s/, 2);
    return `${applyDateMask(start, mask)}${RANGE_MASK_DELIMITER}${applyDateMask(end, mask)}`;
  }

  if (type === 'multi') {
    const tokens = input.split(/\s*,\s*/).filter(Boolean);
    return [...tokens.map((token) => applyDateMask(token, mask)), mask.template].join(MULTI_MASK_DELIMITER);
  }

  return applyDateMask(input, mask);
};

export const getMaskedCaretPosition = (input: string, enteredDigits: number): number => {
  if (enteredDigits === 0) return 0;

  let seenDigits = 0;
  for (let index = 0; index < input.length; index++) {
    if (!/\d/.test(input[index])) continue;
    seenDigits++;
    if (seenDigits !== enteredDigits) continue;

    let caret = index + 1;
    while (caret < input.length && !/[\da-z]/i.test(input[caret])) caret++;
    return caret;
  }

  return input.length;
};

export const getMaskedSelectionRange = (
  input: string,
  enteredDigits: number,
): { start: number; end: number } => {
  const start = getMaskedCaretPosition(input, enteredDigits);
  const placeholder = /^(dd|mm|yyyy)/.exec(input.slice(start))?.[0];
  return { start, end: placeholder ? start + placeholder.length : start };
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

export const getMaskedInputTokens = (
  input: string,
  type: TDatePickerType,
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  formatOptions?: Intl.DateTimeFormatOptions,
): string[] | undefined => {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const isEmptyMaskToken = (token: string): boolean => token.replace(/\D/g, '').length === 0;

  if (type === 'range') {
    const tokens = trimmed.split(/\s[-–—]\s/);
    if (tokens.length > 2 || tokens.some((token) => !token)) return undefined;
    return tokens.filter((token) => !isEmptyMaskToken(token));
  }

  if (type === 'multi') {
    const tokens = trimmed.split(/\s*,\s*/);
    return tokens.every(Boolean) ? tokens.filter((token) => !isEmptyMaskToken(token)) : undefined;
  }

  const mask = getPickerMask(locale, precision, formatOptions);
  return isEmptyMaskToken(trimmed) && trimmed === mask.template ? [] : [trimmed];
};

export const parseMaskedInputToken = (
  token: string,
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  min?: string,
  max?: string,
  isDateDisallowed?: (date: Date) => boolean,
  formatOptions?: Intl.DateTimeFormatOptions,
): TParsedInput => {
  const mask = getPickerMask(locale, precision, formatOptions);
  const values = Object.fromEntries(
    mask.segments.map((segment) => [segment.field, token.slice(segment.start, segment.end)]),
  ) as Partial<Record<'day' | 'month' | 'year', string>>;

  if (Object.values(values).some((value) => !value || !/^\d+$/.test(value))) return { invalid: true };

  const iso = `${values.year}-${precision === 'year' ? '01' : values.month}-${precision === 'day' ? values.day : '01'}`;
  return parseTypedInput(iso, locale, precision, min, max, isDateDisallowed);
};

export const serializeMaskedInputTokens = (
  tokens: string[],
  type: TDatePickerType,
  precision: TDatePrecision,
): string | undefined => {
  if (tokens.length === 0) return undefined;
  const raw = type === 'range' ? tokens.join('/') : tokens.join(' ');
  return serializeValue(parseValue(raw, type, precision), type, precision) || undefined;
};
