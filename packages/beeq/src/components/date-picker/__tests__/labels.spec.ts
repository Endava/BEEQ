import { describe, expect, it } from 'vitest';

import { getHeaderLabel, getHeaderTitleLabel, getNextLabel, getPreviousLabel } from '../helper/labels';

describe('getHeaderLabel', () => {
  it('returns a localized "Month Year" for a single days view', () => {
    const label = getHeaderLabel({
      view: 'days',
      viewDate: new Date(2026, 6, 15),
      focusedYear: 2026,
      decadeStart: 2020,
      monthCount: 1,
      locale: 'en-GB',
    });
    expect(label).toBe('July 2026');
  });

  it('returns a single year when the multi-month range stays in one year', () => {
    const label = getHeaderLabel({
      view: 'days',
      viewDate: new Date(2026, 0, 1),
      focusedYear: 2026,
      decadeStart: 2020,
      monthCount: 2,
      locale: 'en-GB',
    });
    expect(label).toBe('2026');
  });

  it('returns a "startYear – endYear" range when the multi-month view crosses a year boundary', () => {
    const label = getHeaderLabel({
      view: 'days',
      viewDate: new Date(2026, 11, 1),
      focusedYear: 2026,
      decadeStart: 2020,
      monthCount: 2,
      locale: 'en-GB',
    });
    expect(label).toBe('2026 – 2027');
  });

  it('returns the focused year for the months view', () => {
    const label = getHeaderLabel({
      view: 'months',
      viewDate: new Date(2026, 6, 15),
      focusedYear: 2030,
      decadeStart: 2020,
      monthCount: 1,
      locale: 'en-GB',
    });
    expect(label).toBe('2030');
  });

  it('returns the closed decade range for the years view', () => {
    const label = getHeaderLabel({
      view: 'years',
      viewDate: new Date(2026, 6, 15),
      focusedYear: 2026,
      decadeStart: 2020,
      monthCount: 1,
      locale: 'en-GB',
    });
    expect(label).toBe('2020 – 2031');
  });
});

describe('getHeaderTitleLabel', () => {
  it('announces the next drill-in view for days', () => {
    expect(getHeaderTitleLabel('days')).toBe('Choose month');
  });

  it('announces year selection from the months view', () => {
    expect(getHeaderTitleLabel('months')).toBe('Choose year');
  });

  it('announces the cycle back to days from the years view (day precision)', () => {
    expect(getHeaderTitleLabel('years', 'day')).toBe('Choose date');
  });

  it('announces the cycle back to months from the years view (month precision)', () => {
    expect(getHeaderTitleLabel('years', 'month')).toBe('Choose month');
  });
});

describe('getPreviousLabel', () => {
  it.each([
    ['days', 'Previous month'],
    ['months', 'Previous year'],
    ['years', 'Previous decade'],
  ] as const)('returns %s label for the %s view', (view, expected) => {
    expect(getPreviousLabel(view)).toBe(expected);
  });
});

describe('getNextLabel', () => {
  it.each([
    ['days', 'Next month'],
    ['months', 'Next year'],
    ['years', 'Next decade'],
  ] as const)('returns %s label for the %s view', (view, expected) => {
    expect(getNextLabel(view)).toBe(expected);
  });
});
