import { describe, expect, it } from 'vitest';

import { advanceFocusedMonth, advanceFocusedYear, getGridColumns } from '../helper/navigation';

describe('advanceFocusedMonth', () => {
  it('advances within the same year', () => {
    expect(advanceFocusedMonth(3, 2026, 2)).toEqual({ month: 5, year: 2026 });
  });

  it('wraps forward into the next year', () => {
    expect(advanceFocusedMonth(11, 2026, 1)).toEqual({ month: 0, year: 2027 });
  });

  it('wraps backward into the previous year', () => {
    expect(advanceFocusedMonth(0, 2026, -1)).toEqual({ month: 11, year: 2025 });
  });

  it('handles multi-year jumps forward', () => {
    expect(advanceFocusedMonth(6, 2026, 20)).toEqual({ month: 2, year: 2028 });
  });

  it('handles multi-year jumps backward', () => {
    expect(advanceFocusedMonth(2, 2026, -20)).toEqual({ month: 6, year: 2024 });
  });

  it('is a no-op when delta is zero', () => {
    expect(advanceFocusedMonth(4, 2026, 0)).toEqual({ month: 4, year: 2026 });
  });
});

describe('advanceFocusedYear', () => {
  it('keeps the decade when the year stays in view', () => {
    expect(advanceFocusedYear(2024, 2020, 3)).toEqual({ year: 2027, decadeStart: 2020 });
  });

  it('slides the decade back when the year falls below the range', () => {
    expect(advanceFocusedYear(2020, 2020, -1)).toEqual({ year: 2019, decadeStart: 2008 });
  });

  it('slides the decade forward when the year rises above the range', () => {
    // 2020 + 12 - 1 = 2031 is the last visible year; +1 pushes to 2032.
    expect(advanceFocusedYear(2031, 2020, 1)).toEqual({ year: 2032, decadeStart: 2032 });
  });

  it('is a no-op when delta is zero', () => {
    expect(advanceFocusedYear(2025, 2020, 0)).toEqual({ year: 2025, decadeStart: 2020 });
  });
});

describe('getGridColumns', () => {
  it('returns 3 columns for a single-month layout', () => {
    expect(getGridColumns(1)).toBe(3);
  });

  it('returns 4 columns for a multi-month layout', () => {
    expect(getGridColumns(2)).toBe(4);
    expect(getGridColumns(3)).toBe(4);
  });
});
