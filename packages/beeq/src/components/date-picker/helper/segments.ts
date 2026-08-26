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

/**
 * Extracts the numeric date fields from a full ISO date.
 *
 * @param iso Full `YYYY-MM-DD` ISO date.
 * @returns The zero-padded year, month, and day field values.
 */
const getISOValues = (iso: string): Record<TDateMaskField, string> => ({
  day: iso.slice(8, 10),
  month: iso.slice(5, 7),
  year: iso.slice(0, 4),
});

/**
 * Creates one editable group from a mask and optional canonical ISO value.
 *
 * @param id Stable identifier for the group.
 * @param mask Locale-derived mask that defines the segments.
 * @param iso Optional full ISO value used to prefill the segments.
 * @returns The editable segment group.
 */
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
 *
 * @param value Current serialized picker value.
 * @param type Selection mode of the date picker.
 * @param precision Precision represented by the date picker.
 * @param mask Locale-derived mask that defines the segment order.
 * @returns Editable segment groups representing the current value and draft entry.
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

/**
 * Finds the segment addressed by a stable group and field key.
 *
 * @param groups Editable groups to search.
 * @param key Stable address of the target segment.
 * @returns The matching segment, or `undefined` when absent.
 */
export const getDateSegment = (groups: TDateSegmentGroup[], key: TDateSegmentKey): TDateSegment | undefined =>
  groups.find((group) => group.id === key.groupId)?.segments.find((segment) => segment.field === key.field);

/**
 * Finds the first incomplete segment in visual order for initial focus placement.
 *
 * @param groups Editable groups to inspect.
 * @returns The first empty segment key, or `undefined` when all segments have values.
 */
export const getFirstEmptySegmentKey = (groups: TDateSegmentGroup[]): TDateSegmentKey | undefined => {
  for (const group of groups) {
    const segment = group.segments.find((item) => !item.value);
    if (segment) return { groupId: group.id, field: segment.field };
  }
  return undefined;
};

/**
 * Flattens visual groups into the roving-focus navigation order.
 *
 * @param groups Editable groups to flatten.
 * @returns Segment keys in visual navigation order.
 */
export const getSegmentKeys = (groups: TDateSegmentGroup[]): TDateSegmentKey[] =>
  groups.flatMap((group) => group.segments.map((segment) => ({ groupId: group.id, field: segment.field })));

/**
 * Moves one segment backward or forward, including across date-group boundaries.
 *
 * @param groups Editable groups that determine navigation order.
 * @param current Currently focused segment.
 * @param direction Navigation direction.
 * @returns The adjacent key, or `undefined` at a navigation boundary.
 */
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

/**
 * Gets the first or last segment key within a date group.
 *
 * @param group Date group to inspect.
 * @param boundary Requested group boundary.
 * @returns The boundary segment key, or `undefined` when the group is empty.
 */
export const getDateSegmentGroupBoundaryKey = (
  group: TDateSegmentGroup | undefined,
  boundary: 'start' | 'end',
): TDateSegmentKey | undefined => {
  const segment = boundary === 'start' ? group?.segments[0] : group?.segments[group.segments.length - 1];
  return segment && group ? { groupId: group.id, field: segment.field } : undefined;
};

/**
 * Finds the next complete group produced by stepping a field to an allowed ISO date.
 *
 * @param groups Current editable groups.
 * @param key Segment whose numeric value is stepped.
 * @param direction Stepping direction.
 * @param precision Precision used to validate the completed group.
 * @param isDateAllowed Predicate that accepts selectable ISO dates.
 * @returns Updated groups for the next allowed date, or `undefined` when none is found.
 */
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

/**
 * Steps one completed segment while its date group is still incomplete.
 *
 * @param groups Current editable groups.
 * @param key Segment whose numeric value is stepped.
 * @param direction Stepping direction.
 * @returns Updated groups, or `undefined` when the next value is outside the field range.
 */
export const getNextPartialDateSegmentGroups = (
  groups: TDateSegmentGroup[],
  key: TDateSegmentKey,
  direction: -1 | 1,
): TDateSegmentGroup[] | undefined => {
  const segment = getDateSegment(groups, key);
  if (!segment) return undefined;

  const [min, max] = segment.field === 'day' ? [1, 31] : segment.field === 'month' ? [1, 12] : [1, 9999];
  const candidate = Number(segment.value) + direction;
  if (candidate < min || candidate > max) return undefined;

  return updateDateSegment(groups, key, `${candidate}`.padStart(segment.maxLength, '0'));
};

/**
 * Converts a complete visual group into its canonical precision-aware ISO token.
 *
 * @param group Editable date group to serialize.
 * @param precision Precision represented by the group.
 * @returns The serialized ISO token, or `undefined` when required segments are incomplete.
 */
export const getDateSegmentGroupValue = (group: TDateSegmentGroup, precision: TDatePrecision): string | undefined => {
  const values = Object.fromEntries(group.segments.map((segment) => [segment.field, segment.value])) as Partial<
    Record<TDateMaskField, string>
  >;
  /**
   * Checks whether a field has a value that fills its mask width.
   *
   * @param field Segment field to inspect.
   * @returns `true` when the segment exists and is complete.
   */
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

/**
 * Updates one segment immutably while limiting its value to the field width.
 *
 * @param groups Current editable groups.
 * @param key Segment to update.
 * @param value New segment value.
 * @returns A new group list containing the limited value.
 */
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
