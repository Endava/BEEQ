import { describe, expect, it } from 'vitest';

import { getMaskPlaceholder, getPickerMask, MULTI_MASK_DELIMITER, RANGE_MASK_DELIMITER } from '../mask';

describe('date-picker mask helpers', () => {
  it('creates locale-ordered masks for the requested precision', () => {
    const dayMask = getPickerMask('en-GB', 'day');
    const monthMask = getPickerMask('en-GB', 'month');
    const yearMask = getPickerMask('en-GB', 'year');

    expect(dayMask.segments.map(({ field }) => field)).toEqual(['day', 'month', 'year']);
    expect(monthMask.segments.map(({ field }) => field)).toEqual(['month', 'year']);
    expect(yearMask.segments.map(({ field }) => field)).toEqual(['year']);
  });

  it('adds the mode-specific delimiter and a second mask to range and multi placeholders', () => {
    const template = getPickerMask('en-GB', 'day').template;

    expect(getMaskPlaceholder('single', 'en-GB', 'day')).toBe(template);
    expect(getMaskPlaceholder('range', 'en-GB', 'day')).toBe(`${template}${RANGE_MASK_DELIMITER}${template}`);
    expect(getMaskPlaceholder('multi', 'en-GB', 'day')).toBe(`${template}${MULTI_MASK_DELIMITER}${template}`);
  });

  it('respects consumer formatting options when building the placeholder', () => {
    const placeholder = getMaskPlaceholder('single', 'en-US', 'day', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    expect(placeholder).toBe('mm/dd/yyyy');
  });
});
