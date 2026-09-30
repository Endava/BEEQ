import { describe, expect, it } from 'vitest';

import { formatDate, formatMonth, formatYear, getMonthNames, getWeekdayNames } from '../intl';

describe('date-picker Intl helpers', () => {
  const date = new Date(2024, 0, 7);

  it('formats dates, months, and years using the requested locale and options', () => {
    expect(formatDate(date, 'en-GB', { dateStyle: 'full' })).toBe(
      new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date),
    );
    expect(formatMonth(date, 'en-GB', 'long', false)).toBe('January');
    expect(formatMonth(date, 'en-GB', 'short', true)).toBe('Jan 2024');
    expect(formatYear(date, 'en-GB')).toBe('2024');
  });

  it('returns seven localized weekday names ordered from the requested first day', () => {
    const mondayFirst = getWeekdayNames('en-US', 1, 'short');
    const sundayFirst = getWeekdayNames('en-US', 0, 'short');

    expect(mondayFirst).toHaveLength(7);
    expect(mondayFirst[0].long).toBe('Monday');
    expect(mondayFirst[6].long).toBe('Sunday');
    expect(sundayFirst[0].long).toBe('Sunday');
    expect(mondayFirst.map(({ long }) => long).sort()).toEqual(sundayFirst.map(({ long }) => long).sort());
  });

  it('returns twelve localized month names in calendar order', () => {
    const months = getMonthNames('en-US', 'long');

    expect(months).toHaveLength(12);
    expect(months[0]).toBe('January');
    expect(months[11]).toBe('December');
  });
});
