import type { TCalendarView } from '../bq-date-picker2.types';
import { addMonths, startOfMonth } from './calendar';
import { DECADE_GRID_SIZE, DEFAULT_ARIA_LABELS } from './constants';
import { formatMonth, formatYear } from './intl';

interface HeaderLabelArgs {
  view: TCalendarView;
  viewDate: Date;
  focusedYear: number;
  decadeStart: number;
  monthCount: number;
  locale: Intl.LocalesArgument;
}

/**
 * Builds the label shown in the calendar header title button.
 *
 * - `days`: localized "Month Year" for a single panel, or "StartYear – EndYear"
 *   when several months are visible at once.
 * - `months`: the localized year currently in focus.
 * - `years`: the closed range spanning the visible decade.
 */
export const getHeaderLabel = ({
  view,
  viewDate,
  focusedYear,
  decadeStart,
  monthCount,
  locale,
}: HeaderLabelArgs): string => {
  if (view === 'days') {
    if (monthCount > 1) {
      const first = startOfMonth(viewDate);
      const last = startOfMonth(addMonths(viewDate, monthCount - 1));
      const startYear = formatYear(first, locale);
      const endYear = formatYear(last, locale);
      return startYear === endYear ? startYear : `${startYear} – ${endYear}`;
    }
    return formatMonth(viewDate, locale, 'long', true);
  }
  if (view === 'months') {
    return formatYear(new Date(focusedYear, 0, 1), locale);
  }
  const end = decadeStart + DECADE_GRID_SIZE - 1;
  return `${decadeStart} – ${end}`;
};

/** Aria label announcing what clicking the title switches to. */
export const getHeaderTitleLabel = (view: TCalendarView): string => {
  if (view === 'days') return DEFAULT_ARIA_LABELS.chooseMonth;
  return DEFAULT_ARIA_LABELS.chooseYear;
};

/** Aria label for the "previous" navigation button, per view. */
export const getPreviousLabel = (view: TCalendarView): string => {
  if (view === 'days') return DEFAULT_ARIA_LABELS.previousMonth;
  if (view === 'months') return DEFAULT_ARIA_LABELS.previousYear;
  return DEFAULT_ARIA_LABELS.previousDecade;
};

/** Aria label for the "next" navigation button, per view. */
export const getNextLabel = (view: TCalendarView): string => {
  if (view === 'days') return DEFAULT_ARIA_LABELS.nextMonth;
  if (view === 'months') return DEFAULT_ARIA_LABELS.nextYear;
  return DEFAULT_ARIA_LABELS.nextDecade;
};
