import { describe, expect, it } from 'vitest';

import { computeDisplayDate, computeHasValue, normalizeValue } from '../helper/value';

describe('normalizeValue', () => {
  it('returns undefined for undefined input', () => {
    expect(normalizeValue(undefined, 'single')).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(normalizeValue('', 'single')).toBeUndefined();
  });

  it('returns undefined for a fully invalid single value', () => {
    expect(normalizeValue('not-a-date', 'single')).toBeUndefined();
    expect(normalizeValue('2026-99-99', 'single')).toBeUndefined();
  });

  it('preserves a valid ISO single date', () => {
    expect(normalizeValue('2026-05-30', 'single')).toBe('2026-05-30');
  });

  it('drops invalid tokens from a multi selection while keeping valid ones', () => {
    expect(normalizeValue('bad 2026-05-30 also-bad', 'multi')).toBe('2026-05-30');
  });

  it('returns undefined when a multi selection has no valid tokens', () => {
    expect(normalizeValue('bad also-bad', 'multi')).toBeUndefined();
  });

  it('preserves a valid range', () => {
    expect(normalizeValue('2026-05-30/2026-06-05', 'range')).toBe('2026-05-30/2026-06-05');
  });
});

describe('computeHasValue', () => {
  it('returns false for undefined', () => {
    expect(computeHasValue(undefined)).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(computeHasValue('')).toBe(false);
  });

  it('returns true for a non-empty string', () => {
    expect(computeHasValue('2026-05-30')).toBe(true);
  });
});

describe('computeDisplayDate', () => {
  const formatOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };

  it('returns undefined for undefined input', () => {
    expect(computeDisplayDate(undefined, 'single', 'en-GB', formatOptions)).toBeUndefined();
  });

  it('returns undefined for an empty value', () => {
    expect(computeDisplayDate('', 'single', 'en-GB', formatOptions)).toBeUndefined();
  });

  it('formats a single date via Intl', () => {
    const output = computeDisplayDate('2026-05-30', 'single', 'en-GB', formatOptions);
    // Locale/ICU output varies slightly across environments; assert on the shape.
    expect(output).toMatch(/2026/);
    expect(output).toMatch(/30/);
  });
});
