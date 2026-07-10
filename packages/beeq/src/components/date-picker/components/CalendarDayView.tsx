import { type FunctionalComponent, h } from '@stencil/core';

import type { TDatePickerType, TSelection } from '../bq-date-picker.types';
import { buildMonthMatrix, isSameDay, isWithinBounds, type TCalendarCell } from '../helper/calendar';
import { CALENDAR_PARTS } from '../helper/constants';
import { formatMonth, getWeekdayNames } from '../helper/intl';
import { isRangeEnd, isRangeInner, isRangeStart, isSelected } from '../helper/selection';

type TCellState = {
  outside: boolean;
  disallowed: boolean;
  outOfBounds: boolean;
  disabled: boolean;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  rangeInner: boolean;
  isToday: boolean;
  isFocused: boolean;
  buttonHidden: boolean;
};

const buildCellPartList = (state: TCellState): string => {
  const parts: string[] = [CALENDAR_PARTS.day];
  if (state.selected) parts.push(CALENDAR_PARTS.selected);
  if (state.isToday) parts.push(CALENDAR_PARTS.today);
  if (state.outside) parts.push(CALENDAR_PARTS.outside);
  if (state.disallowed) parts.push(CALENDAR_PARTS.disallowed);
  if (state.outOfBounds) parts.push(CALENDAR_PARTS.disabled);
  if (state.rangeStart) parts.push(CALENDAR_PARTS.rangeStart);
  if (state.rangeEnd) parts.push(CALENDAR_PARTS.rangeEnd);
  if (state.rangeInner) parts.push(CALENDAR_PARTS.rangeInner);
  return parts.join(' ');
};

type TCellContext = {
  effectiveSelection: TSelection;
  type: TDatePickerType;
  today: Date;
  focusedISO: string;
  minISO?: string;
  maxISO?: string;
  isDateDisallowed?: (date: Date) => boolean;
  showOutsideDays: boolean;
};

const computeCellState = (cell: TCalendarCell, ctx: TCellContext): TCellState => {
  const disallowed = ctx.isDateDisallowed?.(cell.date) ?? false;
  const outOfBounds = !isWithinBounds(cell.date, ctx.minISO, ctx.maxISO);
  return {
    outside: cell.outside,
    disallowed,
    outOfBounds,
    disabled: disallowed || outOfBounds,
    selected: isSelected(cell.iso, ctx.effectiveSelection, ctx.type),
    rangeStart: isRangeStart(cell.iso, ctx.effectiveSelection, ctx.type),
    rangeEnd: isRangeEnd(cell.iso, ctx.effectiveSelection, ctx.type),
    rangeInner: isRangeInner(cell.iso, ctx.effectiveSelection, ctx.type),
    isToday: isSameDay(cell.date, ctx.today),
    isFocused: cell.iso === ctx.focusedISO,
    buttonHidden: cell.outside && !ctx.showOutsideDays,
  };
};

type TCellCallbacks = {
  onDaySelect: (iso: string, ev: MouseEvent) => void;
  onDayHover: (iso: string | undefined) => void;
  onDayFocus: (iso: string) => void;
};

const renderCell = (cell: TCalendarCell, state: TCellState, cb: TCellCallbacks) => (
  <td
    key={cell.iso}
    aria-selected={state.selected ? 'true' : undefined}
    class="bq-date-picker__td"
    part={CALENDAR_PARTS.td}
    // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: WAI-ARIA date-picker grid pattern.
    role="gridcell"
    tabIndex={-1}
  >
    <button
      aria-current={state.isToday ? 'date' : undefined}
      aria-disabled={state.disabled ? 'true' : undefined}
      class={{
        'bq-date-picker__day': true,
        'is-selected': state.selected,
        'is-today': state.isToday,
        'is-outside': state.outside,
        'is-disallowed': state.disallowed,
        'is-out-of-bounds': state.outOfBounds,
        'is-range-start': state.rangeStart,
        'is-range-end': state.rangeEnd,
        'is-range-inner': state.rangeInner,
        'is-hidden': state.buttonHidden,
      }}
      data-iso={cell.iso}
      onClick={(ev) => !state.disabled && cb.onDaySelect(cell.iso, ev)}
      onFocus={() => cb.onDayFocus(cell.iso)}
      onMouseEnter={() => cb.onDayHover(cell.iso)}
      onMouseLeave={() => cb.onDayHover(undefined)}
      part={`${CALENDAR_PARTS.button} ${buildCellPartList(state)}`}
      tabIndex={state.isFocused ? 0 : -1}
      type="button"
    >
      {cell.date.getDate()}
    </button>
  </td>
);

export type TCalendarDayViewProps = {
  /** Anchor date for the month grid (any date within the month). */
  viewDate: Date;
  /** Current selection (parsed). */
  selection: TSelection;
  /** In-progress range selection (start pending or hovered end). */
  tentativeRange: TSelection;
  /** Focused date ISO (roving tabindex target). */
  focusedISO: string;
  /** Selection type. */
  type: TDatePickerType;
  /** Locale. */
  locale: Intl.LocalesArgument;
  /** First day of the week. */
  firstDayOfWeek: number;
  /** Whether to render outside-month days. */
  showOutsideDays: boolean;
  /** Optional min ISO. */
  minISO?: string;
  /** Optional max ISO. */
  maxISO?: string;
  /** Optional guard for disallowed days. */
  isDateDisallowed?: (date: Date) => boolean;
  /** Callback fired when a day is picked. */
  onDaySelect: (iso: string, ev: MouseEvent | KeyboardEvent) => void;
  /** Callback fired when the pointer hovers a day (used for range preview). */
  onDayHover: (iso: string | undefined) => void;
  /** Callback fired when a day receives focus. */
  onDayFocus: (iso: string) => void;
  /** Optional handler for keyboard nav bubbling up (Arrow, Home, End...). */
  onGridKeyDown: (ev: KeyboardEvent) => void;
};

/**
 * Day-level calendar view — weekday row + 6x7 grid.
 *
 * The grid is a `<table role="grid">` so it is announced correctly by screen
 * readers, and it uses a roving tabindex so only the "focused" day is in the
 * tab order. Keyboard nav is delegated to the host via `onGridKeyDown`.
 */
export const CalendarDayView: FunctionalComponent<TCalendarDayViewProps> = (props) => {
  const {
    viewDate,
    selection,
    tentativeRange,
    focusedISO,
    type,
    locale,
    firstDayOfWeek,
    showOutsideDays,
    minISO,
    maxISO,
    isDateDisallowed,
    onDaySelect,
    onDayHover,
    onDayFocus,
    onGridKeyDown,
  } = props;

  const weekdays = getWeekdayNames(locale, firstDayOfWeek, 'short');
  const rows = buildMonthMatrix(viewDate, firstDayOfWeek);
  const today = new Date();

  // Localized "Month Year" label used to name the grid for screen readers,
  // e.g. "July 2026". Always computed so the grid is named even when the
  // visible heading is rendered outside this component.
  const gridLabel = formatMonth(viewDate, locale, 'long', true);

  // The effective selection includes the tentative range so hover states
  // preview correctly during range selection.
  const effectiveSelection: TSelection = type === 'range' && tentativeRange.length === 2 ? tentativeRange : selection;

  return (
    <div class="bq-date-picker__day-view">
      <table
        aria-label={gridLabel}
        class="bq-date-picker__table"
        onKeyDown={onGridKeyDown}
        part={CALENDAR_PARTS.table}
        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: WAI-ARIA date-picker grid pattern.
        role="grid"
      >
        <thead part={CALENDAR_PARTS.head}>
          <tr part={CALENDAR_PARTS.tr}>
            {weekdays.map((wd) => (
              <th key={wd.long} abbr={wd.long} class="bq-date-picker__th" part={CALENDAR_PARTS.th} scope="col">
                {wd.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0].iso} class="bq-date-picker__week" part={`${CALENDAR_PARTS.tr} ${CALENDAR_PARTS.week}`}>
              {row.map((cell) => {
                const state = computeCellState(cell, {
                  effectiveSelection,
                  type,
                  today,
                  focusedISO,
                  minISO,
                  maxISO,
                  isDateDisallowed,
                  showOutsideDays,
                });
                return renderCell(cell, state, { onDaySelect, onDayHover, onDayFocus });
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
