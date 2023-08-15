import { h, Component, Prop, Element, State, Event, EventEmitter, Listen } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

/**
 * @part base - The component's internal wrapper.
 * @part label - The `span` element in which the label text is displayed.
 * @part prefix - The `span` element in which the prefix is displayed (generally `bq-icon`).
 * @part suffix - The `span` element in which the suffix is displayed (generally `bq-icon`).
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
  @Event({ bubbles: false }) bqBlur: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called when item is focused */
  @Event({ bubbles: false }) bqFocus: EventEmitter<HTMLBqOptionElement>;

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
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqBlur.emit(this.el);
  };

  private onFocus = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqFocus.emit(this.el);
  };

  private onClick = (event: Event) => {
    if (this.disabled) {
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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        class={{
          'bq-option': true,
          disabled: this.disabled,
          active: !this.disabled && this.selected,
        }}
        role="option"
        aria-selected={this.selected}
        aria-disabled={this.disabled}
        tabindex={this.disabled ? '-1' : '0'}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onClick={this.onClick}
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
    );
  }
}
