import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

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
 * @attr {boolean} disabled - If true, the option is disabled.
 * @attr {boolean} hidden - If true, the option is hidden.
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
 *
 * @part base - The component's internal wrapper.
 * @part label - The `span` element in which the label text is displayed.
 * @part prefix - The `span` element in which the prefix is displayed (generally `bq-icon`).
 * @part suffix - The `span` element in which the suffix is displayed (generally `bq-icon`).
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

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqOptionElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasPrefix: boolean = false;
  @State() hasSuffix: boolean = false;

  // Public Property API
  // ========================

  /** If true, the option is hidden. */
  @Prop({ reflect: true }) hidden: boolean = false;

  /** If true, the option is disabled. */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** A string representing the value of the option. Can be used to identify the item */
  @Prop({ reflect: true }) value?: string;

  /** If true, the option is selected and active. */
  @Prop({ reflect: true }) selected: boolean = false;

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

  // Listeners
  // ==============

  @Listen('keydown')
  onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    this.bqEnter.emit(this.el);
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

  private onSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
  };

  private handleSuffixSlotChange = () => {
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
  };

  private get isDisabledOrHidden() {
    return this.disabled || this.hidden;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host
        aria-disabled={this.isDisabledOrHidden ? 'true' : 'false'}
        aria-hidden={this.hidden ? 'true' : 'false'}
        aria-selected={this.selected ? 'true' : 'false'}
        role="option"
      >
        <div
          class={{
            'bq-option': true,
            disabled: this.disabled,
            active: !this.disabled && this.selected,
          }}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onClick={this.onClick}
          tabindex={this.isDisabledOrHidden ? '-1' : '0'}
          role="button"
          part="base"
        >
          <span
            class={{
              'bq-option__prefix me-[--bq-option--gap-start] flex items-center': true,
              '!hidden': !this.hasPrefix,
            }}
            ref={(elem) => (this.prefixElem = elem)}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.onSlotChange} />
          </span>
          <span class="bq-option__label" part="label">
            <slot />
          </span>
          <span
            class={{
              'bq-option__suffix ml-auto ms-[--bq-option--gap-end] flex items-center': true,
              '!hidden': !this.hasSuffix,
            }}
            ref={(elem) => (this.suffixElem = elem)}
            part="suffix"
          >
            <slot name="suffix" onSlotchange={this.handleSuffixSlotChange} />
          </span>
        </div>
      </Host>
    );
  }
}
