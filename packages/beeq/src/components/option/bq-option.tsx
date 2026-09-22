import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Fragment, Host, h, Listen, Prop, State } from '@stencil/core';

import {
  getTextContent,
  hasSlot,
  hasSlotContent,
  isEventTargetChildOfElement,
  isHTMLElement,
} from '../../shared/utils';

/**
 * An option refers to a specific choice that appears in a list of selectable items that can be opened or closed by the user.
 * It can be an element of the navigation system that allows users to select different sections or pages within an application or it can be used within a dropdown list.
 *
 * @example How to use it
 * ```html
 * <bq-option value="user">
 *   <span>User profile</span>
 *   <bq-icon slot="suffix" name="user"></bq-icon>
 * </bq-option>
 * ```
 *
 * @documentation https://storybook.beeq.design/?path=/story/components-option--with-option-group
 * @status stable
 *
 * @dependency bq-checkbox
 * @dependency bq-button
 * @dependency bq-icon
 *
 * @attr {boolean} disabled - If true, the option is disabled.
 * @attr {boolean} hidden - If true, the option is hidden.
 * @attr {boolean} checkbox - If true, the option renders as a checkbox option.
 * @attr {boolean} expanded - If true, nested options are displayed.
 * @attr {string} value - A string representing the value of the option. Can be used to identify the item.
 * @attr {boolean} selected - If true, the option is selected and active.
 *
 * @event bqBlur - Handler to be called when item loses focus.
 * @event bqFocus - Handler to be called when item is focused.
 * @event bqClick - Handler to be called when item is clicked.
 * @event bqEnter - Handler to be called on enter key press.
 *
 * @slot prefix - The prefix content to be displayed before the label.
 * @slot - The label content to be displayed.
 * @slot suffix - The suffix content to be displayed after the label.
 * @slot expand-label - Optional text displayed in the expand or collapse control.
 * @slot options - Nested option items displayed when the option is expanded.
 *
 * @part base - The option selection control.
 * @part item - The interactive option row.
 * @part label - The `span` element in which the label text is displayed.
 * @part prefix - The `span` element in which the prefix is displayed (generally `bq-icon`).
 * @part suffix - The `span` element in which the suffix is displayed (generally `bq-icon`).
 * @part checkbox-base - The checkbox base wrapper exported from the nested `bq-checkbox`.
 * @part checkbox-control - The checkbox control wrapper exported from the nested `bq-checkbox`.
 * @part checkbox-input - The native checkbox input exported from the nested `bq-checkbox`.
 * @part checkbox-checkbox - The checkbox indicator exported from the nested `bq-checkbox`.
 * @part checkbox-label - The checkbox label exported from the nested `bq-checkbox`.
 * @part expand - The button used to expand or collapse nested options.
 * @part expand-button - The native button exported from the expand control.
 * @part expand-label - The label exported from the expand control.
 * @part selected-descendant - The status displayed when a collapsed option contains selected nested options.
 * @part options - The container for nested options.
 *
 * @cssprop --bq-option--background - background color
 * @cssprop --bq-option--font-size - font size
 * @cssprop --bq-option--border-color - border color
 * @cssprop --bq-option--border-style - border style
 * @cssprop --bq-option--border-width - border width
 * @cssprop --bq-option--border-radius - border radius
 * @cssprop --bq-option--box-shadow - box shadow
 * @cssprop --bq-option--gap-start - gap space between prefix and label
 * @cssprop --bq-option--gap-end - gap space between label and suffix
 * @cssprop --bq-option--paddingY - padding Y axis
 * @cssprop --bq-option--padding-start - option label padding start
 * @cssprop --bq-option--padding-end - option label padding end
 */
@Component({
  tag: 'bq-option',
  styleUrl: './scss/bq-option.scss',
  shadow: true,
})
export class BqOption {
  // Own Properties
  // ====================

  private prefixElem: HTMLElement;
  private suffixElem: HTMLElement;
  private checkboxElem?: HTMLBqCheckboxElement;
  private expandElem?: HTMLBqButtonElement;
  private optionsElem?: HTMLElement;
  private selectedDescendantObserver?: MutationObserver;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqOptionElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasExpandLabel: boolean = false;
  @State() hasOptions: boolean = false;
  @State() hasPrefix: boolean = false;
  @State() selectedDescendantCount = 0;
  @State() selectedDescendantLabel?: string;
  @State() hasSuffix: boolean = false;

  // Public Property API
  // ========================

  /** If true, the option is hidden. */
  @Prop({ reflect: true }) hidden: boolean = false;

  /** If true, the option is disabled. */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** If true, the option renders as a checkbox option. */
  @Prop({ reflect: true }) checkbox = false;

  /** The display value of the option. It can be used to override the default displayed value. */
  @Prop({ reflect: true }) displayValue?: string;

  /** If true, nested options are displayed. */
  @Prop({ reflect: true, mutable: true }) expanded = false;

  /** If true, the option is selected and active. */
  @Prop({ reflect: true }) selected: boolean = false;

  /** @internal Applied by `bq-select` when rendering nested options with tree semantics. */
  @Prop({ reflect: true }) tree = false;

  /** A string representing the value of the option. Can be used to identify the item */
  @Prop({ reflect: true }) value?: string;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when item loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called when item is focused */
  @Event() bqFocus: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called when item is clicked */
  @Event() bqClick: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called on enter key press */
  @Event() bqEnter: EventEmitter<HTMLBqOptionElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.handleSlotChange();
    this.observeSelectedDescendants();
  }

  componentDidRender() {
    this.syncExpandButtonState();
  }

  disconnectedCallback() {
    this.selectedDescendantObserver?.disconnect();
  }

  // Listeners
  // ==============

  @Listen('keydown')
  onKeyDown(event: KeyboardEvent) {
    if (this.isEventFromNestedOption(event)) return;
    if (isEventTargetChildOfElement(event, this.expandElem)) return;
    if (this.isTreeItem) {
      this.handleTreeItemKeydown(event);
      return;
    }
    if (event.key !== 'Enter') return;
    // Prevent the default behavior to avoid triggering a synthetic click event
    event.preventDefault();
    this.bqEnter.emit(this.el);
  }

  @Listen('bqChange')
  onCheckboxChange(event: CustomEvent<{ checked: boolean }>) {
    if (!this.checkbox || !isEventTargetChildOfElement(event, this.checkboxElem)) return;

    event.stopImmediatePropagation();
    this.bqClick.emit(this.el);
  }

  @Listen('bqFocus')
  onCheckboxFocus(event: CustomEvent<HTMLBqCheckboxElement>) {
    if (!this.checkbox || !isEventTargetChildOfElement(event, this.checkboxElem)) return;

    event.stopImmediatePropagation();
    this.bqFocus.emit(this.el);
  }

  @Listen('bqBlur')
  onCheckboxBlur(event: CustomEvent<HTMLBqCheckboxElement>) {
    if (!this.checkbox || !isEventTargetChildOfElement(event, this.checkboxElem)) return;

    event.stopImmediatePropagation();
    this.bqBlur.emit(this.el);
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

  private onBlur = (event: Event) => {
    if (this.isDisabledOrHidden) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqBlur.emit(this.el);
  };

  private onFocus = (event: Event) => {
    if (this.isDisabledOrHidden) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqFocus.emit(this.el);
  };

  private onClick = (event: Event) => {
    if (this.isDisabledOrHidden) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqClick.emit(this.el);
  };

  private onTreeItemClick = (event: Event) => {
    if (this.isEventFromNestedOption(event)) return;
    if (isEventTargetChildOfElement(event, this.expandElem)) return;

    this.onClick(event);
  };

  private handleSlotChange = () => {
    this.hasExpandLabel = hasSlot(this.el, 'expand-label');
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
    this.hasOptions = hasSlotContent(this.optionsElem);
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
    this.syncSelectedDescendants();
  };

  private handleExpandClick = (event: CustomEvent<HTMLBqButtonElement>) => {
    event.stopPropagation();

    if (this.isDisabledOrHidden) {
      event.preventDefault();
      return;
    }

    this.expanded = !this.expanded;
  };

  private syncExpandButtonState = () => {
    const expandButton = this.expandElem?.shadowRoot?.querySelector<HTMLButtonElement>('[part="button"]');
    if (!expandButton) return;

    expandButton?.setAttribute('aria-expanded', this.expanded ? 'true' : 'false');

    if (!this.isTreeItem) return;

    expandButton.setAttribute('aria-hidden', 'true');
    expandButton.tabIndex = -1;
  };

  private get optionLabel() {
    const labelSlot = this.el.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    const label = labelSlot
      ? getTextContent(labelSlot, { recurse: true }) || this.el.textContent?.trim()
      : this.el.textContent?.trim();

    return label || this.value || 'option';
  }

  private get selectedDescendantStatus() {
    if (this.expanded || !this.selectedDescendantCount) return undefined;

    if (this.selectedDescendantCount === 1) {
      return `${this.selectedDescendantLabel} selected`;
    }

    return `${this.selectedDescendantCount} selected`;
  }

  private get selectedDescendantAccessibleLabel() {
    const status = this.selectedDescendantStatus;

    return status ? `${this.optionLabel}, ${status}` : undefined;
  }

  private get isDisabledOrHidden() {
    return this.disabled || this.hidden;
  }

  private get isTreeItem() {
    return this.tree || this.hasOptions || Boolean(this.el.parentElement?.closest('bq-option'));
  }

  private isEventFromNestedOption = (event: Event) => {
    const sourceOption = event.composedPath().find((target) => isHTMLElement(target, 'bq-option'));
    if (!isHTMLElement(sourceOption, 'bq-option')) return false;

    return sourceOption !== this.el && this.el.contains(sourceOption);
  };

  private getOptionLabel = (option: HTMLBqOptionElement) => {
    if (option.displayValue) return option.displayValue.trim();

    const labelSlot = option.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    const label = labelSlot ? getTextContent(labelSlot, { recurse: true }) : option.textContent?.trim();

    return label || option.value || 'option';
  };

  private handleTreeItemKeydown = (event: KeyboardEvent) => {
    if (this.isDisabledOrHidden) return;

    if (event.key === 'ArrowRight' && this.hasOptions && !this.expanded) {
      event.preventDefault();
      this.expanded = true;
      return;
    }

    if (event.key === 'ArrowLeft' && this.hasOptions && this.expanded) {
      event.preventDefault();
      this.expanded = false;
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    this.bqEnter.emit(this.el);
  };

  private observeSelectedDescendants = () => {
    this.selectedDescendantObserver = new MutationObserver(this.syncSelectedDescendants);
    this.selectedDescendantObserver.observe(this.el, {
      attributeFilter: ['selected'],
      attributes: true,
      childList: true,
      subtree: true,
    });
  };

  private syncSelectedDescendants = () => {
    const selectedDescendants = Array.from(this.el.querySelectorAll<HTMLBqOptionElement>('bq-option[selected]'));

    this.selectedDescendantCount = selectedDescendants.length;
    this.selectedDescendantLabel = selectedDescendants[0] ? this.getOptionLabel(selectedDescendants[0]) : undefined;
  };

  private renderOptionContent = (displayClass: 'flex' | 'inline-flex') => (
    <Fragment>
      <span
        class={{
          [`bq-option__prefix me-[--bq-option--gap-start] ${displayClass} items-center`]: true,
          '!hidden': !this.hasPrefix,
        }}
        part="prefix"
        ref={(elem) => {
          this.prefixElem = elem;
        }}
      >
        <slot name="prefix" onSlotchange={this.handleSlotChange} />
      </span>
      <span class="bq-option__label" part="label">
        <slot />
      </span>
      <span
        class={{
          [`bq-option__suffix ms-[--bq-option--gap-end] ml-auto ${displayClass} items-center`]: true,
          '!hidden': !this.hasSuffix,
        }}
        part="suffix"
        ref={(elem) => {
          this.suffixElem = elem;
        }}
      >
        <slot name="suffix" onSlotchange={this.handleSlotChange} />
      </span>
    </Fragment>
  );

  private renderExpandButton = () => (
    <bq-button
      aria-label={`${this.expanded ? 'Collapse' : 'Expand'} ${this.optionLabel}`}
      appearance="text"
      class="bq-option__expand"
      disabled={this.isDisabledOrHidden}
      exportparts="button:expand-button,label:expand-label"
      label={`${this.expanded ? 'Collapse' : 'Expand'} ${this.optionLabel}`}
      onBqClick={this.handleExpandClick}
      onlyIcon={!this.hasExpandLabel}
      part="expand"
      ref={(element) => {
        this.expandElem = element;
      }}
      size="small"
      type="button"
    >
      <span class={{ 'bq-option__expand-label text-s': true, '!hidden': !this.hasExpandLabel }}>
        <slot name="expand-label" onSlotchange={this.handleSlotChange} />
      </span>
      <bq-icon
        aria-hidden="true"
        name={this.expanded ? 'caret-up' : 'caret-down'}
        size={16}
        slot={this.hasExpandLabel ? 'suffix' : undefined}
      />
    </bq-button>
  );

  private renderNestedOptions = () => (
    <div
      aria-hidden={!this.hasOptions || !this.expanded ? 'true' : 'false'}
      class={{ 'bq-option__options': true, '!hidden': !this.hasOptions || !this.expanded }}
      part="options"
      ref={(element) => {
        this.optionsElem = element;
      }}
      role={this.isTreeItem && this.hasOptions ? 'group' : undefined}
    >
      <slot name="options" onSlotchange={this.handleSlotChange} />
    </div>
  );

  private renderSelectedDescendantStatus = () => {
    if (!this.selectedDescendantStatus) return;

    return (
      <span aria-hidden="true" class="bq-option__selected-descendant" part="selected-descendant">
        {this.selectedDescendantStatus}
      </span>
    );
  };

  private renderSelectionControl = () => {
    if (this.isTreeItem) {
      return (
        <div class="bq-option" part="base">
          {this.renderOptionContent('flex')}
        </div>
      );
    }

    if (this.checkbox) {
      return (
        <bq-checkbox
          aria-label={this.optionLabel}
          checked={this.selected}
          class="bq-option__checkbox"
          disabled={this.isDisabledOrHidden}
          name={this.optionLabel}
          exportparts="base:checkbox-base,control:checkbox-control,input:checkbox-input,checkbox:checkbox-checkbox,label:checkbox-label"
          part="base"
          ref={(element) => {
            this.checkboxElem = element;
          }}
          value={this.value || 'option'}
        >
          {this.renderOptionContent('inline-flex')}
        </bq-checkbox>
      );
    }

    return (
      <button
        class="bq-option"
        disabled={this.disabled}
        onBlur={this.onBlur}
        onClick={this.onClick}
        onFocus={this.onFocus}
        part="base"
        tabindex={this.isDisabledOrHidden ? '-1' : '0'}
        type="button"
      >
        {this.renderOptionContent('flex')}
      </button>
    );
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host
        aria-disabled={this.isDisabledOrHidden ? 'true' : 'false'}
        aria-expanded={this.isTreeItem && this.hasOptions ? (this.expanded ? 'true' : 'false') : undefined}
        aria-hidden={this.hidden ? 'true' : 'false'}
        aria-label={this.selectedDescendantAccessibleLabel}
        aria-selected={this.selected ? 'true' : 'false'}
        onBlur={this.isTreeItem ? this.onBlur : undefined}
        onClick={this.isTreeItem ? this.onTreeItemClick : undefined}
        onFocus={this.isTreeItem ? this.onFocus : undefined}
        role={this.isTreeItem ? 'treeitem' : 'option'}
        tabindex={this.isTreeItem && !this.isDisabledOrHidden ? '0' : undefined}
      >
        <div class="bq-option__item" part="item">
          {this.renderSelectionControl()}
          {this.renderSelectedDescendantStatus()}
          {this.hasOptions && this.renderExpandButton()}
        </div>
        {this.renderNestedOptions()}
      </Host>
    );
  }
}
