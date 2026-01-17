import { ISO_DATE_LOCALE } from '../../../shared/utils/date';

/** Default fallback input ID */
const DEFAULT_INPUT_ID = 'date-picker';

/** Calendar month shadow DOM parts for common elements */
const CALENDAR_COMMON_EXPORT_PARTS =
  'calendar__heading,calendar__table,calendar__tr,calendar__head,calendar__week,calendar__th,calendar__td';

/** Calendar month shadow DOM parts for button elements */
const CALENDAR_BUTTON_EXPORT_PARTS =
  'calendar__button,calendar__day,calendar__selected,calendar__today,calendar__disallowed,calendar__outside,calendar__range-start,calendar__range-end,calendar__range-inner';

/** Combined export parts for calendar-month component */
const CALENDAR_MONTH_EXPORT_PARTS = `${CALENDAR_COMMON_EXPORT_PARTS},${CALENDAR_BUTTON_EXPORT_PARTS}`;

/** Export parts for the calendar container component (calendar-date, calendar-range, calendar-multi) */
const CALENDAR_CONTAINER_EXPORT_PARTS =
  'container:calendar__container,header:calendar__header,button:calendar__button,previous:calendar__previous,next:calendar__next,disabled:calendar__disabled,heading:calendar__heading';

/** Maps picker type to Cally component tag name */
const CALENDAR_TYPE_MAP = {
  single: 'calendar-date',
  multi: 'calendar-multi',
  range: 'calendar-range',
} as const;

export {
  CALENDAR_BUTTON_EXPORT_PARTS,
  CALENDAR_COMMON_EXPORT_PARTS,
  CALENDAR_CONTAINER_EXPORT_PARTS,
  CALENDAR_MONTH_EXPORT_PARTS,
  CALENDAR_TYPE_MAP,
  DEFAULT_INPUT_ID,
  ISO_DATE_LOCALE,
};
