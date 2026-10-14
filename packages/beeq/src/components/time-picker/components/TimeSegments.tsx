import { type FunctionalComponent, h } from '@stencil/core';

import { isSameSegmentKey, type TTimeHourCycle, type TTimeMask, type TTimeMaskField } from '../../../shared/utils';
import { TIME_PICKER_PARTS } from '../helper/constants';
import {
  getTimeSegmentRange,
  type TTimeSegment,
  type TTimeSegmentGroup,
  type TTimeSegmentKey,
} from '../helper/segments';

/** Resolves the visible text and the spinbutton range and value of a segment. */
export const getSegmentSpinValue = (
  segment: TTimeSegment,
  hourCycle: TTimeHourCycle,
  dayPeriodLabels: readonly [string, string],
): { display: string; range?: [number, number]; valueNow?: number } => {
  if (segment.field === 'dayPeriod') {
    if (!segment.value) return { display: '' };

    const [am, pm] = dayPeriodLabels;
    return { display: segment.value === 'pm' ? pm : am };
  }

  const range = getTimeSegmentRange(segment.field, hourCycle);
  const numeric = Number(segment.value);
  const isComplete = segment.value.length === segment.maxLength;
  const valueNow = isComplete && numeric >= range[0] && numeric <= range[1] ? numeric : undefined;
  return { display: segment.value, range, valueNow };
};

export type TTimeSegmentsProps = {
  /** Segment group being edited. */
  group?: TTimeSegmentGroup;
  /** Locale mask with the template and the segment positions. */
  mask: TTimeMask;
  /** Localized AM and PM labels. */
  dayPeriodLabels: readonly [string, string];
  /** Segment that holds the roving tab stop. */
  activeSegment?: TTimeSegmentKey;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  invalid: boolean;
  /** Returns the accessible name of a field. */
  getLabel: (field: TTimeMaskField) => string;
  onSegmentClick: (key: TTimeSegmentKey, ev: MouseEvent) => void;
  onSegmentKeyDown: (ev: KeyboardEvent, key: TTimeSegmentKey) => void;
  onSegmentFocus: (ev: FocusEvent) => void;
  onSegmentBlur: (ev: FocusEvent) => void;
};

type TTimeSegmentProps = Omit<TTimeSegmentsProps, 'group' | 'mask'> & {
  groupId: number;
  segment: TTimeSegment;
  hourCycle: TTimeHourCycle;
};

/** Keyboard-editable spinbutton for one time field. */
const TimeSegment: FunctionalComponent<TTimeSegmentProps> = ({
  groupId,
  segment,
  hourCycle,
  dayPeriodLabels,
  activeSegment,
  disabled,
  readonly,
  required,
  invalid,
  getLabel,
  onSegmentClick,
  onSegmentKeyDown,
  onSegmentFocus,
  onSegmentBlur,
}) => {
  const key = { groupId, field: segment.field };
  const isActive = isSameSegmentKey(activeSegment, key);
  const isComplete = segment.value.length === segment.maxLength;
  const { display, range, valueNow } = getSegmentSpinValue(segment, hourCycle, dayPeriodLabels);

  return (
    <span
      aria-disabled={disabled ? 'true' : undefined}
      aria-invalid={invalid ? 'true' : 'false'}
      aria-label={getLabel(segment.field)}
      aria-readonly={readonly ? 'true' : undefined}
      aria-required={required ? 'true' : undefined}
      aria-valuemax={range?.[1]}
      aria-valuemin={range?.[0]}
      aria-valuenow={valueNow}
      aria-valuetext={display || 'Empty'}
      class={{
        'bq-time-picker__segment': true,
        'bq-time-picker__segment--day-period': segment.field === 'dayPeriod',
        'is-active': isActive,
        'is-empty': !segment.value,
        'is-partial': segment.value.length > 0 && !isComplete,
      }}
      data-group-id={`${groupId}`}
      data-segment-field={segment.field}
      inputmode={segment.field === 'dayPeriod' ? 'text' : 'numeric'}
      onBlur={onSegmentBlur}
      onClick={(ev) => onSegmentClick(key, ev)}
      onFocus={onSegmentFocus}
      onKeyDown={(ev) => onSegmentKeyDown(ev, key)}
      part={TIME_PICKER_PARTS.segment}
      role="spinbutton"
      tabindex={isActive && !disabled ? 0 : -1}
    >
      {display || segment.placeholder}
    </span>
  );
};

/** Locale literal (separator, prefix or suffix) between the segments. Hidden from assistive tech. */
const SegmentLiteral: FunctionalComponent<{ text: string }> = ({ text }) =>
  text ? (
    <span aria-hidden="true" class="bq-time-picker__segment-literal" part={TIME_PICKER_PARTS.segmentLiteral}>
      {text}
    </span>
  ) : null;

/** Renders the segments with the locale literals before, between and after them. */
export const TimeSegments: FunctionalComponent<TTimeSegmentsProps> = ({ group, mask, ...state }) => {
  if (!group) return [];

  const { template, segments, hourCycle } = mask;
  return [
    <SegmentLiteral text={template.slice(0, segments[0]?.start ?? 0)} />,
    ...group.segments.flatMap((segment, index) => [
      <TimeSegment {...state} groupId={group.id} hourCycle={hourCycle} segment={segment} />,
      <SegmentLiteral text={template.slice(segments[index].end, segments[index + 1]?.start)} />,
    ]),
  ];
};
