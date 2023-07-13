import { EventEmitter } from '@angular/core';
import { Component, Element, Event, h, Prop, State, Watch } from '@stencil/core';

import { hasSlotContent, isDefined } from '../../shared/utils';

/**
 * @part base - The component's base wrapper.
 * @part button - The native HTML button used under the hood in the clear button.
 * @part clear-btn - The clear button.
 * @part control - The input control wrapper.
 * @part label - The label slot container.
 * @part input - The native HTML input element used under the hood.
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 */
@Component({
  tag: 'bq-input',
  styleUrl: './scss/bq-input.scss',
  shadow: true,
})
export class BqInput {
  // Own Properties
  // ====================

  private inputElem?: HTMLInputElement;
  private labelElem?: HTMLElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

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

  /** The clear button aria label */
  @Prop({ reflect: true }) clearButtonLabel = 'Clear value';

  /** If true, the clear button won't be displayed */
  @Prop({ reflect: true }) disableClear = false;

  /** The input placeholder text value */
  @Prop() placeholder: string;

  /** The input value, it can be used to reset the input to a previous value */
  @Prop({ reflect: true, mutable: true }) value: string | number | string[];

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

  /** Callback handler emitted when the input value has changed */
  @Event() bqChange!: EventEmitter<{ value: string | number | string[] }>;

  /** Callback handler emitted when the input value has been cleared */
  @Event() bqClear!: EventEmitter<void>;

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

  private handleInputChange = () => {
    this.value = this.inputElem.value;
    this.bqChange.emit({ value: this.value });
  };

  private handleClearClick = (event: CustomEvent) => {
    this.inputElem.value = '';
    this.value = this.inputElem.value;

    this.bqClear.emit();
    this.bqChange.emit({ value: this.value });
    this.inputElem.focus();

    event.stopPropagation();
  };

  private handlePrefixSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem);
  };

  private handleSuffixSlotChange = () => {
    this.hasSuffix = hasSlotContent(this.suffixElem);
  };

  private handleLabelSlotChange = () => {
    this.hasLabel = hasSlotContent(this.labelElem);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-input" part="base">
        <label
          class={{ 'bq-input--label flex flex-grow text-s': true, hidden: !this.hasLabel }}
          htmlFor="input"
          ref={(labelElem) => (this.labelElem = labelElem)}
          part="label"
        >
          <slot name="label" onSlotchange={this.handleLabelSlotChange} />
        </label>
        <div class="bq-input--control group" part="control">
          {/* Prefix */}
          <span
            class={{ 'bq-input--control__prefix': true, hidden: !this.hasPrefix }}
            ref={(spanElem) => (this.prefixElem = spanElem)}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.handlePrefixSlotChange} />
          </span>
          {/* HTML Input */}
          <input
            id="input"
            class="bq-input--control__input"
            placeholder={this.placeholder}
            ref={(inputElem) => (this.inputElem = inputElem)}
            onInput={this.handleInputChange}
            value={this.value}
            part="input"
          />
          {/* Clear Button */}
          {!this.disableClear && this.hasValue && (
            // The clear button will be visible as long as the input has a value
            // and the parent group is hovered or has focus-within
            <bq-button
              class="bq-input--control__clear ms-[--bq-input--gap] hidden group-hover:flex group-[:has(:focus-within)]:inline-block"
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
            class={{ 'bq-input--control__suffix': true, hidden: !this.hasSuffix }}
            ref={(spanElem) => (this.suffixElem = spanElem)}
            part="suffix"
          >
            <slot name="suffix" onSlotchange={this.handleSuffixSlotChange} />
          </span>
        </div>
      </div>
    );
  }
}
