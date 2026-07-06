import type { EventEmitter } from '@stencil/core';
import { AttachInternals, Component, Element, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { JSX } from '@stencil/core/internal';

import type { Placement } from '../../services/interfaces';
import {
  clampDateToRange,
  extractFocusedDate,
  formatDisplayValue,
  getTodayISO,
  hasSlotContent,
  isDefined,
  isEventTargetChildOfElement,
  isHTMLElement,
  isNil,
  parseDateInput,
  toISODateString,
  updateFormValidity,
  validatePropValue,
} from '../../shared/utils';
import { INPUT_VALIDATION, type TInputValidation } from '../input/bq-input.types';
import type {
  DaysOfWeek,
  TCalendarView,
  TDatePickerType,
  TFloatingStrategy,
  TMonthsPerView,
  TSelection,
} from './bq-date-picker2.types';
import {
  CALENDAR_VIEW,
  DATE_PICKER_TYPE,
  DAYS_OF_WEEK,
  FLOATING_PLACEMENT,
  FLOATING_STRATEGY,
  MONTHS_PER_VIEW,
} from './bq-date-picker2.types';
import { CalendarDayView } from './components/CalendarDayView';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarMonthView } from './components/CalendarMonthView';
import { CalendarYearView } from './components/CalendarYearView';
import {
  addDays,
  addMonths,
  addYears,
  clampDate,
  endOfMonth,
  getDecadeStart,
  getISOYearMonth,
  isWithinBounds,
  parseISO,
  startOfMonth,
  toISO,
} from './helper/calendar';
import {
  CALENDAR_PARTS,
  DECADE_GRID_SIZE,
  DEFAULT_ARIA_LABELS,
  DEFAULT_INPUT_ID,
  MAX_MONTHS_PER_VIEW,
} from './helper/constants';
import { formatMonth, formatYear } from './helper/intl';
import { applySelection, buildTentativeRange, parseValue, serializeValue } from './helper/selection';

/**
 * The Date Picker (v2) is a pure-Stencil calendar input.
 *
 * It exposes the same public API as `bq-date-picker` but is implemented
 * entirely with Stencil functional components (no Cally dependency). It
 * supports single, multi, and range selection, three navigation views
 * (days → months → years), full localization via `Intl.DateTimeFormat`,
 * multi-month side-by-side rendering, and RTL layouts.
 *
 * @example How to use it
 * ```html
 * <bq-date-picker2
 *   first-day-of-week="1"
 *   locale="en-GB"
 *   name="bq-date-picker2"
 *   placeholder="Enter your date"
 *   type="single"
 *   value="2026-07-15"
 * >
 *   <label slot="label">Date picker label</label>
 * </bq-date-picker2>
 * ```
 *
 * @status experimental
 *
 * @dependency bq-button
 * @dependency bq-dropdown
 * @dependency bq-icon
 *
 * @attr {boolean} autofocus - If `true`, the Date picker input will be focused on component render.
 * @attr {string} clear-button-label - The clear button aria label.
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
 * @attr {string} placeholder - Input placeholder text.
 * @attr {"top" | "right" | "bottom" | "left" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"} placement - Placement of the panel.
 * @attr {boolean} required - Whether a value must be selected before submitting the form.
 * @attr {boolean} show-outside-days - Whether to render days that belong to adjacent months.
 * @attr {number} skidding - Skidding between the panel and the trigger.
 * @attr {"fixed" | "absolute"} strategy - Positioning strategy for the panel.
 * @attr {"single" | "multi" | "range"} type - Selection mode.
 * @attr {"error" | "none" | "success" | "warning"} validation-status - Validation state.
 * @attr {string} value - Selected value(s) as a wire-format string.
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
 * @slot suffix - Content rendered after the input value (defaults to a calendar icon).
 * @slot clear-icon - Icon used inside the clear button.
 *
 * @part base - The component's base wrapper.
 * @part label - The label slot container.
 * @part control - The input control wrapper.
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 * @part input - The native input element.
 * @part clear-btn - The clear button.
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
 * @cssprop --bq-date-picker2--background-color - Input background color.
 * @cssprop --bq-date-picker2--border-color - Input border color.
 * @cssprop --bq-date-picker2--border-color-disabled - Border color when disabled.
 * @cssprop --bq-date-picker2--border-color-focus - Border color on focus.
 * @cssprop --bq-date-picker2--border-radius - Input border radius.
 * @cssprop --bq-date-picker2--border-style - Border style.
 * @cssprop --bq-date-picker2--border-width - Border width.
 * @cssprop --bq-date-picker2--currentDate-border-color - Border color for today's date.
 * @cssprop --bq-date-picker2--currentDate-border-width - Border width for today's date.
 * @cssprop --bq-date-picker2--day-size - Size of a day cell in the calendar.
 * @cssprop --bq-date-picker2--gap - Gap between the input content and prefix/suffix.
 * @cssprop --bq-date-picker2--header-title-color - Color of the header title button.
 * @cssprop --bq-date-picker2--icon-size - Size of the icons used in prefix/suffix/clear.
 * @cssprop --bq-date-picker2--label-margin-bottom - Space below the label.
 * @cssprop --bq-date-picker2--label-text-color - Label text color.
 * @cssprop --bq-date-picker2--label-text-size - Label text size.
 * @cssprop --bq-date-picker2--nav-button-size - Size of the header prev/next buttons.
 * @cssprop --bq-date-picker2--padding-end - Input padding end.
 * @cssprop --bq-date-picker2--padding-start - Input padding start.
 * @cssprop --bq-date-picker2--paddingY - Input vertical padding.
 * @cssprop --bq-date-picker2--range-background-color - Background color for range start/end days.
 * @cssprop --bq-date-picker2--range-inner-background-color - Background color for inner range days.
 * @cssprop --bq-date-picker2--text-color - Input text color.
 * @cssprop --bq-date-picker2--text-placeholder-color - Placeholder text color.
 * @cssprop --bq-date-picker2--text-size - Input text size.
 * @cssprop --bq-date-picker2--view-cell-background-hover - Hover background for day/month/year cells.
 * @cssprop --bq-date-picker2--view-cell-background-selected - Selected background for day/month/year cells.
 * @cssprop --bq-date-picker2--view-cell-height - Height of month/year cells.
 * @cssprop --bq-date-picker2--view-cell-radius - Border radius of day/month/year cells.
 * @cssprop --bq-date-picker2--view-cell-text-selected - Text color for selected day/month/year cells.
 */
@Component({
  tag: 'bq-date-picker2',
  styleUrl: './scss/bq-date-picker2.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqDatePicker2 {
  // Own Properties
  // ====================

  private inputElem?: HTMLInputElement;
  private labelElem?: HTMLElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

  /**
   * Memoized parsed selection. Key encodes both `value` and `type` so cache
   * misses invalidate correctly. Value derives from `value`; not promoted to
   * `@State()` to preserve a single source of truth.
   */
  private cachedSelection?: { key: string; value: TSelection };

  /** Pending requestAnimationFrame id used by `focusButton`. Cancelled on
   * re-invoke or disconnect to avoid stray focus after teardown. */
  private pendingFocusRAF?: number;

  /** Initial `value` captured at load time, restored on form reset. */
  private initialValue?: string;

  // Reference to host HTML element
  // ===================================

  @AttachInternals() internals!: ElementInternals;
  @Element() el!: HTMLBqDatePicker2Element;

  // State() variables
  // =======================================

  @State() view: TCalendarView = 'days';
  @State() viewDate: Date = new Date();
  @State() focusedISO: string = getTodayISO();
  @State() focusedMonth: number = new Date().getMonth();
  @State() focusedYear: number = new Date().getFullYear();
  @State() decadeStart: number = getDecadeStart(new Date().getFullYear());
  @State() tentativeHover?: string;

  @State() displayDate?: string;
  @State() hasLabel = false;
  @State() hasPrefix = false;
  @State() hasSuffix = false;
  @State() hasValue = false;

  // Public Property API
  // ========================

  /** If `true`, the Date picker input will be focused on component render. */
  @Prop({ reflect: true }) autofocus: boolean = false;

  /** The clear button aria label. */
  @Prop({ reflect: true }) clearButtonLabel: string = 'Clear value';

  /** If `true`, the clear button won't be displayed. */
  @Prop({ reflect: true }) disableClear: boolean = false;

  /** Indicates whether the Date picker input is disabled or not. */
  @Prop({ mutable: true }) disabled: boolean = false;

  /** Distance (gutter) between the Date picker panel and the input element. */
  @Prop({ reflect: true }) distance: number = 8;

  /** The first day of the week, where Sunday is 0, Monday is 1, etc. */
  @Prop({ reflect: true }) firstDayOfWeek: DaysOfWeek = 1;

  /** Options used when formatting the displayed value. */
  @Prop() formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

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
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** Overrides the height of the Date picker panel. */
  @Prop({ reflect: true, mutable: true }) panelHeight?: string = 'auto';

  /** Placeholder text shown when no value is selected. */
  @Prop({ reflect: true }) placeholder?: string;

  /** Position of the Date picker panel. */
  @Prop({ reflect: true }) placement: Placement = 'bottom-end';

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

  /** Selected value(s). Wire format matches the v1 picker. */
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
    const normalized = serializeValue(parseValue(newValue, this.type), this.type);
    const normalizedValue = normalized === '' ? undefined : normalized;
    if (normalizedValue !== newValue) {
      this.value = normalizedValue;
      return;
    }

    this.syncDerivedFromValue();
    this.syncViewToValue();
  }

  /**
   * Recompute all state derived from the public `value` (form value,
   * `hasValue`, formatted display). Called from `value` and any prop that
   * affects display formatting (`type`, `locale`, `formatOptions`).
   */
  private syncDerivedFromValue = (): void => {
    const current = this.value;
    this.internals.setFormValue(!isNil(current) ? `${current}` : null);
    this.updateFormValidity();

    this.hasValue = isDefined(current) && `${current}`.length > 0;
    this.displayDate = formatDisplayValue(current ?? '', this.type, this.locale, this.formatOptions);
  };

  @Watch('formatOptions')
  @Watch('locale')
  handleFormattingChange() {
    // Re-format the display without re-parsing the wire value.
    this.hasValue = isDefined(this.value) && `${this.value}`.length > 0;
    this.displayDate = formatDisplayValue(this.value ?? '', this.type, this.locale, this.formatOptions);
  }

  @Watch('type')
  handleTypeChange() {
    // `type` affects wire-format parsing, display formatting, and validity.
    // Re-normalize the current value against the new type; if that rewrites
    // the value, the `value` watcher takes over. Otherwise refresh derived
    // state and re-sync the visible calendar range.
    const normalized = serializeValue(parseValue(this.value, this.type), this.type);
    const normalizedValue = normalized === '' ? undefined : normalized;
    if (normalizedValue !== this.value) {
      this.value = normalizedValue;
      return;
    }
    this.syncDerivedFromValue();
    this.syncViewToValue();
  }

  @Watch('max')
  @Watch('min')
  handleBoundsChange() {
    // A tighter range can invalidate the current selection or push the
    // focused day out of bounds. Re-run form validity and re-clamp the
    // internal focus/viewDate cursors.
    this.updateFormValidity();
    this.syncViewToValue();
  }

  @Watch('required')
  handleRequiredChange() {
    this.updateFormValidity();
  }

  @Watch('firstDayOfWeek')
  @Watch('initialView')
  @Watch('monthsPerView')
  @Watch('placement')
  @Watch('strategy')
  @Watch('type')
  @Watch('validationStatus')
  checkPropValues() {
    validatePropValue(DATE_PICKER_TYPE, 'single', this.el, 'type');
    validatePropValue(CALENDAR_VIEW, 'days', this.el, 'initialView');
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

  private clampMonths(value: number): number {
    const rounded = Math.floor(Number(value));
    if (!Number.isFinite(rounded) || rounded < 1) return 1;
    return Math.min(rounded, MAX_MONTHS_PER_VIEW);
  }

  @Watch('open')
  handleOpen(open: boolean) {
    if (!open) {
      this.tentativeHover = undefined;
      return;
    }
    this.view = this.initialView;
    this.syncViewToValue();
    // Move keyboard focus into the calendar so screen-reader / keyboard users
    // land on the focused day (or the equivalent focused cell for
    // months/years views). Non-modal popup: focus is *moved*, not trapped.
    this.focusActiveCell();
  }

  @Watch('view')
  handleViewChange(next: TCalendarView, prev: TCalendarView) {
    if (next === prev) return;
    this.bqViewChange.emit({ view: next, el: this.el });
  }

  // Events section
  // ==============================================

  /** Callback handler emitted when the input loses focus. */
  @Event() bqBlur!: EventEmitter<HTMLBqDatePicker2Element>;

  /**
   * Callback handler emitted when the input value changes.
   */
  @Event() bqChange!: EventEmitter<{ value: string | undefined; el: HTMLBqDatePicker2Element }>;

  /** Callback handler emitted when the value is cleared. */
  @Event() bqClear!: EventEmitter<HTMLBqDatePicker2Element>;

  /** Callback handler emitted when the input receives focus. */
  @Event() bqFocus!: EventEmitter<HTMLBqDatePicker2Element>;

  /**
   * Callback handler emitted when the internal calendar view changes
   * (e.g. from `days` to `months`, or from `years` back to `days`).
   */
  @Event() bqViewChange!: EventEmitter<{ view: TCalendarView; el: HTMLBqDatePicker2Element }>;

  // Component lifecycle events
  // =====================================

  componentWillLoad() {
    this.initialValue = this.value;
    this.checkPropValues();
    this.handleMonthsChange();
    this.syncViewToValue();
  }

  componentDidLoad() {
    this.handleSlotChange();
    this.handleValueChange(this.value, undefined);
    if (this.autofocus) this.inputElem?.focus();
    // `@Watch('open')` doesn't run for the initial prop value, so pickers
    // rendered with `open` never move focus into the calendar. Do it here.
    if (this.open) this.focusActiveCell();
  }

  disconnectedCallback() {
    if (this.pendingFocusRAF !== undefined) {
      cancelAnimationFrame(this.pendingFocusRAF);
      this.pendingFocusRAF = undefined;
    }
  }

  formAssociatedCallback() {
    this.updateFormValidity();
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
  // ===============================================

  /**
   * Clears the selected value.
   */
  @Method()
  async clear(): Promise<void> {
    if (this.disabled) return;
    this.clearValue();
    this.bqClear.emit(this.el);
  }

  // Local methods
  // =======================================================

  private handleBlur = (): void => {
    if (this.disabled) return;
    this.bqBlur.emit(this.el);
  };

  private handleFocus = (): void => {
    if (this.disabled) return;
    this.bqFocus.emit(this.el);
  };

  private handleInputChange = (ev: Event): void => {
    if (this.disabled || !isHTMLElement(ev.target, 'input')) return;

    const inputValue = ev.target.value.trim();
    if (!inputValue) {
      this.clearValue();
      this.bqChange.emit({ value: this.value, el: this.el });
      return;
    }

    const dateValue = parseDateInput(inputValue, this.locale);
    if (!dateValue || this.isDateDisallowed?.(dateValue)) {
      this.internals.setFormValue(null);
      this.updateFormValidity();
      this.bqChange.emit({ value: inputValue, el: this.el });
      return;
    }

    let isoDate = toISODateString(dateValue);
    isoDate = clampDateToRange(isoDate, this.min, this.max);

    this.value = isoDate;
    this.bqChange.emit({ value: this.value, el: this.el });
  };

  private handleClearClick = (ev: CustomEvent): void => {
    if (this.disabled) return;
    if (this.inputElem) this.inputElem.value = '';

    this.clearValue();
    this.bqClear.emit(this.el);
    this.bqChange.emit({ value: this.value, el: this.el });
    this.inputElem?.focus();
    ev.stopPropagation();
  };

  private clearValue = (): void => {
    this.value = undefined;
    this.displayDate = undefined;
    this.internals.setFormValue(null);
    this.tentativeHover = undefined;
  };

  private handleSlotChange = (): void => {
    this.hasLabel = this.labelElem ? hasSlotContent(this.labelElem) : false;
    this.hasPrefix = this.prefixElem ? hasSlotContent(this.prefixElem) : false;
    this.hasSuffix = this.suffixElem ? hasSlotContent(this.suffixElem) : false;
  };

  private updateFormValidity = (): void => {
    updateFormValidity({
      internals: this.internals,
      required: this.required,
      value: this.value,
      inputElem: this.inputElem,
      validationMessage: this.formValidationMessage,
      defaultMessage: 'Please, input or select a valid date',
    });
  };

  /**
   * Align the internal `viewDate` / `focused*` state with the current value.
   * Called on value change and whenever the panel opens so that the user
   * always lands on the right month / year.
   */
  private syncViewToValue = (): void => {
    const focusISO = extractFocusedDate(this.value ?? '') ?? getTodayISO();
    const focus = parseISO(focusISO) ?? new Date();
    const bounded = clampDate(focus, this.min, this.max);

    this.focusedISO = toISO(bounded);
    this.viewDate = startOfMonth(bounded);
    this.focusedMonth = bounded.getMonth();
    this.focusedYear = bounded.getFullYear();
  };

  private get selection(): TSelection {
    const key = `${this.type}|${this.value ?? ''}`;
    if (this.cachedSelection?.key === key) return this.cachedSelection.value;
    const parsed = parseValue(this.value, this.type);
    this.cachedSelection = { key, value: parsed };
    return parsed;
  }

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
    }
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
    this.focusedYear = year;
    this.viewDate = new Date(year, this.focusedMonth, 1);
    this.view = 'months';
    this.focusActiveCell();
  };

  /* ---------------------------- Day selection ---------------------------- */

  private handleDaySelect = (iso: string): void => {
    const next = applySelection(iso, this.selection, this.type);
    const shouldStayOpen = this.type === 'multi' || (this.type === 'range' && next.length === 1);

    this.value = serializeValue(next, this.type);
    this.focusedISO = iso;
    this.viewDate = startOfMonth(parseISO(iso) ?? this.viewDate);
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

  private getRTLDirection(): 1 | -1 {
    const dir = this.el.ownerDocument?.dir || getComputedStyle(this.el).direction;
    return dir === 'rtl' ? -1 : 1;
  }

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
        this.inputElem?.focus();
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

  private getGridColumns(): number {
    // Months/years grids visually expand from 3 to 4 columns in multi-panel
    // mode. Keep arrow-key stride in sync so vertical navigation still lands
    // on the row directly above/below the current cell.
    return this.getMonthCount() > 1 ? 4 : 3;
  }

  private handleMonthGridKeyDown = (ev: KeyboardEvent): void => {
    const rtl = this.getRTLDirection();
    const stride = this.getGridColumns();
    const move = (delta: number) => {
      let next = this.focusedMonth + delta;
      let year = this.focusedYear;
      while (next < 0) {
        next += 12;
        year -= 1;
      }
      while (next > 11) {
        next -= 12;
        year += 1;
      }
      this.focusedMonth = next;
      this.focusedYear = year;
      this.focusButton(`[data-month="${next}"]`);
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
      const nextYear = this.focusedYear + delta;
      this.focusedYear = nextYear;
      if (nextYear < this.decadeStart) {
        this.decadeStart = this.decadeStart - DECADE_GRID_SIZE;
      } else if (nextYear > this.decadeStart + DECADE_GRID_SIZE - 1) {
        this.decadeStart = this.decadeStart + DECADE_GRID_SIZE;
      }
      this.focusButton(`[data-year="${nextYear}"]`);
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

  private focusButton(selector: string): void {
    // Cancel any prior pending focus request so rapid state changes don't
    // race — only the latest target should win.
    if (this.pendingFocusRAF !== undefined) cancelAnimationFrame(this.pendingFocusRAF);
    this.pendingFocusRAF = requestAnimationFrame(() => {
      this.pendingFocusRAF = undefined;
      const button = this.el.shadowRoot?.querySelector<HTMLButtonElement>(selector);
      button?.focus();
    });
  }

  /**
   * Focus the currently active cell for the visible view. Called after the
   * popup opens so keyboard users don't have to tab into the calendar.
   */
  private focusActiveCell(): void {
    if (this.view === 'months') {
      this.focusButton(`[data-month="${this.focusedMonth}"]`);
      return;
    }
    if (this.view === 'years') {
      this.focusButton(`[data-year="${this.focusedYear}"]`);
      return;
    }
    this.focusButton(`[data-iso="${this.focusedISO}"]`);
  }

  /* -------------------------- Header labels ------------------------------ */

  private getMonthCount(): number {
    if (this.type === 'single') return 1;
    // `handleMonthsChange` clamps the prop on write, so here we just guard
    // against the initial value before the first watcher tick.
    return this.clampMonths(this.months);
  }

  private getHeaderLabel(): string {
    if (this.view === 'days') {
      const count = this.getMonthCount();
      if (count > 1) {
        const first = startOfMonth(this.viewDate);
        const last = startOfMonth(addMonths(this.viewDate, count - 1));
        const startYear = formatYear(first, this.locale);
        const endYear = formatYear(last, this.locale);
        return startYear === endYear ? startYear : `${startYear} – ${endYear}`;
      }
      return formatMonth(this.viewDate, this.locale, 'long', true);
    }
    if (this.view === 'months') {
      return formatYear(new Date(this.focusedYear, 0, 1), this.locale);
    }
    const start = this.decadeStart;
    const end = start + DECADE_GRID_SIZE - 1;
    return `${start} – ${end}`;
  }

  private getHeaderTitleLabel(): string {
    if (this.view === 'days') return DEFAULT_ARIA_LABELS.chooseMonth;
    if (this.view === 'months') return DEFAULT_ARIA_LABELS.chooseYear;
    return DEFAULT_ARIA_LABELS.chooseYear;
  }

  private getPreviousLabel(): string {
    if (this.view === 'days') return DEFAULT_ARIA_LABELS.previousMonth;
    if (this.view === 'months') return DEFAULT_ARIA_LABELS.previousYear;
    return DEFAULT_ARIA_LABELS.previousDecade;
  }

  private getNextLabel(): string {
    if (this.view === 'days') return DEFAULT_ARIA_LABELS.nextMonth;
    if (this.view === 'months') return DEFAULT_ARIA_LABELS.nextYear;
    return DEFAULT_ARIA_LABELS.nextDecade;
  }

  /* ------------------------------- Render -------------------------------- */

  private renderDayPanels(): JSX.Element {
    const panels: JSX.Element[] = [];
    const monthCount = this.getMonthCount();

    for (let i = 0; i < monthCount; i++) {
      const anchor = addMonths(this.viewDate, i);
      const anchorKey = toISO(startOfMonth(anchor));
      panels.push(
        <div
          key={anchorKey}
          class={{
            'bq-date-picker2__panel': true,
            'bq-date-picker2__panel--extra': i > 0,
          }}
        >
          {monthCount > 1 && (
            <div class="bq-date-picker2__month-label" part={CALENDAR_PARTS.heading}>
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

    return <div class="bq-date-picker2__panels">{panels}</div>;
  }

  private renderMonthsView(): JSX.Element {
    const firstSelected = this.selection[0];
    const parsedFirst = firstSelected ? parseISO(firstSelected) : null;
    const selectedMonth = parsedFirst?.getFullYear() === this.focusedYear ? parsedFirst.getMonth() : undefined;

    return (
      <CalendarMonthView
        year={this.focusedYear}
        selectedMonth={selectedMonth}
        focusedMonth={this.focusedMonth}
        locale={this.locale}
        minISO={this.min}
        maxISO={this.max}
        onMonthSelect={(month) => this.handleMonthSelect(month)}
        onMonthFocus={(month) => {
          this.focusedMonth = month;
        }}
        onGridKeyDown={this.handleMonthGridKeyDown}
      />
    );
  }

  private renderYearsView(): JSX.Element {
    const start = this.decadeStart;
    const end = start + DECADE_GRID_SIZE - 1;
    const years = Array.from({ length: DECADE_GRID_SIZE }, (_, i) => start + i);
    const selectedYear = this.selection[0] ? parseISO(this.selection[0])?.getFullYear() : undefined;
    const minYear = getISOYearMonth(this.min)?.year;
    const maxYear = getISOYearMonth(this.max)?.year;
    const effectiveFocused = this.focusedYear >= start && this.focusedYear <= end ? this.focusedYear : start;

    return (
      <CalendarYearView
        years={years}
        selectedYear={selectedYear}
        focusedYear={effectiveFocused}
        minYear={minYear}
        maxYear={maxYear}
        onYearSelect={(year) => this.handleYearSelect(year)}
        onYearFocus={(year) => {
          this.focusedYear = year;
        }}
        onGridKeyDown={this.handleYearGridKeyDown}
      />
    );
  }

  private renderView(): JSX.Element {
    if (this.view === 'months') return this.renderMonthsView();
    if (this.view === 'years') return this.renderYearsView();
    return this.renderDayPanels();
  }

  render() {
    const labelId = `bq-date-picker2__label-${this.name || DEFAULT_INPUT_ID}`;
    const popupId = `bq-date-picker2__popup-${this.name || DEFAULT_INPUT_ID}`;

    return (
      <div class="bq-date-picker2" part={CALENDAR_PARTS.base}>
        <label
          class={{ 'bq-date-picker2__label': true, 'is-hidden': !this.hasLabel }}
          htmlFor={this.name || DEFAULT_INPUT_ID}
          part={CALENDAR_PARTS.label}
          ref={(labelElem) => {
            this.labelElem = labelElem;
          }}
        >
          <slot id={labelId} name="label" onSlotchange={this.handleSlotChange} />
        </label>

        <bq-dropdown
          class="bq-date-picker2__dropdown"
          disabled={this.disabled}
          distance={this.distance}
          exportparts="panel"
          open={this.open}
          panelHeight={this.panelHeight}
          placement={this.placement}
          skidding={this.skidding}
          strategy={this.strategy}
        >
          <div
            class={{
              'bq-date-picker2__control': true,
              [`validation-${this.validationStatus}`]: true,
              'is-disabled': !!this.disabled,
              'is-open': !!this.open,
            }}
            part={CALENDAR_PARTS.control}
            slot="trigger"
          >
            <span
              class={{ 'bq-date-picker2__prefix': true, 'is-hidden': !this.hasPrefix }}
              part={CALENDAR_PARTS.prefix}
              ref={(el) => {
                this.prefixElem = el;
              }}
            >
              <slot name="prefix" onSlotchange={this.handleSlotChange} />
            </span>

            <input
              aria-controls={popupId}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-haspopup="dialog"
              aria-invalid={this.validationStatus === 'error' ? 'true' : 'false'}
              aria-labelledby={this.hasLabel ? labelId : undefined}
              autoCapitalize="off"
              autoComplete="off"
              class="bq-date-picker2__input"
              disabled={this.disabled}
              form={this.form}
              id={this.name || DEFAULT_INPUT_ID}
              name={this.name}
              onBlur={this.handleBlur}
              onChange={this.handleInputChange}
              onFocus={this.handleFocus}
              part={CALENDAR_PARTS.input}
              placeholder={this.placeholder}
              readonly={this.type !== 'single'}
              ref={(el) => {
                this.inputElem = el;
              }}
              required={this.required}
              spellcheck={false}
              type="text"
              value={this.displayDate}
            />

            {this.hasValue && !this.disabled && !this.disableClear && (
              <bq-button
                appearance="text"
                border="s"
                class="bq-date-picker2__clear"
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

            <span
              class="bq-date-picker2__suffix"
              part={CALENDAR_PARTS.suffix}
              ref={(el) => {
                this.suffixElem = el;
              }}
            >
              <slot name="suffix" onSlotchange={this.handleSlotChange}>
                <bq-icon name="calendar-blank" />
              </slot>
            </span>
          </div>

          <div
            aria-label={this.hasLabel ? undefined : 'Date picker'}
            aria-labelledby={this.hasLabel ? labelId : undefined}
            class="bq-date-picker2__calendar"
            id={popupId}
            part={CALENDAR_PARTS.container}
            role="dialog"
            style={{ '--bq-date-picker2--panel-count': `${this.getMonthCount()}` }}
          >
            <CalendarHeader
              view={this.view}
              label={this.getHeaderLabel()}
              previousLabel={this.getPreviousLabel()}
              nextLabel={this.getNextLabel()}
              titleLabel={this.getHeaderTitleLabel()}
              titleInteractive={this.view !== 'years'}
              onPrevious={() => this.handleHeaderPrev()}
              onNext={() => this.handleHeaderNext()}
              onTitleClick={() => this.handleHeaderTitleClick()}
            />
            <div class="bq-date-picker2__view">{this.renderView()}</div>
          </div>
        </bq-dropdown>
      </div>
    );
  }
}
