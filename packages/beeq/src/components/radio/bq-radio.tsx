import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, h, Method, Prop } from '@stencil/core';

/**
 * The radio button is a user interface element that allows users to select a single option.
 *
 * @example How to use it
 * ```html
 * <bq-radio value="option1">Radio option 1</bq-radio>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/9718e1-radio-button/b/09d7b1
 * @status stable
 *
 * @attr {boolean} background-on-hover - If `true`, the radio displays background on hover
 * @attr {boolean} checked - If `true` radio input is checked
 * @attr {boolean} disabled - If `true` radio input is disabled
 * @attr {string} form-id - The form ID that the radio input is associated with
 * @attr {string} name - Name of the HTML input form control. Submitted with the form as part of a name/value pair
 * @attr {boolean} required - If `true`, it will indicate that the user must specify a value for the radio before the owning form can be submitted
 * @attr {boolean} value - A string representing the value of the radio
 *
 * @method vClick - Simulate a click event on the native `<input>` HTML element used under the hood
 * @method vFocus - Sets focus on the native `<input>` HTML element used under the hood
 * @method vBlur - Remove focus from the native `<input>` HTML element used under the hood
 * @method getNativeInput - Returns the native `<input>` HTML element used under the hood
 *
 * @event bqBlur - Handler to be called when the radio loses focus
 * @event bqClick - Handler to be called when the radio state changes
 * @event bqFocus - Handler to be called when the radio gets focused
 * @event bqKeyDown - The handler is to be called when the radio key is pressed
 *
 * @slot - The bq-radio item
 *
 * @part base - The component's internal wrapper of the radio component.
 * @part input - The native HTML `<input type="radio">` used under the hood.
 * @part radio - The component's internal wrapper of the radio component.
 * @part label - The `<span>` element that holds the text content.
 *
 * @cssprop --bq-radio--size - Radio size
 * @cssprop --bq-radio--border-width - Radio border width
 */
@Component({
  tag: 'bq-radio',
  styleUrl: './scss/bq-radio.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqRadio {
  // Own Properties
  // ====================
  private inputElement: HTMLInputElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqRadioElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true radio displays background on hover */
  @Prop({ reflect: true }) backgroundOnHover = false;

  /** If true radio input is checked */
  @Prop({ reflect: true, mutable: true }) checked = false;

  /** If true radio input is disabled */
  @Prop({ reflect: true }) disabled = false;

  /** @internal Used by the radio-group parent component to force the disabled state of the radio input */
  @Prop({ reflect: true }) forceDisabled = false;

  /** The form ID that the radio input is associated with */
  @Prop({ reflect: true }) formId?: string;

  /** Name of the HTML input form control. Submitted with the form as part of a name/value pair.  */
  @Prop({ reflect: true }) name!: string;

  /** If `true`, it will indicate that the user must specify a value for the radio before the owning form can be submitted */
  @Prop({ reflect: true }) required?: boolean;

  /** A string representing the value of the radio. */
  @Prop({ reflect: true }) value!: string;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the radio state changes */
  @Event() bqClick: EventEmitter<{ value: string; target: HTMLBqRadioElement }>;

  /** Handler to be called when the radio gets focus */
  @Event() bqFocus: EventEmitter<HTMLBqRadioElement>;

  /** Handler to be called when the radio loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqRadioElement>;

  /** Handler to be called when the radio key is pressed */
  @Event() bqKeyDown: EventEmitter<{ key: string; target: HTMLBqRadioElement }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  // Listeners
  // ==============

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /**
   * Simulate a click event on the native `<input>` HTML element used under the hood.
   * Use this method instead of the global `element.click()`.
   */
  @Method()
  async vClick() {
    this.inputElement?.click();
  }

  /**
   * Sets focus on the native `<input>` HTML element used under the hood.
   * Use this method instead of the global `element.focus()`.
   */
  @Method()
  async vFocus() {
    this.inputElement?.focus();
  }

  /**
   * Remove focus from the native `<input>` HTML element used under the hood.
   * Use this method instead of the global `element.blur()`.
   */
  @Method()
  async vBlur() {
    this.inputElement?.blur();
  }

  /**
   * Returns the native `<input>` HTML element used under the hood.
   */
  @Method()
  async getNativeInput() {
    return this.inputElement;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleClick = (event: MouseEvent) => {
    // Prevent the native input click default behavior
    event.preventDefault();
    if (this.disabled) return;

    // Emit the event without changing state
    // Let the radio-group handle all state management and event propagation
    const bqClickEvent = this.bqClick.emit({ value: this.value, target: this.el });
    if (bqClickEvent.defaultPrevented) {
      event.stopImmediatePropagation();
    }
  };

  private handleOnFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleOnBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handleOnKeyDown = (event: KeyboardEvent) => {
    this.bqKeyDown.emit({ key: event.key, target: this.el });
  };

  private get isDisabled() {
    return this.disabled || this.forceDisabled;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <label
          class={{
            'bq-radio group': true,
            'is-disabled': this.isDisabled,
            'is-checked': this.checked,
            'has-background': this.backgroundOnHover,
          }}
          part="base"
        >
          <div class="bq-radio__control">
            <input
              aria-checked={this.checked ? 'true' : 'false'}
              aria-disabled={this.isDisabled ? 'true' : 'false'}
              aria-labelledby="bq-radio__label"
              checked={this.checked}
              class="bq-radio__input"
              disabled={this.isDisabled}
              form={this.formId}
              name={this.name}
              onBlur={this.handleOnBlur}
              onClick={this.handleClick}
              onFocus={this.handleOnFocus}
              onKeyDown={this.handleOnKeyDown}
              part="input"
              ref={(element) => {
                this.inputElement = element;
              }}
              required={this.required}
              type="radio"
              value={this.value}
            />
            <div class="bq-radio__circle" part="radio">
              <div class="bq-radio__checked" />
            </div>
          </div>
          <span
            class="bq-radio__label group-hover:text-text-primary-hover group-[.is-disabled]:text-text-primary-disabled"
            part="label"
          >
            <slot id="bq-radio__label"></slot>
          </span>
        </label>
      </Host>
    );
  }
}
