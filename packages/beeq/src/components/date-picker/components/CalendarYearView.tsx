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
  /** Selection type — drives multi / range highlighting. */
  type: TDatePickerType;
  /** Callback fired when the user picks a year. */
  onYearSelect: (year: number, ev: MouseEvent | KeyboardEvent) => void;
  /** Callback fired when a year button receives focus. */
  onYearFocus: (year: number) => void;
  /** Optional keydown handler for the grid (roving tabindex management). */
  onGridKeyDown: (ev: KeyboardEvent) => void;
};

/** ISO used to compare a year cell against the internal selection. */
const yearCellISO = (year: number): string => `${year}-01-01`;

/**
 * Year picker — 12 buttons for a decade grid.
 */
export const CalendarYearView: FunctionalComponent<TCalendarYearViewProps> = ({
  years,
  focusedYear,
  minISO,
  maxISO,
  selection,
  type,
  onYearSelect,
  onYearFocus,
  onGridKeyDown,
}) => (
  <div class="bq-date-picker__years" onKeyDown={onGridKeyDown} part={CALENDAR_PARTS.years} role="grid" tabIndex={-1}>
    {years.map((year) => {
      const disabled = !isYearWithinBounds(year, minISO, maxISO);
      const iso = yearCellISO(year);
      const selected = isSelected(iso, selection, type);
      const rangeStart = isRangeStart(iso, selection, type);
      const rangeEnd = isRangeEnd(iso, selection, type);
      const rangeInner = isRangeInner(iso, selection, type);
      const isFocused = focusedYear === year;

      const parts: string[] = [CALENDAR_PARTS.year];
      if (selected) parts.push(CALENDAR_PARTS.yearSelected);
      if (rangeStart) parts.push(CALENDAR_PARTS.rangeStart);
      if (rangeEnd) parts.push(CALENDAR_PARTS.rangeEnd);
      if (rangeInner) parts.push(CALENDAR_PARTS.rangeInner);
      if (disabled) parts.push(CALENDAR_PARTS.disabled);

      return (
        <button
          key={year}
          aria-disabled={disabled ? 'true' : undefined}
          aria-selected={selected ? 'true' : undefined}
          class={{
            'bq-date-picker__year-cell': true,
            'is-selected': selected,
            'is-range-start': rangeStart,
            'is-range-end': rangeEnd,
            'is-range-inner': rangeInner,
            'is-out-of-bounds': disabled,
          }}
          data-year={year}
          disabled={disabled}
          onClick={(ev) => !disabled && onYearSelect(year, ev)}
          onFocus={() => onYearFocus(year)}
          part={`${CALENDAR_PARTS.button} ${parts.join(' ')}`}
          role="gridcell"
          tabIndex={isFocused ? 0 : -1}
          type="button"
        >
          {year}
        </button>
      );
    })}
  </div>
);
