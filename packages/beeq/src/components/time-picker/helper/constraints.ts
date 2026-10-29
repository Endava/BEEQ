import type { TTime, TTimePrecision } from '../bq-time-picker.types';
import { parseTime, SECONDS_PER_DAY, sanitizeStep, toSeconds, truncateTime } from './time';

/** Numeric fields that can be stepped. */
export type TTimeStepField = 'hour' | 'minute' | 'second';

/** Resolved, sanitized constraints shared by segments, panel and validation. */
export type TTimeConstraints = {
  precision: TTimePrecision;
  steps: Record<TTimeStepField, number>;
  /** Inclusive lower bound, in seconds since midnight. */
  min?: number;
  /** Inclusive upper bound, in seconds since midnight. */
  max?: number;
};

type TTimeConstraintsInput = {
  precision: TTimePrecision;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  min?: string;
  max?: string;
};

/**
 * Resolves the component props into sanitized constraints.
 * Bounds are ignored when `min` is later than `max` (overnight ranges are not supported).
 *
 * @param input Raw constraint props.
 * @returns The sanitized constraints.
 */
export const createTimeConstraints = ({
  precision,
  hourStep,
  minuteStep,
  secondStep,
  min,
  max,
}: TTimeConstraintsInput): TTimeConstraints => {
  const minTime = parseTime(min);
  const maxTime = parseTime(max);
  let minSeconds = minTime ? toSeconds(minTime) : undefined;
  let maxSeconds = maxTime ? toSeconds(maxTime) : undefined;
  if (minSeconds !== undefined && maxSeconds !== undefined && minSeconds > maxSeconds) {
    minSeconds = undefined;
    maxSeconds = undefined;
  }

  return {
    precision,
    steps: {
      hour: sanitizeStep(hourStep, 23),
      minute: sanitizeStep(minuteStep, 59),
      second: sanitizeStep(secondStep, 59),
    },
    min: minSeconds,
    max: maxSeconds,
  };
};

const range = (max: number, step: number): number[] => {
  const values: number[] = [];
  for (let value = 0; value <= max; value += step) values.push(value);
  return values;
};

/**
 * Lists the values on the step grid for a field. Fields finer than the precision only accept `0`.
 *
 * @param field Field to list.
 * @param constraints Resolved constraints.
 * @returns The values on the step grid, in ascending order.
 */
export const getStepValues = (field: TTimeStepField, { precision, steps }: TTimeConstraints): number[] => {
  if (field === 'hour') return range(23, steps.hour);
  if (field === 'minute') return precision === 'hour' ? [0] : range(59, steps.minute);
  return precision === 'second' ? range(59, steps.second) : [0];
};

/**
 * Checks whether a number of seconds since midnight is inside the bounds.
 *
 * @param seconds Seconds since midnight.
 * @param constraints Resolved constraints.
 * @returns `true` when the time is inside the inclusive bounds.
 */
export const isWithinTimeBounds = (seconds: number, { min, max }: TTimeConstraints): boolean =>
  (min === undefined || seconds >= min) && (max === undefined || seconds <= max);

/**
 * Checks whether a time sits on the step grid.
 *
 * @param time Time to check.
 * @param constraints Resolved constraints.
 * @returns `true` when every field included by the precision is a multiple of its step.
 */
export const isOnTimeStep = (time: TTime, { precision, steps }: TTimeConstraints): boolean =>
  time.hour % steps.hour === 0 &&
  (precision === 'hour' || time.minute % steps.minute === 0) &&
  (precision !== 'second' || time.second % steps.second === 0);

/** Finds the first minute/second of an hour that is not before the search origin. */
const findInHour = (
  hour: number,
  minutes: number[],
  seconds: number[],
  isBeyond: (value: number) => boolean,
): TTime | undefined => {
  const lastSecond = seconds[seconds.length - 1];
  for (const minute of minutes) {
    const base = hour * 3600 + minute * 60;
    if (isBeyond(base + lastSecond)) continue;

    const second = seconds.find((value) => !isBeyond(base + value));
    if (second !== undefined) return { hour, minute, second };
  }
  return undefined;
};

/**
 * Finds the closest time on the step grid, inside the bounds, in one direction.
 *
 * @param target Seconds since midnight to start from (inclusive).
 * @param direction `1` to search forward, `-1` to search backward.
 * @param constraints Resolved constraints.
 * @returns The closest allowed time, or `undefined` when none exists in that direction.
 */
export const findAllowedTime = (
  target: number,
  direction: 1 | -1,
  constraints: TTimeConstraints,
): TTime | undefined => {
  const forward = direction === 1;
  const order = (values: number[]) => (forward ? values : [...values].reverse());
  const hours = order(getStepValues('hour', constraints));
  const minutes = order(getStepValues('minute', constraints));
  const seconds = order(getStepValues('second', constraints));
  // Edge of an hour in the search direction, used to skip whole hours that lie before `from`.
  const hourEdge = minutes[minutes.length - 1] * 60 + seconds[seconds.length - 1];
  const from = forward
    ? Math.max(target, constraints.min ?? 0)
    : Math.min(target, constraints.max ?? SECONDS_PER_DAY - 1);
  const isBeyond = (value: number) => (forward ? value < from : value > from);

  for (const hour of hours) {
    if (isBeyond(hour * 3600 + hourEdge)) continue;

    const time = findInHour(hour, minutes, seconds, isBeyond);
    if (time) return isWithinTimeBounds(toSeconds(time), constraints) ? time : undefined;
  }

  return undefined;
};

/**
 * Checks whether any allowed time exists in an inclusive window.
 *
 * @param from Window start, in seconds since midnight.
 * @param to Window end, in seconds since midnight.
 * @param constraints Resolved constraints.
 * @returns `true` when at least one allowed time falls in the window.
 */
export const hasAllowedTimeBetween = (from: number, to: number, constraints: TTimeConstraints): boolean => {
  const time = findAllowedTime(from, 1, constraints);
  return time !== undefined && toSeconds(time) <= to;
};

/**
 * Moves an out-of-bounds time to the closest allowed time. In-bounds times are returned untouched.
 *
 * @param time Time to clamp.
 * @param constraints Resolved constraints.
 * @returns The clamped time.
 */
export const clampTimeToBounds = (time: TTime, constraints: TTimeConstraints): TTime => {
  const seconds = toSeconds(time);
  const { min, max } = constraints;
  if (min !== undefined && seconds < min) return findAllowedTime(min, 1, constraints) ?? time;
  if (max !== undefined && seconds > max) return findAllowedTime(max, -1, constraints) ?? time;
  return time;
};

/**
 * Returns the current time truncated to the precision and floored to the step grid.
 *
 * @param constraints Resolved constraints.
 * @param now Reference date. Defaults to the current time.
 * @returns The snapped current time, or `undefined` when it is outside the bounds.
 */
export const getNowTime = (constraints: TTimeConstraints, now: Date = new Date()): TTime | undefined => {
  const { steps } = constraints;
  const floor = (value: number, step: number) => Math.floor(value / step) * step;
  const time = truncateTime(
    {
      hour: floor(now.getHours(), steps.hour),
      minute: floor(now.getMinutes(), steps.minute),
      second: floor(now.getSeconds(), steps.second),
    },
    constraints.precision,
  );

  return isWithinTimeBounds(toSeconds(time), constraints) ? time : undefined;
};

/**
 * Computes the constraint validity flags of a committed value.
 *
 * @param time Committed time.
 * @param constraints Resolved constraints.
 * @returns `rangeUnderflow`, `rangeOverflow` and `stepMismatch` flags. Empty when valid.
 */
export const getTimeValidityFlags = (time: TTime | undefined, constraints: TTimeConstraints): ValidityStateFlags => {
  if (!time) return {};

  const seconds = toSeconds(time);
  const flags: ValidityStateFlags = {};
  if (constraints.min !== undefined && seconds < constraints.min) flags.rangeUnderflow = true;
  if (constraints.max !== undefined && seconds > constraints.max) flags.rangeOverflow = true;
  if (!isOnTimeStep(time, constraints)) flags.stepMismatch = true;

  return flags;
};
