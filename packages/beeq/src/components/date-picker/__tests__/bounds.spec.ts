import { describe, expect, it } from 'vitest';

import {
  boundYear,
  boundYearMonth,
  isDateWithinBounds,
  isMonthWithinBounds,
  isYearWithinBounds,
  padBound,
} from '../helper/bounds';

describe('bounds — boundYear', () => {
  it.each([
    ['2025', 2025],
    ['2025-06', 2025],
    ['2025-06-15', 2025],
  ])('extracts the year from %s → %i', (iso, expected) => {
    expect(boundYear(iso)).toBe(expected);
  });

  it.each([undefined, null, '', 'not-a-date', 'ab25-06-15'])('returns null for %p', (iso) => {
    expect(boundYear(iso as string | undefined | null)).toBeNull();
  });
});

describe('bounds — boundYearMonth', () => {
  it.each([
    ['2025-06', { year: 2025, month: 5 }],
    ['2025-06-15', { year: 2025, month: 5 }],
    ['2025-01-01', { year: 2025, month: 0 }],
    ['2025-12-31', { year: 2025, month: 11 }],
  ])('parses %s', (iso, expected) => {
    expect(boundYearMonth(iso)).toEqual(expected);
  });

  it.each(['2025', '2025-00', '2025-13', 'not-a-date', ''])('returns null for %p', (iso) => {
    expect(boundYearMonth(iso)).toBeNull();
  });
});

describe('bounds — isYearWithinBounds', () => {
  it('returns true when bounds are omitted', () => {
    expect(isYearWithinBounds(2025)).toBe(true);
  });

  it.each([
    [2024, '2025', undefined, false],
    [2025, '2025', undefined, true],
    [2026, undefined, '2025', false],
    [2025, undefined, '2025', true],
    [2025, '2020', '2030', true],
  ])('year=%i min=%s max=%s → %s', (year, min, max, expected) => {
    expect(isYearWithinBounds(year, min, max)).toBe(expected);
  });

  it('accepts bounds at any precision', () => {
    // Only the year prefix matters.
    expect(isYearWithinBounds(2025, '2025-06-15', '2025-06-15')).toBe(true);
    expect(isYearWithinBounds(2024, '2025-06-15')).toBe(false);
  });
});

describe('bounds — isMonthWithinBounds', () => {
  it('returns true when bounds are omitted', () => {
    expect(isMonthWithinBounds(2025, 5)).toBe(true);
  });

  it('rejects months earlier than min year-month', () => {
    // May 2025 (month=4) with min=2025-06 → out
    expect(isMonthWithinBounds(2025, 4, '2025-06')).toBe(false);
    // June 2025 (month=5) with min=2025-06 → in
    expect(isMonthWithinBounds(2025, 5, '2025-06')).toBe(true);
  });

  it('rejects months later than max year-month', () => {
    expect(isMonthWithinBounds(2025, 6, undefined, '2025-06')).toBe(false);
    expect(isMonthWithinBounds(2025, 5, undefined, '2025-06')).toBe(true);
  });

  it('ignores the day component of the bound (a mid-month bound still enables that whole month)', () => {
    // min = 2025-06-15 → month 2025-06 must remain selectable
    expect(isMonthWithinBounds(2025, 5, '2025-06-15')).toBe(true);
    // max = 2025-06-15 → month 2025-06 must remain selectable
    expect(isMonthWithinBounds(2025, 5, undefined, '2025-06-15')).toBe(true);
  });

  it('accepts year-only bounds', () => {
    expect(isMonthWithinBounds(2025, 0, '2025')).toBe(true);
    expect(isMonthWithinBounds(2024, 11, '2025')).toBe(false);
  });
});

describe('bounds — padBound', () => {
  it.each([
    ['2025', 'min', '2025-01-01'],
    ['2025', 'max', '2025-12-31'],
    ['2025-06', 'min', '2025-06-01'],
    ['2025-06', 'max', '2025-06-30'],
    ['2024-02', 'max', '2024-02-29'], // leap
    ['2025-02', 'max', '2025-02-28'], // non-leap
    ['2025-06-15', 'min', '2025-06-15'],
    ['2025-06-15', 'max', '2025-06-15'],
  ] as const)('padBound(%s, %s) → %s', (iso, kind, expected) => {
    expect(padBound(iso, kind)).toBe(expected);
  });

  it.each([undefined, null, ''])('returns null for %p', (iso) => {
    expect(padBound(iso as string | undefined | null, 'min')).toBeNull();
  });
});

describe('bounds — isDateWithinBounds', () => {
  it('returns true when bounds are omitted', () => {
    expect(isDateWithinBounds('2025-06-15')).toBe(true);
  });

  it('respects full-ISO bounds', () => {
    expect(isDateWithinBounds('2025-06-15', '2025-06-10', '2025-06-20')).toBe(true);
    expect(isDateWithinBounds('2025-06-09', '2025-06-10', '2025-06-20')).toBe(false);
    expect(isDateWithinBounds('2025-06-21', '2025-06-10', '2025-06-20')).toBe(false);
  });

  it('respects year-only bounds by padding to the full year', () => {
    // min=2025 → 2025-01-01; max=2025 → 2025-12-31
    expect(isDateWithinBounds('2025-01-01', '2025', '2025')).toBe(true);
    expect(isDateWithinBounds('2025-12-31', '2025', '2025')).toBe(true);
    expect(isDateWithinBounds('2024-12-31', '2025', '2025')).toBe(false);
    expect(isDateWithinBounds('2026-01-01', '2025', '2025')).toBe(false);
  });

  it('respects year-month bounds by padding to the full month', () => {
    // min=2025-06 → 2025-06-01; max=2025-06 → 2025-06-30
    expect(isDateWithinBounds('2025-06-01', '2025-06', '2025-06')).toBe(true);
    expect(isDateWithinBounds('2025-06-30', '2025-06', '2025-06')).toBe(true);
    expect(isDateWithinBounds('2025-05-31', '2025-06', '2025-06')).toBe(false);
    expect(isDateWithinBounds('2025-07-01', '2025-06', '2025-06')).toBe(false);
  });
});
