import { describe, expect, it } from 'vitest';

import { clampISO, parseTypedInput } from '../helper/input';

describe('helper/input', () => {
  describe('clampISO', () => {
    it('returns the ISO unchanged when there are no bounds', () => {
      expect(clampISO('2025-06-15')).toBe('2025-06-15');
    });

    it('clamps up to a full-ISO min', () => {
      expect(clampISO('2025-06-15', '2025-08-01')).toBe('2025-08-01');
    });

    it('clamps down to a full-ISO max', () => {
      expect(clampISO('2025-06-15', undefined, '2025-04-30')).toBe('2025-04-30');
    });

    it('pads a YYYY min to Jan 1 before comparing', () => {
      // 2024-12-31 is before min=2025 (padded to 2025-01-01) → clamps up.
      expect(clampISO('2024-12-31', '2025')).toBe('2025-01-01');
      // A date already inside 2025 is untouched.
      expect(clampISO('2025-06-15', '2025')).toBe('2025-06-15');
    });

    it('pads a YYYY max to Dec 31 before comparing', () => {
      expect(clampISO('2026-01-15', undefined, '2025')).toBe('2025-12-31');
      expect(clampISO('2025-06-15', undefined, '2025')).toBe('2025-06-15');
    });

    it('pads a YYYY-MM min to the 1st', () => {
      expect(clampISO('2025-05-31', '2025-06')).toBe('2025-06-01');
      expect(clampISO('2025-06-15', '2025-06')).toBe('2025-06-15');
    });

    it('pads a YYYY-MM max to the last day (leap year aware)', () => {
      expect(clampISO('2024-03-01', undefined, '2024-02')).toBe('2024-02-29');
      expect(clampISO('2025-03-01', undefined, '2025-02')).toBe('2025-02-28');
    });
  });

  describe('parseTypedInput', () => {
    it('returns undefined value for empty/whitespace text', () => {
      expect(parseTypedInput('', 'en-GB', 'day')).toEqual({ value: undefined });
      expect(parseTypedInput('   ', 'en-GB', 'day')).toEqual({ value: undefined });
    });

    it('flags unparseable text as invalid', () => {
      expect(parseTypedInput('not-a-date', 'en-GB', 'day')).toEqual({ invalid: true });
    });

    it('parses a locale-formatted date at day precision', () => {
      // en-GB → DD/MM/YYYY
      expect(parseTypedInput('15/06/2025', 'en-GB', 'day')).toEqual({ value: '2025-06-15' });
    });

    it('truncates the parsed date to month precision', () => {
      expect(parseTypedInput('15/06/2025', 'en-GB', 'month')).toEqual({ value: '2025-06' });
    });

    it('truncates the parsed date to year precision', () => {
      expect(parseTypedInput('15/06/2025', 'en-GB', 'year')).toEqual({ value: '2025' });
    });

    it('clamps below min at day precision', () => {
      expect(parseTypedInput('01/01/2020', 'en-GB', 'day', '2025-01-01')).toEqual({ value: '2025-01-01' });
    });

    it('clamps against a year-only min then truncates to month precision', () => {
      expect(parseTypedInput('15/06/2020', 'en-GB', 'month', '2025')).toEqual({ value: '2025-01' });
    });

    it('clamps against a year-only max then truncates to year precision', () => {
      expect(parseTypedInput('15/06/2030', 'en-GB', 'year', undefined, '2025')).toEqual({ value: '2025' });
    });

    it('rejects a date the caller marked as disallowed', () => {
      const isDateDisallowed = (d: Date) => d.getDay() === 0;
      // 15/06/2025 = Sunday (local time)
      expect(parseTypedInput('15/06/2025', 'en-GB', 'day', undefined, undefined, isDateDisallowed)).toEqual({
        invalid: true,
      });
    });
  });
});
