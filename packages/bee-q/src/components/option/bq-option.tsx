import { h, Component, Prop, Element, State } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

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

  @State() hasPrefix = false;

  // Public Property API
  // ========================

  /** If true, the dropdown item is disabled */
  @Prop({ reflect: true }) disabled?: boolean = false;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

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
        }}
        aria-role="listitem"
        tabindex={this.disabled ? '-1' : '0'}
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
