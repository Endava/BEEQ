import { isValidISODate, parseDateInput } from '../date';

describe('parseDateInput', () => {
  describe('ISO format parsing', () => {
    it('should parse valid ISO date strings', () => {
      const result = parseDateInput('2024-05-30');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should parse leap year dates', () => {
      const result = parseDateInput('2024-02-29');
      expect(result).toEqual(new Date(2024, 1, 29));
    });
  });

  describe('text format parsing (day month year)', () => {
    it('should parse "30 May 2024" format', () => {
      const result = parseDateInput('30 May 2024', 'en-GB');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should parse "30 January 2024" format', () => {
      const result = parseDateInput('30 January 2024', 'en-GB');
      expect(result).toEqual(new Date(2024, 0, 30));
    });

    it('should parse abbreviated month names', () => {
      const result = parseDateInput('15 Dec 2024', 'en-GB');
      expect(result).toEqual(new Date(2024, 11, 15));
    });

    it('should be case-insensitive for month names', () => {
      const result1 = parseDateInput('30 may 2024', 'en-GB');
      const result2 = parseDateInput('30 MAY 2024', 'en-GB');
      const result3 = parseDateInput('30 May 2024', 'en-GB');

      expect(result1).toEqual(new Date(2024, 4, 30));
      expect(result2).toEqual(new Date(2024, 4, 30));
      expect(result3).toEqual(new Date(2024, 4, 30));
    });

    it('should handle locale-specific month names', () => {
      const result = parseDateInput('30 mai 2024', 'fr-FR');
      expect(result).toEqual(new Date(2024, 4, 30));
    });
  });

  describe('text format parsing (month day year)', () => {
    it('should parse "May 30, 2024" format with comma', () => {
      const result = parseDateInput('May 30, 2024', 'en-GB');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should parse "May 30 2024" format without comma', () => {
      const result = parseDateInput('May 30 2024', 'en-GB');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should parse "January 1, 1970" format', () => {
      const result = parseDateInput('January 1, 1970', 'en-GB');
      expect(result).toEqual(new Date(1970, 0, 1));
    });

    it('should parse abbreviated format "Jan 15, 2024"', () => {
      const result = parseDateInput('Jan 15, 2024', 'en-GB');
      expect(result).toEqual(new Date(2024, 0, 15));
    });
  });

  describe('numeric format parsing', () => {
    it('should parse "30/05/2024" (DD/MM/YYYY) format', () => {
      const result = parseDateInput('30/05/2024');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should parse "30-05-2024" (DD-MM-YYYY) format', () => {
      const result = parseDateInput('30-05-2024');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should parse "30 05 2024" (DD MM YYYY) format', () => {
      const result = parseDateInput('30 05 2024');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should parse "05/30/2024" (MM/DD/YYYY) format', () => {
      const result = parseDateInput('05/30/2024');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should detect day > 12 and parse as DD/MM/YYYY', () => {
      const result = parseDateInput('15/05/2024');
      expect(result).toEqual(new Date(2024, 4, 15));
    });

    it('should handle ambiguous dates using heuristic', () => {
      // When first number is ≤ 12, treat as MM/DD/YYYY
      const result = parseDateInput('05/15/2024');
      expect(result).toEqual(new Date(2024, 4, 15));
    });

    it('should parse "30.05.2024" (DD.MM.YYYY) format', () => {
      const result = parseDateInput('30.05.2024');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should parse "05.30.2024" (MM.DD.YYYY) format', () => {
      const result = parseDateInput('05.30.2024');
      expect(result).toEqual(new Date(2024, 4, 30));
    });
  });

  describe('invalid input handling', () => {
    it('should return null for empty string', () => {
      expect(parseDateInput('')).toBeNull();
    });

    it('should return null for whitespace-only string', () => {
      expect(parseDateInput('   ')).toBeNull();
    });

    it('should return null for invalid date string', () => {
      expect(parseDateInput('invalid-date')).toBeNull();
    });

    it('should return null for non-existent date (Feb 30)', () => {
      expect(parseDateInput('2024-02-30')).toBeNull();
    });

    it('should return null for malformed date', () => {
      expect(parseDateInput('2024/13/01')).toBeNull();
    });

    it('should return null for random text', () => {
      expect(parseDateInput('hello world')).toBeNull();
    });

    it('should return null for numeric gibberish', () => {
      expect(parseDateInput('99/99/9999')).toBeNull();
    });

    it('should return null for unrecognized month name', () => {
      expect(parseDateInput('30 Januaryy 2024')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle single-digit day and month', () => {
      const result = parseDateInput('5/3/2024');
      expect(result).toEqual(new Date(2024, 2, 5));
    });

    it('should handle year 2000 boundary', () => {
      const result = parseDateInput('2000-01-01');
      expect(result).toEqual(new Date(2000, 0, 1));
    });

    it('should handle year 1970 (Unix epoch)', () => {
      const result = parseDateInput('1970-01-01');
      expect(result).toEqual(new Date(1970, 0, 1));
    });

    it('should handle future dates', () => {
      const result = parseDateInput('2099-12-31');
      expect(result).toEqual(new Date(2099, 11, 31));
    });

    it('should parse day 1 and day 31 correctly', () => {
      const day1 = parseDateInput('2024-01-01');
      const day31 = parseDateInput('2024-01-31');

      expect(day1).toEqual(new Date(2024, 0, 1));
      expect(day31).toEqual(new Date(2024, 0, 31));
    });

    it('should handle all 12 months', () => {
      for (let month = 1; month <= 12; month++) {
        const result = parseDateInput(`2024-${String(month).padStart(2, '0')}-15`);
        expect(result?.getMonth()).toBe(month - 1);
      }
    });
  });

  describe('locale support', () => {
    it('should parse Spanish month names with es-ES locale', () => {
      const result = parseDateInput('30 enero 2024', 'es-ES');
      expect(result).toEqual(new Date(2024, 0, 30));
    });

    it('should parse German month names with de-DE locale', () => {
      const result = parseDateInput('30 Januar 2024', 'de-DE');
      expect(result).toEqual(new Date(2024, 0, 30));
    });

    it('should default to en-GB locale', () => {
      const result = parseDateInput('30 May 2024');
      expect(result).toEqual(new Date(2024, 4, 30));
    });

    it('should handle both short and long month names in same locale', () => {
      const long = parseDateInput('30 January 2024', 'en-GB');
      const short = parseDateInput('30 Jan 2024', 'en-GB');

      expect(long).toEqual(new Date(2024, 0, 30));
      expect(short).toEqual(new Date(2024, 0, 30));
    });
  });
});

describe('isValidISODate', () => {
  describe('valid ISO dates', () => {
    it('should return true for valid ISO date format', () => {
      expect(isValidISODate('2024-05-30')).toBe(true);
    });

    it('should return true for valid leap year date', () => {
      expect(isValidISODate('2024-02-29')).toBe(true);
    });

    it('should return true for first day of year', () => {
      expect(isValidISODate('2024-01-01')).toBe(true);
    });

    it('should return true for last day of year', () => {
      expect(isValidISODate('2024-12-31')).toBe(true);
    });
  });

  describe('invalid ISO dates', () => {
    it('should return false for non-ISO format', () => {
      expect(isValidISODate('05/30/2024')).toBe(false);
    });

    it('should return false for missing leading zeros', () => {
      expect(isValidISODate('2024-5-30')).toBe(false);
    });

    it('should return false for invalid month (13)', () => {
      expect(isValidISODate('2024-13-01')).toBe(false);
    });

    it('should return false for invalid day (32)', () => {
      expect(isValidISODate('2024-01-32')).toBe(false);
    });

    it('should return false for February 30', () => {
      expect(isValidISODate('2024-02-30')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidISODate('')).toBe(false);
    });

    it('should return false for text format', () => {
      expect(isValidISODate('May 30, 2024')).toBe(false);
    });

    it('should return false for ISO date with time', () => {
      expect(isValidISODate('2024-05-30T14:30:00')).toBe(false);
    });

    it('should return false for null/undefined (type coercion)', () => {
      expect(isValidISODate(null as unknown as string)).toBe(false);
      expect(isValidISODate(undefined as unknown as string)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return false for invalid separators', () => {
      expect(isValidISODate('2024/05/30')).toBe(false);
      expect(isValidISODate('2024.05.30')).toBe(false);
    });

    it('should return false for partial dates', () => {
      expect(isValidISODate('2024-05')).toBe(false);
      expect(isValidISODate('2024')).toBe(false);
    });

    it('should handle non-leap year February', () => {
      expect(isValidISODate('2023-02-28')).toBe(true);
      expect(isValidISODate('2023-02-29')).toBe(false);
    });
  });
});
