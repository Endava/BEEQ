import { describe, expect, it } from 'vitest';

import {
  appendSegmentDigit,
  createSegmentGroup,
  getAdjacentSegmentKey,
  getFirstEmptySegmentKey,
  getSegment,
  getSegmentGroupBoundaryKey,
  getSegmentGroupValues,
  getSegmentKeys,
  isSameSegmentKey,
  isSegmentComplete,
  padSegmentValue,
  stepSegment,
  type TSegmentGroup,
  updateSegment,
} from '../segments';

type TField = 'hour' | 'minute';

const MASK = [
  { field: 'hour', placeholder: 'hh' },
  { field: 'minute', placeholder: 'mm' },
] as const;

const buildGroups = (): TSegmentGroup<TField>[] => [
  createSegmentGroup<TField>(0, MASK, { hour: '09', minute: '30' }),
  createSegmentGroup<TField>(1, MASK),
];

describe(createSegmentGroup.name, () => {
  it('should create segments sized by placeholder and prefilled with values', () => {
    const group = createSegmentGroup<TField>(3, MASK, { hour: '07' });

    expect(group).toEqual({
      id: 3,
      segments: [
        { field: 'hour', maxLength: 2, placeholder: 'hh', value: '07' },
        { field: 'minute', maxLength: 2, placeholder: 'mm', value: '' },
      ],
    });
  });

  it('should honour explicit max lengths', () => {
    const group = createSegmentGroup<'period'>(0, [{ field: 'period', placeholder: 'AM' }], undefined, { period: 1 });

    expect(group.segments[0].maxLength).toBe(1);
  });
});

describe('segment lookup', () => {
  it('should find a segment by key and compare keys', () => {
    const groups = buildGroups();

    expect(getSegment(groups, { groupId: 0, field: 'minute' })?.value).toBe('30');
    expect(getSegment(groups, { groupId: 9, field: 'minute' })).toBeUndefined();
    expect(isSameSegmentKey({ groupId: 0, field: 'hour' }, { groupId: 0, field: 'hour' })).toBe(true);
    expect(isSameSegmentKey({ groupId: 0, field: 'hour' }, undefined)).toBe(false);
  });

  it('should report completeness and group values', () => {
    const [group] = updateSegment(buildGroups(), { groupId: 0, field: 'minute' }, '3');

    expect(isSegmentComplete(group.segments[0])).toBe(true);
    expect(isSegmentComplete(group.segments[1])).toBe(false);
    expect(isSegmentComplete(undefined)).toBe(false);
    expect(getSegmentGroupValues(group)).toEqual({ hour: '09', minute: '3' });
  });
});

describe('segment navigation', () => {
  it('should flatten keys and move across group boundaries', () => {
    const groups = buildGroups();

    expect(getSegmentKeys(groups)).toHaveLength(4);
    expect(getFirstEmptySegmentKey(groups)).toEqual({ groupId: 1, field: 'hour' });
    expect(getAdjacentSegmentKey(groups, { groupId: 0, field: 'minute' }, 1)).toEqual({ groupId: 1, field: 'hour' });
    expect(getAdjacentSegmentKey(groups, { groupId: 0, field: 'hour' }, -1)).toBeUndefined();
    expect(getAdjacentSegmentKey(groups, { groupId: 5, field: 'hour' }, 1)).toBeUndefined();
  });

  it('should return group boundary keys', () => {
    const [group] = buildGroups();

    expect(getSegmentGroupBoundaryKey(group, 'start')).toEqual({ groupId: 0, field: 'hour' });
    expect(getSegmentGroupBoundaryKey(group, 'end')).toEqual({ groupId: 0, field: 'minute' });
    expect(getSegmentGroupBoundaryKey<TField>(undefined, 'end')).toBeUndefined();
  });

  it('should return undefined when no segment is empty', () => {
    expect(getFirstEmptySegmentKey([buildGroups()[0]])).toBeUndefined();
  });
});

describe('segment editing', () => {
  it('should update only the addressed segment and limit its width', () => {
    const groups = buildGroups();
    const result = updateSegment(groups, { groupId: 0, field: 'hour' }, '123');

    expect(result[0].segments[0].value).toBe('12');
    expect(result[1]).toBe(groups[1]);
  });

  it('should append digits and restart full segments', () => {
    const [group] = buildGroups();

    expect(appendSegmentDigit({ ...group.segments[0], value: '1' }, '4')).toBe('14');
    expect(appendSegmentDigit(group.segments[0], '4')).toBe('4');
  });

  it('should pad values to the segment width', () => {
    expect(padSegmentValue(5, 2)).toBe('05');
    expect(padSegmentValue(12, 2)).toBe('12');
  });

  it('should step within range and stop at the limits', () => {
    const groups = buildGroups();

    expect(stepSegment(groups, { groupId: 0, field: 'minute' }, 15, [0, 59])?.[0].segments[1].value).toBe('45');
    expect(stepSegment(groups, { groupId: 0, field: 'minute' }, 30, [0, 59])).toBeUndefined();
    expect(stepSegment(groups, { groupId: 7, field: 'minute' }, 1, [0, 59])).toBeUndefined();
  });
});
