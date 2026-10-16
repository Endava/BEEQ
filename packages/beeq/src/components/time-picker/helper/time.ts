import type { TDayPeriod, TTime, TTimePrecision } from '../bq-time-picker.types';

/** Number of seconds in one day. */
export const SECONDS_PER_DAY = 86_400;

/** Strict wire format: `HH:mm` or `HH:mm:ss` on the 24-hour clock. */
const TIME_PATTERN = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

/**
 * Parses a 24-hour `HH:mm` or `HH:mm:ss` string.
 *
 * @param value Wire value to parse.
 * @returns The parsed time, or `undefined` when the value is empty or invalid.
 */
export const parseTime = (value: string | undefined | null): TTime | undefined => {
  if (!value) return undefined;

  const match = TIME_PATTERN.exec(value.trim());
  if (!match) return undefined;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] === undefined ? 0 : Number(match[3]);
  if (hour > 23 || minute > 59 || second > 59) return undefined;

  return { hour, minute, second };
};

/**
 * Drops the fields that are finer than the precision.
 *
 * @param time Time to truncate.
 * @param precision Smallest unit to keep.
 * @returns The truncated time.
 */
export const truncateTime = (time: TTime, precision: TTimePrecision): TTime => ({
  hour: time.hour,
  minute: precision === 'hour' ? 0 : time.minute,
  second: precision === 'second' ? time.second : 0,
});

const pad = (value: number): string => `${value}`.padStart(2, '0');

/**
 * Serializes a time to the precision-aware wire format.
 *
 * @param time Time to serialize.
 * @param precision Smallest unit to include.
 * @returns `HH:00`, `HH:mm` or `HH:mm:ss`.
 */
export const serializeTime = (time: TTime, precision: TTimePrecision): string => {
  const { hour, minute, second } = truncateTime(time, precision);
  const base = `${pad(hour)}:${pad(minute)}`;
  return precision === 'second' ? `${base}:${pad(second)}` : base;
};

/**
 * Normalizes a wire value to the precision-aware format.
 *
 * @param value Wire value to normalize.
 * @param precision Smallest unit to include.
 * @returns The normalized value, or `undefined` when the value is empty or invalid.
 */
export const normalizeTimeValue = (value: string | undefined | null, precision: TTimePrecision): string | undefined => {
  const time = parseTime(value);
  return time ? serializeTime(time, precision) : undefined;
};

/**
 * Converts a time to seconds since midnight.
 *
 * @param time Time to convert.
 * @returns Seconds since midnight.
 */
export const toSeconds = ({ hour, minute, second }: TTime): number => hour * 3600 + minute * 60 + second;

/**
 * Converts seconds since midnight to a time.
 *
 * @param seconds Seconds since midnight.
 * @returns The matching time.
 */
export const fromSeconds = (seconds: number): TTime => ({
  hour: Math.floor(seconds / 3600),
  minute: Math.floor((seconds % 3600) / 60),
  second: seconds % 60,
});

/**
 * Converts a 24-hour value to its 12-hour display hour and day period.
 *
 * @param hour Hour on the 24-hour clock (0–23).
 * @returns The display hour (1–12) and its day period.
 */
export const to12Hour = (hour: number): { hour: number; dayPeriod: TDayPeriod } => ({
  hour: hour % 12 === 0 ? 12 : hour % 12,
  dayPeriod: hour < 12 ? 'am' : 'pm',
});

/**
 * Converts a 12-hour display hour and day period to the 24-hour clock.
 *
 * @param hour Display hour (1–12).
 * @param dayPeriod Day period.
 * @returns Hour on the 24-hour clock (0–23).
 */
export const to24Hour = (hour: number, dayPeriod: TDayPeriod): number => (hour % 12) + (dayPeriod === 'pm' ? 12 : 0);

/**
 * Coerces a step prop to a safe integer.
 *
 * @param step Raw step value.
 * @param max Largest meaningful step for the field.
 * @returns An integer between 1 and `max`.
 */
export const sanitizeStep = (step: number | string | undefined, max: number): number => {
  const value = Math.floor(Number(step));
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(value, max);
};
