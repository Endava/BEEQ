import type { EventEmitter } from '@stencil/core';
import { AttachInternals, Component, Element, Event, Host, Listen, Prop, State, Watch } from '@stencil/core';

import {
  debounce,
  getNextElement,
  isDefined,
  isEventTargetChildOfElement,
  isNil,
  type TDebounce,
  validatePropValue,
} from '../../shared/utils';
import type { TRadioGroupOrientation } from './bq-radio-group.types';
import { RADIO_GROUP_ORIENTATION } from './bq-radio-group.types';

const KEY_MAP = {
  ArrowDown: 'forward',
  ArrowRight: 'forward',
  ArrowUp: 'backward',
  ArrowLeft: 'backward',
} as const;

type Direction = (typeof KEY_MAP)[keyof typeof KEY_MAP];

/**
 * The radio group is a user interface component that groups radio buttons to enable a single selection within the group.
 *
 * @example How to use it
 * ```html
 * <bq-radio-group fieldset value="option1">
 *   <span slot="label">radio group</span>
 *   <bq-radio value="option1">Radio option 1</bq-radio>
 *   <bq-radio value="option2">Radio option 2</bq-radio>
 *   <bq-radio value="option3">Radio option 3</bq-radio>
 * </bq-radio-group>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/9718e1-radio-button/b/09d7b1
 * @status stable
 *
 * @attr {boolean} background-on-hover - If `true`, the radio displays background on hover
 * @attr {number} debounce-time - A number representing the delay time (in milliseconds) that bqChange event handler gets triggered once the value change
 * @attr {boolean} disabled - If `true` radio inputs are disabled
 * @attr {boolean} fieldset - If `true` displays fieldset
 * @attr {string} name - Name of the HTML input form control. Submitted with the form as part of a name/value pair
 * @attr {"horizontal" | "vertical"} orientation - The display orientation of the radio inputs
 * @attr {boolean} required - If `true`, the radio group is required
 * @attr {string} required-validation-message - The native form validation message when the radio group is required
 * @attr {string} value - The display orientation of the radio inputs
 *
 * @method vClick - Simulate a click event on the native `<input>` HTML element used under the hood
 * @method vFocus - Sets focus on the native `<input>` HTML element used under the hood
 * @method vBlur - Remove focus from the native `<input>` HTML element used under the hood
 *
 * @event bqChange - Handler to be called when the radio state changes
 *
 * @slot - The bq-radio items to group
 * @slot label - The label content of radio group
 *
 * @part base - The component's internal wrapper of the radio components.
 * @part label - The `<legend>` element that holds the text content.
 * @part group - The `<div>` element that holds the radio inputs.
 */
@Component({
  tag: 'bq-radio-group',
  styleUrl: './scss/bq-radio-group.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqRadioGroup {
  // Own Properties
  // ====================

  private initialValue?: string;
  private debouncedBqChange: TDebounce<{ value: string; target: HTMLBqRadioElement }>;
  private focusedBqRadio: HTMLBqRadioElement | null = null;
  private readonly radioElementsSet = new Set<HTMLBqRadioElement>();
  private cachedRadioElements: HTMLBqRadioElement[] = [];

  // Reference to host HTML element
  // ===================================

  @AttachInternals() internals!: ElementInternals;
  @Element() el!: HTMLBqRadioGroupElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() checkedRadio?: HTMLBqRadioElement;
  @State() tabIndex: '0' | '-1' = '0';

  // Public Property API
  // ========================

  /** If true, all radio inputs in the group will display a background on hover */
  @Prop({ reflect: true }) backgroundOnHover = false;

  /** A number representing the delay time (in milliseconds) that `bqChange` event handler gets triggered once the value change */
  @Prop({ reflect: true, mutable: true }) debounceTime = 0;

  /** If true radio inputs are disabled */
  @Prop({ reflect: true }) disabled = false;

  /** If true displays fieldset */
  @Prop({ reflect: true }) fieldset = false;

  /** Name of the HTML input form control. Submitted with the form as part of a name/value pair.  */
  @Prop({ reflect: true }) name!: string;

  /** The display orientation of the radio inputs */
  @Prop({ reflect: true, mutable: true }) orientation: TRadioGroupOrientation = 'vertical';

  /** If true, the radio group is required */
  @Prop({ reflect: true }) required = false;

  /** The native form validation message when the radio group is required */
  @Prop({ reflect: true }) requiredValidationMessage?: string;

  /** A string representing the value of the radio. */
  @Prop({ reflect: true, mutable: true }) value?: string;

  // Prop lifecycle events
  // =======================

  @Watch('debounceTime')
  handleDebounceTimeChange() {
    const MIN_DEBOUNCE_TIME = 0;
    const normalizedDebounceTime = Math.max(MIN_DEBOUNCE_TIME, this.debounceTime);

    if (normalizedDebounceTime !== this.debounceTime) {
      this.debounceTime = normalizedDebounceTime;
    }

    this.debouncedBqChange?.cancel();
    this.debouncedBqChange = debounce((event: { value: string; target: HTMLBqRadioElement }): void => {
      this.bqChange?.emit(event);
    }, this.debounceTime);
  }

  @Watch('disabled')
  handleDisabledChange() {
    this.tabIndex = this.disabled ? '-1' : '0';
    this.updateRadioTabIndexes();
  }

  @Watch('backgroundOnHover')
  @Watch('disabled')
  @Watch('name')
  @Watch('required')
  handleGroupProperties() {
    this.updateRadioProperties();
  }

  @Watch('orientation')
  checkPropValues() {
    validatePropValue(RADIO_GROUP_ORIENTATION, 'vertical', this.el, 'orientation');
  }

  @Watch('required')
  handleRequiredChange() {
    this.updateFormValidity();
  }

  @Watch('value')
  handleValueChange() {
    this.updateRadioProperties();
    this.updateFormValidity();

    // Find and update the checked radio based on the new value
    const newCheckedRadio = this.cachedRadioElements.find((radio) => radio.value === this.value);
    if (newCheckedRadio) {
      this.checkedRadio = newCheckedRadio;
      this.debouncedBqChange?.({ value: this.value, target: newCheckedRadio });
    } else {
      this.checkedRadio = undefined;
    }
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the radio state changes */
  @Event() bqChange: EventEmitter<{ value: string; target: HTMLBqRadioElement }>;

  /** Handler to be called when the radio loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqRadioElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.initialValue = this.value;
    this.handleDebounceTimeChange();
    this.internals.setFormValue(this.value ?? null);

    this.updateCustomStates();
    this.updateFormValidity();
  }

  disconnectedCallback() {
    this.debouncedBqChange?.cancel();
  }

  formAssociatedCallback() {
    this.internals.setFormValue(this.value ?? null);
    this.updateFormValidity();
  }

  formResetCallback() {
    this.value = this.initialValue;
    this.internals.setFormValue(this.value ?? null);
    this.updateFormValidity();
    this.updateCustomStates();
  }

  // Listeners
  // ==============

  @Listen('bqClick', { capture: true })
  async onBqClick(event: CustomEvent<{ value: string; target: HTMLBqRadioElement }>) {
    if (!isEventTargetChildOfElement(event, this.el)) return;

    const { target, value } = event.detail;
    if (value === this.value) return;

    requestAnimationFrame(() => {
      if (event.defaultPrevented) return;
      this.updateRadioSelection(target);
    });
  }

  @Listen('bqKeyDown')
  onBqKeyDown(event: CustomEvent<{ key: string; target: HTMLBqRadioElement }>) {
    if (!isEventTargetChildOfElement(event, this.el)) return;

    const direction: Direction | undefined = KEY_MAP[event.detail.key];
    if (!direction) return;

    this.focusRadioInputSibling(event.detail.target, direction);
  }

  @Listen('bqFocus', { capture: true })
  onBqFocus(event: CustomEvent<HTMLBqRadioElement>) {
    if (!isEventTargetChildOfElement(event, this.el)) return;

    const shouldStopPropagation = isDefined(this.focusedBqRadio);
    this.focusedBqRadio = event.detail;

    if (shouldStopPropagation) {
      event.stopPropagation();
    }
  }

  @Listen('bqBlur', { capture: true })
  onBqBlur(event: CustomEvent<HTMLBqRadioElement>) {
    if (!isEventTargetChildOfElement(event, this.el)) return;

    // NOTE: if focusedBqRadio is nil that means the event occurred from this component
    if (isNil(this.focusedBqRadio)) return;

    event.stopPropagation();

    requestAnimationFrame(() => {
      if (this.focusedBqRadio !== event.detail) return;

      this.focusedBqRadio = null;
      this.bqBlur.emit(event.detail);
    });
  }

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

  /**
   * Initializes the radio elements set by querying the host element for `ds-radio` elements.
   * This is done to avoid re-querying the host element for radio elements on every change.
   */
  private initializeRadioElements = (): void => {
    this.radioElementsSet.clear();
    this.el.querySelectorAll('bq-radio').forEach((radio) => {
      this.radioElementsSet.add(radio);
    });
    // Caching the radio elements in an array for faster access and iteration
    this.cachedRadioElements = Array.from(this.radioElementsSet);
    // Set the tabIndex of the host element to -1 if there are no radio elements or the group is disabled, otherwise set it to 0
    this.tabIndex = this.cachedRadioElements.length === 0 || this.disabled ? '-1' : '0';
    // Set initial tabIndex for all radios
    this.updateRadioTabIndexes();
  };

  /**
   * Sets tabIndex for all radio elements based on current state
   * Handles all scenarios: disabled state, checked radio, value matching, fallback to first
   */
  private updateRadioTabIndexes = (): void => {
    if (this.cachedRadioElements.length === 0) return;

    // If disabled, all radios get tabIndex -1
    if (this.disabled) {
      this.cachedRadioElements.forEach((radio) => {
        radio.tabIndex = -1;
      });
      return;
    }

    // Find which radio should be focusable
    let focusableRadio: HTMLBqRadioElement | undefined;

    // Priority 1: Currently checked radio
    focusableRadio = this.cachedRadioElements.find((radio) => radio.checked);

    // Priority 2: Radio matching current value
    if (!focusableRadio && this.value) {
      focusableRadio = this.cachedRadioElements.find((radio) => radio.value === this.value);
    }

    // Priority 3: First enabled radio (fallback)
    if (!focusableRadio) {
      focusableRadio = this.cachedRadioElements.find((radio) => !radio.disabled);
    }

    // Apply tabIndex to all radios
    this.cachedRadioElements.forEach((radio) => {
      radio.tabIndex = radio === focusableRadio ? 0 : -1;
    });
  };

  /**
   * Updates the radio selection and focus.
   * @param target - The radio element to update.
   */
  private updateRadioSelection = (target: HTMLBqRadioElement): void => {
    // Only uncheck the previously checked radio if it's different
    if (this.checkedRadio && this.checkedRadio !== target) {
      this.checkedRadio.checked = false;
      this.checkedRadio.tabIndex = -1;
    }

    target.checked = true;
    target.tabIndex = 0;
    target.vFocus();

    this.checkedRadio = target;
    this.value = target.value;
    this.internals?.setFormValue(this.value ?? null);

    this.updateRadioTabIndexes();
  };

  /**
   * Synchronizes properties of child radio elements with the group's state.
   */
  private updateRadioProperties = (): void => {
    if (this.cachedRadioElements.length === 0) return;

    const { backgroundOnHover, disabled, name, required, value } = this;

    for (const radio of this.cachedRadioElements) {
      radio.backgroundOnHover = backgroundOnHover;
      radio.checked = value === radio.value;
      // This will allows us to force all radio elements to be disabled
      // while keeping the disabled state of the radio element if it was set individually by the user
      radio.forceDisabled = disabled;
      radio.name = name;
      radio.required = required;
    }
  };

  /**
   * Focuses the next/previous radio element in the group based on the current target.
   * Handles circular navigation and skips disabled elements.
   * @param currentTarget - The currently focused radio element
   * @param direction - The navigation direction ('forward' | 'backward')
   */
  private focusRadioInputSibling = (currentTarget: HTMLBqRadioElement, direction: Direction): void => {
    // If there is none or only one radio element, there will be no sibling to focus
    if (this.cachedRadioElements.length <= 1) return;

    const currentIndex = this.cachedRadioElements.indexOf(currentTarget);
    // If the index of the radio element target is not found, it means that it's not part of the group
    if (currentIndex === -1) return;

    const nextElement = getNextElement(this.cachedRadioElements, currentIndex, direction);
    this.updateRadioSelection(nextElement);
  };

  private updateFormValidity = async (): Promise<void> => {
    const { internals, required, requiredValidationMessage, value } = this;
    // Clear the validity state
    internals?.states.clear();

    if (!required || (required && !isNil(value))) {
      // If the radio group is not required or has a value, set the validity state to valid
      internals?.states.add('valid');
      internals?.setValidity({});
      return;
    }

    const firstRadio = this.cachedRadioElements[0];
    if (!firstRadio) return;
    // If the radio group is required and has no value, set the validity state to invalid
    internals?.states.add('invalid');
    // We need to pass the native input element to the setValidity method as anchor element
    internals?.setValidity(
      { valueMissing: true },
      requiredValidationMessage ?? 'Please select an option',
      await firstRadio.getNativeInput(),
    );
  };

  /**
   * Updates the custom states based on the component properties.
   * The custom states can be used to style the component based on the component properties.
   * The custom states are `disabled`, based on the component properties.
   */
  private updateCustomStates = (): void => {
    const states = new Set<string>();

    if (this.disabled) states.add('disabled');
    if (this.orientation) states.add(this.orientation);

    // Update states
    this.internals?.states.clear();
    states.forEach((state) => {
      this.internals?.states.add(state);
    });
  };

  private handleSlotChange = (): void => {
    this.initializeRadioElements();
    this.updateRadioProperties();
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host tabindex={this.tabIndex}>
        <fieldset
          aria-controls="bq-radiogroup"
          aria-disabled={this.disabled}
          aria-labelledby="bq-radio-group__label"
          class={{ 'bq-radio-group': true, 'has-fieldset': this.fieldset }}
          disabled={this.disabled}
          part="base"
        >
          <legend part="label">
            <slot id="bq-radiogroup__label" name="label" />
          </legend>
          <div class={`bq-radio-group--${this.orientation}`} part="group">
            <slot id="bq-radiogroup" onSlotchange={this.handleSlotChange} />
          </div>
        </fieldset>
      </Host>
    );
  }
}
