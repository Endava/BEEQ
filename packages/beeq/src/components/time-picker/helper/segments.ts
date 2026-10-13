import {
  createSegmentGroup,
  padSegmentValue,
  type TSegmentGroup,
  type TSegmentKey,
  type TTimeHourCycle,
  type TTimeMask,
  type TTimeMaskField,
} from '../../../shared/utils';
import type { TDayPeriod, TPartialTime, TTime } from '../bq-time-picker.types';
import { to12Hour, to24Hour } from './time';

export type TTimeSegmentGroup = TSegmentGroup<TTimeMaskField>;
export type TTimeSegmentKey = TSegmentKey<TTimeMaskField>;

/** Every time segment holds two characters; the day period stores the canonical `am`/`pm` token. */
const TIME_SEGMENT_MAX_LENGTHS: Record<TTimeMaskField, number> = {
  hour: 2,
  minute: 2,
  second: 2,
  dayPeriod: 2,
};

/** Result of reading the visual segment draft. */
export type TTimeSegmentDraft = {
  /** Complete, in-range fields in display terms. */
  partial: TPartialTime;
  /** No segment has a value. */
  isEmpty: boolean;
  /** Every segment is complete and in range. */
  isComplete: boolean;
  /** At least one complete segment is out of range. */
  isInvalid: boolean;
};

/**
 * Returns the inclusive numeric range of a field in display terms.
 *
 * @param field Numeric field.
 * @param hourCycle Hour cycle used by the mask.
 * @returns The inclusive `[min, max]` range.
 */
export const getTimeSegmentRange = (
  field: Exclude<TTimeMaskField, 'dayPeriod'>,
  hourCycle: TTimeHourCycle,
): [number, number] => {
  if (field !== 'hour') return [0, 59];
  return hourCycle === 'h12' ? [1, 12] : [0, 23];
};

/**
 * Converts a 24-hour time to display terms.
 *
 * @param time Time to convert.
 * @param hourCycle Hour cycle used by the mask.
 * @returns The time in display terms, or an empty object when no time is given.
 */
export const toPartialTime = (time: TTime | undefined, hourCycle: TTimeHourCycle): TPartialTime => {
  if (!time) return {};
  if (hourCycle === 'h23') return { ...time };

  const { hour, dayPeriod } = to12Hour(time.hour);
  return { hour, minute: time.minute, second: time.second, dayPeriod };
};

/**
 * Builds the editable segment group for a mask and a display time.
 *
 * @param mask Time mask that defines the segments.
 * @param partial Display values used to prefill the segments.
 * @returns The editable segment group.
 */
export const getTimeSegmentGroup = (mask: TTimeMask, partial: TPartialTime = {}): TTimeSegmentGroup => {
  const toValue = (value: number | undefined) => (value === undefined ? '' : padSegmentValue(value, 2));

  return createSegmentGroup(
    0,
    mask.segments,
    {
      hour: toValue(partial.hour),
      minute: toValue(partial.minute),
      second: toValue(partial.second),
      dayPeriod: partial.dayPeriod ?? '',
    },
    TIME_SEGMENT_MAX_LENGTHS,
  );
};

/**
 * Reads the visual segment draft.
 *
 * @param group Segment group to read.
 * @param hourCycle Hour cycle used by the mask.
 * @returns The complete fields and the draft status.
 */
export const readTimeSegmentGroup = (group: TTimeSegmentGroup, hourCycle: TTimeHourCycle): TTimeSegmentDraft => {
  const partial: TPartialTime = {};
  let isEmpty = true;
  let isComplete = true;
  let isInvalid = false;

  for (const { field, value, maxLength } of group.segments) {
    if (value) isEmpty = false;
    if (value.length !== maxLength) {
      isComplete = false;
      continue;
    }

    if (field === 'dayPeriod') {
      partial.dayPeriod = value as TDayPeriod;
      continue;
    }

    const numeric = Number(value);
    const [min, max] = getTimeSegmentRange(field, hourCycle);
    if (numeric < min || numeric > max) {
      isInvalid = true;
      continue;
    }
    partial[field] = numeric;
  }

  return { partial, isEmpty, isComplete: isComplete && !isInvalid, isInvalid };
};

/**
 * Converts display values to a 24-hour time when every field required by the mask is present.
 * Fields that are not part of the mask (finer than the precision) default to `0`.
 *
 * @param partial Display values.
 * @param mask Time mask that defines the required fields.
 * @returns The 24-hour time, or `undefined` when a required field is missing.
 */
export const partialToTime = (partial: TPartialTime, mask: TTimeMask): TTime | undefined => {
  for (const { field } of mask.segments) {
    if (partial[field] === undefined) return undefined;
  }
  if (partial.hour === undefined) return undefined;

  const fields = new Set(mask.segments.map(({ field }) => field));
  const hour = mask.hourCycle === 'h12' ? to24Hour(partial.hour, partial.dayPeriod ?? 'am') : partial.hour;

  return {
    hour,
    minute: fields.has('minute') ? (partial.minute ?? 0) : 0,
    second: fields.has('second') ? (partial.second ?? 0) : 0,
  };
};

/**
 * Pads a single typed digit when no second digit could keep the field in range
 * (e.g. `7` in a minute segment becomes `07`).
 *
 * @param field Numeric field being typed.
 * @param value Raw segment value after the keystroke.
 * @param hourCycle Hour cycle used by the mask.
 * @returns The value to store, padded when it is already unambiguous.
 */
export const completeTypedDigit = (
  field: Exclude<TTimeMaskField, 'dayPeriod'>,
  value: string,
  hourCycle: TTimeHourCycle,
): string => {
  if (value.length !== 1) return value;

  const [, max] = getTimeSegmentRange(field, hourCycle);
  return Number(value) * 10 > max ? value.padStart(2, '0') : value;
};

/**
 * Resolves a typed character to a day period using the localized labels.
 *
 * @param key Typed character.
 * @param dayPeriods Localized `[AM, PM]` labels.
 * @returns The matching day period, or `undefined` when the key matches neither label.
 */
export const matchDayPeriodKey = (key: string, dayPeriods: readonly [string, string]): TDayPeriod | undefined => {
  if (key.length !== 1) return undefined;

  const typed = key.toLocaleLowerCase();
  const [am, pm] = dayPeriods.map((label) => label.trim().charAt(0).toLocaleLowerCase());
  // Locales such as `ar-EG` share no first letter with Latin `a`/`p`, so accept both.
  if (typed === am && typed !== pm) return 'am';
  if (typed === pm && typed !== am) return 'pm';
  if (typed === 'a') return 'am';
  if (typed === 'p') return 'pm';
  return undefined;
};
