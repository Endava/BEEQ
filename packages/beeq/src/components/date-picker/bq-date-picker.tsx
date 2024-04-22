import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';

import { FloatingUIPlacement } from '../../services/interfaces';
import { hasSlotContent, isDefined, isHTMLElement } from '../../shared/utils';
import { TInputValidation, TInputValue } from '../input/bq-input.types';

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

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqInputElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

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

  /**
   * Indicates whether the Date picker input is disabled or not.
   * If `true`, the Date picker is disabled and cannot be interacted with.
   */
  @Prop({ mutable: true }) disabled?: boolean = false;

  /** If `true`, the clear button won't be displayed */
  @Prop({ reflect: true }) disableClear? = false;

  /** Represents the distance (gutter or margin) between the Date picker panel and the input element. */
  @Prop({ reflect: true }) distance?: number = 8;

  /** The ID of the form that the Date picker input belongs to. */
  @Prop({ reflect: true }) form?: string;

  /** If `true`, the Date picker panel will remain open after a selection date is made. */
  @Prop({ reflect: true }) keepOpenOnSelect?: boolean = false;

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

  /** Defines the strategy to position the Date picker panel */
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';

  /** If `true`, the Date picker panel will accepts more than 1 month to display */
  @Prop({ reflect: true }) range: boolean = false;

  /** Number of months to show when range is `true` */
  @Prop({ reflect: true }) months: number;

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
  @Prop({ reflect: true, mutable: true }) value: TInputValue;

  /** Whether to show days outside the month */
  @Prop({ reflect: true }) showOutsideDays: boolean = false;

  /** The first day of the week, where Sunday is 0, Monday is 1, etc */
  @Prop({ reflect: true }) firstDayOfWeek?: number = 1;

  /** The earliest date that can be selected */
  @Prop({ reflect: true }) min?: string;

  /** The latest date that can be selected */
  @Prop({ reflect: true }) max?: string;

  /** The locale for formatting dates. If not set, will use the browser's locale */
  @Prop({ reflect: true }) locale?: string | undefined = undefined;

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValueChange() {
    if (Array.isArray(this.value)) {
      this.hasValue = this.value.some((val) => val.length > 0);
      return;
    }

    this.hasValue = isDefined(this.value);
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler emitted when the input loses focus */
  @Event() bqBlur!: EventEmitter<HTMLBqInputElement>;

  /**
   * Callback handler emitted when the input value has changed and the input loses focus.
   * This handler is called whenever the user finishes typing or pasting text into the input field and then clicks outside of the input field.
   */
  @Event() bqChange!: EventEmitter<{ value: string | number | string[]; el: HTMLBqInputElement }>;

  /** Callback handler emitted when the input value has been cleared */
  @Event() bqClear!: EventEmitter<HTMLBqInputElement>;

  /** Callback handler emitted when the input has received focus */
  @Event() bqFocus!: EventEmitter<HTMLBqInputElement>;

  /**
   * Callback handler emitted when the input value changes.
   * This handler is called whenever the user types or pastes text into the input field.
   */
  @Event() bqInput!: EventEmitter<{ value: string | number | string[]; el: HTMLBqInputElement }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.handleValueChange();
  }

  // Listeners
  // ==============

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

  private handleInput = (ev: Event) => {
    if (this.disabled) return;

    if (!isHTMLElement(ev.target, 'input')) return;
    this.value = ev.target.value;
  };

  private handleChange = (ev: Event) => {
    if (this.disabled) return;

    if (!isHTMLElement(ev.target, 'input')) return;
    this.value = ev.target.value;

    this.bqChange.emit({ value: this.value, el: this.el });
  };

  private handleClearClick = (ev: CustomEvent) => {
    if (this.disabled) return;

    this.inputElem.value = '';
    this.value = this.inputElem.value;

    this.bqClear.emit(this.el);
    this.bqInput.emit({ value: this.value, el: this.el });
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

  /**
   * Generates an array of JSX elements representing calendar months.
   * If the 'range' property is true and the 'months' property is defined,
   * it generates multiple calendar months with incremental 'offset' values.
   * If the 'range' property is false or the 'months' property is undefined,
   * it generates a single calendar month without an 'offset'.
   *
   * @returns An array of JSX elements representing calendar months.
   */
  private generateCalendarMonths(): JSX.Element[] {
    const months: JSX.Element[] = [];

    if (this.range && this.months) {
      for (let i = 0; i < this.months; i++) {
        const offset = i > 0 ? i : undefined;
        months.push(<calendar-month offset={offset} />);
      }
    } else {
      months.push(<calendar-month />);
    }

    return months;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const labelId = `bq-date-picker__label-${this.name || this.fallbackInputId}`;

    const CalendarComponentType = this.range ? 'calendar-range' : 'calendar-date';

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
          class="bq-date-picker__dropdown w-full"
          disabled={this.disabled}
          distance={this.distance}
          keepOpenOnSelect={this.keepOpenOnSelect}
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
              aria-controls={`bq-options-${this.name}`}
              aria-expanded={this.open}
              aria-haspopup="listbox"
              disabled={this.disabled}
              form={this.form}
              name={this.name}
              placeholder={this.placeholder}
              ref={(inputElem: HTMLInputElement) => (this.inputElem = inputElem)}
              required={this.required}
              spellcheck={false}
              type="text"
              value={this.value}
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
            <CalendarComponentType
              locale={this.locale}
              value={this.value}
              min={this.min}
              max={this.max}
              focusedDate={this.value}
              firstDayOfWeek={this.firstDayOfWeek}
              showOutsideDays={this.showOutsideDays}
              onChange={(ev: { target: { value: string } }) => {
                this.value = ev.target.value;
              }}
            >
              <bq-icon slot="previous" name="caret-left" label="Previous" />
              <bq-icon slot="next" name="caret-right" label="Next" />

              {this.generateCalendarMonths()}
            </CalendarComponentType>
          </div>
        </bq-dropdown>
      </div>
    );
  }
}
