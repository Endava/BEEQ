import { type FunctionalComponent, h } from '@stencil/core';

import type { TDatePickerType, TSelection } from '../bq-date-picker2.types';
import { getISOYearMonth } from '../helper/calendar';
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
  /** Selection type — drives multi / range highlighting. */
  type: TDatePickerType;
  /** Callback fired when the user picks a month. */
  onMonthSelect: (month: number, ev: MouseEvent | KeyboardEvent) => void;
  /** Callback fired when a month button receives focus. */
  onMonthFocus: (month: number) => void;
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
  type,
  onMonthSelect,
  onMonthFocus,
  onGridKeyDown,
}) => {
  const months = getMonthNames(locale, 'short');
  const minBound = getISOYearMonth(minISO);
  const maxBound = getISOYearMonth(maxISO);

  const isMonthDisabled = (month: number): boolean => {
    if (minBound && (year < minBound.year || (year === minBound.year && month < minBound.month))) {
      return true;
    }
    if (maxBound && (year > maxBound.year || (year === maxBound.year && month > maxBound.month))) {
      return true;
    }
    return false;
  };

  return (
    <div
      class="bq-date-picker2__months"
      onKeyDown={onGridKeyDown}
      part={CALENDAR_PARTS.months}
      role="grid"
      tabIndex={-1}
    >
      {months.map((name, month) => {
        const disabled = isMonthDisabled(month);
        const iso = monthCellISO(year, month);
        const selected = isSelected(iso, selection, type);
        const rangeStart = isRangeStart(iso, selection, type);
        const rangeEnd = isRangeEnd(iso, selection, type);
        const rangeInner = isRangeInner(iso, selection, type);
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
              'bq-date-picker2__month-cell': true,
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
