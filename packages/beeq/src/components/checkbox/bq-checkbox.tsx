import { AttachInternals, Component, Element, Event, EventEmitter, h, Method, Prop, Watch } from '@stencil/core';

import { isNil } from '../../shared/utils';

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
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqCheckbox {
  // Own Properties
  // ====================

  private inputElem: HTMLInputElement;
  private prevCheckedValue: boolean;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqCheckboxElement;
  @AttachInternals() internals!: ElementInternals;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true checkbox displays background on hover */
  @Prop({ reflect: true }) backgroundOnHover? = false;

  /** The form ID that the checkbox is associated with */
  @Prop({ reflect: true }) formId?: string;

  /** The native form validation message */
  @Prop({ mutable: true }) formValidationMessage?: string;

  /** If true checkbox is checked */
  @Prop({ reflect: true, mutable: true }) checked?: boolean;

  /** If true checkbox is disabled */
  @Prop({ reflect: true }) disabled? = false;

  /** A state that is neither checked nor unchecked */
  @Prop({ reflect: true, mutable: true }) indeterminate? = false;

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

  @Watch('required')
  handleRequiredPropChange() {
    this.updateFormValidity();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the checkbox state changes */
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

  formAssociatedCallback() {
    this.setFormValue(this.checked);
    this.updateFormValidity();
  }

  formResetCallback() {
    this.clearSelection();
    // Reset the form value and validity state
    this.internals.setFormValue(undefined);
    this.internals.setValidity({});
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

  private setFormValue = (checked: boolean) => {
    const value = checked ? 'on' : undefined;
    // Set form value based on the checked state
    // Here we also pass the state of the checkbox (2nd argument) as the state of the form control
    // Details: https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/setFormValue
    this.internals?.setFormValue(value, `${this.checked}`);
  };

  private updateFormValidity = () => {
    const { formValidationMessage, internals, required, checked, inputElem } = this;
    // Clear the validity state
    internals?.states.clear();

    if (!(required && !checked)) {
      // If the checkbox is not required or is checked, set the validity state to valid
      internals?.states.add('valid');
      internals?.setValidity({});
      return;
    }

    // Set validity state based on the required property and checked state
    internals?.states.add('invalid');
    internals?.setValidity({ valueMissing: true }, formValidationMessage, inputElem);
  };

  private clearSelection = () => {
    this.checked = false;
    this.indeterminate = false;
  };

  private handleChange = () => {
    this.checked = !this.checked;
    this.indeterminate = false;

    this.setFormValue(this.checked);
    this.updateFormValidity();
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
          'bq-checkbox group': true,
          'is-checked': this.checked,
          'is-indeterminate': this.indeterminate,
          'is-disabled !cursor-not-allowed': this.disabled,
          'has-background': this.backgroundOnHover,
        }}
        aria-label={this.name || 'checkbox'}
        part="base"
      >
        <div
          class="bq-checkbox__control relative box-border flex items-center justify-center bs-[--bq-checkbox--size] is-[--bq-checkbox--size] p-b-xs3 p-i-xs3"
          part="control"
        >
          <input
            type="checkbox"
            class="bq-checkbox__input pointer-events-none absolute opacity-0 p-b-0 p-i-0 m-b-0 m-i-0"
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
            class="bq-checkbox__checkbox relative box-border flex items-center justify-center bs-full is-[--bq-checkbox--size]"
            part="checkbox"
          >
            {/*
              We could move these SVGs to separated functional components, but it seems there's a weird issue with
              Stencil and pure SVG components: https://stencil-worldwide.slack.com/archives/C79EANFL7/p1663779385026389
             */}
            {this.checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute text-neutral-white bs-full is-full"
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
                class="absolute text-neutral-white bs-full is-full"
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
        <span
          class="bq-checkbox__label ps-xs text-start font-medium leading-regular text-text-primary group-hover-[&:not(.is-disabled)]:text-hover-text-primary group-[.is-disabled]:opacity-60"
          part="label"
        >
          <slot />
        </span>
      </label>
    );
  }
}
