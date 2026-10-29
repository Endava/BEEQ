/**
 * Generic engine for keyboard-editable, fixed-width numeric (or token) segments
 * such as the day/month/year parts of a date or the hour/minute/second parts of a time.
 *
 * Every helper is pure and immutable so components can keep the segment draft
 * in a `@State()` and re-render on each update.
 */

/** Minimal mask segment shape needed to build an editable segment. */
export type TSegmentMaskSegment<TField extends string> = {
  field: TField;
  placeholder: string;
};

/** A single editable field within a segment group. */
export type TSegment<TField extends string> = {
  field: TField;
  maxLength: number;
  placeholder: string;
  value: string;
};

/** One editable token (e.g. a date or a time) made of ordered segments. */
export type TSegmentGroup<TField extends string> = {
  id: number;
  segments: TSegment<TField>[];
};

/** Stable address for a segment across renders. */
export type TSegmentKey<TField extends string> = {
  field: TField;
  groupId: number;
};

/**
 * Creates one editable group from mask segments and optional prefilled values.
 *
 * @param id Stable identifier for the group.
 * @param maskSegments Ordered mask segments that define the group.
 * @param values Optional field values used to prefill the segments.
 * @param maxLengths Optional per-field maximum length. Defaults to the placeholder length.
 * @returns The editable segment group.
 */
export const createSegmentGroup = <TField extends string>(
  id: number,
  maskSegments: readonly TSegmentMaskSegment<TField>[],
  values?: Partial<Record<TField, string>>,
  maxLengths?: Partial<Record<TField, number>>,
): TSegmentGroup<TField> => ({
  id,
  segments: maskSegments.map((segment) => ({
    field: segment.field,
    maxLength: maxLengths?.[segment.field] ?? segment.placeholder.length,
    placeholder: segment.placeholder,
    value: values?.[segment.field] ?? '',
  })),
});

/**
 * Checks whether two segment keys address the same segment.
 *
 * @param a First segment key.
 * @param b Second segment key.
 * @returns `true` when both keys share the group and field.
 */
export const isSameSegmentKey = <TField extends string>(
  a: TSegmentKey<TField> | undefined,
  b: TSegmentKey<TField> | undefined,
): boolean => !!a && a.groupId === b?.groupId && a.field === b?.field;

/**
 * Finds the segment addressed by a stable group and field key.
 *
 * @param groups Editable groups to search.
 * @param key Stable address of the target segment.
 * @returns The matching segment, or `undefined` when absent.
 */
export const getSegment = <TField extends string>(
  groups: readonly TSegmentGroup<TField>[],
  key: TSegmentKey<TField>,
): TSegment<TField> | undefined =>
  groups.find((group) => group.id === key.groupId)?.segments.find((segment) => segment.field === key.field);

/**
 * Checks whether a segment value fills its full width.
 *
 * @param segment Segment to inspect.
 * @returns `true` when the segment exists and is complete.
 */
export const isSegmentComplete = <TField extends string>(segment: TSegment<TField> | undefined): boolean =>
  Boolean(segment && segment.value.length === segment.maxLength);

/**
 * Maps a group's segments to a record of field values.
 *
 * @param group Group to read.
 * @returns The field values keyed by field name.
 */
export const getSegmentGroupValues = <TField extends string>(
  group: TSegmentGroup<TField>,
): Partial<Record<TField, string>> =>
  Object.fromEntries(group.segments.map((segment) => [segment.field, segment.value])) as Partial<
    Record<TField, string>
  >;

/**
 * Finds the first incomplete segment in visual order for initial focus placement.
 *
 * @param groups Editable groups to inspect.
 * @returns The first empty segment key, or `undefined` when all segments have values.
 */
export const getFirstEmptySegmentKey = <TField extends string>(
  groups: readonly TSegmentGroup<TField>[],
): TSegmentKey<TField> | undefined => {
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
export const getSegmentKeys = <TField extends string>(
  groups: readonly TSegmentGroup<TField>[],
): TSegmentKey<TField>[] =>
  groups.flatMap((group) => group.segments.map((segment) => ({ groupId: group.id, field: segment.field })));

/**
 * Moves one segment backward or forward, including across group boundaries.
 *
 * @param groups Editable groups that determine navigation order.
 * @param current Currently focused segment.
 * @param direction Navigation direction.
 * @returns The adjacent key, or `undefined` at a navigation boundary.
 */
export const getAdjacentSegmentKey = <TField extends string>(
  groups: readonly TSegmentGroup<TField>[],
  current: TSegmentKey<TField>,
  direction: -1 | 1,
): TSegmentKey<TField> | undefined => {
  const keys = getSegmentKeys(groups);
  const index = keys.findIndex((key) => isSameSegmentKey(key, current));
  if (index === -1) return undefined;
  return keys[index + direction];
};

/**
 * Gets the first or last segment key within a group.
 *
 * @param group Group to inspect.
 * @param boundary Requested group boundary.
 * @returns The boundary segment key, or `undefined` when the group is empty.
 */
export const getSegmentGroupBoundaryKey = <TField extends string>(
  group: TSegmentGroup<TField> | undefined,
  boundary: 'start' | 'end',
): TSegmentKey<TField> | undefined => {
  const segment = boundary === 'start' ? group?.segments[0] : group?.segments[group.segments.length - 1];
  return segment && group ? { groupId: group.id, field: segment.field } : undefined;
};

/**
 * Updates one segment immutably while limiting its value to the field width.
 *
 * @param groups Current editable groups.
 * @param key Segment to update.
 * @param value New segment value.
 * @returns A new group list containing the limited value.
 */
export const updateSegment = <TField extends string>(
  groups: readonly TSegmentGroup<TField>[],
  key: TSegmentKey<TField>,
  value: string,
): TSegmentGroup<TField>[] =>
  groups.map((group) => {
    if (group.id !== key.groupId) return group;
    return {
      ...group,
      segments: group.segments.map((segment) =>
        segment.field === key.field ? { ...segment, value: value.slice(0, segment.maxLength) } : segment,
      ),
    };
  });

/**
 * Appends a typed digit to a numeric segment, restarting the segment when it is already full.
 *
 * @param segment Segment receiving the digit.
 * @param digit Single typed digit.
 * @returns The next raw segment value.
 */
export const appendSegmentDigit = <TField extends string>(segment: TSegment<TField>, digit: string): string =>
  segment.value.length >= segment.maxLength ? digit : `${segment.value}${digit}`;

/**
 * Zero-pads a numeric value to the width of a segment.
 *
 * @param value Numeric value to pad.
 * @param maxLength Segment width.
 * @returns The padded segment value.
 */
export const padSegmentValue = (value: number, maxLength: number): string => `${value}`.padStart(maxLength, '0');

/**
 * Steps one numeric segment by a fixed amount inside an inclusive range.
 *
 * @param groups Current editable groups.
 * @param key Segment whose numeric value is stepped.
 * @param direction Stepping direction.
 * @param range Inclusive numeric range accepted by the field.
 * @returns Updated groups, or `undefined` when the next value is outside the range.
 */
export const stepSegment = <TField extends string>(
  groups: readonly TSegmentGroup<TField>[],
  key: TSegmentKey<TField>,
  direction: number,
  range: readonly [number, number],
): TSegmentGroup<TField>[] | undefined => {
  const segment = getSegment(groups, key);
  if (!segment) return undefined;

  const [min, max] = range;
  const candidate = Number(segment.value) + direction;
  if (candidate < min || candidate > max) return undefined;

  return updateSegment(groups, key, padSegmentValue(candidate, segment.maxLength));
};
