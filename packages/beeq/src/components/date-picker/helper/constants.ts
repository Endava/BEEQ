/** Default fallback input ID */
export const DEFAULT_INPUT_ID = 'date-picker';

/** Default aria labels used by the calendar navigation */
export const DEFAULT_ARIA_LABELS = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  previousDecade: 'Previous decade',
  nextDecade: 'Next decade',
  chooseMonth: 'Choose month',
  chooseYear: 'Choose year',
  chooseDate: 'Choose date',
} as const;

/**
 * Shadow DOM parts exposed by the component.
 * Kept as a single list so it is easy to audit against the JSDoc @part list.
 */
export const CALENDAR_PARTS = {
  base: 'base',
  label: 'label',
  control: 'control',
  prefix: 'prefix',
  suffix: 'suffix',
  input: 'input',
  clearBtn: 'clear-btn',
  button: 'button',
  panel: 'panel',
  container: 'calendar__container',
  header: 'calendar__header',
  heading: 'calendar__heading',
  previous: 'calendar__previous',
  next: 'calendar__next',
  table: 'calendar__table',
  head: 'calendar__head',
  tr: 'calendar__tr',
  th: 'calendar__th',
  week: 'calendar__week',
  td: 'calendar__td',
  day: 'calendar__day',
  today: 'calendar__today',
  selected: 'calendar__selected',
  outside: 'calendar__outside',
  disallowed: 'calendar__disallowed',
  disabled: 'calendar__disabled',
  rangeStart: 'calendar__range-start',
  rangeEnd: 'calendar__range-end',
  rangeInner: 'calendar__range-inner',
  months: 'calendar__months',
  month: 'calendar__month',
  monthSelected: 'calendar__month-selected',
  years: 'calendar__years',
  year: 'calendar__year',
  yearSelected: 'calendar__year-selected',
} as const;

/** Number of years shown in the decade view grid. Uses 12 to fill a 3x4 grid. */
export const DECADE_GRID_SIZE = 12;

/**
 * Maximum number of month panels rendered side-by-side. Range pickers only
 * benefit from up to 2 panels — beyond that the popover overflows most
 * viewports and roving keyboard navigation becomes confusing.
 */
export const MAX_MONTHS_PER_VIEW = 2;
