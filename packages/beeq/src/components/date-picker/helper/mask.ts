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

const getMaskEditablePositions = (mask: TDateMask, offset = 0): number[] =>
  mask.segments.flatMap((segment) =>
    Array.from({ length: segment.end - segment.start }, (_, index) => offset + segment.start + index),
  );

const getFixedMaskSegments = (
  type: TDatePickerType,
  mask: TDateMask,
  value: string,
): { start: number; end: number }[] => {
  if (type === 'multi') {
    const tokens = value.split(MULTI_MASK_DELIMITER);
    return tokens.flatMap((_, index) =>
      mask.segments.map((segment) => {
        const start = index * (mask.template.length + MULTI_MASK_DELIMITER.length) + segment.start;
        return { start, end: start + segment.placeholder.length };
      }),
    );
  }

  const offsets = type === 'range' ? [0, mask.template.length + RANGE_MASK_DELIMITER.length] : [0];
  return offsets.flatMap((offset) =>
    mask.segments.map((segment) => ({
      start: offset + segment.start,
      end: offset + segment.end,
    })),
  );
};

const isFixedPickerMask = (value: string, type: TDatePickerType, mask: TDateMask): boolean => {
  if (type === 'range') {
    return value.length === mask.template.length * 2 + RANGE_MASK_DELIMITER.length;
  }
  if (type === 'multi') {
    return value.split(MULTI_MASK_DELIMITER).every((token) => token.length === mask.template.length);
  }
  return value.length === mask.template.length;
};

const getSegmentSelection = (
  type: TDatePickerType,
  mask: TDateMask,
  value: string,
  position: number,
  direction: -1 | 0 | 1 = 0,
): { start: number; end: number } => {
  const segments = getFixedMaskSegments(type, mask, value);
  const current = segments.findIndex((segment) => position >= segment.start && position <= segment.end);
  const fallback = position >= value.length ? segments.length - 1 : 0;
  const index = Math.max(0, Math.min(segments.length - 1, (current === -1 ? fallback : current) + direction));
  return segments[index] ?? { start: 0, end: 0 };
};

export type TMaskedEdit = {
  selection: { start: number; end: number };
  value: string;
};

type TFixedMaskSlots = {
  placeholders: Map<number, string>;
  positions: number[];
};

const getFixedMaskSlots = (type: TDatePickerType, mask: TDateMask, value: string): TFixedMaskSlots => {
  const editablePositions = getMaskEditablePositions(mask);
  const tokenOffsets =
    type === 'range'
      ? [0, mask.template.length + RANGE_MASK_DELIMITER.length]
      : type === 'multi'
        ? value
            .split(MULTI_MASK_DELIMITER)
            .map((_, index) => index * (mask.template.length + MULTI_MASK_DELIMITER.length))
        : [0];
  return {
    positions: tokenOffsets.flatMap((offset) => editablePositions.map((position) => offset + position)),
    placeholders: new Map<number, string>(
      tokenOffsets.flatMap((offset) =>
        mask.segments.flatMap((segment) =>
          Array.from({ length: segment.placeholder.length }, (_, index) => [
            offset + segment.start + index,
            segment.placeholder[index],
          ]),
        ),
      ),
    ),
  };
};

const toMaskedEdit = (
  type: TDatePickerType,
  mask: TDateMask,
  value: string,
  position: number,
  direction: -1 | 0 | 1 = 0,
): TMaskedEdit => ({
  value,
  selection: getSegmentSelection(type, mask, value, position, direction),
});

const getPreviousSegmentSlots = (positions: number[], selectionStart: number): number[] => {
  const end = positions.findLastIndex((position) => position < selectionStart);
  if (end === -1) return [];
  let start = end;
  while (start > 0 && positions[start] - positions[start - 1] === 1) start--;
  return positions.slice(start, end + 1);
};

const clearMaskSlots = (value: string, placeholders: Map<number, string>, positions: number[]): string => {
  const chars = [...value];
  for (const position of positions) {
    const placeholder = placeholders.get(position);
    if (placeholder) chars[position] = placeholder;
  }
  return chars.join('');
};

const applyFixedMaskDeletion = (
  value: string,
  slots: TFixedMaskSlots,
  selectionStart: number,
  selectionEnd: number,
  inputType: string,
): { caret: number; selection?: { start: number; end: number }; value: string } => {
  const selectedSlots = slots.positions.filter((position) => position >= selectionStart && position < selectionEnd);
  const hasSegmentSelection = selectedSlots.length > 1;
  if (inputType === 'deleteContentBackward' && hasSegmentSelection) {
    const hasEnteredValue = selectedSlots.some((position) => value[position] !== slots.placeholders.get(position));
    const previousSegment = getPreviousSegmentSlots(slots.positions, selectionStart);
    if (!hasEnteredValue) {
      if (previousSegment.length === 0) return { value, caret: selectionStart };
      return {
        value,
        caret: previousSegment[0],
        selection: { start: previousSegment[0], end: previousSegment[previousSegment.length - 1] + 1 },
      };
    }
    return {
      value: clearMaskSlots(value, slots.placeholders, selectedSlots),
      caret: previousSegment[0] ?? selectedSlots[0],
      selection: {
        start: previousSegment[0] ?? selectedSlots[0],
        end: (previousSegment[previousSegment.length - 1] ?? selectedSlots[selectedSlots.length - 1]) + 1,
      },
    };
  }
  const target =
    selectedSlots.length > 0
      ? selectedSlots
      : [
          inputType === 'deleteContentBackward'
            ? [...slots.positions].reverse().find((position) => position < selectionStart)
            : slots.positions.find((position) => position >= selectionStart),
        ].filter((position): position is number => position !== undefined);
  return { value: clearMaskSlots(value, slots.placeholders, target), caret: target[0] ?? selectionStart };
};

const applyFixedMaskInsertion = (
  value: string,
  slots: TFixedMaskSlots,
  selectionStart: number,
  selectionEnd: number,
  data: string | null,
): { caret: number; value: string } => {
  const digits = (data ?? '').replace(/\D/g, '');
  if (!digits) return { value, caret: selectionStart };

  const selectedSlots = slots.positions.filter((position) => position >= selectionStart && position < selectionEnd);
  const firstEmptySlot = selectedSlots.find((position) => value[position] === slots.placeholders.get(position));
  const replacesCompletedSegment = selectedSlots.length > 0 && firstEmptySlot === undefined;
  const startIndex =
    selectedSlots.length > 0
      ? slots.positions.indexOf(firstEmptySlot ?? selectedSlots[0])
      : Math.max(
          0,
          slots.positions.findIndex((position) => position >= selectionStart),
        );
  const positions = slots.positions.slice(startIndex, startIndex + digits.length);
  const chars = [...value];
  if (replacesCompletedSegment) {
    for (const position of selectedSlots) {
      const placeholder = slots.placeholders.get(position);
      if (placeholder) chars[position] = placeholder;
    }
  }
  for (const [index, position] of positions.entries()) chars[position] = digits[index];
  return { value: chars.join(''), caret: positions.at(-1) ?? selectionStart };
};

/**
 * Applies a native editing action to an immutable date-mask layout. Separators
 * remain in place and every edit replaces only digit slots, matching segmented
 * date-input behavior without leaking a raw free-text state to consumers.
 */
export const applyFixedMaskEdit = (
  value: string,
  selectionStart: number,
  selectionEnd: number,
  inputType: string,
  data: string | null,
  type: TDatePickerType,
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  formatOptions?: Intl.DateTimeFormatOptions,
): TMaskedEdit => {
  const mask = getPickerMask(locale, precision, formatOptions);
  const nextValue = isFixedPickerMask(value, type, mask)
    ? value
    : applyPickerMask(value, type, locale, precision, formatOptions);
  if (type === 'multi' && data?.includes(MULTI_MASK_DELIMITER.trim()) && data !== MULTI_MASK_DELIMITER.trim()) {
    const pasted = applyPickerMask(data, type, locale, precision, formatOptions);
    return toMaskedEdit(type, mask, pasted, pasted.length);
  }
  if (type === 'multi' && data === MULTI_MASK_DELIMITER.trim()) {
    const expanded = applyPickerMask(`${nextValue}${MULTI_MASK_DELIMITER}`, type, locale, precision, formatOptions);
    return toMaskedEdit(type, mask, expanded, expanded.length);
  }
  const slots = getFixedMaskSlots(type, mask, nextValue);

  if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
    const edit = applyFixedMaskDeletion(nextValue, slots, selectionStart, selectionEnd, inputType);
    if (edit.selection) return { value: edit.value, selection: edit.selection };
    return toMaskedEdit(type, mask, edit.value, edit.caret);
  }

  if (!inputType.startsWith('insert')) {
    return toMaskedEdit(type, mask, nextValue, selectionStart);
  }

  const edit = applyFixedMaskInsertion(nextValue, slots, selectionStart, selectionEnd, data);
  const completedSegment = getFixedMaskSegments(type, mask, edit.value).find(
    (segment) => edit.caret >= segment.start && edit.caret < segment.end && edit.caret + 1 >= segment.end,
  );
  return toMaskedEdit(type, mask, edit.value, edit.caret + 1, completedSegment ? 1 : 0);
};

export const getAdjacentMaskSegmentSelection = (
  value: string,
  selectionStart: number,
  type: TDatePickerType,
  locale: Intl.LocalesArgument,
  precision: TDatePrecision,
  direction: -1 | 0 | 1,
  formatOptions?: Intl.DateTimeFormatOptions,
): { start: number; end: number } => {
  const mask = getPickerMask(locale, precision, formatOptions);
  return getSegmentSelection(type, mask, value, selectionStart, direction);
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
    const maskedTokens = tokens.map((token) => applyDateMask(token, mask));
    return (maskedTokens.at(-1) === mask.template ? maskedTokens : [...maskedTokens, mask.template]).join(
      MULTI_MASK_DELIMITER,
    );
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

export const getMaskedSelectionRange = (input: string, enteredDigits: number): { start: number; end: number } => {
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
