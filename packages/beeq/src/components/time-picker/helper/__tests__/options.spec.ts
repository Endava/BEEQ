import { describe, expect, it } from 'vitest';

import { createTimeConstraints } from '../constraints';
import { applyColumnPick, getColumnOptions, resolvePartialTime } from '../options';

const dayPeriods = ['AM', 'PM'] as const;

describe('resolvePartialTime', () => {
  const constraints = createTimeConstraints({ precision: 'minute', minuteStep: 15, min: '09:30', max: '17:00' });

  it('fills missing fields with the first allowed time', () => {
    expect(resolvePartialTime({}, 'h23', constraints)).toEqual({ hour: 9, minute: 30, second: 0 });
    expect(resolvePartialTime({ hour: 10 }, 'h23', constraints)).toEqual({ hour: 10, minute: 0, second: 0 });
    expect(resolvePartialTime({ minute: 45 }, 'h23', constraints)).toEqual({ hour: 9, minute: 45, second: 0 });
  });

  it('keeps known fields even when no allowed time matches', () => {
    expect(resolvePartialTime({ hour: 20, minute: 7 }, 'h23', constraints)).toEqual({ hour: 20, minute: 7, second: 0 });
  });

  it('resolves 12-hour drafts', () => {
    expect(resolvePartialTime({ hour: 3 }, 'h12', constraints)).toEqual({ hour: 15, minute: 0, second: 0 });
    expect(resolvePartialTime({ dayPeriod: 'pm' }, 'h12', constraints)).toEqual({ hour: 12, minute: 0, second: 0 });
  });
});

describe('getColumnOptions', () => {
  it('lists 24-hour options with disabled out-of-range hours', () => {
    const constraints = createTimeConstraints({ precision: 'minute', min: '09:30', max: '17:00' });
    const options = getColumnOptions('hour', { constraints, hourCycle: 'h23', dayPeriods, selected: { hour: 10 } });

    expect(options).toHaveLength(24);
    expect(options[8]).toMatchObject({ value: 8, label: '08', disabled: true, selected: false });
    expect(options[9]).toMatchObject({ value: 9, disabled: false });
    expect(options[10]).toMatchObject({ value: 10, selected: true });
    expect(options[17]).toMatchObject({ value: 17, disabled: false });
    expect(options[18]).toMatchObject({ disabled: true });
  });

  it('lists minutes on the step and disables them relative to the selected hour', () => {
    const constraints = createTimeConstraints({ precision: 'minute', minuteStep: 15, min: '09:30' });
    const options = getColumnOptions('minute', { constraints, hourCycle: 'h23', dayPeriods, selected: { hour: 9 } });

    expect(options.map((option) => option.label)).toEqual(['00', '15', '30', '45']);
    expect(options.map((option) => option.disabled)).toEqual([true, true, false, false]);
  });

  it('disables seconds outside the bounds', () => {
    const constraints = createTimeConstraints({ precision: 'second', secondStep: 30, max: '10:00:15' });
    const options = getColumnOptions('second', {
      constraints,
      hourCycle: 'h23',
      dayPeriods,
      selected: { hour: 10, minute: 0 },
    });

    expect(options.map((option) => option.disabled)).toEqual([false, true]);
  });

  it('lists 12-hour options for the current day period starting at 12', () => {
    const constraints = createTimeConstraints({ precision: 'minute', min: '13:00' });
    const options = getColumnOptions('hour', {
      constraints,
      hourCycle: 'h12',
      dayPeriods,
      selected: { dayPeriod: 'pm', hour: 3 },
    });

    expect(options.map((option) => option.value)).toEqual([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(options[0].disabled).toBe(true);
    expect(options[3]).toMatchObject({ disabled: false, selected: true });
  });

  it('uses the period of the first allowed time when none is selected', () => {
    const constraints = createTimeConstraints({ precision: 'minute', min: '13:00' });
    const options = getColumnOptions('hour', { constraints, hourCycle: 'h12', dayPeriods, selected: {} });

    expect(options.every((option) => option.disabled === (option.value === 12))).toBe(true);
  });

  it('builds localized day period options', () => {
    const constraints = createTimeConstraints({ precision: 'minute', max: '11:00' });
    const options = getColumnOptions('dayPeriod', {
      constraints,
      hourCycle: 'h12',
      dayPeriods: ['a. m.', 'p. m.'],
      selected: { dayPeriod: 'am' },
    });

    expect(options).toEqual([
      { value: 'am', label: 'a. m.', disabled: false, selected: true },
      { value: 'pm', label: 'p. m.', disabled: true, selected: false },
    ]);
  });
});

describe('applyColumnPick', () => {
  it('updates one field of the draft', () => {
    expect(applyColumnPick({ hour: 9, minute: 15 }, 'minute', 30)).toEqual({ hour: 9, minute: 30 });
    expect(applyColumnPick({ hour: 9 }, 'dayPeriod', 'pm')).toEqual({ hour: 9, dayPeriod: 'pm' });
  });
});
