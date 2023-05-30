import { h, Component, Host, Element } from '@stencil/core';

import { isHTMLElement } from '../../shared/utils';

@Component({
  tag: 'bq-option-group',
  styleUrl: './scss/bq-option-group.scss',
  shadow: true,
})
export class BqOptionGroup {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    const slotElements = this.el.shadowRoot
      .querySelector<HTMLSlotElement>('[part="group"] > slot')
      .assignedElements({ flatten: true })
      .filter((elem: HTMLElement) => isHTMLElement(elem, 'bq-option')) as [HTMLBqOptionElement];

    slotElements.forEach((bqOption: HTMLBqOptionElement) => bqOption?.setPaddingToOption());
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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <legend class="label">
          <span class="label__child" part="prefix">
            <slot name="header-prefix" />
          </span>
          <span class="label__child label-text" part="label">
            <slot name="header-label" />
          </span>
          <span class="label__child suffix" part="suffix">
            <slot name="header-suffix" />
          </span>
        </legend>
        <div class="group" role="group" part="group">
          <slot />
        </div>
      </Host>
    );
  }
}
