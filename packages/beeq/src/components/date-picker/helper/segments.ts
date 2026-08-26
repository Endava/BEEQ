import type { TDateMask, TDateMaskField } from '../../../shared/utils';
import type { TDatePickerType, TDatePrecision } from '../bq-date-picker.types';
import { parseValue } from './selection';

/** A single locale-derived numeric field within an editable date group. */
export type TDateSegment = {
  field: TDateMaskField;
  maxLength: number;
  placeholder: string;
  value: string;
};

/** One editable date token, used as a date, range endpoint, or multi-date entry. */
export type TDateSegmentGroup = {
  id: number;
  segments: TDateSegment[];
};

/** Stable address for the focused or updated segment across component renders. */
export type TDateSegmentKey = {
  field: TDateMaskField;
  groupId: number;
};

const getISOValues = (iso: string): Record<TDateMaskField, string> => ({
  day: iso.slice(8, 10),
  month: iso.slice(5, 7),
  year: iso.slice(0, 4),
});

const createSegmentGroup = (id: number, mask: TDateMask, iso?: string): TDateSegmentGroup => {
  const values = iso ? getISOValues(iso) : undefined;
  return {
    id,
    segments: mask.segments.map((segment) => ({
      field: segment.field,
      maxLength: segment.placeholder.length,
      placeholder: segment.placeholder,
      value: values?.[segment.field] ?? '',
    })),
  };
};

/**
 * Builds locale-ordered editable segment groups from the current canonical
 * value. The visual draft is deliberately separate from form serialization.
 */
export const getDateSegmentGroups = (
  value: string | undefined,
  type: TDatePickerType,
  precision: TDatePrecision,
  mask: TDateMask,
): TDateSegmentGroup[] => {
  const selection = parseValue(value, type, precision);

  if (type === 'range') {
    return [createSegmentGroup(0, mask, selection[0]), createSegmentGroup(1, mask, selection[1])];
  }

  if (type === 'multi') {
    return [
      ...selection.map((iso, index) => createSegmentGroup(index, mask, iso)),
      createSegmentGroup(selection.length, mask),
    ];
  }

  return [createSegmentGroup(0, mask, selection[0])];
};

/** Returns the segment addressed by a stable group/field key. */
export const getDateSegment = (groups: TDateSegmentGroup[], key: TDateSegmentKey): TDateSegment | undefined =>
  groups.find((group) => group.id === key.groupId)?.segments.find((segment) => segment.field === key.field);

/** Finds the first incomplete segment in visual order for initial focus placement. */
export const getFirstEmptySegmentKey = (groups: TDateSegmentGroup[]): TDateSegmentKey | undefined => {
  for (const group of groups) {
    const segment = group.segments.find((item) => !item.value);
    if (segment) return { groupId: group.id, field: segment.field };
  }
  return undefined;
};

/** Flattens visual groups into the roving-focus navigation order. */
export const getSegmentKeys = (groups: TDateSegmentGroup[]): TDateSegmentKey[] =>
  groups.flatMap((group) => group.segments.map((segment) => ({ groupId: group.id, field: segment.field })));

/** Moves one segment backward or forward, including across date-group boundaries. */
export const getAdjacentSegmentKey = (
  groups: TDateSegmentGroup[],
  current: TDateSegmentKey,
  direction: -1 | 1,
): TDateSegmentKey | undefined => {
  const keys = getSegmentKeys(groups);
  const index = keys.findIndex((key) => key.groupId === current.groupId && key.field === current.field);
  if (index === -1) return undefined;
  return keys[index + direction];
};

/** Returns the first or last segment key within one date group. */
export const getDateSegmentGroupBoundaryKey = (
  group: TDateSegmentGroup | undefined,
  boundary: 'start' | 'end',
): TDateSegmentKey | undefined => {
  const segment = boundary === 'start' ? group?.segments[0] : group?.segments[group.segments.length - 1];
  return segment && group ? { groupId: group.id, field: segment.field } : undefined;
};

/** Finds the next complete group produced by stepping a field to an allowed ISO date. */
export const getNextAvailableDateSegmentGroups = (
  groups: TDateSegmentGroup[],
  key: TDateSegmentKey,
  direction: -1 | 1,
  precision: TDatePrecision,
  isDateAllowed: (iso: string) => boolean,
): TDateSegmentGroup[] | undefined => {
  const segment = getDateSegment(groups, key);
  if (!segment) return undefined;

  const [min, max] = segment.field === 'day' ? [1, 31] : segment.field === 'month' ? [1, 12] : [1, 9999];
  for (
    let candidate = Number(segment.value) + direction;
    candidate >= min && candidate <= max;
    candidate += direction
  ) {
    const nextGroups = updateDateSegment(groups, key, `${candidate}`.padStart(segment.maxLength, '0'));
    const group = nextGroups.find((item) => item.id === key.groupId);
    const value = group ? getDateSegmentGroupValue(group, precision) : undefined;
    const [iso] = parseValue(value, 'single', precision);
    if (iso && isDateAllowed(iso)) return nextGroups;
  }

  return undefined;
};

/** Converts a complete visual group into its canonical precision-aware ISO token. */
export const getDateSegmentGroupValue = (group: TDateSegmentGroup, precision: TDatePrecision): string | undefined => {
  const values = Object.fromEntries(group.segments.map((segment) => [segment.field, segment.value])) as Partial<
    Record<TDateMaskField, string>
  >;
  const isComplete = (field: TDateMaskField): boolean => {
    const segment = group.segments.find((item) => item.field === field);
    return Boolean(segment && segment.value.length === segment.maxLength);
  };
  if (!isComplete('year')) return undefined;
  if (precision !== 'year' && !isComplete('month')) return undefined;
  if (precision === 'day' && !isComplete('day')) return undefined;

  if (precision === 'year') return values.year;
  if (precision === 'month') return `${values.year}-${values.month}`;
  return `${values.year}-${values.month}-${values.day}`;
};

/** Returns an immutable group update while limiting the value to that segment's width. */
export const updateDateSegment = (
  groups: TDateSegmentGroup[],
  key: TDateSegmentKey,
  value: string,
): TDateSegmentGroup[] =>
  groups.map((group) => {
    if (group.id !== key.groupId) return group;
    return {
      ...group,
      segments: group.segments.map((segment) =>
        segment.field === key.field ? { ...segment, value: value.slice(0, segment.maxLength) } : segment,
      ),
    };
  });
