import { type FunctionalComponent, h } from '@stencil/core';

import { CALENDAR_PARTS } from '../helper/constants';

export type TCalendarYearViewProps = {
  /** Years to render (typically 12). */
  years: number[];
  /** Currently selected year (optional). */
  selectedYear?: number;
  /** Focused year (roving tabindex target). */
  focusedYear: number;
  /** Optional min year. */
  minYear?: number;
  /** Optional max year. */
  maxYear?: number;
  /** Callback fired when the user picks a year. */
  onYearSelect: (year: number, ev: MouseEvent | KeyboardEvent) => void;
  /** Callback fired when a year button receives focus. */
  onYearFocus: (year: number) => void;
  /** Optional keydown handler for the grid (roving tabindex management). */
  onGridKeyDown: (ev: KeyboardEvent) => void;
};

/**
 * Year picker — 12 buttons for a decade grid.
 */
export const CalendarYearView: FunctionalComponent<TCalendarYearViewProps> = ({
  years,
  selectedYear,
  focusedYear,
  minYear,
  maxYear,
  onYearSelect,
  onYearFocus,
  onGridKeyDown,
}) => (
  <div class="bq-date-picker2__years" onKeyDown={onGridKeyDown} part={CALENDAR_PARTS.years} role="grid" tabIndex={-1}>
    {years.map((year) => {
      const disabled = (minYear !== undefined && year < minYear) || (maxYear !== undefined && year > maxYear);
      const selected = selectedYear === year;
      const isFocused = focusedYear === year;

      const parts: string[] = [CALENDAR_PARTS.year];
      if (selected) parts.push(CALENDAR_PARTS.yearSelected);
      if (disabled) parts.push(CALENDAR_PARTS.disabled);

      return (
        <button
          key={year}
          aria-disabled={disabled ? 'true' : undefined}
          aria-selected={selected ? 'true' : undefined}
          class={{
            'bq-date-picker2__year-cell': true,
            'is-selected': selected,
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
