import type { EventEmitter } from '@stencil/core';
import { AttachInternals, Component, Element, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import type { BqTagCustomEvent } from '../..';
import type { Placement } from '../../services/interfaces';
import {
  debounce,
  getTextContent,
  hasSlotContent,
  isDefined,
  isHTMLElement,
  isNil,
  stringToArray,
  type TDebounce,
} from '../../shared/utils';
import type { TInputValidation } from '../input/bq-input.types';

export type TSelectValue = string | string[];

export interface TSelectSelectionTreeNode {
  value: string;
  children: TSelectSelectionTreeNode[];
}

export interface TSelectChangeDetail {
  value: TSelectValue;
  item: HTMLBqOptionElement;
  selectionTree?: TSelectSelectionTreeNode[];
}

type TSelectOptionStructure = {
  all: HTMLBqOptionElement[];
  hasNestedMarkup: boolean;
  nested: HTMLBqOptionElement[];
  topLevel: HTMLBqOptionElement[];
};

type TSelectDisplayTag = {
  item: HTMLBqOptionElement;
  label: string;
};

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
 * @attr {boolean} disable-search - Disables text filtering while keeping option selection available.
 * @attr {boolean} disabled - Indicates whether the Select input is disabled and cannot be interacted with.
 * @attr {number} distance - Represents the distance (gutter or margin) between the Select panel and the input element.
 * @attr {string} form - The ID of the form that Select input field belongs to.
 * @attr {string} form-validation-message - The native form validation message (mandatory if `required` is set).
 * @attr {boolean} keep-open-on-select - If `true`, the Select panel will remain open after a selection is made.
 * @attr {number} max-tags-visible - The maximum number of tags to display when multiple selection is enabled.
 * @attr {boolean} multiple - If `true`, the Select input will allow multiple selections.
 * @attr {string} name - The Select input name.
 * @attr {boolean} open - If `true`, the Select panel will be visible.
 * @attr {string} panel-height - When set, it will override the height of the Select panel.
 * @attr {string} placeholder - The Select input placeholder text value.
 * @attr {"bottom" | "bottom-end" | "bottom-start" | "left" | "left-end" | "left-start" | "right" | "right-end" | "right-start" | "top" | "top-end" | "top-start"} placement - Position of the Select panel.
 * @attr {boolean} readonly - Deprecated. Use `disable-search` to allow selection without text filtering.
 * @attr {boolean} required - Indicates whether or not the Select input is required to be filled out before submitting the form.
 * @attr {boolean} same-width - Whether the panel should have the Select same width as the input element.
 * @attr {boolean} enable-checkboxes - If `true` and `multiple` is enabled, flat options render with checkboxes. Nested multi-select options always render with checkboxes.
 * @attr {number} skidding - Represents the skidding between the Select panel and the input element.
 * @attr {"absolute" | "fixed"} strategy - Defines the strategy to position the Select panel.
 * @attr {"error" | "success" | "warning" | "none"} validation-status - The validation status of the Select input.
 * @attr {string | string[]} value - The select input value can be used to reset the field to a previous value.
 *
 * @method clear - Method to be called to clear the selected value.
 *
 * @event bqBlur - The callback handler is emitted when the Select input loses focus.
 * @event bqClear - The callback handler is emitted when the selected value has been cleared.
 * @event bqFocus - A callback handler is emitted when the Select input has received focus.
 * @event bqSelect - The callback handler is emitted when the selected value has changed. Nested multi-select events include selected paths in `selectionTree`.
 *
 * @slot label - The label slot container.
 * @slot - The options rendered in the select list.
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
  private pendingOptionFocus?: HTMLBqOptionElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

  private debounceQuery: TDebounce<void>;
  private debounceInput: TDebounce<void>;
  private activeTreeOption?: HTMLBqOptionElement;
  private expansionObserver?: MutationObserver;
  private optionsObserver?: MutationObserver;
  private restoringSearchExpandedOptions = new WeakSet<HTMLBqOptionElement>();
  private searchExpandedOptions = new Set<HTMLBqOptionElement>();
  private userExpandedOptions = new Map<HTMLBqOptionElement, boolean>();
  private reportedDuplicateOptionValues = new Set<string>();
  private hasWarnedUnsupportedNestedOptions = false;

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
  @State() hasNestedOptions = false;
  @State() hasPrefix = false;
  @State() hasSuffix = false;

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

  /** If true, the Select panel will not lock the page body scroll when open. */
  @Prop({ reflect: true }) disableScrollLock?: boolean = false;

  /**
   * Indicates whether the Select input is disabled or not.
   * If `true`, the Select is disabled and cannot be interacted with.
   */
  @Prop({ mutable: true }) disabled?: boolean = false;

  /** If true, the clear button won't be displayed */
  @Prop({ reflect: true }) disableClear? = false;

  /** If true, the search functionality within the Select panel will be disabled. No typing will be allowed */
  @Prop({ reflect: true }) disableSearch?: boolean = false;

  /** Represents the distance (gutter or margin) between the Select panel and the input element. */
  @Prop({ reflect: true }) distance?: number = 8;

  /** The ID of the form that the Select input belongs to. */
  @Prop({ reflect: true }) form?: string;

  /** The native form validation message (mandatory if `required` is set) */
  @Prop({ mutable: true }) formValidationMessage?: string;

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

  /**
   * @deprecated Use `disableSearch` to allow selection without text filtering.
   * In a future major release, `readonly` will prevent changing the selected value.
   */
  @Prop({ reflect: true }) readonly?: boolean;

  /** Indicates whether or not the Select input is required to be filled out before submitting the form. */
  @Prop({ reflect: true }) required?: boolean;

  /** Whether the panel should have the Select same width as the input element */
  @Prop({ reflect: true }) sameWidth?: boolean = true;

  /** If true, flat options render with checkboxes when multiple selection is enabled. Nested multi-select options always render with checkboxes. */
  @Prop({ reflect: true }) enableCheckboxes?: boolean;

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
    this.syncOptionsAndValue();
  }

  @Watch('required')
  handleRequiredPropChange() {
    this.updateFormValidity();
  }

  @Watch('enableCheckboxes')
  handleEnableCheckboxesChange() {
    this.syncOptionPresentation(this.getOptionStructure().all);
  }

  @Watch('multiple')
  handleMultipleChange(multiple: boolean, previousMultiple?: boolean) {
    const optionStructure = this.getOptionStructure();

    if (!multiple && previousMultiple && optionStructure.hasNestedMarkup) {
      this.selectedOptions = [];
      this.value = '';
      return;
    }

    if (multiple && !previousMultiple && isDefined(this.value) && !Array.isArray(this.value)) {
      this.value = this.value ? [String(this.value)] : [];
      return;
    }

    this.syncOptionsAndValue(optionStructure);
  }

  @Watch('open')
  handleOpenStateChange() {
    this.updateInternalsAccessibility();
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

  /** Callback handler emitted when the selected value has changed. Nested multi-select also includes selected paths in `selectionTree`. */
  @Event() bqSelect!: EventEmitter<TSelectChangeDetail>;

  /** Callback handler emitted when the Select input changes its value while typing */
  @Event() bqInput: EventEmitter<{ value: string | number | string[] }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.handleSlotChange();
    this.observeOptionExpansion();
    this.observeOptions();
  }

  componentDidRender() {
    if (!this.open || !this.pendingOptionFocus) return;

    const option = this.pendingOptionFocus;
    this.pendingOptionFocus = undefined;
    this.focusOption(option);
  }

  disconnectedCallback() {
    this.expansionObserver?.disconnect();
    this.optionsObserver?.disconnect();
  }

  formAssociatedCallback() {
    this.updateInternalsAccessibility();
    this.updateFormValidity();
  }

  async formResetCallback() {
    if (isNil(this.value)) return;

    this.updateFormValidity();
    await this.clear();
  }

  // Listeners
  // ==============

  @Listen('bqOpen', { capture: true })
  handleOpenChange(ev: CustomEvent<{ open: boolean }>) {
    if (!ev.composedPath().includes(this.el)) return;

    this.open = ev.detail.open;
    if (!this.open) {
      this.pendingOptionFocus = undefined;
      this.restoreSearchExpansion();
    }
  }

  @Listen('bqFocus', { capture: true })
  @Listen('bqBlur', { capture: true })
  stopOptionFocusBlurPropagation(ev: CustomEvent) {
    // Stop propagation of focus and blur events coming from the `bq-option` elements
    if (isHTMLElement(ev.target, 'bq-select')) return;

    if (this.hasNestedOptions && isHTMLElement(ev.target, 'bq-option')) {
      this.setActiveTreeOption(ev.target);
    }

    ev.stopPropagation();
  }

  @Listen('keydown', { capture: true })
  handleOptionNavigation(event: KeyboardEvent) {
    if (!this.open || !this.isOptionNavigationKey(event.key)) return;
    if (event.composedPath().some((target) => isHTMLElement(target, 'bq-button'))) return;

    const option = event.composedPath().find((target) => isHTMLElement(target, 'bq-option'));
    if (!isHTMLElement(option, 'bq-option') || !this.el.contains(option)) return;

    event.preventDefault();
    event.stopPropagation();

    if (this.hasNestedOptions) {
      this.navigateTree(option, event.key);
      return;
    }

    this.navigateFlatOptions(option, event.key);
  }

  @Listen('scroll', { target: 'window', passive: true, capture: true })
  handleScrollEvent() {
    if (!this.open || this.disableScrollLock) return;

    // Close the panel when the scroll event is triggered.
    // This is useful for those cases where the floating panel is inside a scrollable container.
    // For example, a select inside a dialog, drawer, etc.
    // ⚠️ Notice that document body scroll lock is handled via the `scrollLock` utility.
    this.open = false;
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

    // Clear value and selected options
    this.value = this.multiple ? [] : '';
    this.selectedOptions = [];

    // Update form value and reset options visibility
    this.resetOptionsVisibility();

    // Emit clear event
    this.bqClear.emit(this.el);
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

    this.collapseInputSelection();
    this.bqFocus.emit(this.el);
  };

  private handleSelect = (ev: CustomEvent<{ value: TSelectValue; item: HTMLBqOptionElement }>) => {
    if (this.disabled) return;

    if (this.multiple) {
      ev.stopPropagation();
    }

    const { value, item } = ev.detail;

    if (this.multiple) {
      const value = this.handleMultipleSelection(item);
      // Clear the input value after selecting an item
      this.inputElem.value = '';
      // If multiple selection is enabled, emit the selected items array instead of relying on
      // the option list to emit the value of the selected item
      this.emitSelect(item, value);
    } else {
      this.value = value;
    }

    this.resetOptionsVisibility();

    if (this.hasNestedOptions && this.keepOpenOnSelect) {
      this.focusTreeOption(item);
      return;
    }

    this.focusInput();
  };

  private handleMultipleSelection = (item: HTMLBqOptionElement) => {
    const optionStructure = this.getOptionStructure();
    const options = this.getActiveOptions(optionStructure);
    const value = this.getMultipleSelectionValue(item, options);

    this.value = value;
    this.syncValueState(optionStructure);

    return value;
  };

  private getMultipleSelectionValue = (item: HTMLBqOptionElement, options: HTMLBqOptionElement[]) => {
    // Set has O(1) complexity for insertion, deletion, and search operations, compared to an Array's O(n)
    const selectedValues = new Set(Array.isArray(this.value) ? this.value : []);

    if (!this.hasNestedOptions) {
      this.toggleOptionValue(selectedValues, item);
      return this.getSelectedOptionValues(selectedValues, options);
    }

    this.toggleNestedOptionValue(selectedValues, item, options);
    return this.getSelectedOptionValues(selectedValues, options);
  };

  private removeMultipleSelection = (item: HTMLBqOptionElement) => {
    const optionStructure = this.getOptionStructure();
    const options = this.getActiveOptions(optionStructure);
    const selectedValues = new Set(Array.isArray(this.value) ? this.value : []);
    const optionsToRemove = this.hasNestedOptions
      ? [item, ...this.getOptionDescendants(item, options)].filter(this.isSelectableOption)
      : [item];

    optionsToRemove.forEach((option) => {
      selectedValues.delete(option.value);
    });

    const value = this.getSelectedOptionValues(selectedValues, options);
    this.value = value;
    this.syncValueState(optionStructure);

    return value;
  };

  private handleSearchFilter = (value: string) => {
    if (this.disabled) return;

    this.debounceQuery?.cancel();

    const trimmedValue = value?.trim();
    if (!trimmedValue) {
      // For multi-select, just reset options visibility without clearing selections
      // This prevents backspace from removing selected tags when only clearing search text
      if (this.multiple) {
        this.resetOptionsVisibility();
        return;
      }

      this.clear();
      return;
    }

    this.debounceQuery = debounce(() => {
      const query = trimmedValue.toLowerCase();
      const matchesByOption = new Map<HTMLBqOptionElement, boolean>();

      this.getActiveOptions(this.getOptionStructure()).forEach((item) => {
        // We want to get the full option text to allow searching across nested options.
        const optionLabel = item.textContent?.trim().toLowerCase() || '';
        const optionValue = item.value?.toLowerCase() || '';
        // Show item if EITHER label OR value matches.
        matchesByOption.set(item, optionLabel.includes(query) || optionValue.includes(query));
      });

      matchesByOption.forEach((matches, item) => {
        item.hidden = !matches;

        if (matches) {
          this.expandOptionAncestors(item);
        }
      });

      this.syncTreeTabIndexes();
    }, this.debounceTime);

    this.debounceQuery();

    // The panel will close once a selection is made
    // so we need to make sure it's open when the user is typing and the query is not empty
    this.open = true;
  };

  private handleKeydown = (ev: KeyboardEvent) => {
    if (this.disabled) return;

    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();

      const options = this.getVisibleOptions();
      const option = ev.key === 'ArrowDown' ? options[0] : options.at(-1);

      if (this.open) {
        this.focusOption(option);
        return;
      }

      this.pendingOptionFocus = option;
      this.open = true;
      return;
    }

    if (ev.key !== 'Backspace' || !this.multiple) return;

    // Only remove tags if input value is empty (no writing) and there are selected options
    if (this.inputElem?.value === '' && this.selectedOptions.length > 0) {
      ev.preventDefault();
      // Remove one selected option at a time starting from the last one
      const lastOption = this.selectedOptions[this.selectedOptions.length - 1];
      this.handleTagRemove(lastOption);
    }
  };

  private handleInput = (ev: Event) => {
    if (this.disabled || this.isSearchDisabled) return;

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
    this.inputElem?.focus();

    ev.stopPropagation();
  };

  private focusInput = () => {
    this.inputElem?.focus();
    this.collapseInputSelection();
  };

  private collapseInputSelection = () => {
    if (!this.isSearchDisabled || !this.inputElem) return;

    const end = this.inputElem.value.length;
    if (this.inputElem.selectionStart === end && this.inputElem.selectionEnd === end) return;

    this.inputElem.setSelectionRange(end, end);
  };

  private handleTagRemove = (item: HTMLBqOptionElement) => {
    if (this.disabled) return;

    const value = this.removeMultipleSelection(item);
    this.emitSelect(item, value);
  };

  private handleSlotChange = () => {
    this.hasLabel = hasSlotContent(this.labelElem);
    this.hasPrefix = hasSlotContent(this.prefixElem);
    this.hasSuffix = hasSlotContent(this.suffixElem);
    this.hasHelperText = hasSlotContent(this.helperTextElem);
    this.syncOptionsAndValue();
  };

  private resetOptionsVisibility = () => {
    this.getActiveOptions(this.getOptionStructure()).forEach((item) => {
      item.hidden = false;
    });

    this.syncTreeTabIndexes();
  };

  private expandOptionAncestors = (option: HTMLBqOptionElement) => {
    let parentOption = option.parentElement?.closest<HTMLBqOptionElement>('bq-option');

    while (parentOption && this.el.contains(parentOption)) {
      if (!parentOption.expanded) {
        this.searchExpandedOptions.add(parentOption);
        parentOption.expanded = true;
      }

      parentOption = parentOption.parentElement?.closest<HTMLBqOptionElement>('bq-option');
    }
  };

  private hasSelectedDescendant = (option: HTMLBqOptionElement) =>
    this.getActiveOptions(this.getOptionStructure()).some(
      (item) => item !== option && option.contains(item) && item.selected,
    );

  private handleOptionExpansionMutations = (mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      const option = mutation.target as HTMLBqOptionElement;

      if (this.restoringSearchExpandedOptions.has(option)) {
        this.restoringSearchExpandedOptions.delete(option);
        return;
      }

      if (option.expanded && this.searchExpandedOptions.has(option)) return;

      this.searchExpandedOptions.delete(option);
      this.userExpandedOptions.set(option, option.expanded);
    });

    this.syncTreeTabIndexes();
  };

  private observeOptionExpansion = () => {
    this.expansionObserver = new MutationObserver(this.handleOptionExpansionMutations);
    this.expansionObserver.observe(this.el, {
      attributeFilter: ['expanded'],
      attributes: true,
      subtree: true,
    });
  };

  private restoreSearchExpansion = () => {
    this.searchExpandedOptions.forEach((option) => {
      if (!this.el.contains(option)) {
        this.searchExpandedOptions.delete(option);
        this.userExpandedOptions.delete(option);
        return;
      }

      const userExpanded = this.userExpandedOptions.get(option);
      if (userExpanded !== undefined) {
        this.searchExpandedOptions.delete(option);
        option.expanded = userExpanded;
        return;
      }

      if (this.hasSelectedDescendant(option)) return;

      this.restoringSearchExpandedOptions.add(option);
      this.searchExpandedOptions.delete(option);
      option.expanded = false;
    });
  };

  private syncOptionsAndValue = (optionStructure = this.getOptionStructure()) => {
    this.syncNestedOptionsMode(optionStructure);
    this.reportDuplicateNestedOptionValues(optionStructure);
    this.syncOptionPresentation(optionStructure.all);
    this.syncValueState(optionStructure);
  };

  private reportDuplicateNestedOptionValues = (optionStructure: TSelectOptionStructure) => {
    if (!this.hasNestedOptions) {
      this.reportedDuplicateOptionValues.clear();
      return;
    }

    const seenValues = new Set<string>();
    const duplicateValues = new Set<string>();

    optionStructure.all.forEach((option) => {
      if (seenValues.has(option.value)) duplicateValues.add(option.value);
      seenValues.add(option.value);
    });

    this.reportedDuplicateOptionValues.forEach((value) => {
      if (!duplicateValues.has(value)) this.reportedDuplicateOptionValues.delete(value);
    });

    duplicateValues.forEach((value) => {
      if (this.reportedDuplicateOptionValues.has(value)) return;

      console.error(
        `[BqSelect] Duplicate option value "${value}" detected. Option values must be unique within a nested select.`,
      );
      this.reportedDuplicateOptionValues.add(value);
    });
  };

  private syncOptionPresentation = (options: HTMLBqOptionElement[]) => {
    options.forEach((option) => {
      option.checkbox = Boolean(this.multiple && (this.enableCheckboxes || this.hasNestedOptions));
      option.tree = this.hasNestedOptions;
    });

    this.syncTreeTabIndexes(options);
  };

  private getVisibleTreeOptions = () => {
    const options = this.getActiveOptions(this.getOptionStructure());

    return options.filter((option) => this.isVisibleTreeOption(option));
  };

  private getVisibleOptions = () =>
    this.hasNestedOptions
      ? this.getVisibleTreeOptions()
      : this.getActiveOptions(this.getOptionStructure()).filter(this.isSelectableOption);

  private isVisibleTreeOption = (option: HTMLBqOptionElement) => {
    if (!this.isSelectableOption(option)) return false;

    let parentOption = option.parentElement?.closest<HTMLBqOptionElement>('bq-option');

    while (parentOption && this.el.contains(parentOption)) {
      if (parentOption.hidden || !parentOption.expanded) return false;

      parentOption = parentOption.parentElement?.closest<HTMLBqOptionElement>('bq-option');
    }

    return true;
  };

  private getTreeOptionParent = (option: HTMLBqOptionElement) => {
    const parentOption = option.parentElement?.closest<HTMLBqOptionElement>('bq-option');

    return parentOption && this.el.contains(parentOption) ? parentOption : undefined;
  };

  private getTreeOptionChildren = (option: HTMLBqOptionElement) =>
    this.getActiveOptions(this.getOptionStructure()).filter(
      (nestedOption) => this.getTreeOptionParent(nestedOption) === option,
    );

  private isOptionNavigationKey = (key: string) =>
    ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home'].includes(key);

  private navigateFlatOptions = (option: HTMLBqOptionElement, key: string) => {
    const visibleOptions = this.getVisibleOptions();
    const currentIndex = visibleOptions.indexOf(option);
    if (currentIndex < 0) return;

    if (key === 'ArrowDown') {
      this.focusOption(visibleOptions[currentIndex + 1]);
      return;
    }

    if (key === 'ArrowUp') {
      this.focusOption(visibleOptions[currentIndex - 1]);
      return;
    }

    if (key === 'Home') {
      this.focusOption(visibleOptions[0]);
      return;
    }

    if (key === 'End') {
      this.focusOption(visibleOptions.at(-1));
    }
  };

  private navigateTree = (option: HTMLBqOptionElement, key: string) => {
    const visibleOptions = this.getVisibleTreeOptions();
    const currentOption = visibleOptions.includes(option) ? option : visibleOptions[0];
    if (!currentOption) return;

    const currentIndex = visibleOptions.indexOf(currentOption);

    if (key === 'ArrowDown') {
      this.focusTreeOption(visibleOptions[currentIndex + 1]);
      return;
    }

    if (key === 'ArrowUp') {
      this.focusTreeOption(visibleOptions[currentIndex - 1]);
      return;
    }

    if (key === 'Home') {
      this.focusTreeOption(visibleOptions[0]);
      return;
    }

    if (key === 'End') {
      this.focusTreeOption(visibleOptions.at(-1));
      return;
    }

    const children = this.getTreeOptionChildren(currentOption);

    if (key === 'ArrowRight') {
      if (!children.length) return;

      if (!currentOption.expanded) {
        currentOption.expanded = true;
        return;
      }

      this.focusTreeOption(children.find((child) => this.isVisibleTreeOption(child)));
      return;
    }

    if (currentOption.expanded && children.length) {
      currentOption.expanded = false;
      return;
    }

    this.focusTreeOption(this.getTreeOptionParent(currentOption));
  };

  private focusTreeOption = (option?: HTMLBqOptionElement) => {
    if (!option || !this.isVisibleTreeOption(option)) return;

    this.setActiveTreeOption(option);
    option.focus();
  };

  private focusOption = (option?: HTMLBqOptionElement) => {
    if (!option) return;
    if (this.hasNestedOptions) {
      this.focusTreeOption(option);
      return;
    }

    option.tabIndex = -1;
    option.focus();
  };

  private syncTreeTabIndexes = (options = this.getActiveOptions(this.getOptionStructure())) => {
    if (!this.hasNestedOptions) {
      this.activeTreeOption = undefined;
      options.forEach((option) => {
        option.removeAttribute('data-tree-tab-index');
        option.removeAttribute('tabindex');
      });
      return;
    }

    const visibleOptions = options.filter((option) => this.isVisibleTreeOption(option));
    const activeOption =
      this.activeTreeOption && visibleOptions.includes(this.activeTreeOption)
        ? this.activeTreeOption
        : visibleOptions[0];

    this.activeTreeOption = activeOption;
    options.forEach((option) => {
      const tabIndex = option === activeOption ? 0 : -1;
      option.dataset.treeTabIndex = String(tabIndex);
      option.tabIndex = tabIndex;
    });
  };

  private setActiveTreeOption = (option: HTMLBqOptionElement) => {
    if (!this.isVisibleTreeOption(option)) return;

    this.activeTreeOption = option;
    this.syncTreeTabIndexes();
  };

  private syncValueState = (optionStructure: TSelectOptionStructure) => {
    const value = this.normalizeValue(optionStructure);
    const options = this.getActiveOptions(optionStructure);

    if (!this.hasSameValue(this.value, value)) {
      this.value = value;
    }

    this.syncUnsupportedNestedOptionsState(optionStructure);
    this.syncSelectedOptionsState(options, value);
    this.selectedOptions =
      this.multiple && Array.isArray(value) ? options.filter((option) => value.includes(option.value)) : [];
    this.updateDisplayLabel(options, value);
    this.internals.setFormValue(this.getFormValue(value));
    this.updateFormValidity(value);
  };

  private normalizeValue = (optionStructure: TSelectOptionStructure): TSelectValue => {
    if (this.multiple) {
      const value = this.getMultipleValue();

      return this.hasNestedOptions ? this.normalizeNestedValue(value, optionStructure) : value;
    }

    const value = isNil(this.value) ? '' : String(this.value);
    const isNestedValue = optionStructure.nested.some((option) => option.value?.toLowerCase() === value.toLowerCase());

    return isNestedValue ? '' : value;
  };

  private getMultipleValue = (): string[] => {
    if (Array.isArray(this.value)) return this.value;
    if (isNil(this.value) || this.value === '') return [];

    return stringToArray(this.value);
  };

  private normalizeNestedValue = (value: string[], optionStructure: TSelectOptionStructure) => {
    const options = this.getActiveOptions(optionStructure);
    const selectedValues = new Set(value);

    options.forEach((option) => {
      if (!selectedValues.has(option.value)) return;

      this.getOptionAncestors(option, options).forEach((ancestor) => {
        if (this.isSelectableOption(ancestor)) selectedValues.add(ancestor.value);
      });
    });

    return this.getSelectedOptionValues(selectedValues, options);
  };

  private getSelectedOptionValues = (selectedValues: Set<string>, options: HTMLBqOptionElement[]) =>
    options.filter((option) => selectedValues.has(option.value)).map((option) => option.value);

  private toggleOptionValue = (selectedValues: Set<string>, option: HTMLBqOptionElement) => {
    if (selectedValues.has(option.value)) {
      selectedValues.delete(option.value);
      return;
    }

    selectedValues.add(option.value);
  };

  private toggleNestedOptionValue = (
    selectedValues: Set<string>,
    option: HTMLBqOptionElement,
    options: HTMLBqOptionElement[],
  ) => {
    const descendants = this.getOptionDescendants(option, options).filter(this.isSelectableOption);

    if (!descendants.length) {
      this.toggleOptionValue(selectedValues, option);
      if (selectedValues.has(option.value)) {
        this.getOptionAncestors(option, options).forEach((ancestor) => {
          if (this.isSelectableOption(ancestor)) selectedValues.add(ancestor.value);
        });
      } else {
        this.getOptionAncestors(option, options).forEach((ancestor) => {
          const selectedDescendants = this.getOptionDescendants(ancestor, options).some(
            (descendant) => this.isSelectableOption(descendant) && selectedValues.has(descendant.value),
          );

          if (!selectedDescendants) selectedValues.delete(ancestor.value);
        });
      }
      return;
    }

    const selectedDescendantCount = descendants.filter((nestedOption) => selectedValues.has(nestedOption.value)).length;
    const isIndeterminate = selectedDescendantCount > 0 && selectedDescendantCount < descendants.length;
    const isSelected = selectedValues.has(option.value) && !isIndeterminate;
    const optionsToToggle = [option, ...descendants].filter(this.isSelectableOption);

    optionsToToggle.forEach((nestedOption) => {
      if (isSelected) {
        selectedValues.delete(nestedOption.value);
        return;
      }

      selectedValues.add(nestedOption.value);
    });
  };

  private getOptionDescendants = (option: HTMLBqOptionElement, options: HTMLBqOptionElement[]) =>
    options.filter((nestedOption) => nestedOption !== option && option.contains(nestedOption));

  private getOptionAncestors = (option: HTMLBqOptionElement, options: HTMLBqOptionElement[]) => {
    const ancestors: HTMLBqOptionElement[] = [];
    let ancestor = option.parentElement?.closest<HTMLBqOptionElement>('bq-option');

    while (ancestor && this.el.contains(ancestor)) {
      if (options.includes(ancestor)) ancestors.unshift(ancestor);
      ancestor = ancestor.parentElement?.closest<HTMLBqOptionElement>('bq-option');
    }

    return ancestors;
  };

  private isSelectableOption = (option: HTMLBqOptionElement) => !option.disabled && !option.hidden;

  private getSelectionTree = (
    value: TSelectValue,
    optionStructure = this.getOptionStructure(),
  ): TSelectSelectionTreeNode[] => {
    if (!this.hasNestedOptions || !Array.isArray(value)) return [];

    const selectedValues = new Set(value);
    const getSelectedNode = (option: HTMLBqOptionElement): TSelectSelectionTreeNode | undefined => {
      if (!selectedValues.has(option.value)) return undefined;

      const children = optionStructure.all
        .filter((nestedOption) => nestedOption.parentElement?.closest('bq-option') === option)
        .map(getSelectedNode)
        .filter((node): node is TSelectSelectionTreeNode => Boolean(node));

      return { children, value: option.value };
    };

    return optionStructure.topLevel
      .map(getSelectedNode)
      .filter((node): node is TSelectSelectionTreeNode => Boolean(node));
  };

  private emitSelect = (item: HTMLBqOptionElement, value: TSelectValue) => {
    const selectionTree = this.hasNestedOptions ? this.getSelectionTree(value) : undefined;

    this.bqSelect.emit({ item, selectionTree, value });
  };

  private hasSameValue = (value: TSelectValue, nextValue: TSelectValue) => {
    if (Array.isArray(value) && Array.isArray(nextValue)) {
      return value.length === nextValue.length && value.every((item, index) => item === nextValue[index]);
    }

    return value === nextValue;
  };

  private syncSelectedOptionsState = (options: HTMLBqOptionElement[], value: TSelectValue) => {
    const lowerCaseValue = String(value).toLowerCase();

    options.forEach((option) => {
      if (this.multiple && Array.isArray(value)) {
        option.selected = value.includes(option.value);
      } else {
        option.selected = option.value?.toLowerCase() === lowerCaseValue;
      }

      option.toggleAttribute('indeterminate', this.getOptionIndeterminateState(option, options, value));
    });
  };

  private getOptionIndeterminateState = (
    option: HTMLBqOptionElement,
    options: HTMLBqOptionElement[],
    value: TSelectValue,
  ) => {
    if (!this.hasNestedOptions || !Array.isArray(value)) return false;

    const selectableDescendants = this.getOptionDescendants(option, options).filter(this.isSelectableOption);
    if (!selectableDescendants.length) return false;

    const selectedValues = new Set(value);
    const selectedDescendantCount = selectableDescendants.filter((descendant) =>
      selectedValues.has(descendant.value),
    ).length;

    return selectedDescendantCount > 0 && selectedDescendantCount < selectableDescendants.length;
  };

  private updateDisplayLabel = (options: HTMLBqOptionElement[], value: TSelectValue) => {
    const checkedItem = Array.isArray(value) ? undefined : options.find((item) => item.value === value);
    const displayValue = checkedItem ? this.getOptionLabel(checkedItem) : '';

    this.displayValue = displayValue;
    if (this.inputElem) this.inputElem.value = displayValue;
  };

  private getOptionLabel = (item: HTMLBqOptionElement) => {
    if (!item) return '';

    if (item.displayValue) {
      return item.displayValue.trim();
    }

    const defaultSlot = item.shadowRoot?.querySelector('slot:not([name])');
    const label = defaultSlot
      ? getTextContent(defaultSlot as HTMLSlotElement, { recurse: true })
      : item.textContent?.trim();

    return label || item.value || '';
  };

  private updateFormValidity = (value: TSelectValue = this.value) => {
    const { formValidationMessage, internals, required } = this;

    // Clear the validity state
    internals?.states.clear();

    const isEmpty = this.multiple
      ? !Array.isArray(value) || value.length === 0
      : !isDefined(value) || String(value).trim() === '';

    if (required && isEmpty) {
      // Set validity state to invalid
      internals?.states.add('invalid');
      internals?.setValidity(
        { valueMissing: true },
        formValidationMessage || 'Please select an option',
        this.inputElem,
      );
      return;
    }

    // Set validity state to valid if textarea has value or is not required
    internals?.states.add('valid');
    internals?.setValidity({});
  };

  private getOptionStructure = (): TSelectOptionStructure => {
    const all = Array.from(this.el.querySelectorAll<HTMLBqOptionElement>('bq-option'));
    const nested = all.filter((option) => Boolean(option.parentElement?.closest('bq-option')));

    return {
      all,
      hasNestedMarkup: all.some((option) => option.querySelector('bq-option[slot="options"]')),
      nested,
      topLevel: all.filter((option) => !nested.includes(option)),
    };
  };

  private getActiveOptions = (optionStructure: TSelectOptionStructure) =>
    this.hasNestedOptions ? optionStructure.all : optionStructure.topLevel;

  private syncNestedOptionsMode = (optionStructure: TSelectOptionStructure) => {
    const hasUnsupportedNestedOptions = optionStructure.hasNestedMarkup && !this.multiple;

    this.hasNestedOptions = this.multiple && optionStructure.hasNestedMarkup;

    if (!hasUnsupportedNestedOptions) {
      this.hasWarnedUnsupportedNestedOptions = false;
      return;
    }

    if (this.hasWarnedUnsupportedNestedOptions) return;

    console.warn('[BqSelect] Nested options require `multiple` to be enabled. Nested descendants are unavailable.');
    this.hasWarnedUnsupportedNestedOptions = true;
  };

  private syncUnsupportedNestedOptionsState = (optionStructure: TSelectOptionStructure) => {
    if (!optionStructure.hasNestedMarkup || this.hasNestedOptions) return;

    optionStructure.nested.forEach((option) => {
      option.hidden = false;
      option.selected = false;
    });
  };

  private getFormValue = (value: TSelectValue) => (Array.isArray(value) ? value.join(',') : value);

  private updateInternalsAccessibility = () => {
    this.internals.role = 'combobox';
    this.internals.ariaExpanded = this.open ? 'true' : 'false';
  };

  private handleOptionMarkupMutations = (mutations: MutationRecord[]) => {
    if (!mutations.some(this.isOptionMarkupMutation)) return;

    this.syncOptionsAndValue();
  };

  private isOptionMarkupMutation = (mutation: MutationRecord) => {
    if (mutation.type === 'attributes') {
      return isHTMLElement(mutation.target, 'bq-option');
    }

    return [...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)].some(this.isOptionMarkupNode);
  };

  private isOptionMarkupNode = (node: Node) =>
    node instanceof HTMLElement && (node.matches('bq-option') || Boolean(node.querySelector('bq-option')));

  private observeOptions = () => {
    this.optionsObserver = new MutationObserver(this.handleOptionMarkupMutations);
    this.optionsObserver.observe(this.el, {
      attributeFilter: ['slot', 'value'],
      attributes: true,
      childList: true,
      subtree: true,
    });
  };

  private get displayPlaceholder() {
    // Hide the placeholder when multiple selection is enabled and there are selected items
    return this.multiple && this.selectedOptions.length !== 0 ? undefined : this.placeholder;
  }

  private get displayTags() {
    const tags = this.getDisplayTags();

    return tags.map(({ item, label }, index) => {
      if (index < this.maxTagsVisible || this.maxTagsVisible < 0) {
        return (
          <bq-tag
            exportparts="wrapper:tag__base,prefix:tag__prefix,text:tag__text,btn-close:tag__btn-close"
            key={item.value}
            // Prevent the tag from closing the panel when clicked
            onBqClick={(ev: BqTagCustomEvent<HTMLBqTagElement>) => ev.stopPropagation()}
            onBqClose={(event) => {
              // NOTE: prevents triggering bqClose on parent
              event.stopPropagation();
              this.handleTagRemove(item);
            }}
            part="tag"
            removable
            size="xsmall"
            variant="filled"
          >
            {label}
          </bq-tag>
        );
      } else if (index === this.maxTagsVisible) {
        return (
          <bq-tag
            exportparts="wrapper:tag__base,prefix:tag__prefix,text:tag__text,btn-close:tag__btn-close"
            key="more"
            part="tag"
            size="xsmall"
            variant="filled"
          >
            +{tags.length - index}
          </bq-tag>
        );
      }

      return null;
    });
  }

  private getDisplayTags = (): TSelectDisplayTag[] => {
    if (!this.hasNestedOptions) {
      return this.selectedOptions.map((item) => ({ item, label: this.getOptionLabel(item) }));
    }

    const optionStructure = this.getOptionStructure();

    return this.selectedOptions
      .filter((item) => optionStructure.topLevel.includes(item))
      .map((item) => ({ item, label: this.getNestedTagLabel(item, optionStructure) }));
  };

  private getNestedTagLabel = (item: HTMLBqOptionElement, optionStructure: TSelectOptionStructure) => {
    const selectableDescendants = this.getOptionDescendants(item, optionStructure.all).filter(this.isSelectableOption);
    const selectedCount = selectableDescendants.filter((option) => option.selected).length;

    if (!selectedCount || selectedCount === selectableDescendants.length) return this.getOptionLabel(item);

    return `${this.getOptionLabel(item)} (${selectedCount})`;
  };

  private get hasClearIcon() {
    if (this.disableClear || this.disabled) {
      return false;
    }

    if (this.multiple) {
      return this.selectedOptions.length > 0;
    }

    return isDefined(this.displayValue);
  }

  private get isSearchDisabled() {
    return this.disableSearch || this.readonly;
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
          aria-label={this.name || this.fallbackInputId}
          class={{ 'bq-select__label': true, '!hidden': !this.hasLabel }}
          htmlFor={this.name || this.fallbackInputId}
          id={labelId}
          part="label"
          ref={(labelElem: HTMLSpanElement) => {
            this.labelElem = labelElem;
          }}
        >
          <slot name="label" onSlotchange={this.handleSlotChange} />
        </label>
        {/* Select dropdown */}
        <bq-dropdown
          class="bq-select__dropdown w-full"
          disabled={this.disabled}
          disableScrollLock={this.disableScrollLock}
          distance={this.distance}
          exportparts="panel"
          keepOpenOnSelect={this.keepOpenOnSelect}
          open={this.open}
          panelHeight={this.panelHeight}
          placement={this.placement}
          sameWidth={this.sameWidth}
          skidding={this.skidding}
          strategy={this.strategy}
        >
          {/* Input control group */}
          <div
            class={{
              'bq-select__control': true,
              [`validation-${this.validationStatus}`]: true,
              disabled: this.disabled,
              'select-none': this.isSearchDisabled,
            }}
            part="control"
            slot="trigger"
          >
            {/* Prefix */}
            <span
              class={{ 'bq-select__control--prefix': true, '!hidden': !this.hasPrefix }}
              part="prefix"
              ref={(spanElem: HTMLSpanElement) => {
                this.prefixElem = spanElem;
              }}
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
                aria-controls={`bq-options-${this.name}`}
                aria-disabled={this.disabled ? 'true' : 'false'}
                aria-expanded={this.open ? 'true' : 'false'}
                aria-haspopup={this.hasNestedOptions ? 'tree' : 'listbox'}
                autoCapitalize="off"
                autoComplete="off"
                class="bq-select__control--input is-full flex-grow"
                disabled={this.disabled}
                form={this.form}
                id={this.name || this.fallbackInputId}
                name={this.name}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onInput={this.handleInput}
                onKeyDown={this.handleKeydown}
                onSelect={this.collapseInputSelection}
                part="input"
                placeholder={this.displayPlaceholder}
                readOnly={this.isSearchDisabled}
                ref={(inputElem: HTMLInputElement) => {
                  this.inputElem = inputElem;
                }}
                required={this.required}
                role="combobox"
                // Events
                spellcheck={false}
                type="text"
                value={this.displayValue}
              />
            </div>
            {/* Clear Button */}
            {this.hasClearIcon && (
              // The clear button will be visible as long as the input has a value
              // and the parent group is hovered or has focus-within
              <bq-button
                appearance="text"
                border="s"
                class="bq-select__control--clear ms-[--bq-select--gap] hidden [&::part(button)]:border-none [&::part(button)]:p-0"
                exportparts="button"
                label={this.clearButtonLabel}
                onBqClick={this.handleClearClick}
                onlyIcon
                part="clear-btn"
                size="small"
                tabIndex={-1}
              >
                <slot name="clear-icon">
                  <bq-icon aria-hidden="true" class="flex" name="x-circle" />
                </slot>
              </bq-button>
            )}
            {/* Suffix */}
            <span
              class={{ 'bq-select__control--suffix': true, 'rotate-180': this.open, 'rotate-0': !this.open }}
              part="suffix"
              ref={(spanElem: HTMLSpanElement) => {
                this.suffixElem = spanElem;
              }}
            >
              <slot name="suffix" onSlotchange={this.handleSlotChange}>
                <bq-icon class="flex" name="caret-down" />
              </slot>
            </span>
          </div>
          {this.hasNestedOptions ? (
            <bq-option-list
              aria-multiselectable="true"
              exportparts="base:option-list"
              id={`bq-options-${this.name}`}
              onBqSelect={this.handleSelect}
              role="tree"
            >
              <slot onSlotchange={this.handleSlotChange} />
            </bq-option-list>
          ) : (
            <bq-option-list
              exportparts="base:option-list"
              id={`bq-options-${this.name}`}
              onBqSelect={this.handleSelect}
              role="listbox"
            >
              <slot onSlotchange={this.handleSlotChange} />
            </bq-option-list>
          )}
        </bq-dropdown>
        {/* Helper text */}
        <div
          class={{
            [`bq-select__helper-text validation-${this.validationStatus}`]: true,
            '!hidden': !this.hasHelperText,
          }}
          part="helper-text"
          ref={(divElem: HTMLDivElement) => {
            this.helperTextElem = divElem;
          }}
        >
          <slot name="helper-text" onSlotchange={this.handleSlotChange} />
        </div>
      </div>
    );
  }
}
