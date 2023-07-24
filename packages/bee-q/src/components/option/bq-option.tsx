import { h, Component, Prop, Element, State, Event, EventEmitter, Listen, Method } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

/**
 * @part label - The `span` element in which the label text is displayed
 * @part prefix - The `span` element in which the prefix is displayed (generally `bq-icon`)
 * @part suffix - The `span` element in which the suffix is displayed (generally `bq-icon`)
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

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqOptionElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasPrefix: boolean = false;

  // Public Property API
  // ========================

  /** If true, the `bq-option` is disabled. */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** A string representing the value of the option. */
  @Prop({ reflect: true }) value?: string;

  /** If true, the option is selected and active. */
  @Prop({ reflect: true }) selected: boolean = false;

  /** If true, option element is part of a group */
  @Prop({ reflect: true }) isOptionInGroup: boolean = false;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when item loses focus */
  @Event() bqOptionBlur: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called when item is focused */
  @Event() bqOptionFocus: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called when item is clicked */
  @Event() bqOptionClick: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called on enter key press */
  @Event() bqOptionEnter: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called on enter key up */
  @Event() bqOnEnterKeyUp: EventEmitter<HTMLBqOptionElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  // Listeners
  // ==============

  @Listen('keydown')
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.bqOptionEnter.emit(this.el);
  }

  @Listen('keyup')
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') this.bqOnEnterKeyUp.emit(this.el);
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  @Method()
  async setPaddingToOption() {
    this.isOptionInGroup = true;
  }

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

    this.bqOptionBlur.emit(this.el);
  };

  private onFocus = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqOptionFocus.emit(this.el);
  };

  private onClick = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqOptionClick.emit(this.el);
  };

  private onSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
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
          'option-group': this.isOptionInGroup,
        }}
        role="option"
        aria-selected={this.selected}
        tabindex={this.disabled ? '-1' : '0'}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onClick={this.onClick}
      >
        <span class="bq-option__child" ref={(elem) => (this.prefixElem = elem)} part="prefix">
          <slot name="prefix" onSlotchange={this.onSlotChange} />
        </span>
        <span
          class={{
            'bq-option__child': true,
            label: true,
            'no-prefix': !this.hasPrefix,
          }}
          part="label"
        >
          <slot />
        </span>
        <span class="bq-option__child suffix" part="suffix">
          <slot name="suffix" />
        </span>
      </div>
    );
  }
}
