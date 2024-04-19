import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { FloatingUIPlacement } from '../../services/interfaces';
import { debounce, getTextContent, hasSlotContent, isDefined, isHTMLElement, TDebounce } from '../../shared/utils';
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

  private debounceQuery: TDebounce<void>;

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
   * The amount of time, in milliseconds, to wait before emitting the `bqInput` event after the input value changes.
   * A value of 0 means no debouncing will occur.
   */
  @Prop({ reflect: true, mutable: true }) debounceTime? = 0;

  /**
   * Indicates whether the Select input is disabled or not.
   * If `true`, the Select is disabled and cannot be interacted with.
   */
  @Prop({ mutable: true }) disabled?: boolean = false;

  /** If true, the clear button won't be displayed */
  @Prop({ reflect: true }) disableClear? = false;

  /** Represents the distance (gutter or margin) between the Select panel and the input element. */
  @Prop({ reflect: true }) distance?: number = 8;

  /** The ID of the form that the Select input belongs to. */
  @Prop({ reflect: true }) form?: string;

  /** If true, the Select panel will remain open after a selection is made. */
  @Prop({ reflect: true }) keepOpenOnSelect?: boolean = false;

  /** The Select input name. */
  @Prop({ reflect: true }) name!: string;

  /** If true, the Select panel will be visible. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** When set, it will override the height of the Select panel. */
  @Prop({ reflect: true }) panelHeight?: string;

  /** The Select input placeholder text value */
  @Prop({ reflect: true }) placeholder?: string;

  /** Position of the Select panel */
  @Prop({ reflect: true }) placement?: FloatingUIPlacement = 'bottom';

  /** If true, the list of options cannot be filtered (searching won't be available) */
  @Prop({ reflect: true }) readonly?: boolean;

  /** Indicates whether or not the Select input is required to be filled out before submitting the form. */
  @Prop({ reflect: true }) required?: boolean;

  /** Whether the panel should have the Select same width as the input element */
  @Prop({ reflect: true }) sameWidth?: boolean = true;

  /**  Represents the skidding between the Select panel and the input element. */
  @Prop({ reflect: true }) skidding?: number = 0;

  /** Defines the strategy to position the Select panel */
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';

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

  componentDidRender() {
    this.syncItemsFromValue();
  }

  // Listeners
  // ==============

  @Listen('bqOpen', { capture: true })
  handleOpenChange(ev: CustomEvent<{ open: boolean }>) {
    if (!ev.composedPath().includes(this.el)) return;

    this.open = ev.detail.open;
  }

  @Listen('bqFocus', { capture: true })
  @Listen('bqBlur', { capture: true })
  stopOptionFocusBlurPropagation(ev: CustomEvent) {
    // Stop propagation of focus and blur events coming from the `bq-option` elements
    if (isHTMLElement(ev.target, 'bq-select')) return;

    ev.stopPropagation();
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /**
   * Clears the selected value.
   *
   * @return {Promise<void>}
   * @memberof BqSelect
   */
  @Method()
  async clear(): Promise<void> {
    if (this.disabled) return;

    this.value = undefined;
    this.displayValue = undefined;
    this.inputElem.value = undefined;

    this.resetOptionsVisibility();
    this.bqClear.emit(this.el);
  }

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

  private handleSelect = (ev: CustomEvent<{ value: TInputValue; item: HTMLBqOptionElement }>) => {
    if (this.disabled) return;

    this.value = ev.detail.value;
    this.resetOptionsVisibility();
    // Move the focus back to the input once an option is selected and the panel is closed
    this.inputElem.focus();
  };

  private handleInput = (ev: Event) => {
    if (this.disabled) return;

    this.debounceQuery?.cancel();

    const query = (ev.target as HTMLInputElement).value?.toLowerCase().trim();

    if (!isDefined(query)) {
      this.clear();
    } else {
      this.debounceQuery = debounce(() => {
        this.options.forEach((item: HTMLBqOptionElement) => {
          const itemLabel = this.getOptionLabel(item).toLowerCase();
          item.hidden = !itemLabel.includes(query);
        });
      }, this.debounceTime);

      this.debounceQuery();
    }

    // The panel will close once a selection is made
    // so we need to make sure it's open when the user is typing and the query is not empty
    this.open = true;
  };

  private handleClearClick = (ev: CustomEvent) => {
    (async () => {
      await this.clear();
    })();
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

  private resetOptionsVisibility = () => {
    this.options.forEach((item: HTMLBqOptionElement) => (item.hidden = false));
  };

  private syncItemsFromValue = () => {
    const items = this.options;
    if (!items.length) return;

    // Sync selected state
    this.options.forEach((item: HTMLBqOptionElement) => (item.selected = item.value === this.value));
    // Sync display label
    const checkedItem = items.filter((item) => item.value === this.value)[0];
    this.displayValue = checkedItem ? this.getOptionLabel(checkedItem) : '';
    this.inputElem.value = this.displayValue;
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
    const labelId = `bq-select__label-${this.name || this.fallbackInputId}`;
    const hasClearIcon = !this.disableClear && !this.disabled && isDefined(this.displayValue);

    return (
      <div class="bq-select" part="base">
        {/* Label */}
        <label
          id={labelId}
          class={{ 'bq-select__label': true, '!hidden': !this.hasLabel }}
          htmlFor={this.name || this.fallbackInputId}
          ref={(labelElem: HTMLSpanElement) => (this.labelElem = labelElem)}
          part="label"
        >
          <slot name="label" onSlotchange={this.handleLabelSlotChange} />
        </label>
        {/* Select dropdown */}
        <bq-dropdown
          class="bq-select__dropdown w-full"
          disabled={this.disabled}
          distance={this.distance}
          keepOpenOnSelect={this.keepOpenOnSelect}
          open={this.open}
          panelHeight={this.panelHeight}
          placement={this.placement}
          sameWidth={this.sameWidth}
          skidding={this.skidding}
          strategy={this.strategy}
          exportparts="panel"
        >
          {/* Input control group */}
          <div
            class={{
              'bq-select__control': true,
              [`validation-${this.validationStatus}`]: true,
              disabled: this.disabled,
            }}
            part="control"
            slot="trigger"
          >
            {/* Prefix */}
            <span
              class={{ 'bq-select__control--prefix': true, '!hidden': !this.hasPrefix }}
              ref={(spanElem: HTMLSpanElement) => (this.prefixElem = spanElem)}
              part="prefix"
            >
              <slot name="prefix" onSlotchange={this.handlePrefixSlotChange} />
            </span>
            {/* HTML Input */}
            <input
              id={this.name || this.fallbackInputId}
              class="bq-select__control--input"
              autoComplete="off"
              autoCapitalize="off"
              autoFocus={this.autofocus}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-controls={`bq-options-${this.name}`}
              aria-expanded={this.open ? 'true' : 'false'}
              aria-haspopup="listbox"
              disabled={this.disabled}
              form={this.form}
              name={this.name}
              placeholder={this.placeholder}
              ref={(inputElem: HTMLInputElement) => (this.inputElem = inputElem)}
              readOnly={this.readonly}
              required={this.required}
              role="combobox"
              spellcheck={false}
              type="text"
              value={this.displayValue}
              part="input"
              // Events
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onInput={this.handleInput}
            />
            {/* Clear Button */}
            {hasClearIcon && (
              // The clear button will be visible as long as the input has a value
              // and the parent group is hovered or has focus-within
              <bq-button
                class="bq-select__control--clear ms-[--bq-select--gap]"
                appearance="text"
                aria-label={this.clearButtonLabel}
                size="small"
                onBqClick={this.handleClearClick}
                part="clear-btn"
                exportparts="button"
                tabIndex={-1}
              >
                <slot name="clear-icon">
                  <bq-icon name="x-circle" class="flex" />
                </slot>
              </bq-button>
            )}
            {/* Suffix */}
            <span
              class={{ 'bq-select__control--suffix': true, 'rotate-180': this.open, 'rotate-0': !this.open }}
              ref={(spanElem: HTMLSpanElement) => (this.suffixElem = spanElem)}
              part="suffix"
            >
              <slot name="suffix" onSlotchange={this.handleSuffixSlotChange}>
                <bq-icon name="caret-down" class="flex" />
              </slot>
            </span>
          </div>
          <bq-option-list
            id={`bq-options-${this.name}`}
            onBqSelect={this.handleSelect}
            aria-expanded={this.open ? 'true' : 'false'}
            role="listbox"
          >
            <slot />
          </bq-option-list>
        </bq-dropdown>
        {/* Helper text */}
        <div
          class={{
            [`bq-select__helper-text validation-${this.validationStatus}`]: true,
            '!hidden': !this.hasHelperText,
          }}
          ref={(divElem: HTMLDivElement) => (this.helperTextElem = divElem)}
          part="helper-text"
        >
          <slot name="helper-text" onSlotchange={this.handleHelperTextSlotChange} />
        </div>
      </div>
    );
  }
}
