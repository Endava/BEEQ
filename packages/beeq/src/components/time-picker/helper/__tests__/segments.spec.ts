import { describe, expect, it } from 'vitest';

import { getTimeMask } from '../../../../shared/utils';
import {
  completeTypedDigit,
  getTimeSegmentGroup,
  getTimeSegmentRange,
  matchDayPeriodKey,
  partialToTime,
  readTimeSegmentGroup,
  toPartialTime,
} from '../segments';

const mask24 = getTimeMask('en-GB', 'second', 'h23');
const mask12 = getTimeMask('en-US', 'minute', 'h12');

describe('getTimeSegmentRange', () => {
  it('depends on the field and the hour cycle', () => {
    expect(getTimeSegmentRange('hour', 'h23')).toEqual([0, 23]);
    expect(getTimeSegmentRange('hour', 'h12')).toEqual([1, 12]);
    expect(getTimeSegmentRange('minute', 'h12')).toEqual([0, 59]);
  });
});

describe('toPartialTime', () => {
  it('converts to display terms', () => {
    expect(toPartialTime({ hour: 0, minute: 5, second: 0 }, 'h12')).toEqual({
      hour: 12,
      minute: 5,
      second: 0,
      dayPeriod: 'am',
    });
    expect(toPartialTime({ hour: 13, minute: 5, second: 0 }, 'h23')).toEqual({ hour: 13, minute: 5, second: 0 });
    expect(toPartialTime(undefined, 'h23')).toEqual({});
  });
});

describe('getTimeSegmentGroup / readTimeSegmentGroup', () => {
  it('prefills padded values and reads them back', () => {
    const group = getTimeSegmentGroup(mask24, { hour: 7, minute: 5, second: 9 });
    expect(group.segments.map((segment) => segment.value)).toEqual(['07', '05', '09']);
    expect(readTimeSegmentGroup(group, 'h23')).toEqual({
      partial: { hour: 7, minute: 5, second: 9 },
      isEmpty: false,
      isComplete: true,
      isInvalid: false,
    });
  });

  it('stores the canonical day period token', () => {
    const group = getTimeSegmentGroup(mask12, { hour: 3, minute: 0, dayPeriod: 'pm' });
    expect(group.segments.find((segment) => segment.field === 'dayPeriod')?.value).toBe('pm');
    expect(readTimeSegmentGroup(group, 'h12').partial).toEqual({ hour: 3, minute: 0, dayPeriod: 'pm' });
  });

  it('reports empty, partial and invalid drafts', () => {
    expect(readTimeSegmentGroup(getTimeSegmentGroup(mask24), 'h23')).toMatchObject({
      isEmpty: true,
      isComplete: false,
    });

    const partial = getTimeSegmentGroup(mask24, { hour: 7 });
    expect(readTimeSegmentGroup(partial, 'h23')).toMatchObject({ isEmpty: false, isComplete: false });

    const invalid = getTimeSegmentGroup(mask12, { hour: 13, minute: 0, dayPeriod: 'am' });
    expect(readTimeSegmentGroup(invalid, 'h12')).toMatchObject({ isInvalid: true, isComplete: false });
  });
});

describe('partialToTime', () => {
  it('requires every field of the mask', () => {
    expect(partialToTime({ hour: 3, minute: 15 }, mask12)).toBeUndefined();
    expect(partialToTime({ hour: 12, minute: 15, dayPeriod: 'am' }, mask12)).toEqual({
      hour: 0,
      minute: 15,
      second: 0,
    });
    expect(partialToTime({ hour: 3, minute: 15, dayPeriod: 'pm' }, mask12)).toEqual({
      hour: 15,
      minute: 15,
      second: 0,
    });
  });

  it('fixes fields outside the mask to 0', () => {
    const hourMask = getTimeMask('en-GB', 'hour', 'h23');
    expect(partialToTime({ hour: 9, minute: 45 }, hourMask)).toEqual({ hour: 9, minute: 0, second: 0 });
  });
});

describe('completeTypedDigit', () => {
  it('pads digits that cannot start a two-digit value', () => {
    expect(completeTypedDigit('hour', '2', 'h23')).toBe('2');
    expect(completeTypedDigit('hour', '3', 'h23')).toBe('03');
    expect(completeTypedDigit('hour', '1', 'h12')).toBe('1');
    expect(completeTypedDigit('hour', '2', 'h12')).toBe('02');
    expect(completeTypedDigit('minute', '5', 'h23')).toBe('5');
    expect(completeTypedDigit('minute', '6', 'h23')).toBe('06');
    expect(completeTypedDigit('minute', '45', 'h23')).toBe('45');
  });
});

describe('matchDayPeriodKey', () => {
  it('matches the first letter of the localized labels', () => {
    expect(matchDayPeriodKey('a', ['AM', 'PM'])).toBe('am');
    expect(matchDayPeriodKey('P', ['AM', 'PM'])).toBe('pm');
    expect(matchDayPeriodKey('ص', ['ص', 'م'])).toBe('am');
    expect(matchDayPeriodKey('م', ['ص', 'م'])).toBe('pm');
  });

  it('falls back to a/p and ignores other keys', () => {
    expect(matchDayPeriodKey('p', ['ص', 'م'])).toBe('pm');
    expect(matchDayPeriodKey('x', ['AM', 'PM'])).toBeUndefined();
    expect(matchDayPeriodKey('Enter', ['AM', 'PM'])).toBeUndefined();
  });
});
