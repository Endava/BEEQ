import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State } from '@stencil/core';

import { TSwitchInnerLabel, TSwitchJustifyContent } from './bq-switch.types';
import { getTextContent, isNil } from '../../shared/utils';

/**
 * Toggle switches are digital on/off switches.
 * They should provide immediate results, giving users the freedom to control their preferences as needed.
 *
 * @example How to use it
 * ```html
 * <bq-switch inner-label="default" justify-content="start" name="bq-switch" value="Switch value">
 *   Toggle me!
 * </bq-switch>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/49d9c9-switch
 * @status stable
 *
 * @attr {boolean} background-on-hover - If `true`, a background will be displayed on hover
 * @attr {boolean} checked - It indicates whether if the switch is `ON` by default (when the page loads)
 * @attr {boolean} disabled - If `true`, the switch control will be disabled and no interaction will be allowed
 * @attr {boolean} full-width - If `true`, the component will take the full width space available on the parent container
 * @attr {"default" | "icon"} inner-label - It indicates how to to display the on/off marks inside the control, with icons or none (default)
 * @attr {"start" | "end" | "center" | "space-between" | "space-around" | "space-evenly"} justify-content - It defines how to distribute the space between and around the control and the label text
 * @attr {string} name - Name of the form control. Submitted with the form as part of a name/value pair
 * @attr {boolean} required - If `true`, it will indicate that the user must switch `ON` the element before the owning form can be submitted
 * @attr {boolean} reverse-order - If `true`, the order of the control and the label text will be changed
 * @attr {string} value - The input control's value, submitted as a name/value pair with form data
 *
 * @event bqChange - Handler to be called when the switch state changes
 * @event bqFocus - Handler to be called when the switch gets focus
 * @event bqBlur - Handler to be called when the switch loses focus
 *
 * @slot - The switch label text
 *
 * @part base - HTML `<label>` root container
 * @part control - HTML `<div>` element for the custom control
 * @part dot - HTML `<div>` element that acts as changing dot
 * @part icon-off - HTMLBqIcon `<pk-icon>` element used as the `OFF` mark inner label
 * @part icon-on - HTMLBqIcon `<pk-icon>` element used as the `ON` mark inner label
 * @part label - HTML `<span>` element that holds the label text
 *
 * @cssprop --bq-switch--height - Switch height
 * @cssprop --bq-switch--justify-content - Switch justify content
 * @cssprop --bq-switch--width - Switch width
 * @cssprop --bq-switch--dot-size - Switch dot size
 */
@Component({
  tag: 'bq-switch',
  styleUrl: './scss/bq-switch.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqSwitch {
  // Own Properties
  // ====================

  private labelElem: HTMLSpanElement;
  private inputElem: HTMLInputElement;
  private prevCheckedValue: boolean;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSwitchElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasLabel = false;

  // Public Property API
  // ========================

  /** If true, a background will be displayed on hover */
  @Prop({ reflect: true }) backgroundOnHover?: boolean = false;

  /** It indicates whether if the switch is `ON` by default (when the page loads) */
  @Prop({ reflect: true, mutable: true }) checked?: boolean = false;

  /** If true, the switch control will be disabled and no interaction will be allowed */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** If true, the component will take the full width space available on the parent container */
  @Prop({ reflect: true }) fullWidth?: boolean = false;

  /** It indicates how to to display the on/off marks inside the control, with icons or none (default)  */
  @Prop({ reflect: true }) innerLabel?: TSwitchInnerLabel = 'default';

  /**
   * It defines how to distribute the space between and around the control and the label text
   * (https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)
   */
  @Prop({ reflect: true }) justifyContent?: TSwitchJustifyContent = 'start';

  /** Name of the form control. Submitted with the form as part of a name/value pair */
  @Prop({ reflect: true }) name!: string;

  /** If `true`, it will indicate that the user must switch `ON` the element before the owning form can be submitted */
  @Prop({ reflect: true }) required?: boolean = false;

  /** If true, the order of the control and the label text will be changed  */
  @Prop({ reflect: true }) reverseOrder?: boolean = false;

  /** The input control's value, submitted as a name/value pair with form data. */
  @Prop({ reflect: true }) value?: string;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the switch state changes */
  @Event() bqChange: EventEmitter<{ checked: boolean }>;

  /** Handler to be called when the switch gets focus */
  @Event() bqFocus: EventEmitter<HTMLBqSwitchElement>;

  /** Handler to be called when the switch loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqSwitchElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.prevCheckedValue = this.checked;
  }

  componentDidLoad() {
    this.handleSlotChange();
  }

  componentDidUpdate() {
    /**
     * We need to trigger the `bqChange` immediately after the first update happens
     * so the checked attribute get applied, otherwise, a delay will happen
     * between the event emits and when the checked attribute value gets reflected in the element host.
     */
    if (this.checked !== this.prevCheckedValue) {
      this.bqChange.emit({ checked: this.checked });
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
  };

  private handleOnFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleOnBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handleSlotChange = () => {
    const slot = this.labelElem?.querySelector('slot') ?? null;
    if (isNil(slot)) return;

    this.hasLabel = !!getTextContent(slot, { recurse: true }).length;
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const hostStyle = {
      ...(this.justifyContent && { '--bq-switch--justify-content': this.justifyContent }),
    };

    const labelCssClasses = {
      'has-background': this.backgroundOnHover,
      'is-checked': this.checked,
      'is-disabled': this.disabled,
      'flex-row-reverse': this.reverseOrder,
    };

    return (
      <Host class={{ 'full-width': this.fullWidth }} style={hostStyle}>
        <label class={{ 'bq-switch group': true, ...labelCssClasses }} part="base">
          {/* Hidden native HTML input */}
          <input
            class="bq-switch--input peer sr-only peer-checked:invisible"
            type="checkbox"
            checked={this.checked}
            disabled={this.disabled}
            required={this.required}
            name={!isNil(this.name) ? this.name : undefined}
            aria-label={this.name}
            aria-checked={this.checked ? 'true' : 'false'}
            aria-disabled={this.disabled ? 'true' : 'false'}
            onBlur={this.handleOnBlur}
            onChange={this.handleChange}
            onFocus={this.handleOnFocus}
            ref={(input) => (this.inputElem = input)}
            role="switch"
            value={this.value}
          />
          {/* Control */}
          <div
            class="bq-switch--control relative box-border flex justify-between rounded-full bg-ui-tertiary transition duration-300 bs-[--bq-switch--height] is-[--bq-switch--width] p-b-xs2 p-i-xs2 group-[&.is-checked]:bg-ui-brand"
            part="control"
          >
            {this.innerLabel === 'icon' && (
              <bq-icon
                class="bq-switch--control__icon on"
                name="check"
                color="icon--alt"
                role="img"
                title="On"
                part="icon-on"
              />
            )}
            {this.innerLabel === 'icon' && (
              <bq-icon
                class="bq-switch--control__icon off"
                name="x"
                color="icon--inverse"
                role="img"
                title="Off"
                part="icon-off"
              />
            )}
            {/* Dot */}
            <div class="bq-switch--control__dot" part="dot" />
          </div>
          {/* Label */}
          <span
            class={{
              'bq-switch--label text-m font-medium leading-regular text-primary transition-colors duration-300': true,
              'ms-s': this.hasLabel && !this.reverseOrder,
              'me-s': this.hasLabel && this.reverseOrder,
            }}
            ref={(span) => (this.labelElem = span)}
            part="label"
          >
            <slot onSlotchange={this.handleSlotChange} />
          </span>
        </label>
      </Host>
    );
  }
}
