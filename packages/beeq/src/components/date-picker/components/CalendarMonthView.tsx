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
};

/** ISO used to compare a month cell against the internal selection. */
const monthCellISO = (year: number, month: number): string => `${year}-${String(month + 1).padStart(2, '0')}-01`;

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
}) => {
  const months = getMonthNames(locale, 'short');
  const effectiveSelection: TSelection = type === 'range' && tentativeRange.length === 2 ? tentativeRange : selection;

  const isMonthDisabled = (month: number): boolean => !isMonthWithinBounds(year, month, minISO, maxISO);

  return (
    <div
      class="bq-date-picker__months"
      onKeyDown={onGridKeyDown}
      part={CALENDAR_PARTS.months}
      role="grid"
      tabIndex={-1}
    >
      {months.map((name, month) => {
        const disabled = isMonthDisabled(month);
        const iso = monthCellISO(year, month);
        const selected = isSelected(iso, effectiveSelection, type);
        const rangeStart = isRangeStart(iso, effectiveSelection, type);
        const rangeEnd = isRangeEnd(iso, effectiveSelection, type);
        const rangeInner = isRangeInner(iso, effectiveSelection, type);
        const isFocused = focusedMonth === month;

        const parts: string[] = [CALENDAR_PARTS.month];
        if (selected) parts.push(CALENDAR_PARTS.monthSelected);
        if (rangeStart) parts.push(CALENDAR_PARTS.rangeStart);
        if (rangeEnd) parts.push(CALENDAR_PARTS.rangeEnd);
        if (rangeInner) parts.push(CALENDAR_PARTS.rangeInner);
        if (disabled) parts.push(CALENDAR_PARTS.disabled);

        return (
          <button
            key={month}
            aria-disabled={disabled ? 'true' : undefined}
            aria-selected={selected ? 'true' : undefined}
            class={{
              'bq-date-picker__month-cell': true,
              'is-selected': selected,
              'is-range-start': rangeStart,
              'is-range-end': rangeEnd,
              'is-range-inner': rangeInner,
              'is-out-of-bounds': disabled,
            }}
            data-month={month}
            disabled={disabled}
            onClick={(ev) => !disabled && onMonthSelect(month, ev)}
            onFocus={() => onMonthFocus(month)}
            onMouseEnter={() => onMonthHover(iso)}
            onMouseLeave={() => onMonthHover(undefined)}
            part={`${CALENDAR_PARTS.button} ${parts.join(' ')}`}
            role="gridcell"
            tabIndex={isFocused ? 0 : -1}
            type="button"
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};
