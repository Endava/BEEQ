import { describe, expect, it } from 'vitest';

import {
  addDays,
  addMonths,
  addYears,
  buildDecade,
  buildMonthMatrix,
  clampDate,
  compareISO,
  endOfMonth,
  getDecadeStart,
  getISOYearMonth,
  isSameDay,
  isSameMonth,
  isSameYear,
  isValidISO,
  isWithinBounds,
  parseISO,
  sortRange,
  startOfDay,
  startOfMonth,
  toISO,
} from '../helper/calendar';

describe('parseISO', () => {
  it('returns null for invalid or missing input', () => {
    expect(parseISO(undefined)).toBeNull();
    expect(parseISO(null)).toBeNull();
    expect(parseISO('')).toBeNull();
    expect(parseISO('2024/05/30')).toBeNull();
    expect(parseISO('2024-13-01')).toBeNull();
    expect(parseISO('2024-02-30')).toBeNull();
  });

  it('parses valid ISO strings into local Dates', () => {
    const d = parseISO('2024-05-30');
    expect(d).toEqual(new Date(2024, 4, 30));
  });
});

describe('toISO', () => {
  it('serializes a Date to YYYY-MM-DD', () => {
    expect(toISO(new Date(2024, 4, 30))).toBe('2024-05-30');
    expect(toISO(new Date(2024, 0, 1))).toBe('2024-01-01');
    expect(toISO(new Date(2024, 11, 31))).toBe('2024-12-31');
  });
});

describe('isValidISO', () => {
  it('returns true for well-formed ISO dates', () => {
    expect(isValidISO('2024-05-30')).toBe(true);
    expect(isValidISO('2000-01-01')).toBe(true);
  });

  it('returns false for missing/malformed input', () => {
    expect(isValidISO(undefined)).toBe(false);
    expect(isValidISO(null)).toBe(false);
    expect(isValidISO('')).toBe(false);
    expect(isValidISO('2024-13-01')).toBe(false);
    expect(isValidISO('2024-02-30')).toBe(false);
    expect(isValidISO('2024/05/30')).toBe(false);
    expect(isValidISO('bad')).toBe(false);
  });
});

describe('getISOYearMonth', () => {
  it('returns { year, month } for valid ISO input', () => {
    expect(getISOYearMonth('2024-05-30')).toEqual({ year: 2024, month: 4 });
    expect(getISOYearMonth('2000-01-15')).toEqual({ year: 2000, month: 0 });
    expect(getISOYearMonth('1999-12-31')).toEqual({ year: 1999, month: 11 });
  });

  it('returns null for missing/malformed input', () => {
    expect(getISOYearMonth(undefined)).toBeNull();
    expect(getISOYearMonth(null)).toBeNull();
    expect(getISOYearMonth('')).toBeNull();
    expect(getISOYearMonth('2024-99-99')).toBeNull();
    expect(getISOYearMonth('bad')).toBeNull();
  });
});

describe('startOfDay / startOfMonth / endOfMonth', () => {
  it('startOfDay strips the time portion', () => {
    const d = new Date(2024, 4, 30, 13, 45, 12);
    expect(startOfDay(d)).toEqual(new Date(2024, 4, 30));
  });

  it('startOfMonth returns the first day of the month', () => {
    expect(startOfMonth(new Date(2024, 4, 30))).toEqual(new Date(2024, 4, 1));
  });

  it('endOfMonth handles leap years', () => {
    expect(endOfMonth(new Date(2024, 1, 15))).toEqual(new Date(2024, 1, 29));
    expect(endOfMonth(new Date(2023, 1, 15))).toEqual(new Date(2023, 1, 28));
  });
});

describe('addDays', () => {
  it('adds and subtracts days', () => {
    expect(addDays(new Date(2024, 4, 30), 1)).toEqual(new Date(2024, 4, 31));
    expect(addDays(new Date(2024, 4, 30), -1)).toEqual(new Date(2024, 4, 29));
  });

  it('crosses month boundaries', () => {
    expect(addDays(new Date(2024, 4, 31), 1)).toEqual(new Date(2024, 5, 1));
  });
});

describe('addMonths', () => {
  it('preserves the day when possible', () => {
    expect(addMonths(new Date(2024, 0, 15), 1)).toEqual(new Date(2024, 1, 15));
  });

  it('clamps to the last day of the target month', () => {
    // Jan 31 + 1 month → Feb 29 (leap year)
    expect(addMonths(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 29));
    // Jan 31 + 1 month → Feb 28 (non-leap)
    expect(addMonths(new Date(2023, 0, 31), 1)).toEqual(new Date(2023, 1, 28));
  });

  it('crosses year boundaries', () => {
    expect(addMonths(new Date(2024, 11, 15), 1)).toEqual(new Date(2025, 0, 15));
  });
});

describe('addYears', () => {
  it('adds years while preserving day/month', () => {
    expect(addYears(new Date(2024, 5, 15), 1)).toEqual(new Date(2025, 5, 15));
    expect(addYears(new Date(2024, 5, 15), -2)).toEqual(new Date(2022, 5, 15));
  });
});

describe('comparators', () => {
  it('isSameDay compares y/m/d', () => {
    expect(isSameDay(new Date(2024, 4, 30, 10), new Date(2024, 4, 30, 22))).toBe(true);
    expect(isSameDay(new Date(2024, 4, 30), new Date(2024, 4, 31))).toBe(false);
    expect(isSameDay(null, new Date())).toBe(false);
  });

  it('isSameMonth compares y/m', () => {
    expect(isSameMonth(new Date(2024, 4, 1), new Date(2024, 4, 30))).toBe(true);
    expect(isSameMonth(new Date(2024, 4, 1), new Date(2024, 5, 1))).toBe(false);
  });

  it('isSameYear compares y', () => {
    expect(isSameYear(new Date(2024, 0, 1), new Date(2024, 11, 31))).toBe(true);
    expect(isSameYear(new Date(2024, 0, 1), new Date(2025, 0, 1))).toBe(false);
  });

  it('compareISO returns -1 / 0 / 1', () => {
    expect(compareISO('2024-01-01', '2024-01-02')).toBe(-1);
    expect(compareISO('2024-01-02', '2024-01-01')).toBe(1);
    expect(compareISO('2024-01-01', '2024-01-01')).toBe(0);
  });
});

describe('buildMonthMatrix', () => {
  it('returns 6 rows of 7 cells (42 cells)', () => {
    const matrix = buildMonthMatrix(new Date(2024, 4, 15), 1);
    expect(matrix).toHaveLength(6);
    for (const row of matrix) expect(row).toHaveLength(7);
    expect(matrix.flat()).toHaveLength(42);
  });

  it('marks cells outside the anchor month', () => {
    const matrix = buildMonthMatrix(new Date(2024, 4, 15), 1);
    const anchorMonth = 4; // May
    const insideCount = matrix.flat().filter((c) => !c.outside).length;
    // May 2024 has 31 days
    expect(insideCount).toBe(31);
    for (const cell of matrix.flat()) {
      if (!cell.outside) expect(cell.date.getMonth()).toBe(anchorMonth);
    }
  });

  it('starts each row on the configured first day of the week (Monday)', () => {
    const matrix = buildMonthMatrix(new Date(2024, 4, 15), 1); // Monday-first
    // May 1st 2024 was a Wednesday → matrix[0][2] should be May 1
    expect(matrix[0][2].iso).toBe('2024-05-01');
    expect(matrix[0][0].date.getDay()).toBe(1); // Monday
  });

  it('starts each row on the configured first day of the week (Sunday)', () => {
    const matrix = buildMonthMatrix(new Date(2024, 4, 15), 0);
    expect(matrix[0][0].date.getDay()).toBe(0); // Sunday
  });
});

describe('getDecadeStart / buildDecade', () => {
  it('getDecadeStart anchors at decade-minus-1', () => {
    // Matches the reference screenshot: 2026 → grid starts at 2016
    expect(getDecadeStart(2026)).toBe(2019); // 2020 - 1
    expect(getDecadeStart(2020)).toBe(2019);
    expect(getDecadeStart(2029)).toBe(2019);
  });

  it('buildDecade returns exactly 12 years starting one before the decade', () => {
    const { years, start, end } = buildDecade(new Date(2026, 0, 1));
    expect(years).toHaveLength(12);
    expect(start).toBe(2019);
    expect(end).toBe(2030);
    expect(years[0]).toBe(2019);
    expect(years[11]).toBe(2030);
  });
});

describe('clampDate', () => {
  it('returns the same date when within bounds', () => {
    const d = new Date(2024, 4, 15);
    expect(clampDate(d, '2024-01-01', '2024-12-31')).toBe(d);
  });

  it('clamps to min when before it', () => {
    const d = new Date(2023, 11, 31);
    expect(clampDate(d, '2024-01-01')).toEqual(new Date(2024, 0, 1));
  });

  it('clamps to max when after it', () => {
    const d = new Date(2025, 0, 1);
    expect(clampDate(d, undefined, '2024-12-31')).toEqual(new Date(2024, 11, 31));
  });
});

describe('isWithinBounds', () => {
  it('is inclusive on both ends', () => {
    expect(isWithinBounds(new Date(2024, 0, 1), '2024-01-01', '2024-12-31')).toBe(true);
    expect(isWithinBounds(new Date(2024, 11, 31), '2024-01-01', '2024-12-31')).toBe(true);
  });

  it('rejects dates outside bounds', () => {
    expect(isWithinBounds(new Date(2023, 11, 31), '2024-01-01', '2024-12-31')).toBe(false);
    expect(isWithinBounds(new Date(2025, 0, 1), '2024-01-01', '2024-12-31')).toBe(false);
  });

  it('treats missing bounds as unbounded', () => {
    expect(isWithinBounds(new Date(2024, 4, 30))).toBe(true);
  });
});

describe('sortRange', () => {
  it('keeps sorted ISO pairs as-is', () => {
    expect(sortRange('2024-01-01', '2024-01-05')).toEqual(['2024-01-01', '2024-01-05']);
  });

  it('swaps unsorted ISO pairs', () => {
    expect(sortRange('2024-01-05', '2024-01-01')).toEqual(['2024-01-01', '2024-01-05']);
  });
});
