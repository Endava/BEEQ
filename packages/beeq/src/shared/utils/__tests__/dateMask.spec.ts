import { describe, expect, it } from 'vitest';

import { getDateMask, isDateMaskFormatOptionsCompatible } from '../date';

describe(isDateMaskFormatOptionsCompatible.name, () => {
  it('should accept numeric options that include every day-precision field', () => {
    const result = isDateMaskFormatOptionsCompatible(
      { day: '2-digit', month: 'numeric', year: 'numeric' },
      'day',
    );

    expect(result).toBe(true);
  });

  it('should reject options that omit a required precision field', () => {
    const result = isDateMaskFormatOptionsCompatible({ month: '2-digit', year: 'numeric' }, 'day');

    expect(result).toBe(false);
  });

  it('should reject options that produce textual month names', () => {
    const result = isDateMaskFormatOptionsCompatible(
      { day: 'numeric', month: 'long', year: 'numeric' },
      'day',
    );

    expect(result).toBe(false);
  });

  it('should reject options that include variable-length date parts', () => {
    const result = isDateMaskFormatOptionsCompatible(
      { day: '2-digit', month: '2-digit', weekday: 'long', year: 'numeric' },
      'day',
    );

    expect(result).toBe(false);
  });
});

describe(getDateMask.name, () => {
  it('should derive a locale-ordered day mask from compatible options', () => {
    const result = getDateMask('en-US', 'day', { day: '2-digit', month: '2-digit', year: 'numeric' });

    expect(result).toEqual({
      template: 'mm/dd/yyyy',
      segments: [
        { field: 'month', placeholder: 'mm', start: 0, end: 2 },
        { field: 'day', placeholder: 'dd', start: 3, end: 5 },
        { field: 'year', placeholder: 'yyyy', start: 6, end: 10 },
      ],
      usedFallback: false,
    });
  });

  it('should derive the locale default numeric layout when options are omitted', () => {
    const result = getDateMask('en-GB', 'day');

    expect(result).toEqual({
      template: 'dd/mm/yyyy',
      segments: [
        { field: 'day', placeholder: 'dd', start: 0, end: 2 },
        { field: 'month', placeholder: 'mm', start: 3, end: 5 },
        { field: 'year', placeholder: 'yyyy', start: 6, end: 10 },
      ],
      usedFallback: true,
    });
  });

  it('should use only month and year fields at month precision', () => {
    const result = getDateMask('en-US', 'month', { month: '2-digit', year: 'numeric' });

    expect(result).toEqual({
      template: 'mm/yyyy',
      segments: [
        { field: 'month', placeholder: 'mm', start: 0, end: 2 },
        { field: 'year', placeholder: 'yyyy', start: 3, end: 7 },
      ],
      usedFallback: false,
    });
  });

  it('should fall back to the locale numeric layout for incompatible options', () => {
    const result = getDateMask('en-US', 'day', { dateStyle: 'full' });

    expect(result).toMatchObject({
      template: 'mm/dd/yyyy',
      usedFallback: true,
    });
  });
});
