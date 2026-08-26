import type { EventEmitter } from '@stencil/core';
import { AttachInternals, Component, Element, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { JSX } from '@stencil/core/internal';

import type { Placement } from '../../services/interfaces';
import {
  getDateMask,
  getTodayISO,
  hasSlotContent,
  isEventTargetChildOfElement,
  isNil,
  updateFormValidity,
  validatePropValue,
} from '../../shared/utils';
import { INPUT_VALIDATION, type TInputValidation } from '../input/bq-input.types';
import type {
  DaysOfWeek,
  TCalendarView,
  TDatePickerType,
  TDatePrecision,
  TFloatingStrategy,
  TMonthsPerView,
  TSelection,
} from './bq-date-picker.types';
import {
  CALENDAR_VIEW,
  DATE_PICKER_TYPE,
  DATE_PRECISION,
  DAYS_OF_WEEK,
  FLOATING_PLACEMENT,
  FLOATING_STRATEGY,
  MONTHS_PER_VIEW,
} from './bq-date-picker.types';
import { CalendarDayView } from './components/CalendarDayView';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarMonthView } from './components/CalendarMonthView';
import { CalendarYearView } from './components/CalendarYearView';
import { clampISOToBounds, isMonthWithinBounds, isYearWithinBounds, padBound } from './helper/bounds';
import {
  addDays,
  addMonths,
  addYears,
  clampDate,
  endOfMonth,
  getDecadeStart,
  isWithinBounds,
  parseISO,
  startOfMonth,
  toISO,
} from './helper/calendar';
import { CALENDAR_PARTS, DECADE_GRID_SIZE, DEFAULT_INPUT_ID, MAX_MONTHS_PER_VIEW } from './helper/constants';
import { formatMonth } from './helper/intl';
import { getHeaderLabel, getHeaderTitleLabel, getNextLabel, getPreviousLabel } from './helper/labels';
import { getMaskPlaceholder } from './helper/mask';
import { advanceFocusedMonth, advanceFocusedYear, getGridColumns } from './helper/navigation';
import {
  getAdjacentSegmentKey,
  getDateSegment,
  getDateSegmentGroupBoundaryKey,
  getDateSegmentGroups,
  getDateSegmentGroupValue,
  getFirstEmptySegmentKey,
  type TDateSegmentGroup,
  type TDateSegmentKey,
  updateDateSegment,
} from './helper/segments';
import { applySelection, buildTentativeRange, parseValue, serializeValue } from './helper/selection';
import { computeHasValue, normalizeValue } from './helper/value';

/** Compose the default constraint-validation message for a set of flags. */
const defaultValidityMessage = (flags: ValidityStateFlags): string => {
  if (flags.badInput) return 'Please, input or select a valid date';
  if (flags.rangeUnderflow && flags.rangeOverflow) return 'Selected value is outside the allowed range';
  if (flags.rangeUnderflow) return 'Selected value is before the minimum';
  return 'Selected value is after the maximum';
};

/**
 * The Date Picker is a pure-Stencil calendar input.
 *
 * It supports single, multi, and range selection, three navigation views
 * (days → months → years), full localization via `Intl.DateTimeFormat`,
 * multi-month side-by-side rendering, and RTL layouts.
 *
 * @example How to use it
 * ```html
 * <bq-date-picker
 *   first-day-of-week="1"
 *   locale="en-GB"
 *   name="bq-date-picker"
 *   placeholder="Enter your date"
 *   type="single"
 *   value="2026-07-15"
 * >
 *   <label slot="label">Date picker label</label>
 * </bq-date-picker>
 * ```
 *
 * @documentation https://storybook.beeq.design/?path=/docs/components-date-picker--docs
 *
 * @status experimental
 *
 * @dependency bq-button
 * @dependency bq-dropdown
 * @dependency bq-icon
 *
 * @attr {boolean} autofocus - If `true`, the Date picker input will be focused on component render.
 * @attr {string} clear-button-label - The clear button aria label.
 * @attr {string} calendar-button-label - The aria-label for the calendar trigger button.
 * @attr {boolean} disable-clear - If `true`, the clear button won't be displayed.
 * @attr {boolean} disabled - Indicates whether the Date picker input is disabled or not.
 * @attr {number} distance - Represents the distance between the panel and the input.
 * @attr {0 | 1 | 2 | 3 | 4 | 5 | 6} first-day-of-week - The first day of the week (0 = Sunday).
 * @attr {Intl.DateTimeFormatOptions} format-options - Display formatting options.
 * @attr {string} form - The form ID the input belongs to.
 * @attr {string} form-validation-message - Custom native form validation message.
 * @attr {"days" | "months" | "years"} initial-view - The view to open when the panel first opens.
 * @attr {function} is-date-disallowed - Predicate that marks specific dates as unselectable.
 * @attr {Intl.LocalesArgument} locale - Locale used for formatting.
 * @attr {string} max - Latest selectable date (ISO).
 * @attr {string} min - Earliest selectable date (ISO).
 * @attr {number} months - Number of month panels to render side by side (range/multi). Capped at 2.
 * @attr {"single" | "months"} months-per-view - Prev/Next step size when multi-month is enabled.
 * @attr {string} name - Input name.
 * @attr {boolean} open - If `true`, the panel is visible.
 * @attr {string} panel-height - Overrides the height of the panel.
 * @attr {string} placeholder - Legacy placeholder text. The locale-derived date mask is always shown instead.
 * @attr {"top" | "right" | "bottom" | "left" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"} placement - Placement of the panel.
 * @attr {boolean} required - Whether a value must be selected before submitting the form.
 * @attr {boolean} show-outside-days - Whether to render days that belong to adjacent months.
 * @attr {number} skidding - Skidding between the panel and the trigger.
 * @attr {"fixed" | "absolute"} strategy - Positioning strategy for the panel.
 * @attr {"single" | "multi" | "range"} type - Selection mode.
 * @attr {"error" | "none" | "success" | "warning"} validation-status - Validation state.
 * @attr {string} value - The current selection, as a wire-format string. Shape depends on `type` and `precision`:
 *   • **single**: a single ISO token — `YYYY-MM-DD` (precision `day`), `YYYY-MM` (precision `month`), `YYYY` (precision `year`).
 *   • **range**: `start/end` (two tokens joined with `/`) at the same precision.
 *   • **multi**: space-separated tokens at the same precision.
 *   Bounds (`min`/`max`) may be supplied at any of these precisions and are honoured accordingly.
 * @attr {"day" | "month" | "year"} precision - Granularity of the value and of the calendar's initial view. Also drives which cells are selectable (day cells at `day`, month cells at `month`, year cells at `year`). Defaults to `"day"`.
 *
 * @method clear - Clears the selected value.
 *
 * @event bqBlur - Emitted when the input loses focus.
 * @event bqChange - Emitted when the value changes.
 * @event bqClear - Emitted when the value is cleared.
 * @event bqFocus - Emitted when the input receives focus.
 * @event bqViewChange - Emitted when the internal calendar view changes (days ↔ months ↔ years).
 *
 * @slot label - The label displayed above the input.
 * @slot prefix - Content rendered before the input value.
 * @slot suffix - Icon rendered inside the calendar trigger button (defaults to a calendar icon).
 * @slot clear-icon - Icon used inside the clear button.
 *
 * @part base - The component's base wrapper.
 * @part label - The label slot container.
 * @part control - The input control wrapper.
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 * @part input - The native input element.
 * @part clear-btn - The clear button.
 * @part calendar-trigger - The calendar icon trigger button.
 * @part button - Any button rendered inside the calendar (nav or day/month/year cell).
 * @part panel - The dropdown panel container.
 * @part calendar__container - The calendar panels wrapper.
 * @part calendar__header - The header row (prev / title / next).
 * @part calendar__heading - The header title button (or month label above a panel).
 * @part calendar__previous - The previous navigation button.
 * @part calendar__next - The next navigation button.
 * @part calendar__table - The day-view `<table>` element.
 * @part calendar__head - The day-view table header row wrapper.
 * @part calendar__tr - Any row within the day-view table.
 * @part calendar__th - The day-view weekday header cells.
 * @part calendar__week - Body rows in the day-view table.
 * @part calendar__td - Body cells in the day-view table.
 * @part calendar__day - Any day button in the day view.
 * @part calendar__today - The button representing today's date.
 * @part calendar__selected - Any selected day.
 * @part calendar__outside - Any day outside the visible month.
 * @part calendar__disallowed - Any day rejected by `isDateDisallowed`.
 * @part calendar__disabled - Any button disabled by min/max.
 * @part calendar__range-start - The first day of a range selection.
 * @part calendar__range-end - The last day of a range selection.
 * @part calendar__range-inner - Days between the start and end of a range.
 * @part calendar__months - The month-view grid.
 * @part calendar__month - Any month button.
 * @part calendar__month-selected - The currently selected month.
 * @part calendar__years - The year-view grid.
 * @part calendar__year - Any year button.
 * @part calendar__year-selected - The currently selected year.
 *
 * @cssprop --bq-date-picker--background-color - Input background color.
 * @cssprop --bq-date-picker--border-color - Input border color.
 * @cssprop --bq-date-picker--border-color-disabled - Border color when disabled.
 * @cssprop --bq-date-picker--border-color-focus - Border color on focus.
 * @cssprop --bq-date-picker--border-radius - Input border radius.
 * @cssprop --bq-date-picker--border-style - Border style.
 * @cssprop --bq-date-picker--border-width - Border width.
 * @cssprop --bq-date-picker--currentDate-border-color - Border color for today's date.
 * @cssprop --bq-date-picker--currentDate-border-width - Border width for today's date.
 * @cssprop --bq-date-picker--day-size - Size of a day cell in the calendar.
 * @cssprop --bq-date-picker--gap - Gap between the input content and prefix/suffix.
 * @cssprop --bq-date-picker--header-title-color - Color of the per-panel month label in multi-panel view.
 * @cssprop --bq-date-picker--icon-size - Size of the icons used in prefix/suffix/clear.
 * @cssprop --bq-date-picker--label-margin-bottom - Space below the label.
 * @cssprop --bq-date-picker--label-text-color - Label text color.
 * @cssprop --bq-date-picker--label-text-size - Label text size.
 * @cssprop --bq-date-picker--padding-end - Input padding end.
 * @cssprop --bq-date-picker--padding-start - Input padding start.
 * @cssprop --bq-date-picker--paddingY - Input vertical padding.
 * @cssprop --bq-date-picker--range-background-color - Background color for range start/end days.
 * @cssprop --bq-date-picker--range-inner-background-color - Background color for inner range days.
 * @cssprop --bq-date-picker--row-gap - Vertical space between day-grid rows.
 * @cssprop --bq-date-picker--text-color - Input text color.
 * @cssprop --bq-date-picker--text-placeholder-color - Placeholder text color.
 * @cssprop --bq-date-picker--text-size - Input text size.
 * @cssprop --bq-date-picker--view-cell-background-hover - Hover background for day/month/year cells.
 * @cssprop --bq-date-picker--view-cell-background-selected - Selected background for day/month/year cells.
 * @cssprop --bq-date-picker--view-cell-height - Height of month/year cells.
 * @cssprop --bq-date-picker--view-cell-radius - Border radius of day/month/year cells.
 * @cssprop --bq-date-picker--view-cell-text-selected - Text color for selected day/month/year cells.
 */
@Component({
  tag: 'bq-date-picker',
  styleUrl: './scss/bq-date-picker.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqDatePicker {
  // Own Properties
  // ====================

  /**
   * Memoized parsed selection. Key encodes both `value` and `type` so cache
   * misses invalidate correctly. Value derives from `value`; not promoted to
   * `@State()` to preserve a single source of truth.
   */
  private cachedSelection?: { key: string; value: TSelection };

  /** Sticky flag: last typed input couldn't be parsed. Cleared on next successful commit or `clear()`. */
  private hasBadInput: boolean = false;

  /** Source of the current panel opening, used to preserve the appropriate focus target. */
  private activeOpenSource: 'input' | 'trigger' | 'programmatic' = 'programmatic';

  /** Initial `value` captured at load time, restored on form reset. */
  private initialValue?: string;

  /** Set while `commitSelection` writes back to `this.value`. */
  private isCommittingSelection = false;

  /** Prevents an internal segment commit from replacing an incomplete visual draft. */
  private isCommittingSegmentDraft = false;

  private labelElem?: HTMLElement;

  /** Pending requestAnimationFrame id used by `focusButton`. */
  private pendingFocusRAF?: number;

  /** Source to apply to the next open transition initiated by this component. */
  private pendingOpenSource?: 'input' | 'trigger';

  private prefixElem?: HTMLElement;
  private segmentContainerElem?: HTMLElement;

  private triggerBtnElem?: HTMLBqButtonElement;

  // Reference to host HTML element
  // ===================================

  @AttachInternals() internals!: ElementInternals;
  @Element() el!: HTMLBqDatePickerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() decadeStart: number = getDecadeStart(new Date().getFullYear());
  @State() focusedISO: string = getTodayISO();
  @State() focusedMonth: number = new Date().getMonth();
  @State() focusedYear: number = new Date().getFullYear();
  @State() hasConstraintError = false;
  @State() hasLabel = false;
  @State() hasPrefix = false;
  @State() hasValue = false;
  @State() activeSegment?: TDateSegmentKey;
  @State() segmentGroups: TDateSegmentGroup[] = [];
  @State() tentativeHover?: string;
  @State() view: TCalendarView = 'days';
  @State() viewDate: Date = new Date();

  // Public Property API
  // ========================

  /** If `true`, the Date picker input will be focused on component render. */
  @Prop({ reflect: true }) autofocus: boolean = false;

  /** The clear button aria label. */
  @Prop({ reflect: true }) clearButtonLabel: string = 'Clear value';

  /** The aria-label for the calendar trigger button. */
  @Prop({ reflect: true }) calendarButtonLabel: string = 'Open calendar';

  /** If `true`, the clear button won't be displayed. */
  @Prop({ reflect: true }) disableClear: boolean = false;

  /** Indicates whether the Date picker input is disabled or not. */
  @Prop({ reflect: true, mutable: true }) disabled: boolean = false;

  /** Distance (gutter) between the Date picker panel and the input element. */
  @Prop({ reflect: true }) distance: number = 8;

  /** The first day of the week, where Sunday is 0, Monday is 1, etc. */
  @Prop({ reflect: true }) firstDayOfWeek: DaysOfWeek = 1;

  /**
   * Numeric options used to derive the input mask's field order and separators.
   *
   * The options must contain numeric or two-digit day/month fields and a
   * numeric year. Textual or variable-length fields fall back to the locale
   * numeric mask and emit a development warning.
   */
  @Prop() formatOptions?: Intl.DateTimeFormatOptions;

  /** The ID of the form the input belongs to. */
  @Prop({ reflect: true }) form?: string;

  /** Native form validation message (mandatory if `required` is set). */
  @Prop({ mutable: true }) formValidationMessage?: string;

  /** The view opened first when the panel becomes visible. */
  @Prop({ reflect: true }) initialView: TCalendarView = 'days';

  /** Predicate that marks specific dates as unselectable. */
  @Prop() isDateDisallowed?: (date: Date) => boolean;

  /** Locale used for formatting dates. */
  @Prop({ reflect: true }) locale: Intl.LocalesArgument = 'en-GB';

  /** Latest date that can be selected (ISO). */
  @Prop({ reflect: true }) max?: string;

  /** Earliest date that can be selected (ISO). */
  @Prop({ reflect: true }) min?: string;

  /**
   * Number of months to show side by side (range / multi). Capped at 2.
   * Larger values are silently clamped to keep the popover from overflowing
   * the viewport and to preserve keyboard navigation semantics.
   */
  @Prop({ reflect: true, mutable: true }) months: number = 1;

  /**
   * How the next/previous buttons should navigate the calendar.
   * - single: navigate one month at a time.
   * - months: navigate by the number of months displayed.
   */
  @Prop({ reflect: true }) monthsPerView: TMonthsPerView = 'single';

  /** The Date picker input name. */
  @Prop({ reflect: true }) name!: string;

  /** If `true`, the panel is visible. */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /** Overrides the height of the Date picker panel. */
  @Prop({ reflect: true, mutable: true }) panelHeight?: string = 'auto';

  /** Legacy placeholder text. The locale-derived date mask is shown when no value is selected. */
  @Prop({ reflect: true }) placeholder?: string;

  /** Position of the Date picker panel. */
  @Prop({ reflect: true }) placement: Placement = 'bottom-end';

  /**
   * Precision of the value produced by the picker.
   *
   * - `day`   → `YYYY-MM-DD` (default). Standard drill-down.
   * - `month` → `YYYY-MM`. Selection commits on the months view; no days view.
   * - `year`  → `YYYY`. Selection commits on the years view; no months/days view.
   *
   * When precision is coarser than day, `initialView` is forced to match and
   * the header title cycles through the views available for that precision.
   */
  @Prop({ reflect: true }) precision: TDatePrecision = 'day';

  /** Whether a value must be selected before submitting the form. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Skidding between the panel and the input element. */
  @Prop({ reflect: true }) skidding: number = 0;

  /** Whether to render days outside the current month. */
  @Prop({ reflect: true }) showOutsideDays: boolean = false;

  /** Positioning strategy for the panel. */
  @Prop({ reflect: true }) strategy: TFloatingStrategy = 'fixed';

  /**
   * Selection type.
   * - `single`: single date.
   * - `multi`: multiple discrete dates.
   * - `range`: contiguous range.
   */
  @Prop({ reflect: true }) type: TDatePickerType = 'single';

  /** Validation state applied to the input. */
  @Prop({ reflect: true }) validationStatus: TInputValidation = 'none';

  /**
   * Currently selected value, in the precision-aware wire format:
   * - `precision="day"`   → tokens are `YYYY-MM-DD`
   * - `precision="month"` → tokens are `YYYY-MM`
   * - `precision="year"`  → tokens are `YYYY`
   *
   * How multiple tokens are combined depends on `type`:
   * - `single` → a single token (e.g. `"2025-05-15"`, `"2025-05"`, `"2025"`)
   * - `range`  → `"start/end"` — two tokens joined with `/`
   * - `multi`  → space-separated tokens (e.g. `"2025-05-15 2025-05-20"`)
   */
  @Prop({ reflect: true, mutable: true }) value: string | undefined;

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValueChange(newValue: string | undefined, oldValue: string | undefined) {
    if (newValue === oldValue) return;

    // Normalize invalid tokens before propagating to the form or the UI so
    // consumers can't submit an invalid wire value while the display shows
    // nothing. If normalization rewrote the value, reflect it back on the
    // prop and let the follow-up watcher tick handle the normalized string.
    const normalized = normalizeValue(newValue, this.type, this.precision);
    if (normalized !== newValue) {
      this.value = normalized;
      return;
    }

    this.hasBadInput = false;
    if (!this.isCommittingSegmentDraft) this.syncDerivedFromValue();
    if (this.isCommittingSelection) return;

    this.syncViewToValue();
  }

  @Watch('formatOptions')
  @Watch('locale')
  handleFormattingChange() {
    this.warnForIncompatibleFormatOptions();
    this.syncDerivedFromValue();
  }

  @Watch('type')
  handleTypeChange() {
    // `type` affects wire-format parsing, display formatting, and validity.
    // Re-normalize the current value against the new type; if that rewrites
    // the value, the `value` watcher takes over. Otherwise refresh derived
    // state and re-sync the visible calendar range.
    const normalized = normalizeValue(this.value, this.type, this.precision);
    if (normalized !== this.value) {
      this.value = normalized;
      return;
    }

    this.syncDerivedFromValue();
    this.syncViewToValue();
  }

  @Watch('precision')
  handlePrecisionChange() {
    validatePropValue(DATE_PRECISION, 'day', this.el, 'precision');
    // Precision affects both wire format and default view. Force the calendar
    // to open on the matching view and re-normalize the current value so
    // trailing day/month segments are dropped or padded consistently.
    this.view = this.precisionToView(this.precision);
    const normalized = normalizeValue(this.value, this.type, this.precision);
    if (normalized !== this.value) {
      this.value = normalized;
      return;
    }

    this.syncDerivedFromValue();
    this.syncViewToValue();
  }

  @Watch('max')
  @Watch('min')
  handleBoundsChange() {
    this.syncValidity();
    this.syncViewToValue();
  }

  @Watch('required')
  handleRequiredChange() {
    this.syncValidity();
  }

  @Watch('firstDayOfWeek')
  @Watch('initialView')
  @Watch('monthsPerView')
  @Watch('placement')
  @Watch('precision')
  @Watch('strategy')
  @Watch('type')
  @Watch('validationStatus')
  checkPropValues() {
    validatePropValue(DATE_PICKER_TYPE, 'single', this.el, 'type');
    validatePropValue(CALENDAR_VIEW, 'days', this.el, 'initialView');
    validatePropValue(DATE_PRECISION, 'day', this.el, 'precision');
    validatePropValue(MONTHS_PER_VIEW, 'single', this.el, 'monthsPerView');
    validatePropValue(FLOATING_STRATEGY, 'fixed', this.el, 'strategy');
    validatePropValue(FLOATING_PLACEMENT, 'bottom-end', this.el, 'placement');
    validatePropValue(INPUT_VALIDATION, 'none', this.el, 'validationStatus');
    validatePropValue(DAYS_OF_WEEK, 1, this.el, 'firstDayOfWeek');
  }

  @Watch('months')
  handleMonthsChange() {
    // Clamp `months` to an integer in [1, MAX_MONTHS_PER_VIEW]. Non-single
    // pickers may show 1..MAX side-by-side; single pickers ignore the value
    // in `getMonthCount()`, so we still clamp defensively to keep the prop
    // reflected value predictable.
    const clamped = this.clampMonths(this.months);
    if (clamped !== this.months) this.months = clamped;
  }

  @Watch('open')
  handleOpen(open: boolean) {
    if (!open) {
      this.tentativeHover = undefined;
      if (this.activeOpenSource !== 'input') {
        requestAnimationFrame(() =>
          this.triggerBtnElem?.shadowRoot?.querySelector<HTMLButtonElement>('button')?.focus(),
        );
      }
      return;
    }

    this.activeOpenSource = this.pendingOpenSource ?? 'programmatic';
    this.pendingOpenSource = undefined;
    // Precision locks the initial view; otherwise honor the consumer-provided one.
    this.view = this.precision === 'day' ? this.initialView : this.precisionToView(this.precision);
    this.syncViewToValue();
    if (this.activeOpenSource !== 'input') this.focusActiveCell();
  }

  @Watch('view')
  handleViewChange(next: TCalendarView, prev: TCalendarView) {
    if (next === prev) return;

    this.bqViewChange.emit({ view: next, el: this.el });
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler emitted when the input loses focus. */
  @Event() bqBlur!: EventEmitter<HTMLBqDatePickerElement>;

  /**
   * Callback handler emitted when the input value changes.
   */
  @Event() bqChange!: EventEmitter<{ value: string | undefined; el: HTMLBqDatePickerElement }>;

  /** Callback handler emitted when the value is cleared. */
  @Event() bqClear!: EventEmitter<HTMLBqDatePickerElement>;

  /** Callback handler emitted when the input receives focus. */
  @Event() bqFocus!: EventEmitter<HTMLBqDatePickerElement>;

  /**
   * Callback handler emitted when the internal calendar view changes
   * (e.g. from `days` to `months`, or from `years` back to `days`).
   */
  @Event() bqViewChange!: EventEmitter<{ view: TCalendarView; el: HTMLBqDatePickerElement }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.initialValue = this.value;
    // Precision locks the initial view when set. Otherwise honor `initialView`.
    // When the picker is rendered with `open` already true, `handleOpen` never
    // fires — apply the preference here so the initial paint respects it.
    this.view = this.precision === 'day' ? this.initialView : this.precisionToView(this.precision);
    this.checkPropValues();
    this.handleMonthsChange();
    this.warnForIncompatibleFormatOptions();
    this.syncDerivedFromValue();
    this.syncViewToValue();
  }

  componentDidLoad() {
    this.handleSlotChange();
    this.handleValueChange(this.value, undefined);
    if (this.autofocus && this.activeSegment) this.focusSegment(this.activeSegment);
    // `@Watch('open')` doesn't run for the initial prop value. Treat an
    // initially open picker as programmatic and focus its active calendar cell.
    if (this.open) this.focusActiveCell();
  }

  disconnectedCallback() {
    if (this.pendingFocusRAF !== undefined) {
      cancelAnimationFrame(this.pendingFocusRAF);
      this.pendingFocusRAF = undefined;
    }
  }

  formAssociatedCallback() {
    this.syncValidity();
  }

  formResetCallback() {
    // Native form reset should restore the value the field had when the form
    // was first parsed, not blank it. The `value` watcher takes care of
    // syncing derived state, form value, and validity.
    if (this.value === this.initialValue) return;

    this.value = this.initialValue;
  }

  // Listeners
  // ==============

  @Listen('bqOpen', { capture: true })
  handleOpenChange(ev: CustomEvent<{ open: boolean }>) {
    if (!isEventTargetChildOfElement(ev, this.el)) return;

    const { open } = ev.detail;
    if (this.open === open) return;

    this.open = open;
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /**
   * Clears the selected value and any pending validation state (bad input,
   * bounds overflow). Emits `bqClear`. No-op when the component is disabled.
   *
   * @returns A promise that resolves once the value has been cleared.
   */
  @Method()
  async clear(): Promise<void> {
    if (this.disabled) return;

    this.clearValue();
    this.bqClear.emit(this.el);
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleBlur = (): void => {
    if (this.disabled) return;

    this.bqBlur.emit(this.el);
  };

  /** Moves DOM focus after the roving-tabindex state has rendered. */
  private focusSegment = (key: TDateSegmentKey): void => {
    requestAnimationFrame(() => {
      this.segmentContainerElem
        ?.querySelector<HTMLElement>(`[data-group-id="${key.groupId}"][data-segment-field="${key.field}"]`)
        ?.focus();
    });
  };

  /** Keeps keyboard focus inside a locale-ordered date segment sequence. */
  private handleSegmentKeyDown = (ev: KeyboardEvent, key: TDateSegmentKey): void => {
    if (this.disabled) return;

    if (this.handleSegmentPopupShortcut(ev)) return;
    if (this.handleSegmentNavigation(ev, key)) return;
    if (this.handleSegmentDeletion(ev, key)) return;
    if (this.handleSegmentIncrement(ev, key)) return;

    this.handleSegmentDigit(ev, key);
  };

  /** Opens the calendar from the keyboard without changing segment focus. */
  private handleSegmentPopupShortcut = (ev: KeyboardEvent): boolean => {
    if (!ev.altKey || ev.key !== 'ArrowDown' || this.open) return false;

    ev.preventDefault();

    this.pendingOpenSource = 'input';
    this.open = true;
    return true;
  };

  /** Moves active focus between adjacent segments or to a group boundary. */
  private handleSegmentNavigation = (ev: KeyboardEvent, key: TDateSegmentKey): boolean => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(ev.key)) return false;

    ev.preventDefault();

    const group = this.segmentGroups.find((item) => item.id === key.groupId);
    const next =
      ev.key === 'Home' || ev.key === 'End'
        ? getDateSegmentGroupBoundaryKey(group, ev.key === 'Home' ? 'start' : 'end')
        : getAdjacentSegmentKey(this.segmentGroups, key, ev.key === 'ArrowLeft' ? -1 : 1);
    if (!next) return true;

    this.activeSegment = next;
    this.focusSegment(next);
    return true;
  };

  /** Clears a whole segment; Backspace then moves to the prior segment for continued deletion. */
  private handleSegmentDeletion = (ev: KeyboardEvent, key: TDateSegmentKey): boolean => {
    if (ev.key !== 'Backspace' && ev.key !== 'Delete') return false;

    ev.preventDefault();

    const segment = getDateSegment(this.segmentGroups, key);
    if (!segment) return true;

    if (!segment.value && ev.key === 'Backspace') {
      const previous = getAdjacentSegmentKey(this.segmentGroups, key, -1);
      if (!previous) return true;

      this.activeSegment = previous;
      this.focusSegment(previous);
      return true;
    }

    this.segmentGroups = updateDateSegment(this.segmentGroups, key, '');
    this.syncSegmentDraftValue();

    if (ev.key === 'Backspace') {
      const previous = getAdjacentSegmentKey(this.segmentGroups, key, -1);
      if (previous) {
        this.activeSegment = previous;
        this.focusSegment(previous);
        return true;
      }
    }

    this.activeSegment = key;
    return true;
  };

  /** Increments or decrements a complete segment when the resulting date remains selectable. */
  private handleSegmentIncrement = (ev: KeyboardEvent, key: TDateSegmentKey): boolean => {
    if (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown') return false;

    ev.preventDefault();

    const segment = getDateSegment(this.segmentGroups, key);
    if (!segment) return true;

    if (segment.value.length !== segment.maxLength) {
      this.applySegmentDraftUpdate(
        updateDateSegment(this.segmentGroups, key, this.getCurrentSegmentValue(segment.field)),
        key,
      );
      return true;
    }

    const limits = this.getSegmentLimits(segment.field);
    const candidate = Number(segment.value) + (ev.key === 'ArrowUp' ? 1 : -1);
    if (candidate < limits[0] || candidate > limits[1]) return true;

    const nextValue = `${candidate}`.padStart(segment.maxLength, '0');
    const nextGroups = updateDateSegment(this.segmentGroups, key, nextValue);
    const group = nextGroups.find((item) => item.id === key.groupId);
    const iso = group ? getDateSegmentGroupValue(group, this.precision) : undefined;
    if (!iso) {
      this.applySegmentDraftUpdate(nextGroups, key);
      return true;
    }

    const date = iso ? parseValue(iso, 'single', this.precision)[0] : undefined;
    const parsed = date ? parseISO(date) : undefined;
    if (!parsed || !isWithinBounds(parsed, this.min, this.max) || this.isDateDisallowed?.(parsed)) return true;

    this.applySegmentDraftUpdate(nextGroups, key);
    return true;
  };

  /** Applies a draft update and restores focus to the segment that initiated it. */
  private applySegmentDraftUpdate = (groups: TDateSegmentGroup[], key: TDateSegmentKey): void => {
    this.segmentGroups = groups;
    this.syncSegmentDraftValue();
    this.activeSegment = key;
    this.focusSegment(key);
  };

  /** Returns today's value for the requested date field, preserving its fixed segment width. */
  private getCurrentSegmentValue = (field: 'day' | 'month' | 'year'): string => {
    const today = getTodayISO();
    if (field === 'day') return today.slice(8, 10);
    if (field === 'month') return today.slice(5, 7);
    return today.slice(0, 4);
  };

  /** Returns the allowed numeric range for a date segment before full-date validation. */
  private getSegmentLimits = (field: 'day' | 'month' | 'year'): [number, number] => {
    if (field === 'day') return [1, 31];
    if (field === 'month') return [1, 12];
    return [1, 9999];
  };

  /** Adds one numeric character, replacing a completed segment when necessary. */
  private handleSegmentDigit = (ev: KeyboardEvent, key: TDateSegmentKey): void => {
    if (!/^\d$/.test(ev.key) || ev.metaKey || ev.ctrlKey) return;

    ev.preventDefault();

    const segment = getDateSegment(this.segmentGroups, key);
    if (!segment) return;

    const nextValue = segment.value.length >= segment.maxLength ? ev.key : `${segment.value}${ev.key}`;
    this.segmentGroups = updateDateSegment(this.segmentGroups, key, nextValue);
    this.syncSegmentDraftValue();

    if (nextValue.length < segment.maxLength) return;

    const next = getAdjacentSegmentKey(this.segmentGroups, key, 1);
    if (!next) return;

    this.activeSegment = next;
    this.focusSegment(next);
  };

  /** Opens the calendar from a segment without moving keyboard focus into the panel. */
  private handleSegmentClick = (key: TDateSegmentKey, ev: MouseEvent): void => {
    this.activeSegment = key;
    this.handleSegmentControlClick(ev);
    // The dropdown completes its own panel-focus work while opening. Defer the
    // segment focus until that work has finished so pointer entry remains here.
    requestAnimationFrame(() => this.focusSegment(key));
  };

  /** Focuses the current roving segment when the user clicks unoccupied field space or a separator. */
  private handleSegmentsClick = (ev: MouseEvent): void => {
    if (!this.activeSegment) return;

    this.handleSegmentClick(this.activeSegment, ev);
  };

  /** Routes control-surface clicks to the active segment without hijacking action buttons. */
  private handleControlClick = (ev: MouseEvent): void => {
    if (ev.composedPath().some((target) => target instanceof HTMLElement && target.tagName === 'BQ-BUTTON')) return;

    this.handleSegmentsClick(ev);
  };

  /** Emits focus only when focus enters the segmented date field from outside it. */
  private handleSegmentsFocusIn = (ev: FocusEvent): void => {
    if (this.segmentContainerElem?.contains(ev.relatedTarget as Node)) return;

    this.handleFocus();
  };

  /** Emits blur only when focus leaves the segmented date field entirely. */
  private handleSegmentsFocusOut = (ev: FocusEvent): void => {
    if (this.segmentContainerElem?.contains(ev.relatedTarget as Node)) return;

    this.clampCompleteSegmentGroupsToBounds();
    this.handleBlur();
  };

  private handleFocus = (): void => {
    if (this.disabled) return;

    this.bqFocus.emit(this.el);
  };

  private handleSegmentControlClick = (ev: MouseEvent): void => {
    if (this.disabled) return;

    ev.stopPropagation();

    if (this.open) return;

    this.pendingOpenSource = 'input';
    this.open = true;
  };

  private handleClearClick = (ev: CustomEvent): void => {
    if (this.disabled) return;

    this.clearValue();
    this.bqClear.emit(this.el);
    this.bqChange.emit({ value: this.value, el: this.el });
    this.segmentGroups = getDateSegmentGroups(undefined, this.type, this.precision, this.pickerMask);

    const firstSegment = getFirstEmptySegmentKey(this.segmentGroups);
    this.activeSegment = firstSegment;

    if (firstSegment) requestAnimationFrame(() => this.focusSegment(firstSegment));
    ev.stopPropagation();
  };

  /** Toggles the calendar panel open/closed when the trigger button is activated. */
  private handleTriggerClick = (): void => {
    if (this.disabled) return;

    this.pendingOpenSource = 'trigger';
    this.open = !this.open;
  };

  private clearValue = (): void => {
    this.value = undefined;
    this.hasBadInput = false;
    this.internals.setFormValue(null);
    this.tentativeHover = undefined;
  };

  private handleSlotChange = (): void => {
    this.hasLabel = this.labelElem ? hasSlotContent(this.labelElem) : false;
    this.hasPrefix = this.prefixElem ? hasSlotContent(this.prefixElem) : false;
  };

  private updateFormValidity = (): void => {
    updateFormValidity({
      internals: this.internals,
      required: this.required,
      value: this.value,
      inputElem: this.segmentContainerElem,
      validationMessage: this.formValidationMessage,
      defaultMessage: 'Please, input or select a valid date',
    });
  };

  /**
   * Recompute state derived from the public `value` (form value, selection
   * presence, and visual groups). Called when value or mask-defining props change.
   */
  private syncDerivedFromValue = (): void => {
    const current = this.value;

    this.internals.setFormValue(!isNil(current) ? `${current}` : null);
    this.syncValidity();

    this.hasValue = computeHasValue(current);
    this.segmentGroups = getDateSegmentGroups(current, this.type, this.precision, this.pickerMask);

    const firstSegment = this.segmentGroups[0]?.segments[0];
    this.activeSegment =
      getFirstEmptySegmentKey(this.segmentGroups) ??
      (firstSegment ? { groupId: this.segmentGroups[0].id, field: firstSegment.field } : undefined);
  };

  /**
   * Commits completed, valid visual groups to the canonical value while keeping
   * partial drafts visible and preserving the last valid selection.
   */
  private syncSegmentDraftValue = (): void => {
    const values = this.segmentGroups.map((group) => getDateSegmentGroupValue(group, this.precision));
    const hasPartialGroup = this.segmentGroups.some((group, index) => {
      if (values[index]) return false;
      return group.segments.some((segment) => Boolean(segment.value));
    });
    const complete = values.filter((value): value is string => Boolean(value));
    const selection = complete.flatMap((value) => parseValue(value, 'single', this.precision));
    const hasInvalidValue = complete.length > 0 && selection.length !== complete.length;
    const hasDisallowedValue = selection.some((iso) => {
      const date = parseISO(iso);
      return !date || !isWithinBounds(date, this.min, this.max) || Boolean(this.isDateDisallowed?.(date));
    });

    this.hasBadInput = hasInvalidValue || hasDisallowedValue;

    this.syncValidity();

    if (this.hasBadInput || hasPartialGroup) return;

    const next =
      this.type === 'single'
        ? selection.slice(0, 1)
        : this.type === 'range'
          ? selection.length === 2 || (selection.length === 1 && values[0])
            ? selection.slice(0, 2)
            : []
          : selection;

    const nextValue = serializeValue(next, this.type, this.precision) || undefined;
    if (nextValue === this.value) return;

    this.isCommittingSegmentDraft = true;
    this.value = nextValue;
    this.isCommittingSegmentDraft = false;
    this.internals.setFormValue(nextValue ?? null);
    this.hasValue = computeHasValue(nextValue);

    this.syncValidity();
    this.syncMultiSegmentGroups(nextValue);
    this.bqChange.emit({ value: this.value, el: this.el });
  };

  /** Clamps each complete date group when focus leaves the segmented field. */
  private clampCompleteSegmentGroupsToBounds = (): void => {
    if (!this.min && !this.max) return;

    const nextGroups = this.segmentGroups.map((group) => {
      const value = getDateSegmentGroupValue(group, this.precision);
      if (!value) return group;

      const [iso] = parseValue(value, 'single', this.precision);
      if (!iso) return group;

      const clampedISO = clampISOToBounds(iso, this.min, this.max);
      if (clampedISO === iso) return group;

      const [clampedGroup] = getDateSegmentGroups(
        serializeValue([clampedISO], 'single', this.precision),
        'single',
        this.precision,
        this.pickerMask,
      );
      return { ...clampedGroup, id: group.id };
    });
    if (nextGroups.every((group, index) => group === this.segmentGroups[index])) return;

    this.segmentGroups = nextGroups;
    this.syncSegmentDraftValue();
  };

  /** Restores the trailing blank group required to enter another multi-date value. */
  private syncMultiSegmentGroups = (value: string | undefined): void => {
    if (this.type !== 'multi') return;

    this.segmentGroups = getDateSegmentGroups(value, this.type, this.precision, this.pickerMask);
    this.activeSegment = getFirstEmptySegmentKey(this.segmentGroups) ?? this.activeSegment;
  };

  /**
   * Runs the full form-validity pipeline in a consistent order: `required`
   * → bounds → `badInput`. Multiple failing constraints are unioned into a
   * single `setValidity` call.
   */
  private syncValidity = (): void => {
    if (!this.internals) return;

    this.updateFormValidity();

    const boundsFlags = this.computeBoundsValidityFlags();
    const flags: ValidityStateFlags = { ...boundsFlags };
    if (this.hasBadInput) flags.badInput = true;

    const hasCustomConstraintError = Object.keys(flags).length > 0;
    if (!hasCustomConstraintError) {
      this.hasConstraintError = !this.internals.validity.valid;
      return;
    }

    const message = this.formValidationMessage ?? defaultValidityMessage(flags);

    this.internals.states.delete('valid');
    this.internals.states.add('invalid');
    this.internals.setValidity(flags, message, this.segmentContainerElem);
    this.hasConstraintError = true;
  };

  /** Returns `rangeUnderflow` / `rangeOverflow` flags for the current selection. */
  private computeBoundsValidityFlags = (): ValidityStateFlags => {
    if (!this.min && !this.max) return {};

    const selection = parseValue(this.value, this.type, this.precision);
    if (selection.length === 0) return {};

    const paddedMin = padBound(this.min, 'min');
    const paddedMax = padBound(this.max, 'max');
    let rangeUnderflow = false;
    let rangeOverflow = false;

    for (const iso of selection) {
      if (paddedMin && iso < paddedMin) rangeUnderflow = true;
      if (paddedMax && iso > paddedMax) rangeOverflow = true;
    }

    if (!rangeUnderflow && !rangeOverflow) return {};
    return { rangeUnderflow, rangeOverflow };
  };

  private clampMonths = (value: number): number => {
    const rounded = Math.floor(Number(value));
    if (!Number.isFinite(rounded) || rounded < 1) return 1;

    return Math.min(rounded, MAX_MONTHS_PER_VIEW);
  };

  /**
   * Align the internal `viewDate` / `focused*` state with the current value.
   * Called when the panel opens and whenever an *external* prop change
   * invalidates the current view (value, type, precision, min/max). Internal
   * commits skip this via `isCommittingSelection` so the user's navigated
   * year isn't clobbered by a subsequent multi/range selection.
   *
   * Uses `parseValue` (precision-aware, always returns full ISO dates) rather
   * than a raw `YYYY-MM-DD` regex so that month/year wire values like
   * `"2025-05"` or `"2025"` land on the right cell instead of falling back
   * to today.
   */
  private syncViewToValue = (): void => {
    const parsed = parseValue(this.value, this.type, this.precision);
    const focusISO = parsed[0] ?? getTodayISO();
    const focus = parseISO(focusISO) ?? new Date();
    const bounded = clampDate(focus, this.min, this.max);

    this.focusedISO = toISO(bounded);
    this.viewDate = startOfMonth(bounded);
    this.focusedMonth = bounded.getMonth();
    this.focusedYear = bounded.getFullYear();
    this.decadeStart = getDecadeStart(bounded.getFullYear());
  };

  private get selection(): TSelection {
    const key = `${this.type}|${this.precision}|${this.value ?? ''}`;
    if (this.cachedSelection?.key === key) return this.cachedSelection.value;

    const parsed = parseValue(this.value, this.type, this.precision);
    this.cachedSelection = { key, value: parsed };

    return parsed;
  }

  private get maskPlaceholder(): string {
    return getMaskPlaceholder(this.type, this.locale, this.precision, this.formatOptions);
  }

  private get pickerMask() {
    return getDateMask(this.locale, this.precision, this.formatOptions);
  }

  private warnForIncompatibleFormatOptions = (): void => {
    if (!this.formatOptions) return;

    if (!getDateMask(this.locale, this.precision, this.formatOptions).usedFallback) return;

    console.warn(
      '[BQ-DATE-PICKER] formatOptions must contain only numeric date fields to configure the input mask; using the locale default.',
    );
  };

  /** Map a precision value to the calendar view that commits selections. */
  private precisionToView = (precision: TDatePrecision): TCalendarView => {
    if (precision === 'month') return 'months';
    if (precision === 'year') return 'years';

    return 'days';
  };

  private get tentativeRange(): TSelection {
    if (this.type !== 'range') return [];

    const parsed = this.selection;
    // While the user is completing a range (one endpoint chosen) show the
    // hover preview between that endpoint and the current hovered day.
    if (parsed.length === 1) return buildTentativeRange(parsed[0], this.tentativeHover);
    return [];
  }

  /* --------------------------- View transitions -------------------------- */

  /**
   * Return the date that view transitions (days ⇄ months ⇄ years) should
   * center the focus on.
   *
   * Priority:
   * 1. First entry of the current selection — for `range` this is the start
   *    date (selection is sorted on parse), for `multi` it is the earliest.
   * 2. Otherwise the currently displayed `viewDate` (i.e. the month/year the
   *    user has navigated to with prev/next).
   */
  private getViewFocusReference = (): Date => {
    const [first] = this.selection;
    if (first) {
      const parsed = parseISO(first);
      if (parsed) return parsed;
    }

    return this.viewDate;
  };

  private handleHeaderTitleClick = (): void => {
    if (this.precision === 'year') return;

    if (this.view === 'days') {
      const ref = this.getViewFocusReference();
      this.focusedMonth = ref.getMonth();
      this.focusedYear = ref.getFullYear();
      this.view = 'months';
      this.focusActiveCell();
      return;
    }

    if (this.view === 'months') {
      const ref = this.getViewFocusReference();
      this.focusedYear = ref.getFullYear();
      this.decadeStart = getDecadeStart(ref.getFullYear());
      this.view = 'years';
      this.focusActiveCell();
      return;
    }

    // years view → cycle back to the base view for the current precision
    this.view = this.precisionToView(this.precision);
    this.focusActiveCell();
  };

  private handleHeaderPrev = (): void => {
    if (this.view === 'days') {
      const step = this.monthsPerView === 'months' ? Math.max(1, this.months) : 1;
      this.viewDate = addMonths(this.viewDate, -step);
      this.focusedISO = toISO(clampDate(startOfMonth(this.viewDate), this.min, this.max));
    } else if (this.view === 'months') {
      this.focusedYear = this.focusedYear - 1;
    } else {
      this.decadeStart = this.decadeStart - DECADE_GRID_SIZE;
    }
  };

  private handleHeaderNext = (): void => {
    if (this.view === 'days') {
      const step = this.monthsPerView === 'months' ? Math.max(1, this.months) : 1;
      this.viewDate = addMonths(this.viewDate, step);
      this.focusedISO = toISO(clampDate(startOfMonth(this.viewDate), this.min, this.max));
    } else if (this.view === 'months') {
      this.focusedYear = this.focusedYear + 1;
    } else {
      this.decadeStart = this.decadeStart + DECADE_GRID_SIZE;
    }
  };

  private handleMonthSelect = (month: number): void => {
    // When precision is `month`, selecting a month commits the value instead
    // of drilling to the days view. Gate the commit on bounds so keyboard
    // Enter/Space cannot bypass the click-path disabled check.
    if (this.precision === 'month') {
      if (!isMonthWithinBounds(this.focusedYear, month, this.min, this.max)) return;

      this.focusedMonth = month;
      this.viewDate = new Date(this.focusedYear, month, 1);
      this.commitSelection(toISO(new Date(this.focusedYear, month, 1)));
      return;
    }

    this.viewDate = new Date(this.focusedYear, month, 1);
    this.focusedMonth = month;
    // Preserve day-of-month from the current focus (value or today), clamped
    // to the last day of the destination month and to min/max bounds.
    const nextFocus = clampDate(
      new Date(
        this.focusedYear,
        month,
        Math.min(new Date(this.focusedISO).getDate() || 1, endOfMonth(this.viewDate).getDate()),
      ),
      this.min,
      this.max,
    );

    this.focusedISO = toISO(nextFocus);
    this.view = 'days';
    this.focusActiveCell();
  };

  private handleYearSelect = (year: number): void => {
    // When precision is `year`, selecting a year commits the value instead
    // of drilling to the months view. Gate the commit on bounds so keyboard
    // Enter/Space cannot bypass the click-path disabled check.
    if (this.precision === 'year') {
      if (!isYearWithinBounds(year, this.min, this.max)) return;

      this.focusedYear = year;
      this.viewDate = new Date(year, 0, 1);
      this.commitSelection(toISO(new Date(year, 0, 1)));
      return;
    }

    this.focusedYear = year;
    this.viewDate = new Date(year, this.focusedMonth, 1);
    this.view = 'months';
    this.focusActiveCell();
  };

  /* ---------------------------- Day selection ---------------------------- */

  private handleDaySelect = (iso: string): void => {
    this.commitSelection(iso);
  };

  /**
   * Shared commit path used by day / month / year selection. Keeps the
   * selection logic (single/multi/range) and post-commit behaviour (event,
   * open state, tentative hover, view sync) identical across precisions.
   */
  private commitSelection = (iso: string): void => {
    const next = applySelection(iso, this.selection, this.type);
    const shouldStayOpen = this.type === 'multi' || (this.type === 'range' && next.length === 1);

    this.hasBadInput = false;

    // Guard so `handleValueChange` doesn't re-sync the view back to `parsed[0]`
    // (would jump multi/range pickers to the earliest selected date) or to
    // today (when precision truncation leaves no full ISO to extract).
    this.isCommittingSelection = true;
    this.value = serializeValue(next, this.type, this.precision);
    this.isCommittingSelection = false;

    this.focusedISO = iso;
    const parsedIso = parseISO(iso);
    if (parsedIso) {
      this.viewDate = startOfMonth(parsedIso);
      this.focusedMonth = parsedIso.getMonth();
      this.focusedYear = parsedIso.getFullYear();
      if (this.precision !== 'year') {
        this.decadeStart = getDecadeStart(parsedIso.getFullYear());
      }
    }

    this.tentativeHover = this.type === 'range' && next.length === 1 ? iso : undefined;

    this.bqChange.emit({ value: this.value, el: this.el });
    this.open = shouldStayOpen;
  };

  private handleDayHover = (iso: string | undefined): void => {
    if (this.type !== 'range') return;

    this.tentativeHover = iso;
  };

  private handleDayFocus = (iso: string): void => {
    if (this.focusedISO === iso) return;

    this.focusedISO = iso;
  };

  /* ------------------------- Grid keyboard nav --------------------------- */

  private getRTLDirection = (): 1 | -1 => {
    // Walk up through the composed tree so that dir="rtl" set on <html> or
    // any ancestor is picked up, not just a direct attribute on the host.
    const dir = (this.el.closest('[dir]') as HTMLElement)?.dir ?? getComputedStyle(this.el).direction;
    return dir === 'rtl' ? -1 : 1;
  };

  private moveFocusedDay = (deltaDays: number): void => {
    const current = parseISO(this.focusedISO) ?? new Date();
    const next = clampDate(addDays(current, deltaDays), this.min, this.max);
    this.focusedISO = toISO(next);
    if (next.getMonth() !== this.viewDate.getMonth() || next.getFullYear() !== this.viewDate.getFullYear()) {
      this.viewDate = startOfMonth(next);
    }

    this.focusButton(`[data-iso="${this.focusedISO}"]`);
  };

  private moveFocusedDayHome = (): void => {
    const first = this.firstDayOfWeek ?? 1;
    const dayOfWeek = parseISO(this.focusedISO)?.getDay() ?? 0;

    this.moveFocusedDay(-((dayOfWeek - first + 7) % 7));
  };

  private moveFocusedDayEnd = (): void => {
    const first = this.firstDayOfWeek ?? 1;
    const focus = parseISO(this.focusedISO) ?? new Date();
    const rowIndex = (focus.getDay() - first + 7) % 7;

    this.moveFocusedDay(6 - rowIndex);
  };

  private pageFocusedMonth = (direction: -1 | 1, byYear: boolean): void => {
    this.viewDate = byYear ? addYears(this.viewDate, direction) : addMonths(this.viewDate, direction);
    this.focusedISO = toISO(clampDate(startOfMonth(this.viewDate), this.min, this.max));
  };

  private selectFocusedDay = (): void => {
    const iso = this.focusedISO;
    const parsed = parseISO(iso);

    if (parsed && isWithinBounds(parsed, this.min, this.max) && !this.isDateDisallowed?.(parsed)) {
      this.handleDaySelect(iso);
    }
  };

  private handleDayGridKeyDown = (ev: KeyboardEvent): void => {
    const rtl = this.getRTLDirection();

    const handlers: Record<string, () => void> = {
      ArrowLeft: () => this.moveFocusedDay(-1 * rtl),
      ArrowRight: () => this.moveFocusedDay(1 * rtl),
      ArrowUp: () => this.moveFocusedDay(-7),
      ArrowDown: () => this.moveFocusedDay(7),
      Home: () => this.moveFocusedDayHome(),
      End: () => this.moveFocusedDayEnd(),
      PageUp: () => this.pageFocusedMonth(-1, ev.shiftKey),
      PageDown: () => this.pageFocusedMonth(1, ev.shiftKey),
      Escape: () => {
        this.open = false;
        if (this.activeSegment) this.focusSegment(this.activeSegment);
      },
      Enter: () => this.selectFocusedDay(),
      ' ': () => this.selectFocusedDay(),
    };

    const handler = handlers[ev.key];
    if (handler) {
      ev.preventDefault();
      handler();
    }
  };

  private getGridColumns = (): number => {
    // Months/years grids visually expand from 3 to 4 columns in multi-panel
    // mode. Keep arrow-key stride in sync so vertical navigation still lands
    // on the row directly above/below the current cell.
    return getGridColumns(this.getMonthCount());
  };

  private handleMonthGridKeyDown = (ev: KeyboardEvent): void => {
    const rtl = this.getRTLDirection();
    const stride = this.getGridColumns();
    const move = (delta: number) => {
      const { month, year } = advanceFocusedMonth(this.focusedMonth, this.focusedYear, delta);
      this.focusedMonth = month;
      this.focusedYear = year;
      this.focusButton(`[data-month="${month}"]`);
    };

    switch (ev.key) {
      case 'ArrowLeft':
        ev.preventDefault();
        move(-1 * rtl);
        return;
      case 'ArrowRight':
        ev.preventDefault();
        move(1 * rtl);
        return;
      case 'ArrowUp':
        ev.preventDefault();
        move(-stride);
        return;
      case 'ArrowDown':
        ev.preventDefault();
        move(stride);
        return;
      case 'Enter':
      case ' ':
        ev.preventDefault();
        this.handleMonthSelect(this.focusedMonth);
        return;
      case 'Escape':
        ev.preventDefault();
        this.view = 'days';
    }
  };

  private handleYearGridKeyDown = (ev: KeyboardEvent): void => {
    const rtl = this.getRTLDirection();
    const stride = this.getGridColumns();
    const move = (delta: number) => {
      const { year, decadeStart } = advanceFocusedYear(this.focusedYear, this.decadeStart, delta);
      this.focusedYear = year;
      this.decadeStart = decadeStart;
      this.focusButton(`[data-year="${year}"]`);
    };

    switch (ev.key) {
      case 'ArrowLeft':
        ev.preventDefault();
        move(-1 * rtl);
        return;
      case 'ArrowRight':
        ev.preventDefault();
        move(1 * rtl);
        return;
      case 'ArrowUp':
        ev.preventDefault();
        move(-stride);
        return;
      case 'ArrowDown':
        ev.preventDefault();
        move(stride);
        return;
      case 'Enter':
      case ' ':
        ev.preventDefault();
        this.handleYearSelect(this.focusedYear);
        return;
      case 'Escape':
        ev.preventDefault();
        this.view = 'months';
    }
  };

  private focusButton = (selector: string): void => {
    // Cancel any prior pending focus request so rapid state changes don't
    // race — only the latest target should win.
    if (this.pendingFocusRAF !== undefined) cancelAnimationFrame(this.pendingFocusRAF);
    this.pendingFocusRAF = requestAnimationFrame(() => {
      this.pendingFocusRAF = undefined;
      const button = this.el.shadowRoot?.querySelector<HTMLButtonElement>(selector);
      button?.focus();
    });
  };

  /**
   * Focus the currently active cell for the visible view. Called after the
   * popup opens so keyboard users don't have to tab into the calendar.
   */
  private focusActiveCell = (): void => {
    if (this.view === 'months') {
      this.focusButton(`[data-month="${this.focusedMonth}"]`);
      return;
    }

    if (this.view === 'years') {
      this.focusButton(`[data-year="${this.focusedYear}"]`);
      return;
    }

    this.focusButton(`[data-iso="${this.focusedISO}"]`);
  };

  /* ------------------------------- View labels ------------------------------ */

  private getMonthCount = (): number => {
    if (this.type === 'single') return 1;

    // `handleMonthsChange` clamps the prop on write, so here we just guard
    // against the initial value before the first watcher tick.
    return this.clampMonths(this.months);
  };

  private getHeaderLabel = (): string => {
    return getHeaderLabel({
      view: this.view,
      viewDate: this.viewDate,
      focusedYear: this.focusedYear,
      decadeStart: this.decadeStart,
      monthCount: this.getMonthCount(),
      locale: this.locale,
    });
  };

  private getHeaderTitleLabel = (): string => {
    return getHeaderTitleLabel(this.view, this.precision);
  };

  private getPreviousLabel = (): string => {
    return getPreviousLabel(this.view);
  };

  private getNextLabel = (): string => {
    return getNextLabel(this.view);
  };

  private getSegmentLabel = (key: TDateSegmentKey): string =>
    // Builds the accessible name that identifies a date field and its range endpoint.
    `${this.type === 'range' ? (key.groupId === 0 ? 'Start date ' : 'End date ') : ''}${key.field}`;

  // Partial render methods for the calendar panel. These are called from `renderView` which is the only render method that is called from `render`.
  // This keeps the render methods organized and focused on specific parts of the component.
  // ===================================

  private renderDayPanels = (): JSX.Element => {
    const panels: JSX.Element[] = [];
    const monthCount = this.getMonthCount();

    for (let i = 0; i < monthCount; i++) {
      const anchor = addMonths(this.viewDate, i);
      const anchorKey = toISO(startOfMonth(anchor));
      panels.push(
        <div
          key={anchorKey}
          class={{
            'bq-date-picker__panel': true,
            'bq-date-picker__panel--extra': i > 0,
          }}
        >
          {monthCount > 1 && (
            <div class="bq-date-picker__month-label" part={CALENDAR_PARTS.heading}>
              {formatMonth(anchor, this.locale, 'long', true)}
            </div>
          )}
          <CalendarDayView
            viewDate={anchor}
            selection={this.selection}
            tentativeRange={this.tentativeRange}
            focusedISO={this.focusedISO}
            type={this.type}
            locale={this.locale}
            firstDayOfWeek={this.firstDayOfWeek ?? 1}
            showOutsideDays={this.showOutsideDays}
            minISO={this.min}
            maxISO={this.max}
            isDateDisallowed={this.isDateDisallowed}
            onDaySelect={(iso) => this.handleDaySelect(iso)}
            onDayHover={(iso) => this.handleDayHover(iso)}
            onDayFocus={(iso) => this.handleDayFocus(iso)}
            onGridKeyDown={this.handleDayGridKeyDown}
          />
        </div>,
      );
    }

    return <div class="bq-date-picker__panels">{panels}</div>;
  };

  private renderMonthsView = (): JSX.Element => {
    const gridColumns = this.getGridColumns();
    return (
      <CalendarMonthView
        year={this.focusedYear}
        focusedMonth={this.focusedMonth}
        gridColumns={gridColumns}
        locale={this.locale}
        minISO={this.min}
        maxISO={this.max}
        selection={this.selection}
        tentativeRange={this.tentativeRange}
        type={this.type}
        onMonthSelect={(month) => this.handleMonthSelect(month)}
        onMonthHover={(iso) => this.handleDayHover(iso)}
        onMonthFocus={(month) => {
          this.focusedMonth = month;
        }}
        onGridKeyDown={this.handleMonthGridKeyDown}
      />
    );
  };

  private renderYearsView = (): JSX.Element => {
    const start = this.decadeStart;
    const end = start + DECADE_GRID_SIZE - 1;
    const years = Array.from({ length: DECADE_GRID_SIZE }, (_, i) => start + i);
    const effectiveFocused = this.focusedYear >= start && this.focusedYear <= end ? this.focusedYear : start;
    const gridColumns = this.getGridColumns();

    return (
      <CalendarYearView
        years={years}
        focusedYear={effectiveFocused}
        gridColumns={gridColumns}
        minISO={this.min}
        maxISO={this.max}
        selection={this.selection}
        tentativeRange={this.tentativeRange}
        type={this.type}
        onYearSelect={(year) => this.handleYearSelect(year)}
        onYearHover={(iso) => this.handleDayHover(iso)}
        onYearFocus={(year) => {
          this.focusedYear = year;
        }}
        onGridKeyDown={this.handleYearGridKeyDown}
      />
    );
  };

  /** Renders a numeric spinbutton segment with a fixed locale-derived width. */
  private renderSegment = (group: TDateSegmentGroup, index: number): JSX.Element => {
    const segment = group.segments[index];
    const key = { groupId: group.id, field: segment.field };
    const isActive = this.activeSegment?.groupId === key.groupId && this.activeSegment.field === key.field;

    return (
      <span
        aria-label={this.getSegmentLabel(key)}
        aria-valuemax={segment.field === 'day' ? 31 : segment.field === 'month' ? 12 : 9999}
        aria-valuemin={1}
        aria-valuetext={segment.value || 'Empty'}
        class={{
          'bq-date-picker__segment': true,
          'is-active': isActive,
          'is-empty': !segment.value,
          'is-partial': segment.value.length > 0 && segment.value.length < segment.maxLength,
        }}
        data-group-id={`${key.groupId}`}
        data-segment-field={key.field}
        inputmode="numeric"
        onBlur={this.handleSegmentsFocusOut}
        onClick={(ev) => this.handleSegmentClick(key, ev)}
        onFocus={this.handleSegmentsFocusIn}
        onKeyDown={(ev) => this.handleSegmentKeyDown(ev, key)}
        part="segment"
        role="spinbutton"
        tabindex={isActive ? 0 : -1}
      >
        {segment.value || segment.placeholder}
      </span>
    );
  };

  /** Renders one locale-ordered date token as discrete editable spinbutton segments. */
  private renderSegmentGroup = (group: TDateSegmentGroup): JSX.Element => {
    const mask = this.pickerMask;

    return (
      <span class="bq-date-picker__segment-group">
        {group.segments.map((_, index) => {
          const next = group.segments[index + 1];
          const literal = mask.template.slice(
            mask.segments[index].end,
            next ? mask.segments[index + 1].start : undefined,
          );
          return [
            this.renderSegment(group, index),
            literal && (
              <span aria-hidden="true" class="bq-date-picker__segment-literal" part="segment-literal">
                {literal}
              </span>
            ),
          ];
        })}
      </span>
    );
  };

  private renderView = (): JSX.Element => {
    if (this.view === 'months') return this.renderMonthsView();
    if (this.view === 'years') return this.renderYearsView();
    return this.renderDayPanels();
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const labelId = `bq-date-picker__label-${this.name || DEFAULT_INPUT_ID}`;
    const maskDescriptionId = `bq-date-picker__mask-${this.name || DEFAULT_INPUT_ID}`;
    const popupId = `bq-date-picker__popup-${this.name || DEFAULT_INPUT_ID}`;

    return (
      <div class="bq-date-picker" part={CALENDAR_PARTS.base}>
        <label
          class={{ 'bq-date-picker__label': true, 'is-hidden': !this.hasLabel }}
          htmlFor={this.name || DEFAULT_INPUT_ID}
          part={CALENDAR_PARTS.label}
          ref={(labelElem) => {
            this.labelElem = labelElem;
          }}
        >
          <slot id={labelId} name="label" onSlotchange={this.handleSlotChange} />
        </label>

        <bq-dropdown
          class="bq-date-picker__dropdown"
          disabled={this.disabled}
          distance={this.distance}
          exportparts="panel"
          open={this.open}
          panelHeight={this.panelHeight}
          placement={this.placement}
          skidding={this.skidding}
          strategy={this.strategy}
        >
          {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer handling delegates to the roving-focus segment group */}
          <div
            class={{
              'bq-date-picker__control': true,
              [`validation-${this.validationStatus}`]: true,
              'is-disabled': !!this.disabled,
              'is-open': !!this.open,
            }}
            onClick={this.handleControlClick}
            onKeyDown={(ev) => ev.stopPropagation()}
            part={CALENDAR_PARTS.control}
            slot="trigger"
          >
            <span
              class={{ 'bq-date-picker__prefix': true, 'is-hidden': !this.hasPrefix }}
              part={CALENDAR_PARTS.prefix}
              ref={(el) => {
                this.prefixElem = el;
              }}
            >
              <slot name="prefix" onSlotchange={this.handleSlotChange} />
            </span>

            <div
              aria-describedby={maskDescriptionId}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-invalid={this.validationStatus === 'error' || this.hasConstraintError ? 'true' : 'false'}
              aria-labelledby={this.hasLabel ? labelId : undefined}
              class="bq-date-picker__segments"
              onClick={this.handleSegmentsClick}
              onKeyDown={(ev) => ev.stopPropagation()}
              part={CALENDAR_PARTS.input}
              ref={(el) => {
                this.segmentContainerElem = el;
              }}
              role="group"
            >
              {this.segmentGroups.map((group, index) => [
                index > 0 && (
                  <span aria-hidden="true" class="bq-date-picker__segment-group-literal">
                    {this.type === 'range' ? ' - ' : ', '}
                  </span>
                ),
                this.renderSegmentGroup(group),
              ])}
            </div>
            <span class="bq-date-picker__mask-description" id={maskDescriptionId}>
              Expected format: {this.maskPlaceholder}
            </span>

            {this.hasValue && !this.disabled && !this.disableClear && (
              <bq-button
                appearance="text"
                border="xs"
                class="bq-date-picker__clear"
                exportparts="button"
                label={this.clearButtonLabel}
                onBqClick={this.handleClearClick}
                onlyIcon
                part={CALENDAR_PARTS.clearBtn}
                size="small"
              >
                <slot name="clear-icon">
                  <bq-icon aria-hidden="true" name="x-circle" />
                </slot>
              </bq-button>
            )}

            {/* biome-ignore lint/a11y/noStaticElementInteractions: bq-button renders a native <button> in its shadow DOM */}
            <bq-button
              appearance="text"
              border="xs"
              class="bq-date-picker__calendar-trigger"
              disabled={this.disabled}
              exportparts="button"
              label={this.calendarButtonLabel}
              onClick={(ev: MouseEvent) => ev.stopPropagation()}
              onBqClick={this.handleTriggerClick}
              onlyIcon
              part={`${CALENDAR_PARTS.button} ${CALENDAR_PARTS.suffix} ${CALENDAR_PARTS.calendarTrigger}`}
              ref={(el) => {
                this.triggerBtnElem = el;
              }}
              size="small"
            >
              <slot name="suffix" onSlotchange={this.handleSlotChange}>
                <bq-icon aria-hidden="true" name="calendar-blank" />
              </slot>
            </bq-button>
          </div>

          <div
            aria-label={this.hasLabel ? undefined : 'Date picker'}
            aria-labelledby={this.hasLabel ? labelId : undefined}
            class="bq-date-picker__calendar"
            id={popupId}
            part={CALENDAR_PARTS.container}
            role="dialog"
            style={{ '--bq-date-picker--panel-count': `${this.getMonthCount()}` }}
          >
            <CalendarHeader
              view={this.view}
              label={this.getHeaderLabel()}
              previousLabel={this.getPreviousLabel()}
              nextLabel={this.getNextLabel()}
              titleLabel={this.getHeaderTitleLabel()}
              titleInteractive={this.precision !== 'year'}
              onPrevious={() => this.handleHeaderPrev()}
              onNext={() => this.handleHeaderNext()}
              onTitleClick={() => this.handleHeaderTitleClick()}
            />
            <div class="bq-date-picker__view">{this.renderView()}</div>
          </div>
        </bq-dropdown>
      </div>
    );
  }
}
