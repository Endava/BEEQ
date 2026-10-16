import {
  getAdjacentSegmentKey,
  getSegmentGroupBoundaryKey,
  type TTimeHourCycle,
  type TTimeMaskField,
} from '../../../shared/utils';
import type { TDayPeriod, TTimeOption } from '../bq-time-picker.types';
import { stepColumnOption, type TColumnMove } from './options';
import type { TTimeSegment, TTimeSegmentGroup, TTimeSegmentKey } from './segments';

/** Keyboard keys mapped to panel column moves. */
const COLUMN_KEY_MOVES: Readonly<Record<string, TColumnMove>> = {
  ArrowDown: 'next',
  ArrowUp: 'previous',
  PageDown: 'pageNext',
  PageUp: 'pagePrevious',
  Home: 'first',
  End: 'last',
};

const SEGMENT_NAVIGATION_KEYS: readonly string[] = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

/** Returns the column move bound to a key, if any. */
export const getColumnKeyMove = (key: string): TColumnMove | undefined =>
  Object.hasOwn(COLUMN_KEY_MOVES, key) ? COLUMN_KEY_MOVES[key] : undefined;

/** Whether the key moves focus between the segments. */
export const isSegmentNavigationKey = (key: string): boolean => SEGMENT_NAVIGATION_KEYS.includes(key);

/**
 * Resolves the segment a navigation key moves to: Home and End jump to the first or last segment,
 * ArrowLeft and ArrowRight move to the adjacent one.
 */
export const getSegmentNavigationTarget = (
  groups: readonly TTimeSegmentGroup[],
  current: TTimeSegmentKey,
  key: string,
): TTimeSegmentKey | undefined => {
  if (key === 'Home' || key === 'End') return getSegmentGroupBoundaryKey(groups[0], key === 'Home' ? 'start' : 'end');
  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    return getAdjacentSegmentKey(groups, current, key === 'ArrowLeft' ? -1 : 1);
  }
  return undefined;
};

/** Converts a segment value to the value of its panel option. */
export const toOptionValue = (field: TTimeMaskField, value: string): number | TDayPeriod =>
  field === 'dayPeriod' ? (value as TDayPeriod) : Number(value);

/** Converts a panel option value to a segment value. */
export const toSegmentValue = (value: number | TDayPeriod): string =>
  typeof value === 'number' ? `${value}`.padStart(2, '0') : value;

/**
 * Steps a segment to the next or previous enabled option, wrapping around.
 * An incomplete segment starts from the first or last option.
 *
 * @returns The new segment value, or `undefined` when no option is enabled.
 */
export const stepSegmentValue = (
  segment: TTimeSegment,
  options: TTimeOption[],
  direction: 1 | -1,
  hourCycle: TTimeHourCycle,
): string | undefined => {
  const isComplete = segment.value.length === segment.maxLength;
  const current = isComplete ? toOptionValue(segment.field, segment.value) : undefined;
  const next = stepColumnOption(options, current, direction, segment.field, hourCycle);
  return next ? toSegmentValue(next.value) : undefined;
};

/**
 * Resolves the column ArrowLeft or ArrowRight moves to. The direction is mirrored in right-to-left layouts.
 *
 * @returns The adjacent column, or `undefined` at either end or for any other key.
 */
export const getAdjacentColumn = (
  columns: readonly TTimeMaskField[],
  current: TTimeMaskField,
  key: string,
  isRtl: boolean,
): TTimeMaskField | undefined => {
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return undefined;

  const forward = (key === 'ArrowRight') !== isRtl;
  return columns[columns.indexOf(current) + (forward ? 1 : -1)];
};

/** Finds the option rendered with a `data-value`, e.g. the option that received a key press. */
export const findOptionByValue = (options: TTimeOption[], value: string | undefined): TTimeOption | undefined =>
  options.find((option) => `${option.value}` === value);
