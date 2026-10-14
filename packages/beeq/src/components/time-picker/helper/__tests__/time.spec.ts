import { describe, expect, it } from 'vitest';

import {
  fromSeconds,
  normalizeTimeValue,
  parseTime,
  sanitizeStep,
  serializeTime,
  to12Hour,
  to24Hour,
  toSeconds,
  truncateTime,
} from '../time';

describe('parseTime', () => {
  it('parses HH:mm and HH:mm:ss', () => {
    expect(parseTime('09:05')).toEqual({ hour: 9, minute: 5, second: 0 });
    expect(parseTime('23:59:58')).toEqual({ hour: 23, minute: 59, second: 58 });
  });

  it('rejects empty, malformed or out-of-range values', () => {
    for (const value of [undefined, null, '', '9:05', '24:00', '12:60', '12:00:60', '12-00', '12:00:00:00']) {
      expect(parseTime(value)).toBeUndefined();
    }
  });
});

describe('serializeTime / truncateTime', () => {
  const time = { hour: 7, minute: 8, second: 9 };

  it('serializes to the precision-aware wire format', () => {
    expect(serializeTime(time, 'hour')).toBe('07:00');
    expect(serializeTime(time, 'minute')).toBe('07:08');
    expect(serializeTime(time, 'second')).toBe('07:08:09');
  });

  it('drops fields finer than the precision', () => {
    expect(truncateTime(time, 'hour')).toEqual({ hour: 7, minute: 0, second: 0 });
    expect(truncateTime(time, 'minute')).toEqual({ hour: 7, minute: 8, second: 0 });
  });
});

describe('normalizeTimeValue', () => {
  it('normalizes valid values to the precision', () => {
    expect(normalizeTimeValue('14:30:15', 'minute')).toBe('14:30');
    expect(normalizeTimeValue('14:30', 'second')).toBe('14:30:00');
    expect(normalizeTimeValue('14:30', 'hour')).toBe('14:00');
  });

  it('returns undefined for invalid values', () => {
    expect(normalizeTimeValue('nope', 'minute')).toBeUndefined();
    expect(normalizeTimeValue(undefined, 'minute')).toBeUndefined();
  });
});

describe('seconds conversion', () => {
  it('round-trips between times and seconds', () => {
    expect(toSeconds({ hour: 1, minute: 2, second: 3 })).toBe(3723);
    expect(fromSeconds(3723)).toEqual({ hour: 1, minute: 2, second: 3 });
  });
});

describe('12-hour conversion', () => {
  it('maps 24-hour values to display hours and day periods', () => {
    expect(to12Hour(0)).toEqual({ hour: 12, dayPeriod: 'am' });
    expect(to12Hour(11)).toEqual({ hour: 11, dayPeriod: 'am' });
    expect(to12Hour(12)).toEqual({ hour: 12, dayPeriod: 'pm' });
    expect(to12Hour(23)).toEqual({ hour: 11, dayPeriod: 'pm' });
  });

  it('maps display hours back to the 24-hour clock', () => {
    expect(to24Hour(12, 'am')).toBe(0);
    expect(to24Hour(1, 'am')).toBe(1);
    expect(to24Hour(12, 'pm')).toBe(12);
    expect(to24Hour(11, 'pm')).toBe(23);
  });
});

describe('sanitizeStep', () => {
  it('coerces invalid steps to 1 and caps large ones', () => {
    expect(sanitizeStep(undefined, 59)).toBe(1);
    expect(sanitizeStep(0, 59)).toBe(1);
    expect(sanitizeStep(Number.NaN, 59)).toBe(1);
    expect(sanitizeStep('15', 59)).toBe(15);
    expect(sanitizeStep(7.8, 59)).toBe(7);
    expect(sanitizeStep(90, 59)).toBe(59);
  });
});
