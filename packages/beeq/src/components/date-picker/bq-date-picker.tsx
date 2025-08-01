import { AttachInternals, Component, Element, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

import { DATE_PICKER_TYPE } from './bq-date-picker.types';
import type { DaysOfWeek, TCalendarDate, TDatePickerType } from './bq-date-picker.types';
import { isCallyLibraryLoaded, loadCallyLibrary } from './helper/callyLibrary';
import type { Placement } from '../../services/interfaces';
import {
  hasSlotContent,
  isClient,
  isDefined,
  isEventTargetChildOfElement,
  isHTMLElement,
  isNil,
  validatePropValue,
} from '../../shared/utils';
import type { TInputValidation } from '../input/bq-input.types';

/**
 * The Date Picker is a intuitive UI element component allows users to select dates from a visual calendar interface, providing an intuitive way to input date information.
 *
 * @example How to use it
 * ```html
 * <bq-date-picker
 *   first-day-of-week="1"
 *   locale="en-GB"
 *   months-per-view="single"
 *   months="2"
 *   name="bq-date-picker"
 *   placeholder="Enter your date"
 *   placement="bottom-end"
 *   show-outside-days="false"
 *   type="range"
 *   validation-status="none"
 *   value="2024-05-25"
 * >
 *   <label class="flex flex-grow items-center" slot="label">
 *     Date picker label
 *   </label>
 * </bq-date-picker>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/5793a9-date-picker
 * @status stable
 *
 * @dependency bq-button
 * @dependency bq-dropdown
 * @dependency bq-icon
 *
 * @attr {boolean} autofocus - If `true`, the Date picker input will be focused on component render.
 * @attr {string} clear-button-label - The clear button aria label.
 * @attr {boolean} disable-clear - If `true`, the clear button won't be displayed.
 * @attr {boolean} disabled - Indicates whether the Date picker input is disabled or not.
 * @attr {number} distance - Represents the distance (gutter or margin) between the Date picker panel and the input element.
 * @attr {0 | 1 | 2 | 3 | 4 | 5 | 6} first-day-of-week - The first day of the week, where Sunday is 0, Monday is 1, etc.
 * @attr {Intl.DateTimeFormatOptions} format-options - The options to use when formatting the displayed value. Details: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
 * @attr {string} form - The ID of the form that the Date picker input belongs to.
 * @attr {string} form-validation-message - The native form validation message (mandatory if `required` is set).
 * @attr {function} is-date-disallowed - A function that takes a date and returns true if the date should not be selectable.
 * @attr {Intl.LocalesArgument} locale - The locale for formatting dates. If not set, will use the browser's locale. Details: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument
 * @attr {string} max - The latest date that can be selected.
 * @attr {string} min - The earliest date that can be selected.
 * @attr {number} months - Number of months to show when range is `true`.
 * @attr {string} name - The Date picker input name.
 * @attr {boolean} open - If `true`, the Date picker panel will be visible.
 * @attr {string} panel-height - When set, it will override the height of the Date picker panel.
 * @attr {"top" | "right" | "bottom" | "left" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"} placement - Position of the Date picker panel.
 * @attr {boolean} required - Indicates whether or not the Date picker input is required to be filled out before submitting the form.
 * @attr {number} skidding - Represents the skidding between the Date picker panel and the input element.
 * @attr {boolean} show-outside-days - Whether to show days outside the month.
 * @attr {string} strategy - Defines the strategy to position the Date picker panel.
 * @attr {string} tentative - The date that is tentatively selected, e.g. the start of a range selection.
 * @attr {"single" | "multi" | "range"} type - It defines how the calendar will behave, allowing single date selection, range selection, or multiple date selection.
 * @attr {"error" | "none" | "success" | "warning"} validation-status - The validation status of the Select input.
 * @attr {string} value - The select input value represents the currently selected date or range and can be used to reset the field to a previous value.
 *
 * @method clear - Clears the selected value.
 *
 * @event bqBlur - Callback handler emitted when the input loses focus.
 * @event bqChange - Callback handler emitted when the input value has changed and the input loses focus.
 * @event bqClear - Callback handler emitted when the input value has been cleared.
 * @event bqFocus - Callback handler emitted when the input has received focus.
 *
 * @part base - The component's base wrapper.
 * @part button - The native HTML button used under the hood in the clear button.
 * @part calendar__button - Any button used in the calendar-month component.
 * @part calendar__button - Any button within the calendar-range component.
 * @part calendar__container - The calendar-range container for the entire component.
 * @part calendar__day - The buttons corresponding to each day in the calendar-month grid.
 * @part calendar__disabled - A button that is disabled due to min/max on the calendar-range component.
 * @part calendar__disallowed - Any day that has been disallowed via isDateDisallowed.
 * @part calendar__head - The calendar-month table's header row.
 * @part calendar__header - The calendar-range container for the heading and buttons.
 * @part calendar__heading - The calendar-month heading container that labels the month.
 * @part calendar__heading - The calendar-range heading containing the month and year.
 * @part calendar__next - The next page button on the calendar-range component.
 * @part calendar__outside - Any days which are outside the current month.
 * @part calendar__previous - The previous page button on the calendar-range component.
 * @part calendar__range-end - The day at the end of a date range.
 * @part calendar__range-inner - Any days between the start and end of a date range.
 * @part calendar__range-start - The day at the start of a date range.
 * @part calendar__selected - Any days which are selected.
 * @part calendar__table - The calendar-month <table> element.
 * @part calendar__td - The calendar-month table's body cells.
 * @part calendar__th - The calendar-month table's header cells.
 * @part calendar__today - The Today's day.
 * @part calendar__tr - Any row within the table on the calendar-month component.
 * @part calendar__week - The calendar-month table's body rows.
 * @part clear-btn - The clear button.
 * @part control - The input control wrapper.
 * @part input - The native HTML input element used under the hood.
 * @part label - The label slot container.
 * @part panel - The date picker panel container
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 *
 * @cssprop --bq-date-picker--background-color - Date picker background color.
 * @cssprop --bq-date-picker--border-color - Date picker border color.
 * @cssprop --bq-date-picker--border-color-disabled - Date picker border color when disabled.
 * @cssprop --bq-date-picker--border-color-focus - Date picker border color on focus.
 * @cssprop --bq-date-picker--border-radius - Date picker border radius.
 * @cssprop --bq-date-picker--border-style - Date picker border style.
 * @cssprop --bq-date-picker--border-width - Date picker border width.
 * @cssprop --bq-date-picker--currentDate-border-color - Date picker border color for current date.
 * @cssprop --bq-date-picker--currentDate-border-width - Date picker border width for current date.
 * @cssprop --bq-date-picker--day-size - Date picker button day size.
 * @cssprop --bq-date-picker--gap - Gap between Date picker content and prefix/suffix.
 * @cssprop --bq-date-picker--icon-size - Icon size to use in prefix/suffix and clear button.
 * @cssprop --bq-date-picker--label-margin-bottom - Date picker label margin bottom.
 * @cssprop --bq-date-picker--label-text-color - Date picker label text color.
 * @cssprop --bq-date-picker--label-text-size - Date picker label text size.
 * @cssprop --bq-date-picker--padding-end - Date picker padding end.
 * @cssprop --bq-date-picker--padding-start - Date picker padding start.
 * @cssprop --bq-date-picker--paddingY - Date picker padding top and bottom.
 * @cssprop --bq-date-picker--range-background-color - Background color for the selected date range in the date picker.
 * @cssprop --bq-date-picker--range-inner-background-color - Background color for the selected dates inside the date range in the date picker.
 * @cssprop --bq-date-picker--text-color - Date picker text color.
 * @cssprop --bq-date-picker--text-placeholder-color - Date picker placeholder text color.
 * @cssprop --bq-date-picker--text-size - Date picker text size.
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

  private callyElem?: TCalendarDate;
  private inputElem?: HTMLInputElement;
  private labelElem?: HTMLElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

  private fallbackInputId = 'date-picker';

  // Export parts of the calendar-month component
  private readonly COMMON_EXPORT_PARTS =
    'calendar__heading,calendar__table,calendar__tr,calendar__head,calendar__week,calendar__th,calendar__td';
  private readonly BUTTON_EXPORT_PARTS =
    'calendar__button,calendar__day,calendar__selected,calendar__today,calendar__disallowed,calendar__outside,calendar__range-start,calendar__range-end,calendar__range-inner';

  // Reference to host HTML element
  // ===================================

  @AttachInternals() internals: ElementInternals;
  @Element() el!: HTMLBqDatePickerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() isCallyLoaded = false;
  @State() focusedDate: string;
  @State() displayDate: string;
  @State() hasLabel = false;
  @State() hasPrefix = false;
  @State() hasRangeEnd = false;
  @State() hasSuffix = false;
  @State() hasValue = false;

  // Public Property API
  // ========================

  /** If `true`, the Date picker input will be focused on component render */
  @Prop({ reflect: true }) autofocus: boolean;

  /** The clear button aria label */
  @Prop({ reflect: true }) clearButtonLabel? = 'Clear value';

  /** If `true`, the clear button won't be displayed */
  @Prop({ reflect: true }) disableClear? = false;

  /**
   * Indicates whether the Date picker input is disabled or not.
   * If `true`, the Date picker is disabled and cannot be interacted with.
   */
  @Prop({ mutable: true }) disabled?: boolean = false;

  /** Represents the distance (gutter or margin) between the Date picker panel and the input element. */
  @Prop({ reflect: true }) distance?: number = 8;

  /** The first day of the week, where Sunday is 0, Monday is 1, etc */
  @Prop({ reflect: true }) firstDayOfWeek?: DaysOfWeek = 1;

  /** The options to use when formatting the displayed value.
   * Details: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   */
  @Prop() formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  /** The ID of the form that the Date picker input belongs to. */
  @Prop({ reflect: true }) form?: string;

  /** The native form validation message (mandatory if `required` is set) */
  @Prop({ mutable: true }) formValidationMessage?: string;

  /** A function that takes a date and returns true if the date should not be selectable */
  @Prop({ reflect: true }) isDateDisallowed?: (date: Date) => boolean;

  /** The locale for formatting dates. If not set, will use the browser's locale.
   * Details: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument
   */
  @Prop({ reflect: true }) locale: Intl.LocalesArgument = 'en-GB';

  /** The latest date that can be selected */
  @Prop({ reflect: true }) max?: string;

  /** The earliest date that can be selected */
  @Prop({ reflect: true }) min?: string;

  /** Number of months to show when range is `true` */
  @Prop({ reflect: true }) months: number;

  /**
   * Specifies how the next/previous buttons should navigate the calendar.
   * - single: The buttons will navigate by a single month at a time.
   * - months: The buttons will navigate by the number of months displayed per view.
   */
  @Prop({ reflect: true }) monthsPerView: 'single' | 'months' = 'single';

  /** The Date picker input name. */
  @Prop({ reflect: true }) name!: string;

  /** If `true`, the Date picker panel will be visible. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** When set, it will override the height of the Date picker panel. */
  @Prop({ reflect: true, mutable: true }) panelHeight?: string = 'auto';

  /** The Date picker input placeholder text value */
  @Prop({ reflect: true }) placeholder?: string;

  /** Position of the Date picker panel */
  @Prop({ reflect: true }) placement?: Placement = 'bottom-end';

  /** Indicates whether or not the Date picker input is required to be filled out before submitting the form. */
  @Prop({ reflect: true }) required?: boolean;

  /** Represents the skidding between the Date picker panel and the input element. */
  @Prop({ reflect: true }) skidding?: number = 0;

  /** Whether to show days outside the month */
  @Prop({ reflect: true }) showOutsideDays: boolean = false;

  /** Defines the strategy to position the Date picker panel */
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';

  /** The date that is tentatively selected e.g. the start of a range selection  */
  @Prop({ reflect: true, mutable: true }) tentative?: string;

  /** It defines how the calendar will behave, allowing single date selection, range selection, or multiple date selection */
  @Prop({ reflect: true }) type: TDatePickerType = 'single';

  /**
   * The validation status of the Select input.
   *
   * @remarks
   * This property is used to indicate the validation status of the select input. It can be set to one of the following values:
   * - `'none'`: No validation status is set.
   * - `'error'`: The input has a validation error.
   * - `'warning'`: The input has a validation warning.
   * - `'success'`: The input has passed validation.
   */
  @Prop({ reflect: true }) validationStatus: TInputValidation = 'none';

  /** The select input value represents the currently selected date or range and can be used to reset the field to a previous value.
   * All dates are expected in ISO-8601 format (YYYY-MM-DD). */
  @Prop({ reflect: true, mutable: true }) value: string;

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValueChange() {
    const { formatDisplayValue, internals, isCallyLoaded, value } = this;
    if (!isCallyLoaded) return;

    internals.setFormValue(!isNil(value) ? `${value}` : undefined);
    this.updateFormValidity();

    if (Array.isArray(value)) {
      this.hasValue = value.some((val) => val.length > 0);
      return;
    }

    this.hasValue = isDefined(value);
    this.displayDate = formatDisplayValue(value);

    this.setFocusedDate();
  }

  @Watch('type')
  checkPropValues() {
    validatePropValue(DATE_PICKER_TYPE, 'single', this.el, 'type');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler emitted when the input loses focus */
  @Event() bqBlur!: EventEmitter<HTMLBqDatePickerElement>;

  /**
   * Callback handler emitted when the input value has changed and the input loses focus.
   * This handler is called whenever the user finishes typing or pasting text into the input field and then clicks outside of the input field.
   */
  @Event() bqChange!: EventEmitter<{ value: string; el: HTMLBqDatePickerElement }>;

  /** Callback handler emitted when the input value has been cleared */
  @Event() bqClear!: EventEmitter<HTMLBqDatePickerElement>;

  /** Callback handler emitted when the input has received focus */
  @Event() bqFocus!: EventEmitter<HTMLBqDatePickerElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  async componentWillLoad() {
    if (!isClient() || this.isCallyLoaded) return;

    try {
      await loadCallyLibrary();
      this.isCallyLoaded = isCallyLibraryLoaded();
    } catch (error) {
      console.error(error);
    }
  }

  async componentDidLoad() {
    this.handleSlotChange();
    this.handleValueChange();
  }

  formAssociatedCallback() {
    this.updateFormValidity();
  }

  formResetCallback() {
    if (isNil(this.value)) return;

    this.clear();
  }

  // Listeners
  // ==============

  @Listen('bqOpen', { capture: true })
  handleOpenChange(ev: CustomEvent<{ open: boolean }>) {
    if (!ev.composedPath().includes(this.el)) return;

    this.open = ev.detail.open;
    this.setFocusedDate();
  }

  @Listen('click', { target: 'body', capture: true })
  handleClickOutside(ev: MouseEvent) {
    const { open, type, hasRangeEnd } = this;
    if (!open || type !== 'range' || ev.button !== 0) return;
    if (isEventTargetChildOfElement(ev, this.el) || hasRangeEnd) return;
    if (isEventTargetChildOfElement(ev, this.el)) return;

    if (!hasRangeEnd) {
      this.tentative = undefined;
      this.hasRangeEnd = false;
    }
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /**
   * Clears the selected value.
   *
   * @return {Promise<void>}
   * @memberof BqInput
   */
  @Method()
  async clear(): Promise<void> {
    if (this.disabled) return;

    this.value = undefined;
    this.internals.setFormValue(undefined);
    this.bqClear.emit(this.el);
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleBlur = () => {
    if (this.disabled) return;

    this.bqBlur.emit(this.el);
  };

  private handleFocus = () => {
    if (this.disabled) return;

    this.bqFocus.emit(this.el);
  };

  private setFocusedDate = () => {
    const { callyElem, formatFocusedDate, isCallyLoaded, value } = this;
    if (!(callyElem && isCallyLoaded)) return;
    // We need to set the focused date in the calendar component via a ref
    // because it doesn't work when passed as a prop (the Cally element does not re-render)
    this.focusedDate = value ? formatFocusedDate(value) : new Date().toLocaleDateString('fr-CA');
    this.callyElem.focusedDate = this.focusedDate;
  };

  private handleChange = (ev: Event) => {
    if (this.disabled) return;
    if (!isHTMLElement(ev.target, 'input')) return;

    const dateValue = new Date(ev.target.value);
    if (!isNaN(dateValue.getTime())) {
      // We need to force the value to respect the format: yyyy-mm-dd, hence the hardcoded locale
      this.value = dateValue.toLocaleDateString('fr-CA');
      this.displayDate = this.formatDisplayValue(this.value);
      this.internals.setFormValue(`${this.value}`);
      this.bqChange.emit({ value: this.value, el: this.el });
    }
  };

  private handleCalendarChange = (ev: Event) => {
    const { value } = ev.target as unknown as { value: string };

    this.value = value;
    this.displayDate = this.formatDisplayValue(this.value);
    this.inputElem.value = this.displayDate;
    this.inputElem.focus();

    this.internals.setFormValue(`${this.value}`);
    this.bqChange.emit({ value: this.value, el: this.el });

    this.open = this.type === 'multi';
  };

  private handleCalendarRangeStart = (ev: CustomEvent) => {
    this.hasRangeEnd = false;
    this.tentative = new Date(ev.detail).toLocaleDateString('fr-CA');
  };

  private handleCalendarRangeEnd = () => {
    this.hasRangeEnd = true;
  };

  private handleClearClick = (ev: CustomEvent) => {
    if (this.disabled) return;

    this.inputElem.value = '';
    this.value = this.inputElem.value;
    this.hasRangeEnd = false;

    this.bqClear.emit(this.el);
    this.bqChange.emit({ value: this.value, el: this.el });
    this.internals.setFormValue(undefined);
    this.inputElem.focus();

    ev.stopPropagation();
  };

  private handleSlotChange = () => {
    this.hasLabel = hasSlotContent(this.labelElem);
    this.hasPrefix = hasSlotContent(this.prefixElem);
    this.hasSuffix = hasSlotContent(this.suffixElem);
  };

  private generateCalendarMonth = (offset?: number, className = ''): Element | null => {
    if (!this.isCallyLoaded) return null;

    return (
      <calendar-month
        offset={offset}
        class={className}
        exportparts={`${this.COMMON_EXPORT_PARTS},${this.BUTTON_EXPORT_PARTS}`}
      />
    );
  };

  /**
   * Generates an array of Elements representing the calendar months.
   *
   * If the type of the date picker is 'range' or 'multi' and the number of months is specified,
   * it generates an array of calendar months with the specified length. Each month will have an offset
   * and a class name based on its position in the array. The offset is used to determine the month to display,
   * and the class name is used for responsive design.
   *
   * If the type of the date picker is not 'range' or 'multi', or if the number of months is not specified,
   * it generates an array with a single calendar month.
   *
   * @returns {Element[]} An array of elements representing the calendar months.
   */
  private generateCalendarMonths = (): Element[] => {
    if (!this.isCallyLoaded) return [];

    if (this.type === 'range' || (this.type === 'multi' && this.months)) {
      return Array.from({ length: this.months }, (_, i) => {
        const offset = i > 0 ? i : undefined;
        const className = offset ? 'hidden sm:block' : '';
        return this.generateCalendarMonth(offset, className);
      });
    }

    return [this.generateCalendarMonth()];
  };

  /**
   * Extracts and returns the first date part from a given string.
   * When the type of the date picker is 'range' or 'multi', the first or initial date part of the value
   * should be the focused date in the calendar.
   *
   * @param value - The value to be processed, can be a string.
   * @returns The extracted last date portion of the value.
   */
  private formatFocusedDate = (value: string): string | undefined => {
    if (!value) return undefined;

    const dateRegex = /\b\d{4}-\d{2}-\d{2}\b/;
    const match = dateRegex.exec(value);
    return match ? match[0] : undefined;
  };

  private formatDisplayValue = (value: string): string | undefined => {
    if (!value) return undefined;

    const dateFormatter = new Intl.DateTimeFormat(this.locale, this.formatOptions);

    if (this.type === 'range') {
      const [start, end] = value.split('/').map((dateStr) => new Date(dateStr));
      return dateFormatter.formatRange(start, end);
    }

    if (this.type === 'multi') {
      const dates = value.split(' ').map((dateStr) => new Date(dateStr));
      return dates.map((date) => dateFormatter.format(date)).join(', ');
    }

    return dateFormatter.format(new Date(value));
  };

  private updateFormValidity = () => {
    const { formValidationMessage, internals, required, value, inputElem } = this;

    // Clear the validity state
    internals?.states.clear();

    if (required && (!value || value.toString().trim() === '')) {
      // Set validity state to invalid
      internals?.states.add('invalid');
      internals?.setValidity({ valueMissing: true }, formValidationMessage, inputElem);
      return;
    }

    // Set validity state to valid if textarea has value or is not required
    internals?.states.add('valid');
    internals?.setValidity({});
  };

  private get CalendarType() {
    const componentTypes = {
      single: 'calendar-date',
      multi: 'calendar-multi',
      range: 'calendar-range',
    } as const;

    // Return the corresponding component type, based on the type prop value
    return componentTypes[this.type] || componentTypes.single;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const CallyCalendar = this.CalendarType;
    const labelId = `bq-date-picker__label-${this.name || this.fallbackInputId}`;

    return (
      <div class="bq-date-picker" part="base">
        {/* Label */}
        <label
          id={labelId}
          class={{ 'bq-date-picker__label': true, '!hidden': !this.hasLabel }}
          aria-label={this.name || this.fallbackInputId}
          htmlFor={this.name || this.fallbackInputId}
          ref={(labelElem: HTMLSpanElement) => (this.labelElem = labelElem)}
          part="label"
        >
          <slot name="label" onSlotchange={this.handleSlotChange} />
        </label>
        {/* Select date picker dropdown */}
        <bq-dropdown
          class="bq-date-picker__dropdown is-full [&::part(panel)]:p-m [&::part(panel)]:is-auto"
          disabled={this.disabled}
          distance={this.distance}
          open={this.open}
          panelHeight={this.panelHeight}
          placement={this.placement}
          skidding={this.skidding}
          strategy={this.strategy}
          exportparts="panel"
        >
          {/* Input control group */}
          <div
            class={{
              'bq-date-picker__control': true,
              [`validation-${this.validationStatus}`]: true,
              disabled: this.disabled,
            }}
            part="control"
            slot="trigger"
          >
            {/* Prefix */}
            <span
              class={{ 'bq-date-picker__control--prefix': true, '!hidden': !this.hasPrefix }}
              ref={(spanElem: HTMLSpanElement) => (this.prefixElem = spanElem)}
              part="prefix"
            >
              <slot name="prefix" onSlotchange={this.handleSlotChange} />
            </span>
            {/* HTML Input */}
            <input
              id={this.name || this.fallbackInputId}
              class="bq-date-picker__control--input"
              autoComplete="off"
              autoCapitalize="off"
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-controls={`${this.name}`}
              aria-haspopup="dialog"
              disabled={this.disabled}
              form={this.form}
              name={this.name}
              placeholder={this.placeholder}
              readonly={this.type !== 'single'}
              ref={(inputElem: HTMLInputElement) => (this.inputElem = inputElem)}
              required={this.required}
              spellcheck={false}
              type="text"
              value={this.displayDate}
              part="input"
              // Events
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onChange={this.handleChange}
            />
            {/* Clear Button */}
            {this.hasValue && !this.disabled && !this.disableClear && (
              // The clear button will be visible as long as the input has a value
              // and the parent group is hovered or has focus-within
              <bq-button
                class="bq-date-picker__control--clear ms-[--bq-date-picker--gap] hidden"
                appearance="text"
                aria-label={this.clearButtonLabel}
                size="small"
                onBqClick={this.handleClearClick}
                part="clear-btn"
                exportparts="button"
              >
                <slot name="clear-icon">
                  <bq-icon name="x-circle" class="flex" />
                </slot>
              </bq-button>
            )}
            {/* Suffix */}
            <span
              class="bq-date-picker__control--suffix"
              ref={(spanElem: HTMLSpanElement) => (this.suffixElem = spanElem)}
              part="suffix"
            >
              <slot name="suffix" onSlotchange={this.handleSlotChange}>
                <bq-icon name="calendar-blank" class="flex" />
              </slot>
            </span>
          </div>
          {this.isCallyLoaded && (
            <CallyCalendar
              isDateDisallowed={this.isDateDisallowed}
              locale={this.locale as string}
              value={this.value}
              min={this.min}
              max={this.max}
              months={this.months}
              tentative={this.tentative}
              pageBy={this.monthsPerView}
              firstDayOfWeek={this.firstDayOfWeek}
              showOutsideDays={this.showOutsideDays}
              onChange={this.handleCalendarChange}
              onRangestart={this.handleCalendarRangeStart}
              onRangeend={this.handleCalendarRangeEnd}
              exportparts="container:calendar__container,header:calendar__header,button:calendar__button,previous:calendar__previous,next:calendar__next,disabled:calendar__disabled,heading:calendar__heading"
              ref={(elem: TCalendarDate) => (this.callyElem = elem)}
            >
              <bq-icon color="text--primary" slot="previous" name="caret-left" label="Previous" />
              <bq-icon color="text--primary" slot="next" name="caret-right" label="Next" />

              <div class="flex flex-wrap justify-center gap-[--bq-spacing-m]">{this.generateCalendarMonths()}</div>
            </CallyCalendar>
          )}
        </bq-dropdown>
      </div>
    );
  }
}
