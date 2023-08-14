import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { getTextContent, hasSlotContent, isDefined } from '../../shared/utils';
import { TInputValidation, TInputValue } from '../input/bq-input.types';

/**
 * @part base - The component's base wrapper.
 * @part button - The native HTML button used under the hood in the clear button.
 * @part clear-btn - The clear button.
 * @part control - The input control wrapper.
 * @part helper-text - The helper text slot container.
 * @part input - The native HTML input element used under the hood.
 * @part label - The label slot container.
 * @part panel - The select panel container
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 */
@Component({
  tag: 'bq-select',
  styleUrl: './scss/bq-select.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqSelect {
  // Own Properties
  // ====================

  private helperTextElem?: HTMLElement;
  private inputElem?: HTMLInputElement;
  private labelElem?: HTMLElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

  private fallbackInputId = 'select';

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSelectElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() displayValue?: string;
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

  /** If true, the Select panel will be visible. */
  @Prop({ reflect: true }) open?: boolean = false;

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
    this.syncItemsFromValue();

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

  /** Callback handler emitted when the selected value has been cleared */
  @Event() bqClear!: EventEmitter<HTMLBqSelectElement>;

  /** Callback handler emitted when the Select input has received focus */
  @Event() bqFocus!: EventEmitter<HTMLBqSelectElement>;

  /** Callback handler emitted when the selected value has changed */
  @Event() bqSelect!: EventEmitter<{ value: string | number | string[]; item: HTMLBqOptionElement }>;

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

  private handleClearClick = (ev: CustomEvent) => {
    if (this.disabled) return;

    this.value = '';
    this.displayValue = '';

    this.bqClear.emit(this.el);
    this.inputElem.focus();

    ev.stopPropagation();
  };

  private handleSelect = (ev: CustomEvent<{ value: TInputValue; item: HTMLBqOptionElement }>) => {
    if (this.disabled) return;

    this.value = ev.detail.value;
    this.inputElem.focus();
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

  private syncItemsFromValue = () => {
    const items = this.options;
    if (!items.length) return;

    // Sync selected state
    this.options.forEach((item: HTMLBqOptionElement) => (item.selected = item.value === this.value));
    // Sync display label
    const checkedItem = items.filter((item) => item.value === this.value)[0];
    this.displayValue = checkedItem ? this.getOptionLabel(checkedItem) : '';
  };

  private getOptionLabel = (item: HTMLBqOptionElement) => {
    const slot = item.shadowRoot.querySelector('slot:not([name])');
    if (!slot) return;

    return getTextContent(slot as HTMLSlotElement);
  };

  private get options() {
    return Array.from(this.el.querySelectorAll('bq-option'));
  }

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
        {/* Select dropdown */}
        <bq-dropdown class="bq-select__dropdown w-full" sameWidth exportparts="panel">
          {/* Input control group */}
          <div
            class={{
              'bq-select--control': true,
              [`validation-${this.validationStatus}`]: true,
              disabled: this.disabled,
            }}
            part="control"
            slot="trigger"
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
              autoComplete="off"
              autoCapitalize="off"
              autoFocus={this.autofocus}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-controls="listbox"
              aria-expanded={this.open}
              aria-haspopup="listbox"
              disabled={this.disabled}
              form={this.form}
              name={this.name}
              placeholder={this.placeholder}
              ref={(inputElem) => (this.inputElem = inputElem)}
              readOnly={true}
              required={this.required}
              spellcheck={false}
              type="text"
              value={this.displayValue}
              part="input"
              // Events
              onBlur={this.handleBlur}
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
          <bq-option-list aria-expanded={this.open} role="listbox" onBqSelect={this.handleSelect} tabIndex={-1}>
            <slot />
          </bq-option-list>
        </bq-dropdown>
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
