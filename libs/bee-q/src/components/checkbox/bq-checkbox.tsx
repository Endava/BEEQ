import { h, Component, Prop, Watch, Event, EventEmitter, Element, Method } from '@stencil/core';
import { isNil } from 'libs/bee-q/src/shared/utils';

/**
 * @part base - The component's internal wrapper of the checkbox component.
 * @part control - The container `<div>` element that holds the custom checkbox.
 * @part input - The native HTML `<input type="checkbox">` used under the hood.
 * @part checkbox - The `<span>` element that renders the custom checked/indeterminate state.
 * @part label - The `<span>` element that holds the text content.
 */
@Component({
  tag: 'bq-checkbox',
  styleUrl: './scss/bq-checkbox.scss',
  shadow: true,
})
export class BqCheckbox {
  // Own Properties
  // ====================

  private inputElem: HTMLInputElement;
  private prevCheckedValue: boolean;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqCheckboxElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true checkbox displays background on hover */
  @Prop({ reflect: true }) backgroundOnHover? = false;

  /** The form ID that the checkbox is associated with */
  @Prop({ reflect: true }) formId?: string;

  /** If true checkbox is checked */
  @Prop({ reflect: true, mutable: true }) checked?: boolean;

  /** If true checkbox is disabled */
  @Prop({ reflect: true }) disabled? = false;

  /** A state that is neither checked nor unchecked */
  @Prop({ reflect: true, mutable: true }) indeterminate: false;

  /** Name of the HTML input form control. Submitted with the form as part of a name/value pair.  */
  @Prop({ reflect: true }) name!: string;

  /** If `true`, it will indicate that the user must specify a value for the checkbox before the owning form can be submitted */
  @Prop({ reflect: true }) required?: boolean;

  /** A string representing the value of the checkbox. Primarily used to differentiate a list of related checkboxes that have the same name.  */
  @Prop({ reflect: true }) value!: string;

  // Prop lifecycle events
  // =======================

  @Watch('indeterminate')
  handleIndeterminatePropChange() {
    if (!this.inputElem) return;

    this.inputElem.indeterminate = this.indeterminate;
    if (this.indeterminate) {
      this.checked = false;
    }
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the chebkbox state changes */
  @Event() bqChange: EventEmitter<{ checked: boolean }>;

  /** Handler to be called when the checkbox gets focus */
  @Event() bqFocus: EventEmitter<HTMLBqCheckboxElement>;

  /** Handler to be called when the checkbox loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqCheckboxElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.prevCheckedValue = this.checked;
  }

  componentDidUpdate() {
    /**
     * We need to trigger the `bqChange` immediately after the first update happens
     * so the checked attribute get applied, otherwise, a delay will happen
     * between the event emits and when the checked attribute value gets reflected in the element host.
     */
    if (this.checked !== this.prevCheckedValue) {
      if (!this.indeterminate) {
        this.bqChange.emit({ checked: this.checked });
      }
      this.prevCheckedValue = this.checked;
    }
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
   * Simulate a click event on the native `<input>` HTML element used under the hood.
   * Use this method instead of the global `element.click()`.
   */
  @Method()
  async vClick() {
    this.inputElem?.click();
  }

  /**
   * Sets focus on the native `<input>` HTML element used under the hood.
   * Use this method instead of the global `element.focus()`.
   */
  @Method()
  async vFocus() {
    this.inputElem?.focus();
  }

  /**
   * Remove focus from the native `<input>` HTML element used under the hood.
   * Use this method instead of the global `element.blur()`.
   */
  @Method()
  async vBlur() {
    this.inputElem?.blur();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleChange = () => {
    this.checked = !this.checked;
    this.inputElem.setAttribute('checked', `${this.checked}`);
    this.indeterminate = false;
  };

  private handleOnFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleOnBlur = () => {
    this.bqBlur.emit(this.el);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <label
        class={{
          'bq-checkbox': true,
          'is-checked': this.checked,
          'is-indeterminate': this.indeterminate,
          'is-disabled': this.disabled,
          'has-background': this.backgroundOnHover,
        }}
        part="base"
      >
        <div
          class="bq-checkbox__control relative box-border flex h-[var(--bq-checkbox--size)] w-[var(--bq-checkbox--size)] items-center justify-center p-[2px]"
          part="control"
        >
          <input
            type="checkbox"
            class="bq-checkbox__input pointer-events-none absolute m-0 p-0 opacity-0"
            name={!isNil(this.name) ? this.name : undefined}
            checked={this.checked}
            disabled={this.disabled}
            indeterminate={this.indeterminate}
            form={this.formId}
            required={this.required}
            value={this.value}
            aria-checked={this.checked ? 'true' : 'false'}
            aria-disabled={this.disabled ? 'true' : 'false'}
            ref={(input: HTMLInputElement) => (this.inputElem = input)}
            onBlur={this.handleOnBlur}
            onChange={this.handleChange}
            onFocus={this.handleOnFocus}
            part="input"
            tabindex="0"
          />
          <span
            class="bq-checkbox__checkbox relative box-border flex h-full w-[var(--bq-checkbox--size)] items-center justify-center"
            part="checkbox"
          >
            {/* 
              We could move these SVGs to separated functional components, but it seems there's a weird issue with
              Stencil and pure SVG components: https://stencil-worldwide.slack.com/archives/C79EANFL7/p1663779385026389
             */}
            {this.checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute h-full w-full text-text-inverse"
                viewBox="0 0 256 256"
              >
                <path fill="none" d="M0 0h256v256H0z" />
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                  d="M216 72 104 184l-56-56"
                />
              </svg>
            )}
            {!this.checked && this.indeterminate && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute h-full w-full text-text-inverse"
                viewBox="0 0 256 256"
                fill="currentColor"
              >
                <path fill="none" d="M0 0h256v256H0z" />
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                  d="M40 128h176"
                />
              </svg>
            )}
          </span>
        </div>
        <span class="bq-checkbox__label ml-1 font-inter font-medium leading-large text-text-primary" part="label">
          <slot />
        </span>
      </label>
    );
  }
}
