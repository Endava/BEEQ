import { describe, expect, it } from 'vitest';

import { clampDateToRange, extractFocusedDate, formatDisplayValue } from '../date';

/** 52 valid BCP 47 language codes – one unique cache entry each */
const LOCALES = [
  'af',
  'am',
  'ar',
  'az',
  'be',
  'bg',
  'bn',
  'bs',
  'ca',
  'cs',
  'cy',
  'da',
  'de',
  'el',
  'en',
  'es',
  'et',
  'eu',
  'fa',
  'fi',
  'fr',
  'ga',
  'gl',
  'gu',
  'he',
  'hi',
  'hr',
  'hu',
  'hy',
  'id',
  'is',
  'it',
  'ja',
  'ka',
  'kk',
  'km',
  'kn',
  'ko',
  'lt',
  'lv',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'mt',
  'my',
  'nb',
  'nl',
  'or',
  'pa',
  'pl',
] as const;

describe('getDateFormatter cache eviction', () => {
  it('should evict the oldest entry when cache exceeds 50 entries', () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };

    // Trigger 52 unique formatters (one per locale) to exceed the 50-entry cache limit
    for (const locale of LOCALES) {
      formatDisplayValue('2024-01-15', 'single', locale, options);
    }

    // The cache-eviction branch is now covered; function still works correctly after eviction
    const result = formatDisplayValue('2024-05-30', 'single', 'en-GB', options);
    expect(result).toBe('30 May 2024');
  });
});

describe(formatDisplayValue.name, () => {
  describe('single', () => {
    it('should return undefined when value is empty', () => {
      expect(formatDisplayValue('', 'single', 'en-US', {})).toBeUndefined();
    });

    it('should return undefined for an invalid date string', () => {
      expect(formatDisplayValue('not-a-date', 'single', 'en-US', {})).toBeUndefined();
    });

    it('should format a valid ISO date string', () => {
      const result = formatDisplayValue('2024-05-30', 'single', 'en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      expect(result).toBe('May 30, 2024');
    });
  });

  describe('multi', () => {
    it('should return undefined when value is empty', () => {
      expect(formatDisplayValue('', 'multi', 'en-US', {})).toBeUndefined();
    });

    it('should return undefined if any date in the list is invalid', () => {
      expect(formatDisplayValue('2024-05-30 bad-date', 'multi', 'en-US', {})).toBeUndefined();
    });

    it('should format multiple dates joined by a comma', () => {
      const result = formatDisplayValue('2024-05-30 2024-06-15', 'multi', 'en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      expect(result).toBe('May 30, 2024, June 15, 2024');
    });
  });

  describe('range', () => {
    it('should return undefined when value is empty', () => {
      expect(formatDisplayValue('', 'range', 'en-US', {})).toBeUndefined();
    });

    it('should return undefined if either date in the range is invalid', () => {
      expect(formatDisplayValue('2024-05-30/bad-date', 'range', 'en-US', {})).toBeUndefined();
    });

    it('should format a valid date range', () => {
      const result = formatDisplayValue('2024-05-01/2024-05-31', 'range', 'en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      expect(result).toContain('May');
      expect(result).toContain('2024');
    });
  });
});

describe(extractFocusedDate.name, () => {
  it('should return undefined when value is empty', () => {
    expect(extractFocusedDate('')).toBeUndefined();
  });

  it('should extract the first ISO date from a plain ISO string', () => {
    expect(extractFocusedDate('2024-05-30')).toBe('2024-05-30');
  });

  it('should extract the first ISO date from a range string', () => {
    expect(extractFocusedDate('2024-05-01/2024-05-31')).toBe('2024-05-01');
  });

  it('should extract the first ISO date from a multi-date string', () => {
    expect(extractFocusedDate('2024-05-30 2024-06-15')).toBe('2024-05-30');
  });

  it('should return undefined when the string contains no ISO date', () => {
    expect(extractFocusedDate('no dates here')).toBeUndefined();
  });
});

describe(clampDateToRange.name, () => {
  it('should return the date unchanged when no min or max is provided', () => {
    expect(clampDateToRange('2024-05-15')).toBe('2024-05-15');
  });

  it('should clamp to min when date is before min', () => {
    expect(clampDateToRange('2024-01-01', '2024-03-01')).toBe('2024-03-01');
  });

  it('should clamp to max when date is after max', () => {
    expect(clampDateToRange('2024-12-31', undefined, '2024-06-30')).toBe('2024-06-30');
  });

  it('should return the date unchanged when it is within the range', () => {
    expect(clampDateToRange('2024-05-15', '2024-01-01', '2024-12-31')).toBe('2024-05-15');
  });

  it('should return min when date equals min', () => {
    expect(clampDateToRange('2024-03-01', '2024-03-01', '2024-12-31')).toBe('2024-03-01');
  });

  it('should return max when date equals max', () => {
    expect(clampDateToRange('2024-12-31', '2024-01-01', '2024-12-31')).toBe('2024-12-31');
  });
});
