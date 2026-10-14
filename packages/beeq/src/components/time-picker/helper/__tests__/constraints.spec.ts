import { describe, expect, it } from 'vitest';

import {
  clampTimeToBounds,
  createTimeConstraints,
  findAllowedTime,
  getNowTime,
  getStepValues,
  getTimeValidityFlags,
  hasAllowedTimeBetween,
  isOnTimeStep,
} from '../constraints';

const at = (hour: number, minute = 0, second = 0) => ({ hour, minute, second });

describe('createTimeConstraints', () => {
  it('parses bounds to seconds and sanitizes steps', () => {
    expect(
      createTimeConstraints({ precision: 'minute', min: '09:00', max: '17:30', minuteStep: 15, hourStep: 0 }),
    ).toEqual({ precision: 'minute', steps: { hour: 1, minute: 15, second: 1 }, min: 32_400, max: 63_000 });
  });

  it('ignores inverted bounds', () => {
    const constraints = createTimeConstraints({ precision: 'minute', min: '18:00', max: '08:00' });
    expect(constraints.min).toBeUndefined();
    expect(constraints.max).toBeUndefined();
  });
});

describe('getStepValues', () => {
  it('lists values on the step grid and fixes finer fields to 0', () => {
    const constraints = createTimeConstraints({ precision: 'minute', minuteStep: 20, hourStep: 6 });
    expect(getStepValues('hour', constraints)).toEqual([0, 6, 12, 18]);
    expect(getStepValues('minute', constraints)).toEqual([0, 20, 40]);
    expect(getStepValues('second', constraints)).toEqual([0]);
    expect(getStepValues('minute', createTimeConstraints({ precision: 'hour' }))).toEqual([0]);
  });
});

describe('isOnTimeStep', () => {
  it('only checks the fields included by the precision', () => {
    const constraints = createTimeConstraints({ precision: 'minute', minuteStep: 15, secondStep: 30 });
    expect(isOnTimeStep(at(10, 30, 7), constraints)).toBe(true);
    expect(isOnTimeStep(at(10, 31), constraints)).toBe(false);
  });
});

describe('findAllowedTime', () => {
  const constraints = createTimeConstraints({ precision: 'minute', minuteStep: 15, min: '09:07', max: '17:50' });

  it('finds the next allowed time forward', () => {
    expect(findAllowedTime(0, 1, constraints)).toEqual(at(9, 15));
    expect(findAllowedTime(10 * 3600 + 1, 1, constraints)).toEqual(at(10, 15));
  });

  it('finds the previous allowed time backward', () => {
    expect(findAllowedTime(86_399, -1, constraints)).toEqual(at(17, 45));
    expect(findAllowedTime(12 * 3600 + 14 * 60, -1, constraints)).toEqual(at(12));
  });

  it('returns undefined beyond the bounds', () => {
    expect(findAllowedTime(17 * 3600 + 46 * 60, 1, constraints)).toBeUndefined();
    expect(findAllowedTime(9 * 3600, -1, constraints)).toBeUndefined();
  });
});

describe('hasAllowedTimeBetween', () => {
  it('tells whether a window contains an allowed time', () => {
    const constraints = createTimeConstraints({ precision: 'minute', min: '09:30', max: '10:10' });
    expect(hasAllowedTimeBetween(9 * 3600, 9 * 3600 + 59 * 60, constraints)).toBe(true);
    expect(hasAllowedTimeBetween(8 * 3600, 8 * 3600 + 59 * 60, constraints)).toBe(false);
  });
});

describe('clampTimeToBounds', () => {
  const constraints = createTimeConstraints({ precision: 'minute', minuteStep: 5, min: '09:02', max: '17:58' });

  it('moves out-of-bounds times to the closest allowed time', () => {
    expect(clampTimeToBounds(at(8), constraints)).toEqual(at(9, 5));
    expect(clampTimeToBounds(at(19), constraints)).toEqual(at(17, 55));
  });

  it('keeps in-bounds times untouched, even off the step grid', () => {
    expect(clampTimeToBounds(at(12, 3), constraints)).toEqual(at(12, 3));
  });
});

describe('getNowTime', () => {
  const now = new Date(2026, 0, 1, 14, 37, 42);

  it('truncates to the precision and floors to the step', () => {
    expect(getNowTime(createTimeConstraints({ precision: 'minute', minuteStep: 15 }), now)).toEqual(at(14, 30));
    expect(getNowTime(createTimeConstraints({ precision: 'second', secondStep: 10 }), now)).toEqual(at(14, 37, 40));
    expect(getNowTime(createTimeConstraints({ precision: 'hour' }), now)).toEqual(at(14));
  });

  it('returns undefined outside the bounds', () => {
    expect(getNowTime(createTimeConstraints({ precision: 'minute', max: '12:00' }), now)).toBeUndefined();
  });
});

describe('getTimeValidityFlags', () => {
  const constraints = createTimeConstraints({ precision: 'minute', minuteStep: 15, min: '09:00', max: '17:00' });

  it('flags range and step violations', () => {
    expect(getTimeValidityFlags(at(8), constraints)).toEqual({ rangeUnderflow: true });
    expect(getTimeValidityFlags(at(18), constraints)).toEqual({ rangeOverflow: true });
    expect(getTimeValidityFlags(at(10, 10), constraints)).toEqual({ stepMismatch: true });
  });

  it('returns no flags for valid or empty values', () => {
    expect(getTimeValidityFlags(at(10, 15), constraints)).toEqual({});
    expect(getTimeValidityFlags(undefined, constraints)).toEqual({});
  });
});
