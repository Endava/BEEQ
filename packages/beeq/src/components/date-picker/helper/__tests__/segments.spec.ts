import { describe, expect, it } from 'vitest';

import { getDateMask } from '../../../../shared/utils';
import {
  getAdjacentSegmentKey,
  getDateSegmentGroupBoundaryKey,
  getDateSegmentGroups,
  getDateSegmentGroupValue,
  getFirstEmptySegmentKey,
  getNextAvailableDateSegmentGroups,
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

  it('should return the first and last segment key for a date group', () => {
    const [group] = getDateSegmentGroups('1990-12-25', 'single', 'day', getDateMask('en-GB', 'day'));

    expect(getDateSegmentGroupBoundaryKey(group, 'start')).toEqual({ groupId: 0, field: 'day' });
    expect(getDateSegmentGroupBoundaryKey(group, 'end')).toEqual({ groupId: 0, field: 'year' });
  });

  it('should skip unavailable dates while stepping a complete segment', () => {
    const groups = getDateSegmentGroups('2026-05-17', 'single', 'day', getDateMask('en-GB', 'day'));
    const isDateAllowed = (iso: string): boolean => !['2026-05-15', '2026-05-16'].includes(iso);

    const previous = getNextAvailableDateSegmentGroups(groups, { groupId: 0, field: 'day' }, -1, 'day', isDateAllowed);
    const next = getNextAvailableDateSegmentGroups(groups, { groupId: 0, field: 'day' }, 1, 'day', isDateAllowed);
    if (!previous || !next) throw new Error('Expected an available date in both directions');

    expect(getDateSegmentGroupValue(previous[0], 'day')).toBe('2026-05-14');
    expect(getDateSegmentGroupValue(next[0], 'day')).toBe('2026-05-18');
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
