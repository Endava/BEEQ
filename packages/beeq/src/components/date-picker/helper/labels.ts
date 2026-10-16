import type { TCalendarView, TDatePrecision } from '../bq-date-picker.types';
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
 *
 * @param args Calendar state used to derive the label.
 * @returns The localized label for the current calendar header.
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

/**
 * Aria label announcing what clicking the title switches to.
 * Views cycle days → months → years → back to the base view (days for
 * `precision="day"`, months for `precision="month"`).
 *
 * @param view Current calendar view.
 * @param precision Date precision configured for the picker.
 * @returns The localized action label for the header title button.
 */
export const getHeaderTitleLabel = (view: TCalendarView, precision: TDatePrecision = 'day'): string => {
  if (view === 'days') return DEFAULT_ARIA_LABELS.chooseMonth;
  if (view === 'months') return DEFAULT_ARIA_LABELS.chooseYear;
  return precision === 'month' ? DEFAULT_ARIA_LABELS.chooseMonth : DEFAULT_ARIA_LABELS.chooseDate;
};

/**
 * Gets the aria label for the previous navigation button in a view.
 *
 * @param view Current calendar view.
 * @returns The appropriate previous navigation label.
 */
export const getPreviousLabel = (view: TCalendarView): string => {
  if (view === 'days') return DEFAULT_ARIA_LABELS.previousMonth;
  if (view === 'months') return DEFAULT_ARIA_LABELS.previousYear;
  return DEFAULT_ARIA_LABELS.previousDecade;
};

/**
 * Gets the aria label for the next navigation button in a view.
 *
 * @param view Current calendar view.
 * @returns The appropriate next navigation label.
 */
export const getNextLabel = (view: TCalendarView): string => {
  if (view === 'days') return DEFAULT_ARIA_LABELS.nextMonth;
  if (view === 'months') return DEFAULT_ARIA_LABELS.nextYear;
  return DEFAULT_ARIA_LABELS.nextDecade;
};
