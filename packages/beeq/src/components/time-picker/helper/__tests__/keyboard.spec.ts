import { describe, expect, it } from 'vitest';

import { getTimeMask } from '../../../../shared/utils';
import type { TTimeOption } from '../../bq-time-picker.types';
import {
  findOptionByValue,
  getAdjacentColumn,
  getColumnKeyMove,
  getSegmentNavigationTarget,
  isSegmentNavigationKey,
  stepSegmentValue,
  toOptionValue,
  toSegmentValue,
} from '../keyboard';
import { getTimeSegmentGroup } from '../segments';

const option = (value: TTimeOption['value'], disabled = false): TTimeOption => ({
  value,
  label: `${value}`,
  disabled,
  selected: false,
});

describe('getColumnKeyMove', () => {
  it('maps the column keys to moves', () => {
    expect(getColumnKeyMove('ArrowDown')).toBe('next');
    expect(getColumnKeyMove('ArrowUp')).toBe('previous');
    expect(getColumnKeyMove('PageDown')).toBe('pageNext');
    expect(getColumnKeyMove('PageUp')).toBe('pagePrevious');
    expect(getColumnKeyMove('Home')).toBe('first');
    expect(getColumnKeyMove('End')).toBe('last');
  });

  it('ignores other keys, including inherited object keys', () => {
    expect(getColumnKeyMove('Enter')).toBeUndefined();
    expect(getColumnKeyMove('toString')).toBeUndefined();
  });
});

describe('segment navigation', () => {
  const groups = [getTimeSegmentGroup(getTimeMask('en-GB', 'second', 'h23'))];
  const minute = { groupId: 0, field: 'minute' as const };

  it('recognizes the navigation keys', () => {
    expect(['ArrowLeft', 'ArrowRight', 'Home', 'End'].every(isSegmentNavigationKey)).toBe(true);
    expect(isSegmentNavigationKey('ArrowUp')).toBe(false);
  });

  it('moves to the adjacent segment with ArrowLeft and ArrowRight', () => {
    expect(getSegmentNavigationTarget(groups, minute, 'ArrowLeft')).toEqual({ groupId: 0, field: 'hour' });
    expect(getSegmentNavigationTarget(groups, minute, 'ArrowRight')).toEqual({ groupId: 0, field: 'second' });
  });

  it('jumps to the first or last segment with Home and End', () => {
    expect(getSegmentNavigationTarget(groups, minute, 'Home')).toEqual({ groupId: 0, field: 'hour' });
    expect(getSegmentNavigationTarget(groups, minute, 'End')).toEqual({ groupId: 0, field: 'second' });
  });

  it('returns undefined past the ends and for other keys', () => {
    expect(getSegmentNavigationTarget(groups, { groupId: 0, field: 'hour' }, 'ArrowLeft')).toBeUndefined();
    expect(getSegmentNavigationTarget(groups, minute, 'ArrowUp')).toBeUndefined();
  });
});

describe('toOptionValue / toSegmentValue', () => {
  it('converts between segment and option values', () => {
    expect(toOptionValue('hour', '07')).toBe(7);
    expect(toOptionValue('dayPeriod', 'pm')).toBe('pm');
    expect(toSegmentValue(7)).toBe('07');
    expect(toSegmentValue(42)).toBe('42');
    expect(toSegmentValue('am')).toBe('am');
  });
});

describe('stepSegmentValue', () => {
  const options = [option(0), option(15), option(30, true), option(45)];
  const segment = (value: string) => ({ field: 'minute' as const, value, maxLength: 2, placeholder: '––' });

  it('steps to the next or previous enabled option', () => {
    expect(stepSegmentValue(segment('15'), options, 1, 'h23')).toBe('45');
    expect(stepSegmentValue(segment('45'), options, -1, 'h23')).toBe('15');
  });

  it('wraps around', () => {
    expect(stepSegmentValue(segment('45'), options, 1, 'h23')).toBe('00');
    expect(stepSegmentValue(segment('00'), options, -1, 'h23')).toBe('45');
  });

  it('starts an incomplete segment from the first or last option', () => {
    expect(stepSegmentValue(segment('1'), options, 1, 'h23')).toBe('00');
    expect(stepSegmentValue(segment(''), options, -1, 'h23')).toBe('45');
  });

  it('returns undefined when no option is enabled', () => {
    expect(stepSegmentValue(segment('15'), [option(0, true)], 1, 'h23')).toBeUndefined();
  });
});

describe('getAdjacentColumn', () => {
  const columns = ['hour', 'minute', 'second'] as const;

  it('moves with ArrowLeft and ArrowRight', () => {
    expect(getAdjacentColumn(columns, 'minute', 'ArrowLeft', false)).toBe('hour');
    expect(getAdjacentColumn(columns, 'minute', 'ArrowRight', false)).toBe('second');
  });

  it('mirrors the direction in right-to-left layouts', () => {
    expect(getAdjacentColumn(columns, 'minute', 'ArrowLeft', true)).toBe('second');
    expect(getAdjacentColumn(columns, 'minute', 'ArrowRight', true)).toBe('hour');
  });

  it('returns undefined at the ends and for other keys', () => {
    expect(getAdjacentColumn(columns, 'second', 'ArrowRight', false)).toBeUndefined();
    expect(getAdjacentColumn(columns, 'hour', 'ArrowLeft', false)).toBeUndefined();
    expect(getAdjacentColumn(columns, 'minute', 'ArrowDown', false)).toBeUndefined();
  });
});

describe('findOptionByValue', () => {
  it('matches the rendered data-value', () => {
    const options = [option(0), option(5), option('am')];
    expect(findOptionByValue(options, '5')).toBe(options[1]);
    expect(findOptionByValue(options, 'am')).toBe(options[2]);
    expect(findOptionByValue(options, '7')).toBeUndefined();
    expect(findOptionByValue(options, undefined)).toBeUndefined();
  });
});
