import type { TTimeHourCycle, TTimeMaskField } from '../../../shared/utils';
import type { TDayPeriod, TPartialTime, TTime, TTimeOption } from '../bq-time-picker.types';
import { getStepValues, hasAllowedTimeBetween, isWithinTimeBounds, type TTimeConstraints } from './constraints';
import { to12Hour, to24Hour, toSeconds } from './time';

const HALF_DAY = 43_200;

const pad = (value: number): string => `${value}`.padStart(2, '0');

const first = <T>(values: T[]): T | undefined => values[0];

/** Hours (24-hour clock) that match the known display hour and day period. */
const getHourCandidates = (partial: TPartialTime, hourCycle: TTimeHourCycle, constraints: TTimeConstraints) => {
  if (partial.hour !== undefined) {
    if (hourCycle === 'h23') return [partial.hour];
    if (partial.dayPeriod) return [to24Hour(partial.hour, partial.dayPeriod)];
    return [to24Hour(partial.hour, 'am'), to24Hour(partial.hour, 'pm')];
  }

  const hours = getStepValues('hour', constraints);
  if (hourCycle === 'h23' || !partial.dayPeriod) return hours;
  return hours.filter((hour) => to12Hour(hour).dayPeriod === partial.dayPeriod);
};

/** Returns the first combination, in ascending order, that is inside the bounds. */
const findFirstWithinBounds = (
  hours: number[],
  minutes: number[],
  seconds: number[],
  constraints: TTimeConstraints,
): TTime | undefined => {
  for (const hour of hours) {
    for (const minute of minutes) {
      const second = seconds.find((value) =>
        isWithinTimeBounds(toSeconds({ hour, minute, second: value }), constraints),
      );
      if (second !== undefined) return { hour, minute, second };
    }
  }
  return undefined;
};

/**
 * Fills the missing fields of a display draft, preferring the first allowed time.
 * Known fields are kept as typed, even when they are off the step grid.
 *
 * @param partial Display draft.
 * @param hourCycle Hour cycle used by the mask.
 * @param constraints Resolved constraints.
 * @returns The first allowed matching time, the first matching time when none is allowed,
 * or `undefined` when no hour matches the draft.
 */
export const resolvePartialTime = (
  partial: TPartialTime,
  hourCycle: TTimeHourCycle,
  constraints: TTimeConstraints,
): TTime | undefined => {
  const { precision } = constraints;
  const hours = getHourCandidates(partial, hourCycle, constraints);
  const minutes =
    precision !== 'hour' && partial.minute !== undefined ? [partial.minute] : getStepValues('minute', constraints);
  const seconds =
    precision === 'second' && partial.second !== undefined ? [partial.second] : getStepValues('second', constraints);

  const allowed = findFirstWithinBounds(hours, minutes, seconds, constraints);
  if (allowed) return allowed;

  const hour = first(hours);
  if (hour === undefined) return undefined;
  return { hour, minute: first(minutes) ?? 0, second: first(seconds) ?? 0 };
};

type TColumnContext = {
  constraints: TTimeConstraints;
  hourCycle: TTimeHourCycle;
  dayPeriods: readonly [string, string];
  /** Display values currently shown in the field. */
  selected: TPartialTime;
};

const getLastValue = (values: number[]): number => values[values.length - 1] ?? 0;

const getHourOptions = ({ constraints, hourCycle, selected }: TColumnContext): TTimeOption[] => {
  const lastMinute = getLastValue(getStepValues('minute', constraints));
  const lastSecond = getLastValue(getStepValues('second', constraints));
  const isHourDisabled = (hour: number) =>
    !hasAllowedTimeBetween(hour * 3600, hour * 3600 + lastMinute * 60 + lastSecond, constraints);
  const hours = getStepValues('hour', constraints);

  if (hourCycle === 'h23') {
    return hours.map((hour) => ({
      value: hour,
      label: pad(hour),
      disabled: isHourDisabled(hour),
      selected: selected.hour === hour,
    }));
  }

  const resolved = resolvePartialTime(selected, hourCycle, constraints);
  const dayPeriod = selected.dayPeriod ?? (resolved ? to12Hour(resolved.hour).dayPeriod : 'am');

  return hours
    .filter((hour) => to12Hour(hour).dayPeriod === dayPeriod)
    .map((hour) => {
      const display = to12Hour(hour).hour;
      return {
        value: display,
        label: pad(display),
        disabled: isHourDisabled(hour),
        selected: selected.hour === display,
      };
    });
};

const getMinuteOptions = ({ constraints, hourCycle, selected }: TColumnContext): TTimeOption[] => {
  const base = resolvePartialTime(selected, hourCycle, constraints);
  const lastSecond = getLastValue(getStepValues('second', constraints));

  return getStepValues('minute', constraints).map((minute) => {
    const start = base ? base.hour * 3600 + minute * 60 : undefined;
    return {
      value: minute,
      label: pad(minute),
      disabled: start === undefined || !hasAllowedTimeBetween(start, start + lastSecond, constraints),
      selected: selected.minute === minute,
    };
  });
};

const getSecondOptions = ({ constraints, hourCycle, selected }: TColumnContext): TTimeOption[] => {
  const base = resolvePartialTime(selected, hourCycle, constraints);

  return getStepValues('second', constraints).map((second) => ({
    value: second,
    label: pad(second),
    disabled: !base || !isWithinTimeBounds(base.hour * 3600 + base.minute * 60 + second, constraints),
    selected: selected.second === second,
  }));
};

const getDayPeriodOptions = ({ constraints, dayPeriods, selected }: TColumnContext): TTimeOption[] =>
  (['am', 'pm'] as const).map((dayPeriod, index) => {
    const start = index * HALF_DAY;
    return {
      value: dayPeriod,
      label: dayPeriods[index],
      disabled: !hasAllowedTimeBetween(start, start + HALF_DAY - 1, constraints),
      selected: selected.dayPeriod === dayPeriod,
    };
  });

/**
 * Builds the options of a panel column.
 *
 * Options are listed on the step grid. An option is disabled when no allowed time can be
 * reached by picking it, given the other fields currently shown in the field.
 *
 * @param column Column to build.
 * @param context Constraints, hour cycle, localized day periods and the current display values.
 * @returns The column options.
 */
export const getColumnOptions = (column: TTimeMaskField, context: TColumnContext): TTimeOption[] => {
  if (column === 'hour') return getHourOptions(context);
  if (column === 'minute') return getMinuteOptions(context);
  if (column === 'second') return getSecondOptions(context);
  return getDayPeriodOptions(context);
};

/**
 * Applies a column pick to a display draft.
 *
 * @param partial Current display draft.
 * @param column Picked column.
 * @param value Picked option value.
 * @returns The updated display draft.
 */
export const applyColumnPick = (
  partial: TPartialTime,
  column: TTimeMaskField,
  value: number | TDayPeriod,
): TPartialTime => ({ ...partial, [column]: value });

/** Position of a value in a column, so that `12 AM`/`12 PM` sort before `1`. */
const getOptionOrder = (value: number | TDayPeriod, column: TTimeMaskField, hourCycle: TTimeHourCycle): number => {
  if (value === 'am') return 0;
  if (value === 'pm') return 1;
  return column === 'hour' && hourCycle === 'h12' ? value % 12 : value;
};

/**
 * Finds the next enabled option of a column in one direction, wrapping around the ends.
 * Values off the step grid step to the closest enabled option in that direction.
 *
 * @param options Column options, in display order.
 * @param current Current value, or `undefined` when the field is empty.
 * @param direction `1` for the next option, `-1` for the previous one.
 * @param column Column the options belong to.
 * @param hourCycle Hour cycle used by the mask.
 * @returns The next enabled option, or `undefined` when every option is disabled.
 */
export const stepColumnOption = (
  options: TTimeOption[],
  current: number | TDayPeriod | undefined,
  direction: 1 | -1,
  column: TTimeMaskField,
  hourCycle: TTimeHourCycle,
): TTimeOption | undefined => {
  const enabled = options.filter((option) => !option.disabled);
  const firstOption = enabled[0];
  const lastOption = enabled[enabled.length - 1];
  if (current === undefined) return direction === 1 ? firstOption : lastOption;

  const order = getOptionOrder(current, column, hourCycle);
  const orderOf = (option: TTimeOption) => getOptionOrder(option.value, column, hourCycle);
  if (direction === 1) return enabled.find((option) => orderOf(option) > order) ?? firstOption;
  return [...enabled].reverse().find((option) => orderOf(option) < order) ?? lastOption;
};

/** Keyboard moves supported inside a panel column. */
export type TColumnMove = 'next' | 'previous' | 'pageNext' | 'pagePrevious' | 'first' | 'last';

/** Number of options skipped by PageUp/PageDown. */
const COLUMN_PAGE_SIZE = 5;

const COLUMN_MOVE_DELTAS: Record<'next' | 'previous' | 'pageNext' | 'pagePrevious', number> = {
  next: 1,
  previous: -1,
  pageNext: COLUMN_PAGE_SIZE,
  pagePrevious: -COLUMN_PAGE_SIZE,
};

/**
 * Finds the enabled option reached by a keyboard move inside a panel column, without wrapping.
 *
 * @param options Column options, in display order.
 * @param current Currently selected value, or `undefined` when none is selected.
 * @param move Keyboard move.
 * @param column Column the options belong to.
 * @param hourCycle Hour cycle used by the mask.
 * @returns The target option, or `undefined` when every option is disabled.
 */
export const moveColumnOption = (
  options: TTimeOption[],
  current: number | TDayPeriod | undefined,
  move: TColumnMove,
  column: TTimeMaskField,
  hourCycle: TTimeHourCycle,
): TTimeOption | undefined => {
  const enabled = options.filter((option) => !option.disabled);
  const lastIndex = enabled.length - 1;
  if (move === 'first') return enabled[0];
  if (move === 'last') return enabled[lastIndex];

  const delta = COLUMN_MOVE_DELTAS[move];
  const index = enabled.findIndex((option) => option.value === current);
  if (index === -1) return stepColumnOption(options, current, delta > 0 ? 1 : -1, column, hourCycle);

  return enabled[Math.min(lastIndex, Math.max(0, index + delta))];
};
