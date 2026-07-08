import { type FunctionalComponent, h } from '@stencil/core';

import type { TDatePickerType, TSelection } from '../bq-date-picker.types';
import { isYearWithinBounds } from '../helper/bounds';
import { CALENDAR_PARTS } from '../helper/constants';
import { isRangeEnd, isRangeInner, isRangeStart, isSelected } from '../helper/selection';

export type TCalendarYearViewProps = {
  /** Years to render (typically 12). */
  years: number[];
  /** Focused year (roving tabindex target). */
  focusedYear: number;
  /** Optional min bound (any precision — `YYYY`, `YYYY-MM`, `YYYY-MM-DD`). */
  minISO?: string;
  /** Optional max bound (any precision). */
  maxISO?: string;
  /** Current selection (as stored internally: array of YYYY-MM-DD). */
  selection: TSelection;
  /** In-progress range preview while hovering a second endpoint. */
  tentativeRange: TSelection;
  /** Selection type — drives multi / range highlighting. */
  type: TDatePickerType;
  /** Callback fired when the user picks a year. */
  onYearSelect: (year: number, ev: MouseEvent | KeyboardEvent) => void;
  /** Callback fired when a year button receives focus. */
  onYearFocus: (year: number) => void;
  /** Callback fired when hovering a year cell (range preview). */
  onYearHover: (iso: string | undefined) => void;
  /** Optional keydown handler for the grid (roving tabindex management). */
  onGridKeyDown: (ev: KeyboardEvent) => void;
};

/** ISO used to compare a year cell against the internal selection. */
const yearCellISO = (year: number): string => `${year}-01-01`;

type TYearCellState = {
  iso: string;
  disabled: boolean;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  rangeInner: boolean;
  isFocused: boolean;
};

const buildYearParts = (state: TYearCellState): string => {
  const parts: string[] = [CALENDAR_PARTS.year];
  if (state.selected) parts.push(CALENDAR_PARTS.yearSelected);
  if (state.rangeStart) parts.push(CALENDAR_PARTS.rangeStart);
  if (state.rangeEnd) parts.push(CALENDAR_PARTS.rangeEnd);
  if (state.rangeInner) parts.push(CALENDAR_PARTS.rangeInner);
  if (state.disabled) parts.push(CALENDAR_PARTS.disabled);
  return parts.join(' ');
};

const buildYearCellState = (
  year: number,
  focusedYear: number,
  minISO: string | undefined,
  maxISO: string | undefined,
  selection: TSelection,
  type: TDatePickerType,
): TYearCellState => {
  const iso = yearCellISO(year);
  const disabled = !isYearWithinBounds(year, minISO, maxISO);
  return {
    iso,
    disabled,
    selected: isSelected(iso, selection, type),
    rangeStart: isRangeStart(iso, selection, type),
    rangeEnd: isRangeEnd(iso, selection, type),
    rangeInner: isRangeInner(iso, selection, type),
    isFocused: focusedYear === year,
  };
};

type TRenderYearCellArgs = {
  year: number;
  state: TYearCellState;
  onYearSelect: (year: number, ev: MouseEvent | KeyboardEvent) => void;
  onYearFocus: (year: number) => void;
  onYearHover: (iso: string | undefined) => void;
};

const renderYearCell = ({ year, state, onYearSelect, onYearFocus, onYearHover }: TRenderYearCellArgs) => (
  <button
    key={year}
    aria-disabled={state.disabled ? 'true' : undefined}
    aria-selected={state.selected ? 'true' : undefined}
    class={{
      'bq-date-picker__year-cell': true,
      'is-selected': state.selected,
      'is-range-start': state.rangeStart,
      'is-range-end': state.rangeEnd,
      'is-range-inner': state.rangeInner,
      'is-out-of-bounds': state.disabled,
    }}
    data-year={year}
    disabled={state.disabled}
    onClick={(ev) => !state.disabled && onYearSelect(year, ev)}
    onFocus={() => onYearFocus(year)}
    onMouseEnter={() => onYearHover(state.iso)}
    onMouseLeave={() => onYearHover(undefined)}
    part={`${CALENDAR_PARTS.button} ${buildYearParts(state)}`}
    role="gridcell"
    tabIndex={state.isFocused ? 0 : -1}
    type="button"
  >
    {year}
  </button>
);

/**
 * Year picker — 12 buttons for a decade grid.
 */
export const CalendarYearView: FunctionalComponent<TCalendarYearViewProps> = ({
  years,
  focusedYear,
  minISO,
  maxISO,
  selection,
  tentativeRange,
  type,
  onYearSelect,
  onYearFocus,
  onYearHover,
  onGridKeyDown,
}) => {
  const effectiveSelection: TSelection = type === 'range' && tentativeRange.length === 2 ? tentativeRange : selection;

  return (
    <div class="bq-date-picker__years" onKeyDown={onGridKeyDown} part={CALENDAR_PARTS.years} role="grid" tabIndex={-1}>
      {years.map((year) => {
        const state = buildYearCellState(year, focusedYear, minISO, maxISO, effectiveSelection, type);
        return renderYearCell({ year, state, onYearSelect, onYearFocus, onYearHover });
      })}
    </div>
  );
};
