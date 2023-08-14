import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { hasSlotContent, isDefined, isHTMLElement } from '../../shared/utils';
import { TInputValidation, TInputValue } from '../input/bq-input.types';

@Component({
  tag: 'bq-select',
  styleUrl: './scss/bq-select.scss',
  shadow: true,
})
export class BqSelect {
  // Own Properties
  // ====================

  private helperTextElem?: HTMLElement;
  private inputElem?: HTMLInputElement;
  private labelElem?: HTMLElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

  private fallbackInputId = 'input';

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSelectElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasHelperText = false;
  @State() hasLabel = false;
  @State() hasPrefix = false;
  @State() hasSuffix = false;
  @State() hasValue = false;

  // Public Property API
  // ========================

  /** If true, the Select input will be focused on component render */
  @Prop({ reflect: true }) autofocus: boolean;

  /** The clear button aria label */
  @Prop({ reflect: true }) clearButtonLabel? = 'Clear value';

  /**
   * Indicates whether the Select input is disabled or not.
   * If `true`, the Select is disabled and cannot be interacted with.
   */
  @Prop({ mutable: true }) disabled?: boolean = false;

  /** If true, the clear button won't be displayed */
  @Prop({ reflect: true }) disableClear? = false;

  /** The ID of the form that the Select input belongs to. */
  @Prop({ reflect: true }) form?: string;

  /** The Select input name. */
  @Prop({ reflect: true }) name!: string;

  /** The Select input placeholder text value */
  @Prop({ reflect: true }) placeholder?: string;

  /** If true, the Select input cannot be modified. */
  @Prop({ reflect: true }) readonly?: boolean;

  /** Indicates whether or not the Select input is required to be filled out before submitting the form. */
  @Prop({ reflect: true }) required?: boolean;

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

  /** The select input value, it can be used to reset the field to a previous value */
  @Prop({ reflect: true, mutable: true }) value: TInputValue;

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

  /** Callback handler emitted when the Select input loses focus */
  @Event() bqBlur!: EventEmitter<HTMLBqSelectElement>;

  /** Callback handler emitted when the selected value has changed and the Select input loses focus */
  @Event() bqChange!: EventEmitter<{ value: string | number | string[]; el: HTMLBqSelectElement }>;

  /** Callback handler emitted when the selected value has been cleared */
  @Event() bqClear!: EventEmitter<HTMLBqSelectElement>;

  /** Callback handler emitted when the Select input has received focus */
  @Event() bqFocus!: EventEmitter<HTMLBqSelectElement>;

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
    this.value = ev.target.value;

    this.bqChange.emit({ value: this.value, el: this.el });
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

  private handleHelperTextSlotChange = () => {
    this.hasHelperText = hasSlotContent(this.helperTextElem);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-select" part="base">
        {/* Label */}
        <label
          class={{ 'bq-select--label': true, hidden: !this.hasLabel }}
          htmlFor={this.name || this.fallbackInputId}
          ref={(labelElem) => (this.labelElem = labelElem)}
          part="label"
        >
          <slot name="label" onSlotchange={this.handleLabelSlotChange} />
        </label>
        {/* Input control group */}
        <div
          class={{
            'bq-select--control': true,
            [`validation-${this.validationStatus}`]: true,
            disabled: this.disabled,
          }}
          part="control"
        >
          {/* Prefix */}
          <span
            class={{ 'bq-select--control__prefix': true, hidden: !this.hasPrefix }}
            ref={(spanElem) => (this.prefixElem = spanElem)}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.handlePrefixSlotChange} />
          </span>
          {/* HTML Input */}
          <input
            id={this.name || this.fallbackInputId}
            class="bq-select--control__input"
            aria-disabled={this.disabled ? 'true' : 'false'}
            autoFocus={this.autofocus}
            disabled={this.disabled}
            form={this.form}
            name={this.name}
            placeholder={this.placeholder}
            ref={(inputElem) => (this.inputElem = inputElem)}
            readOnly={true}
            required={this.required}
            type="text"
            value={this.value}
            part="input"
            // Events
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
          />
          {/* Clear Button */}
          {this.hasValue && !this.disabled && !this.disableClear && (
            // The clear button will be visible as long as the input has a value
            // and the parent group is hovered or has focus-within
            <bq-button
              class="bq-select--control__clear ms-[--bq-select--gap] hidden"
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
            class={{ 'bq-select--control__suffix': true }}
            ref={(spanElem) => (this.suffixElem = spanElem)}
            part="suffix"
          >
            <slot name="suffix" onSlotchange={this.handleSuffixSlotChange}>
              <bq-icon name="caret-down" class="flex" />
            </slot>
          </span>
        </div>
        {/* Helper text */}
        <div
          class={{ [`bq-select--helper-text validation-${this.validationStatus}`]: true, hidden: !this.hasHelperText }}
          ref={(divElem) => (this.helperTextElem = divElem)}
          part="helper-text"
        >
          <slot name="helper-text" onSlotchange={this.handleHelperTextSlotChange} />
        </div>
      </div>
    );
  }
}
