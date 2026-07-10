import { type FunctionalComponent, h } from '@stencil/core';

import type { TDatePickerType, TSelection } from '../bq-date-picker.types';
import { isMonthWithinBounds } from '../helper/bounds';
import { CALENDAR_PARTS } from '../helper/constants';
import { getMonthNames } from '../helper/intl';
import { isRangeEnd, isRangeInner, isRangeStart, isSelected } from '../helper/selection';

export type TCalendarMonthViewProps = {
  /** Year currently shown in the header. */
  year: number;
  /** Focused month (0-based), used for the roving tabindex. */
  focusedMonth: number;
  /** Locale used for localized month names. */
  locale: Intl.LocalesArgument;
  /** Min year/month to keep enabled. */
  minISO?: string;
  /** Max year/month to keep enabled. */
  maxISO?: string;
  /** Current selection (as stored internally: array of YYYY-MM-DD). */
  selection: TSelection;
  /** In-progress range preview while hovering a second endpoint. */
  tentativeRange: TSelection;
  /** Selection type — drives multi / range highlighting. */
  type: TDatePickerType;
  /** Callback fired when the user picks a month. */
  onMonthSelect: (month: number, ev: MouseEvent | KeyboardEvent) => void;
  /** Callback fired when a month button receives focus. */
  onMonthFocus: (month: number) => void;
  /** Callback fired when hovering a month cell (range preview). */
  onMonthHover: (iso: string | undefined) => void;
  /** Optional keydown handler for the grid (roving tabindex management). */
  onGridKeyDown: (ev: KeyboardEvent) => void;
  /** Number of columns rendered by the month grid. */
  gridColumns: number;
};

/** ISO used to compare a month cell against the internal selection. */
const monthCellISO = (year: number, month: number): string => `${year}-${String(month + 1).padStart(2, '0')}-01`;

type TMonthCellState = {
  iso: string;
  disabled: boolean;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  rangeInner: boolean;
  isFocused: boolean;
};

const buildMonthParts = (state: TMonthCellState): string => {
  const parts: string[] = [CALENDAR_PARTS.month];
  if (state.selected) parts.push(CALENDAR_PARTS.monthSelected);
  if (state.rangeStart) parts.push(CALENDAR_PARTS.rangeStart);
  if (state.rangeEnd) parts.push(CALENDAR_PARTS.rangeEnd);
  if (state.rangeInner) parts.push(CALENDAR_PARTS.rangeInner);
  if (state.disabled) parts.push(CALENDAR_PARTS.disabled);
  return parts.join(' ');
};

const buildMonthCellState = (
  year: number,
  month: number,
  focusedMonth: number,
  minISO: string | undefined,
  maxISO: string | undefined,
  selection: TSelection,
  type: TDatePickerType,
): TMonthCellState => {
  const iso = monthCellISO(year, month);
  const disabled = !isMonthWithinBounds(year, month, minISO, maxISO);
  return {
    iso,
    disabled,
    selected: isSelected(iso, selection, type),
    rangeStart: isRangeStart(iso, selection, type),
    rangeEnd: isRangeEnd(iso, selection, type),
    rangeInner: isRangeInner(iso, selection, type),
    isFocused: focusedMonth === month,
  };
};

type TRenderMonthCellArgs = {
  month: number;
  name: string;
  state: TMonthCellState;
  onMonthSelect: (month: number, ev: MouseEvent | KeyboardEvent) => void;
  onMonthFocus: (month: number) => void;
  onMonthHover: (iso: string | undefined) => void;
};

const chunkMonths = (months: string[], columns: number): Array<Array<{ month: number; name: string }>> => {
  const rows: Array<Array<{ month: number; name: string }>> = [];
  for (let month = 0; month < months.length; month += columns) {
    rows.push(months.slice(month, month + columns).map((name, offset) => ({ month: month + offset, name })));
  }
  return rows;
};

const renderMonthCell = ({ month, name, state, onMonthSelect, onMonthFocus, onMonthHover }: TRenderMonthCellArgs) => (
  // biome-ignore lint/a11y/useFocusableInteractive: gridcell is a structural ARIA container; focus is managed by the child <button> via roving tabindex
  <div
    aria-selected={state.selected ? 'true' : undefined}
    class="bq-date-picker__month-gridcell"
    role="gridcell"
    key={month}
  >
    <button
      aria-disabled={state.disabled ? 'true' : undefined}
      class={{
        'bq-date-picker__month-cell': true,
        'is-selected': state.selected,
        'is-range-start': state.rangeStart,
        'is-range-end': state.rangeEnd,
        'is-range-inner': state.rangeInner,
        'is-out-of-bounds': state.disabled,
      }}
      data-month={month}
      disabled={state.disabled}
      onClick={(ev) => !state.disabled && onMonthSelect(month, ev)}
      onFocus={() => onMonthFocus(month)}
      onMouseEnter={() => onMonthHover(state.iso)}
      onMouseLeave={() => onMonthHover(undefined)}
      part={`${CALENDAR_PARTS.button} ${buildMonthParts(state)}`}
      tabIndex={state.isFocused ? 0 : -1}
      type="button"
    >
      {name}
    </button>
  </div>
);

/**
 * Month picker — 12 buttons in a 3×4 grid.
 */
export const CalendarMonthView: FunctionalComponent<TCalendarMonthViewProps> = ({
  year,
  focusedMonth,
  locale,
  minISO,
  maxISO,
  selection,
  tentativeRange,
  type,
  onMonthSelect,
  onMonthFocus,
  onMonthHover,
  onGridKeyDown,
  gridColumns,
}) => {
  const months = getMonthNames(locale, 'short');
  const effectiveSelection: TSelection = type === 'range' && tentativeRange.length === 2 ? tentativeRange : selection;
  const rows = chunkMonths(months, gridColumns);

  return (
    <div
      class="bq-date-picker__months"
      data-grid-columns={String(gridColumns)}
      onKeyDown={onGridKeyDown}
      part={CALENDAR_PARTS.months}
      role="grid"
      tabIndex={-1}
    >
      {rows.map((row, rowIndex) => (
        // biome-ignore lint/a11y/useFocusableInteractive: gridcell is a structural ARIA container; focus is managed by the child <button> via roving tabindex
        <div class="bq-date-picker__month-row" role="row" key={`month-row-${rowIndex}`}>
          {row.map(({ month, name }) => {
            const state = buildMonthCellState(year, month, focusedMonth, minISO, maxISO, effectiveSelection, type);
            return renderMonthCell({ month, name, state, onMonthSelect, onMonthFocus, onMonthHover });
          })}
        </div>
      ))}
    </div>
  );
};
