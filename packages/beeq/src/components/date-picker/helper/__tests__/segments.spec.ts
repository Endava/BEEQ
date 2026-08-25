import { describe, expect, it } from 'vitest';

import { getDateMask } from '../../../../shared/utils';
import {
  getAdjacentSegmentKey,
  getDateSegmentGroups,
  getDateSegmentGroupValue,
  getFirstEmptySegmentKey,
  updateDateSegment,
} from '../segments';

describe(getDateSegmentGroups.name, () => {
  it('should derive locale-ordered groups from a complete single value', () => {
    const result = getDateSegmentGroups('1990-12-25', 'single', 'day', getDateMask('en-GB', 'day'));

    expect(result).toEqual([
      {
        id: 0,
        segments: [
          { field: 'day', maxLength: 2, placeholder: 'dd', value: '25' },
          { field: 'month', maxLength: 2, placeholder: 'mm', value: '12' },
          { field: 'year', maxLength: 4, placeholder: 'yyyy', value: '1990' },
        ],
      },
    ]);
  });

  it('should create both range groups when only the start is selected', () => {
    const result = getDateSegmentGroups('1990-12-25', 'range', 'day', getDateMask('en-GB', 'day'));

    expect(result).toHaveLength(2);
    expect(result[0].segments.map((segment) => segment.value)).toEqual(['25', '12', '1990']);
    expect(result[1].segments.map((segment) => segment.value)).toEqual(['', '', '']);
  });

  it('should append an empty entry group to multi values', () => {
    const result = getDateSegmentGroups('1990-12-25 1991-01-01', 'multi', 'day', getDateMask('en-GB', 'day'));

    expect(result).toHaveLength(3);
    expect(result[2].segments.map((segment) => segment.value)).toEqual(['', '', '']);
  });
});

describe('segment navigation', () => {
  it('should locate the first empty segment and move across group boundaries', () => {
    const groups = getDateSegmentGroups('1990-12-25', 'range', 'day', getDateMask('en-GB', 'day'));

    expect(getFirstEmptySegmentKey(groups)).toEqual({ groupId: 1, field: 'day' });
    expect(getAdjacentSegmentKey(groups, { groupId: 0, field: 'year' }, 1)).toEqual({ groupId: 1, field: 'day' });
  });

  it('should replace only the selected segment value', () => {
    const groups = getDateSegmentGroups('1990-12-25', 'single', 'day', getDateMask('en-GB', 'day'));
    const result = updateDateSegment(groups, { groupId: 0, field: 'month' }, '11');

    expect(result[0].segments.map((segment) => segment.value)).toEqual(['25', '11', '1990']);
  });

  it('should serialize only complete groups at the selected precision', () => {
    const groups = getDateSegmentGroups('1990-12-25', 'single', 'day', getDateMask('en-GB', 'day'));
    const incomplete = updateDateSegment(groups, { groupId: 0, field: 'month' }, '1');

    expect(getDateSegmentGroupValue(groups[0], 'day')).toBe('1990-12-25');
    expect(getDateSegmentGroupValue(incomplete[0], 'day')).toBeUndefined();
    expect(getDateSegmentGroupValue(groups[0], 'month')).toBe('1990-12');
  });
});
