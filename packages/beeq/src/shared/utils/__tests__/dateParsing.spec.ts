import { describe, expect, it } from 'vitest';

import { getTodayISO, isValidISODate, parseDateInput, toISODateString } from '../date';

describe(isValidISODate.name, () => {
  it('should return true for a valid ISO date string', () => {
    expect(isValidISODate('2024-05-30')).toBe(true);
  });

  it('should return false for a non-ISO string', () => {
    expect(isValidISODate('30/05/2024')).toBe(false);
  });

  it('should return false for an invalid calendar date', () => {
    expect(isValidISODate('2024-02-30')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isValidISODate('')).toBe(false);
  });
});

describe(parseDateInput.name, () => {
  it('should return null for an empty string', () => {
    expect(parseDateInput('')).toBeNull();
  });

  it('should return null for whitespace only', () => {
    expect(parseDateInput('   ')).toBeNull();
  });

  it('should return null for an unparseable string', () => {
    expect(parseDateInput('not-a-date')).toBeNull();
  });

  it('should parse a valid ISO date string', () => {
    const result = parseDateInput('2024-05-30');
    expect(result).toEqual(new Date(2024, 4, 30));
  });

  it('should parse a text format date (DD MMM YYYY)', () => {
    const result = parseDateInput('30 May 2024', 'en-GB');
    expect(result).toEqual(new Date(2024, 4, 30));
  });

  it('should parse a text format date (MMM DD, YYYY)', () => {
    const result = parseDateInput('May 30, 2024', 'en-US');
    expect(result).toEqual(new Date(2024, 4, 30));
  });

  it('should parse a numeric date in DD/MM/YYYY format (en-GB)', () => {
    const result = parseDateInput('30/05/2024', 'en-GB');
    expect(result).toEqual(new Date(2024, 4, 30));
  });

  it('should parse a numeric date in MM/DD/YYYY format (en-US)', () => {
    const result = parseDateInput('05/30/2024', 'en-US');
    expect(result).toEqual(new Date(2024, 4, 30));
  });

  it('should return null for an invalid calendar date', () => {
    expect(parseDateInput('2024-02-30')).toBeNull();
  });
});

describe(toISODateString.name, () => {
  it('should convert a Date object to YYYY-MM-DD format', () => {
    expect(toISODateString(new Date(2024, 4, 30))).toBe('2024-05-30');
  });

  it('should pad month and day with leading zeros', () => {
    expect(toISODateString(new Date(2024, 0, 5))).toBe('2024-01-05');
  });
});

describe(getTodayISO.name, () => {
  it('should return a string matching YYYY-MM-DD format', () => {
    expect(getTodayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should return the current date', () => {
    const today = new Date();
    const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(getTodayISO()).toBe(expected);
  });
});
