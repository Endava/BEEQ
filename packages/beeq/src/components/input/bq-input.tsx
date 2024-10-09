import { AttachInternals, Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { TInputType, TInputValidation, TInputValue } from './bq-input.types';
import { debounce, hasSlotContent, isDefined, isHTMLElement, isNil, TDebounce } from '../../shared/utils';

/**
 * @part base - The component's base wrapper.
 * @part button - The native HTML button used under the hood in the clear button.
 * @part clear-btn - The clear button.
 * @part control - The input control wrapper.
 * @part helper-text - The helper text slot container.
 * @part label - The label slot container.
 * @part input - The native HTML input element used under the hood.
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 */
@Component({
  tag: 'bq-input',
  styleUrl: './scss/bq-input.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqInput {
  // Own Properties
  // ====================

  private helperTextElem?: HTMLElement;
  private inputElem?: HTMLInputElement;
  private labelElem?: HTMLElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

  private debounceBqInput: TDebounce<void>;
  private fallbackInputId = 'input';

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqInputElement;
  @AttachInternals() internals!: ElementInternals;

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

  /**
   * Controls whether or not the input field should be capitalized and how.
   * Possible values are 'off', 'none', 'on', 'sentences', 'words', and 'characters'.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize
   */
  @Prop({ reflect: true }) autocapitalize: string = 'off';

  /**
   * Specifies whether or not the input field should have autocomplete enabled.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values
   */
  @Prop({ reflect: true }) autocomplete: string = 'off';

  /**
   * Controls whether or not the input field should have autocorrect enabled.
   * Possible values are 'on' and 'off'.
   */
  @Prop({ reflect: true }) autocorrect: 'on' | 'off' = 'off';

  /** If true, the input will be focused on component render */
  @Prop({ reflect: true }) autofocus: boolean;

  /** The clear button aria label */
  @Prop({ reflect: true }) clearButtonLabel? = 'Clear value';

  /**
   * The amount of time, in milliseconds, to wait before emitting the `bqInput` event after the input value changes.
   * A value of 0 means no debouncing will occur.
   */
  @Prop({ reflect: true, mutable: true }) debounceTime? = 0;

  /**
   * Indicates whether the input is disabled or not.
   * If `true`, the input is disabled and cannot be interacted with.
   */
  @Prop({ mutable: true }) disabled?: boolean = false;

  /** If true, the clear button won't be displayed */
  @Prop({ reflect: true }) disableClear? = false;

  /** The ID of the form that the input field belongs to. */
  @Prop({ reflect: true }) form?: string;

  /**
   * The inputmode attribute specifies what kind of input mechanism would be most helpful for users entering content into the input field.
   * This allows a browser to display an appropriate virtual keyboard while editing.
   * Possible values are 'none', 'text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url', and 'date'.
   */
  @Prop() inputmode?: string;

  /**
   * The maximum value that the input field can accept.
   * Only applies to date and number input types.
   */
  @Prop({ reflect: true }) max?: number | string;

  /** The maximum number of characters that the input field can accept. */
  @Prop({ reflect: true }) maxlength: number;

  /**
   * The minimum value that the input field can accept.
   * Only applies to date and number input types.
   */
  @Prop({ reflect: true }) min?: number | string;

  /** The minimum number of characters that the input field can accept. */
  @Prop({ reflect: true }) minlength: number;

  /** The input field name. */
  @Prop({ reflect: true }) name!: string;

  /**
   * Specifies a regular expression the form control's value should match.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern
   */
  @Prop({ reflect: true }) pattern?: string;

  /** The input placeholder text value */
  @Prop({ reflect: true }) placeholder?: string;

  /** If true, the input field cannot be modified. */
  @Prop({ reflect: true }) readonly?: boolean;

  /** Indicates whether or not the input field is required to be filled out before submitting the form. */
  @Prop({ reflect: true }) required?: boolean;

  /**
   * A number that specifies the granularity that the value must adhere to.
   * Valid for date, month, week, time, datetime-local, number, and range.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step
   */
  @Prop({ reflect: true }) step: number | 'any';

  /**
   * The type attribute specifies the type of input field to display.
   * Possible values are 'text', 'password', 'email', 'number', 'tel', 'search', 'url', and more.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types
   */
  @Prop({ reflect: true }) type: TInputType = 'text';

  /**
   * The validation status of the input.
   *
   * @remarks
   * This property is used to indicate the validation status of the input. It can be set to one of the following values:
   * - `'none'`: No validation status is set.
   * - `'error'`: The input has a validation error.
   * - `'warning'`: The input has a validation warning.
   * - `'success'`: The input has passed validation.
   */
  @Prop({ reflect: true }) validationStatus: TInputValidation = 'none';

  /** The input value, it can be used to reset the input to a previous value */
  @Prop({ reflect: true, mutable: true }) value: TInputValue;

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValueChange() {
    if (Array.isArray(this.value)) {
      this.hasValue = this.value.some((val) => val.length > 0);
      this.internals.setFormValue(this.value.join(','));
      return;
    }

    this.hasValue = isDefined(this.value);
    this.internals.setFormValue(`${this.value}`);
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

  componentWillLoad() {
    this.handleValueChange();
  }

  formResetCallback() {
    if (isNil(this.value)) return;

    this.handleClear();
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

  private handleInput = (ev: Event) => {
    if (this.disabled) return;

    this.debounceBqInput?.cancel();

    if (!isHTMLElement(ev.target, 'input')) return;
    this.value = this.type === 'number' ? Number(ev.target.value) : ev.target.value;
    this.internals.setFormValue(`${this.value}`);

    this.debounceBqInput = debounce(() => {
      this.bqInput.emit({ value: this.value, el: this.el });
    }, this.debounceTime);
    this.debounceBqInput();
  };

  private handleChange = (ev: Event) => {
    if (this.disabled) return;

    if (!isHTMLElement(ev.target, 'input')) return;
    this.value = this.type === 'number' ? Number(ev.target.value) : ev.target.value;
    this.internals.setFormValue(`${this.value}`);

    this.bqChange.emit({ value: this.value, el: this.el });
  };

  private handleClear = () => {
    if (this.disabled) return;

    const { inputElem, internals } = this;

    // Clear input element value
    inputElem.value = '';
    this.value = inputElem.value;

    // Update associated form control value
    internals.setFormValue(undefined);
  };

  private handleClearClick = (ev: CustomEvent) => {
    ev.stopPropagation();
    this.handleClear();

    const { bqClear, bqChange, bqInput, el, inputElem } = this;
    // Emit events
    bqClear.emit(el);
    bqInput.emit({ value: this.value, el });
    bqChange.emit({ value: this.value, el });
    // Refocus input element
    inputElem.focus();
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
      <div class="bq-input" part="base">
        {/* Label */}
        <label
          class={{ 'bq-input--label': true, '!hidden': !this.hasLabel }}
          aria-label={this.name || this.fallbackInputId}
          htmlFor={this.name || this.fallbackInputId}
          ref={(labelElem) => (this.labelElem = labelElem)}
          part="label"
        >
          <slot name="label" onSlotchange={this.handleLabelSlotChange} />
        </label>
        {/* Input control group */}
        <div
          class={{
            'bq-input--control': true,
            [`validation-${this.validationStatus}`]: true,
            disabled: this.disabled,
          }}
          part="control"
        >
          {/* Prefix */}
          <span
            class={{ 'bq-input--control__prefix': true, '!hidden': !this.hasPrefix }}
            ref={(spanElem) => (this.prefixElem = spanElem)}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.handlePrefixSlotChange} />
          </span>
          {/* HTML Input */}
          <input
            id={this.name || this.fallbackInputId}
            class="bq-input--control__input"
            aria-disabled={this.disabled ? 'true' : 'false'}
            autoCapitalize={this.autocapitalize}
            autoComplete={this.autocomplete}
            autoCorrect={this.autocorrect}
            disabled={this.disabled}
            form={this.form}
            inputMode={this.inputmode}
            max={this.max}
            maxLength={this.maxlength}
            min={this.min}
            minLength={this.minlength}
            name={this.name}
            pattern={this.pattern}
            placeholder={this.placeholder}
            ref={(inputElem) => (this.inputElem = inputElem)}
            readOnly={this.readonly}
            required={this.required}
            step={this.step}
            type={this.type}
            value={this.value}
            part="input"
            // Events
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onInput={this.handleInput}
          />
          {/* Clear Button */}
          {this.hasValue && !this.disabled && !this.disableClear && (
            // The clear button will be visible as long as the input has a value
            // and the parent group is hovered or has focus-within
            <bq-button
              class="bq-input--control__clear ms-[--bq-input--gap] hidden"
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
            class={{ 'bq-input--control__suffix': true, '!hidden': !this.hasSuffix }}
            ref={(spanElem) => (this.suffixElem = spanElem)}
            part="suffix"
          >
            <slot name="suffix" onSlotchange={this.handleSuffixSlotChange} />
          </span>
        </div>
        {/* Helper text */}
        <div
          class={{
            [`bq-input--helper-text validation-${this.validationStatus}`]: true,
            '!hidden': !this.hasHelperText,
          }}
          ref={(divElem) => (this.helperTextElem = divElem)}
          part="helper-text"
        >
          <slot name="helper-text" onSlotchange={this.handleHelperTextSlotChange} />
        </div>
      </div>
    );
  }
}
