import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { DATE_PICKER_TYPE, DaysOfWeek, TDatePickerType } from './bq-date-picker.types';
import { FloatingUIPlacement } from '../../services/interfaces';
import { hasSlotContent, isDefined, isHTMLElement, validatePropValue } from '../../shared/utils';
import { TInputValidation } from '../input/bq-input.types';

/**
 * @part base - The component's base wrapper.
 * @part button - The native HTML button used under the hood in the clear button.
 * @part clear-btn - The clear button.
 * @part control - The input control wrapper.
 * @part input - The native HTML input element used under the hood.
 * @part label - The label slot container.
 * @part panel - The date picker panel container
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.

// Parts from the Cally library for calendar-date and calendar-range components:
 * @part container - The container for the entire component.
 * @part header - The container for heading and button's.
 * @part button - Any button within the component.
 * @part previous - The previous page button.
 * @part next - The next page button.
 * @part disabled - A button that is disabled due to min/max.
 * @part heading - The heading containing the month and year.

// Parts specific to the calendar-month component:
 * @part heading - The heading that labels the month.
 * @part table - The <table> element.
 * @part tr - Any row within the table.
 * @part head - The table's header row.
 * @part week - The table's body rows.
 * @part th - The table's header cells.
 * @part td - The table's body cells.
 * @part button - Any button used in the component.
 * @part day - The buttons corresponding to each day in the grid.
 * @part selected - Any days which are selected.
 * @part today - Today's day.
 * @part disallowed - Any day that has been disallowed via isDateDisallowed.
 * @part outside - Any days which are outside the current month.
 * @part range-start - The day at the start of a date range.
 * @part range-end - The day at the end of a date range.
 * @part range-inner - Any days between the start and end of a date range.
 */
@Component({
  tag: 'bq-date-picker',
  styleUrl: './scss/bq-date-picker.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqDatePicker {
  // Own Properties
  // ====================

  private inputElem?: HTMLInputElement;
  private labelElem?: HTMLElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

  private fallbackInputId = 'date-picker';

  // Export parts of the calendar-month component
  private readonly COMMON_EXPORT_PARTS = 'heading,table,tr,head,week,th,td';
  private readonly BUTTON_EXPORT_PARTS =
    'button,day,selected,today,disallowed,outside,range-start,range-end,range-inner';

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDatePickerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() formattedDate: string;
  @State() hasLabel = false;
  @State() hasPrefix = false;
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

  /** The Date picker input name. */
  @Prop({ reflect: true }) name!: string;

  /** If `true`, the Date picker panel will be visible. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** When set, it will override the height of the Date picker panel. */
  @Prop({ reflect: true, mutable: true }) panelHeight?: string = 'auto';

  /** The Date picker input placeholder text value */
  @Prop({ reflect: true }) placeholder?: string;

  /** Position of the Date picker panel */
  @Prop({ reflect: true }) placement?: FloatingUIPlacement = 'bottom-start';

  /** Indicates whether or not the Date picker input is required to be filled out before submitting the form. */
  @Prop({ reflect: true }) required?: boolean;

  /** Represents the skidding between the Date picker panel and the input element. */
  @Prop({ reflect: true }) skidding?: number = 0;

  /** Whether to show days outside the month */
  @Prop({ reflect: true }) showOutsideDays: boolean = false;

  /** Defines the strategy to position the Date picker panel */
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';

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
    if (Array.isArray(this.value)) {
      this.hasValue = this.value.some((val) => val.length > 0);
      return;
    }

    this.formattedDate = this.formatDate(this.value);
    this.hasValue = isDefined(this.value);
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

  componentDidLoad() {
    this.handleValueChange();
  }

  // Listeners
  // ==============

  @Listen('bqOpen', { capture: true })
  handleOpenChange(ev: CustomEvent<{ open: boolean }>) {
    if (!ev.composedPath().includes(this.el)) return;

    this.open = ev.detail.open;
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

  private handleChange = (ev: Event) => {
    if (this.disabled) return;

    if (!isHTMLElement(ev.target, 'input')) return;

    const dateValue = new Date(ev.target.value);
    if (!isNaN(dateValue.getTime())) {
      // We need to force the value to respect the format: yyyy-mm-dd, hence the hardcoded locale
      this.value = dateValue.toLocaleDateString('fr-CA');
      this.formattedDate = this.formatDate(this.value);
      this.bqChange.emit({ value: this.value, el: this.el });
    }
  };

  private handleCalendarChange = (ev: Event) => {
    const { value } = ev.target as unknown as { value: string };

    this.value = value;
    this.formattedDate = this.formatDate(this.value);
    this.inputElem.value = this.formattedDate;

    this.bqChange.emit({ value: this.value, el: this.el });

    this.open = this.type === 'multi';
  };

  private handleClearClick = (ev: CustomEvent) => {
    if (this.disabled) return;

    this.inputElem.value = '';
    this.value = this.inputElem.value;

    this.bqClear.emit(this.el);
    this.bqChange.emit({ value: this.value, el: this.el });
    this.inputElem.focus();

    ev.stopPropagation();
  };

  private handleLabelSlotChange = () => {
    this.hasLabel = hasSlotContent(this.labelElem);
  };

  private handlePrefixSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem);
  };

  private handleSuffixSlotChange = () => {
    this.hasSuffix = hasSlotContent(this.suffixElem);
  };

  private generateCalendarMonth = (offset?: number, className = ''): JSX.Element => {
    return (
      <calendar-month
        offset={offset}
        class={className}
        exportparts={`${this.COMMON_EXPORT_PARTS},${this.BUTTON_EXPORT_PARTS}`}
      />
    );
  };

  /**
   * Generates an array of JSX.Element representing calendar months.
   *
   * If the type of the date picker is 'range' or 'multi' and the number of months is specified,
   * it generates an array of calendar months with the specified length. Each month will have an offset
   * and a class name based on its position in the array. The offset is used to determine the month to display,
   * and the class name is used for responsive design.
   *
   * If the type of the date picker is not 'range' or 'multi', or if the number of months is not specified,
   * it generates an array with a single calendar month.
   *
   * @returns {JSX.Element[]} An array of JSX.Element representing calendar months.
   */
  private generateCalendarMonths = (): JSX.Element[] => {
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
   * Extracts and returns the last date part from a given string.
   * When the type of the date picker is 'range' or 'multi', the last date part of the value
   * should be the focused date in the calendar.
   *
   * @param value - The value to be processed, can be a string.
   * @returns The extracted last date portion of the value.
   */
  private focusedDate = (value: string) => {
    if (!value) return;

    const dateLength = 10; // Length of a standard date in the format YYYY-MM-DD
    return value.slice(-dateLength);
  };

  private formatDate = (value: string): string | undefined => {
    if (!value) return;

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
          htmlFor={this.name || this.fallbackInputId}
          ref={(labelElem: HTMLSpanElement) => (this.labelElem = labelElem)}
          part="label"
        >
          <slot name="label" onSlotchange={this.handleLabelSlotChange} />
        </label>
        {/* Select date picker dropdown */}
        <bq-dropdown
          class="bq-date-picker__dropdown w-full [&::part(panel)]:w-auto"
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
              <slot name="prefix" onSlotchange={this.handlePrefixSlotChange} />
            </span>
            {/* HTML Input */}
            <input
              id={this.name || this.fallbackInputId}
              class="bq-date-picker__control--input"
              autoComplete="off"
              autoCapitalize="off"
              autoFocus={this.autofocus}
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
              value={this.formattedDate}
              part="input"
              // Events
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onInput={this.handleInput}
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
                  <bq-icon weight="bold" name="x-circle" class="flex" />
                </slot>
              </bq-button>
            )}
            {/* Suffix */}
            <span
              class="bq-date-picker__control--suffix"
              ref={(spanElem: HTMLSpanElement) => (this.suffixElem = spanElem)}
              part="suffix"
            >
              <slot name="suffix" onSlotchange={this.handleSuffixSlotChange}>
                <bq-icon name="calendar-blank" weight="bold" class="flex" />
              </slot>
            </span>
          </div>
          <div class="flex items-center justify-center">
            <CallyCalendar
              isDateDisallowed={this.isDateDisallowed}
              locale={this.locale as string}
              value={this.value}
              min={this.min}
              max={this.max}
              months={this.months}
              focusedDate={this.focusedDate(this.value)}
              firstDayOfWeek={this.firstDayOfWeek}
              showOutsideDays={this.showOutsideDays}
              onChange={this.handleCalendarChange}
              exportparts="container,header,button,previous,next,disabled,heading"
            >
              <bq-icon color="text--primary" slot="previous" name="caret-left" label="Previous" />
              <bq-icon color="text--primary" slot="next" name="caret-right" label="Next" />

              <div class="flex flex-wrap justify-center gap-[--bq-spacing-m]">{this.generateCalendarMonths()}</div>
            </CallyCalendar>
          </div>
        </bq-dropdown>
      </div>
    );
  }
}
