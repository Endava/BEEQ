import { Component, Element, Event, h, Method, Prop } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

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

  /** If true radio input is checked */
  @Prop({ reflect: true, mutable: true }) checked?: boolean;

  /** If true radio input is disabled */
  @Prop({ reflect: true }) disabled? = false;

  /** If true radio displays background on hover */
  @Prop({ reflect: true }) backgroundOnHover? = false;

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
  @Event() bqClick: EventEmitter<HTMLBqRadioElement>;

  /** Handler to be called when the radio gets focus */
  @Event() bqFocus: EventEmitter<HTMLBqRadioElement>;

  /** Handler to be called when the radio loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqRadioElement>;

  /** Handler to be called when the radio key is pressed */
  @Event() bqKeyDown: EventEmitter<KeyboardEvent>;

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

  private handleClick = () => {
    this.checked = true;
    this.bqClick.emit(this.el);
  };

  private handleOnFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleOnBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handleOnKeyDown = (event: KeyboardEvent) => {
    this.bqKeyDown.emit(event);
  };

  private get tabindex(): string {
    // NOTE: this.checked is undefined when is not part of bq-radio-group
    return `${-1 + +(this.checked ?? 1)}`;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <label
        class={{
          'bq-radio group': true,
          'is-disabled !cursor-not-allowed': this.disabled,
          'is-checked': this.checked,
          'has-background': this.backgroundOnHover,
        }}
        part="base"
      >
        <div class="bq-radio__control">
          <input
            class="bq-radio__input"
            ref={(element) => (this.inputElement = element)}
            type="radio"
            form={this.formId}
            name={this.name}
            value={this.value}
            required={this.required}
            disabled={this.disabled}
            onBlur={this.handleOnBlur}
            onClick={this.handleClick}
            onFocus={this.handleOnFocus}
            onKeyDown={this.handleOnKeyDown}
            aria-checked={this.checked ? 'true' : 'false'}
            aria-disabled={this.disabled ? 'true' : 'false'}
            aria-labelledby="bq-radio__label"
            tabindex={this.tabindex}
            part="input"
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
    );
  }
}
