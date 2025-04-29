import { AttachInternals, Component, Element, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

import type { Placement } from '../../services/interfaces';
import {
  debounce,
  hasSlotContent,
  isDefined,
  isHTMLElement,
  isNil,
  stringToArray,
  TDebounce,
} from '../../shared/utils';
import type { TInputValidation } from '../input/bq-input.types';

export type TSelectValue = string | string[];

/**
 * The select input component lets users choose from a predefined list, commonly used in forms for easy data selection.
 *
 * @example How to use it
 * ```html
 * <bq-select placeholder="Placeholder">
 *   <label slot="label">Select label</label>
 *   <span slot="helper-text">
 *     <bq-icon name="star"></bq-icon>
 *       Helper text
 *   </span>
 *
 *   <bq-option value="1">Option 1</bq-option>
 *   <bq-option value="2">Option 2</bq-option>
 *   <bq-option value="3">Option 3</bq-option>
 * </bq-select>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/41989d-select/b/09d7b1
 * @status stable
 *
 * @dependency bq-button
 * @dependency bq-dropdown
 * @dependency bq-icon
 * @dependency bq-option-list
 * @dependency bq-tag
 *
 * @attr {boolean} autofocus - If `true`, the Select input will be focused on component render.
 * @attr {string} clear-button-label - The clear button aria label.
 * @attr {number} debounce-time - The amount of time, in milliseconds, to wait before emitting the `bqInput` event after the input value changes.
 * @attr {boolean} disable-clear - If `true`, the clear button won't be displayed.
 * @attr {boolean} disabled - Indicates whether the Select input is disabled and cannot be interacted with.
 * @attr {number} distance - Represents the distance (gutter or margin) between the Select panel and the input element.
 * @attr {string} form - The ID of the form that Select input field belongs to.
 * @attr {boolean} keep-open-on-select - If `true`, the Select panel will remain open after a selection is made.
 * @attr {number} max-tags-visible - The maximum number of tags to display when multiple selection is enabled.
 * @attr {boolean} multiple - If `true`, the Select input will allow multiple selections.
 * @attr {string} name - The Select input name.
 * @attr {boolean} open - If `true`, the Select panel will be visible.
 * @attr {string} panel-height - When set, it will override the height of the Select panel.
 * @attr {string} placeholder - The Select input placeholder text value.
 * @attr {"bottom" | "bottom-end" | "bottom-start" | "left" | "left-end" | "left-start" | "right" | "right-end" | "right-start" | "top" | "top-end" | "top-start"} placement - Position of the Select panel.
 * @attr {boolean} readonly - If `true`, the Select input cannot be modified.
 * @attr {boolean} required - Indicates whether or not the Select input is required to be filled out before submitting the form.
 * @attr {boolean} same-width - Whether the panel should have the Select same width as the input element.
 * @attr {number} skidding - Represents the skidding between the Select panel and the input element.
 * @attr {"absolute" | "fixed"} strategy - Defines the strategy to position the Select panel.
 * @attr {"error" | "success" | "warning" | "none"} validation-status - The validation status of the Select input.
 * @attr {"number" | "string" | "string[]"} value - The select input value can be used to reset the field to a previous value.
 *
 * @method clear - Method to be called to clear the selected value.
 *
 * @event bqBlur - The callback handler is emitted when the Select input loses focus.
 * @event bqClear - The callback handler is emitted when the selected value has been cleared.
 * @event bqFocus - A callback handler is emitted when the Select input has received focus.
 * @event bqSelect - The callback handler is emitted when the selected value has changed.
 *
 * @slot label - The label slot container.
 * @slot prefix - The prefix slot container.
 * @slot tags - The tags slot container.
 * @slot clear-icon - The clear icon slot container.
 * @slot suffix - The suffix slot container.
 * @slot helper-text - The helper text slot container.
 *
 * @part base - The component's base wrapper.
 * @part button - The native HTML button used under the hood in the clear button.
 * @part clear-btn - The clear button.
 * @part control - The input control wrapper.
 * @part input-outline - The input outline wrapper that holds the tags container and the native HTML input used under the hood.
 * @part helper-text - The helper text slot container.
 * @part input - The native HTML input element used under the hood.
 * @part label - The label slot container.
 * @part panel - The select panel container
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 * @part tags - The tags container of the BqTags for multiple selection.
 * @part tag - The tag container of the BqTag for multiple selection.
 * @part tag__base - The base wrapper of the BqTag for multiple selection.
 * @part tag__prefix - The prefix slot container of the BqTag for multiple selection.
 * @part tag__text - The text slot container of the BqTag for multiple selection.
 * @part tag__btn-close - The close button of the BqTag for multiple selection.
 * @part option-list - The option list container.
 *
 * @cssprop --bq-select--background-color - Select background color
 * @cssprop --bq-select--border-color - Select border color
 * @cssprop --bq-select--border-color-focus - Select border color on focus
 * @cssprop --bq-select--border-color-disabled - Select border color when disabled
 * @cssprop --bq-select--border-radius - Select border radius
 * @cssprop --bq-select--border-width - Select border width
 * @cssprop --bq-select--border-style - Select border style
 * @cssprop --bq-select--gap - Gap between Select content and prefix/suffix
 * @cssprop --bq-select--helper-margin-top - Helper text margin top
 * @cssprop --bq-select--helper-text-color - Helper text color
 * @cssprop --bq-select--helper-text-size - Helper text size
 * @cssprop --bq-select--icon-size - Icon size to use in prefix/suffix and clear button
 * @cssprop --bq-select--label-margin-bottom - Select label margin bottom
 * @cssprop --bq-select--label-text-color - Select label text color
 * @cssprop --bq-select--label-text-size - Select label text size
 * @cssprop --bq-select--padding-start - Select padding start
 * @cssprop --bq-select--padding-end - Select padding end
 * @cssprop --bq-select--paddingY - Select padding top and bottom
 * @cssprop --bq-select--text-color - Select text color
 * @cssprop --bq-select--text-size - Select text size
 * @cssprop --bq-select--text-placeholder-color - Select placeholder text color
 */
@Component({
  tag: 'bq-select',
  styleUrl: './scss/bq-select.scss',
  formAssociated: true,
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
  private debounceInput: TDebounce<void>;

  private fallbackInputId = 'select';

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSelectElement;
  @AttachInternals() internals!: ElementInternals;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() displayValue?: string;
  @State() hasHelperText = false;
  @State() selectedOptions: HTMLBqOptionElement[] = [];

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

  /** The maximum number of tags to display when multiple selection is enabled */
  @Prop({ mutable: true }) maxTagsVisible: number = 2;

  /** If true, the Select input will allow multiple selections. */
  @Prop({ reflect: true }) multiple?: boolean = false;

  /** If true, the Select panel will be visible. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** When set, it will override the height of the Select panel. */
  @Prop({ reflect: true }) panelHeight?: string;

  /** The Select input placeholder text value */
  @Prop({ reflect: true }) placeholder?: string;

  /** Position of the Select panel */
  @Prop({ reflect: true }) placement?: Placement = 'bottom';

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
  @Prop({ reflect: true, mutable: true }) value: TSelectValue;

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValueChange() {
    // Early return for undefined/null values
    if (isNil(this.value)) {
      this.value = this.multiple ? [] : '';
      this.internals.setFormValue(undefined);
      this.syncItemsFromValue();
      return;
    }

    // Handle multiple selection mode
    if (this.multiple) {
      this.value = stringToArray(this.value);
      this.internals.setFormValue(this.value.join(','));
      this.syncItemsFromValue();

      return;
    }

    // Handle single selection mode
    this.value = String(this.value);
    this.internals.setFormValue(this.value);
    this.syncItemsFromValue();
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

  /** Callback handler emitted when the Select input changes its value while typing */
  @Event() bqInput: EventEmitter<{ value: string | number | string[] }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  connectedCallback() {
    this.initMultipleValue();
  }

  componentWillLoad() {
    this.initMultipleValue();
  }

  componentDidLoad() {
    this.handleSlotChange();

    if (this.multiple && Array.isArray(this.value)) {
      this.selectedOptions = this.options.filter((item) => this.value.includes(item.value));
    }
    this.handleValueChange();
  }

  formAssociatedCallback() {
    this.internals.role = 'combobox';
    this.internals.ariaExpanded = this.open ? 'true' : 'false';
  }

  async formResetCallback() {
    if (isNil(this.value)) return;

    this.internals.setValidity({});
    this.clear();
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

    const { multiple, inputElem, bqClear, el } = this;

    // Clear value and selected options
    this.value = '';
    this.selectedOptions = [];

    // Clear display value and input element if not multiple
    if (!multiple) {
      this.displayValue = '';
      inputElem.value = '';
    }

    // Update form value and reset options visibility
    this.resetOptionsVisibility();

    // Emit clear event
    bqClear.emit(el);
  }

  /**
   * Resets the Select input to a previous value.
   *
   * @param {TSelectValue} value - The value to reset the Select input to.
   * @return {Promise<void>}
   * @memberof BqSelect
   */
  @Method()
  async reset(value: TSelectValue): Promise<void> {
    if (isNil(value)) return;

    this.value = value;
    this.syncItemsFromValue();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private initMultipleValue = () => {
    if (!this.multiple) return;

    this.value = Array.isArray(this.value) ? this.value : Array.from(JSON.parse(String(this.value)));
  };

  private handleBlur = () => {
    if (this.disabled) return;

    this.bqBlur.emit(this.el);
  };

  private handleFocus = () => {
    if (this.disabled) return;

    this.bqFocus.emit(this.el);
  };

  private handleSelect = (ev: CustomEvent<{ value: TSelectValue; item: HTMLBqOptionElement }>) => {
    if (this.disabled) return;

    if (this.multiple) {
      ev.stopPropagation();
    }

    const { value, item } = ev.detail;

    if (this.multiple) {
      this.handleMultipleSelection(item);
      // Clear the input value after selecting an item
      this.inputElem.value = '';
      // If multiple selection is enabled, emit the selected items array instead of relying on
      // the option list to emit the value of the selected item
      this.bqSelect.emit({ value: this.value, item });
    } else {
      this.value = value;
    }

    this.resetOptionsVisibility();
    this.inputElem.focus();
  };

  private handleMultipleSelection = (item: HTMLBqOptionElement) => {
    // Set has O(1) complexity for insertion, deletion, and search operations, compared to an Array's O(n)
    const selectedOptionsSet = new Set(this.selectedOptions);

    if (selectedOptionsSet.has(item)) {
      selectedOptionsSet.delete(item);
    } else {
      selectedOptionsSet.add(item);
    }

    this.selectedOptions = Array.from(selectedOptionsSet);
    this.value = this.selectedOptions.map((item) => item.value);
  };

  private handleSearchFilter = (value: string) => {
    if (this.disabled) return;

    this.debounceQuery?.cancel();

    if (!isDefined(value)) {
      this.clear();
    } else {
      this.debounceQuery = debounce(() => {
        this.options.forEach((item: HTMLBqOptionElement) => {
          const itemLabel = this.getOptionLabel(item).toLowerCase();
          item.hidden = !itemLabel.includes(value);
        });
      }, this.debounceTime);

      this.debounceQuery();
    }

    // The panel will close once a selection is made
    // so we need to make sure it's open when the user is typing and the query is not empty
    this.open = true;
  };

  private handleInput = (ev: Event) => {
    if (this.disabled) return;

    const { value } = ev.target as HTMLInputElement;

    this.debounceInput?.cancel();

    this.debounceInput = debounce(() => {
      const inputEvent = this.bqInput.emit({ value });
      if (!inputEvent.defaultPrevented) {
        // Continue with search filtering only if the event wasn't prevented
        this.handleSearchFilter(value);
      }
    }, this.debounceTime);

    this.debounceInput();
  };

  private handleClearClick = (ev: CustomEvent) => {
    (async () => {
      await this.clear();
    })();
    this.inputElem.focus();

    ev.stopPropagation();
  };

  private handleTagRemove = (item: HTMLBqOptionElement) => {
    if (this.disabled) return;

    this.handleMultipleSelection(item);
    this.bqSelect.emit({ value: this.value, item });
  };

  private handleSlotChange = () => {
    this.hasLabel = hasSlotContent(this.labelElem);
    this.hasPrefix = hasSlotContent(this.prefixElem);
    this.hasSuffix = hasSlotContent(this.suffixElem);
    this.hasHelperText = hasSlotContent(this.helperTextElem);
  };

  private resetOptionsVisibility = () => {
    this.options.forEach((item: HTMLBqOptionElement) => (item.hidden = false));
  };

  private syncItemsFromValue = () => {
    const { internals, options, value } = this;
    if (!options.length) return;

    // Sync selected state of the BqOption elements
    this.syncSelectedOptionsState();

    if (this.multiple) {
      // Sync selected options for multiple selection mode
      this.selectedOptions = options.filter((option) => this.value?.includes(option.value));
    }

    // Always update display value and form value
    this.updateDisplayLabel();
    internals.setFormValue(!isNil(value) ? `${value}` : undefined);
  };

  /**
   * Syncs the selected state of the BqOption elements which value is included in the `value` property.
   * Notice that value can be a string or an array of strings.
   *
   * @private
   * @memberof BqSelect
   */
  private syncSelectedOptionsState = () => {
    const { options, multiple, value } = this;
    const lowerCaseValue = String(value).toLowerCase();

    options.forEach((option: HTMLBqOptionElement) => {
      if (multiple && Array.isArray(value)) {
        option.selected = value.includes(option.value);
      } else {
        option.selected = option.value.toLowerCase() === lowerCaseValue;
      }
    });
  };

  /**
   * Updates the display value of the input element based on the selected option.
   *
   * @private
   * @memberof BqSelect
   */
  private updateDisplayLabel = () => {
    const { value, options, inputElem } = this;

    const checkedItem = options.find((item) => item.value === value);
    const displayValue = checkedItem ? this.getOptionLabel(checkedItem) : '';

    inputElem.value = displayValue;
    this.displayValue = displayValue;
  };

  private getOptionLabel = (item: HTMLBqOptionElement) => {
    if (!item) return '';
    return item.innerText.trim() ?? '';
  };

  private get options() {
    return Array.from(this.el.querySelectorAll('bq-option'));
  }

  private get displayPlaceholder() {
    // Hide the placeholder when multiple selection is enabled and there are selected items
    return this.multiple && this.selectedOptions.length !== 0 ? undefined : this.placeholder;
  }

  private get displayTags() {
    return this.selectedOptions.map((item, index) => {
      if (index < this.maxTagsVisible || this.maxTagsVisible < 0) {
        return (
          <bq-tag
            key={item.value}
            removable
            size="xsmall"
            variant="filled"
            onBqClose={(event) => {
              // NOTE: prevents triggering bqClose on parent
              event.stopPropagation();
              this.handleTagRemove(item);
            }}
            // Prevent the tag from closing the panel when clicked
            onClick={(ev: MouseEvent) => ev.stopPropagation()}
            exportparts="wrapper:tag__base,prefix:tag__prefix,text:tag__text,btn-close:tag__btn-close"
            part="tag"
          >
            {this.getOptionLabel(item)}
          </bq-tag>
        );
      } else if (index === this.maxTagsVisible) {
        return (
          <bq-tag
            key="more"
            size="xsmall"
            variant="filled"
            exportparts="wrapper:tag__base,prefix:tag__prefix,text:tag__text,btn-close:tag__btn-close"
            part="tag"
          >
            +{this.selectedOptions.length - index}
          </bq-tag>
        );
      }

      return null;
    });
  }

  private get hasClearIcon() {
    if (this.disableClear || this.disabled) {
      return false;
    }

    if (this.multiple) {
      return this.selectedOptions.length > 0;
    }

    return isDefined(this.displayValue);
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const labelId = `bq-select__label-${this.name || this.fallbackInputId}`;

    return (
      <div class="bq-select" part="base">
        {/* Label */}
        <label
          id={labelId}
          class={{ 'bq-select__label': true, '!hidden': !this.hasLabel }}
          aria-label={this.name || this.fallbackInputId}
          htmlFor={this.name || this.fallbackInputId}
          ref={(labelElem: HTMLSpanElement) => (this.labelElem = labelElem)}
          part="label"
        >
          <slot name="label" onSlotchange={this.handleSlotChange} />
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
              <slot name="prefix" onSlotchange={this.handleSlotChange} />
            </span>
            <div class="flex flex-1 overflow-x-auto" part="input-outline">
              {/* Display selected values using BqTags for multiple selection */}
              {this.multiple && (
                <span class="bq-select__tags" part="tags">
                  <slot name="tags">{this.displayTags}</slot>
                </span>
              )}
              {/* HTML Input */}
              <input
                id={this.name || this.fallbackInputId}
                class="bq-select__control--input flex-grow is-full"
                autoComplete="off"
                autoCapitalize="off"
                aria-disabled={this.disabled ? 'true' : 'false'}
                aria-controls={`bq-options-${this.name}`}
                aria-expanded={this.open ? 'true' : 'false'}
                aria-haspopup="listbox"
                disabled={this.disabled}
                form={this.form}
                name={this.name}
                placeholder={this.displayPlaceholder}
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
            </div>
            {/* Clear Button */}
            {this.hasClearIcon && (
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
              <slot name="suffix" onSlotchange={this.handleSlotChange}>
                <bq-icon name="caret-down" class="flex" />
              </slot>
            </span>
          </div>
          <bq-option-list
            id={`bq-options-${this.name}`}
            onBqSelect={this.handleSelect}
            aria-expanded={this.open ? 'true' : 'false'}
            exportparts="base:option-list"
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
          <slot name="helper-text" onSlotchange={this.handleSlotChange} />
        </div>
      </div>
    );
  }
}
