import { Component, Element, h, Prop, Watch } from '@stencil/core';

import { ACCORDION_SIZE, TAccordionSize } from './bq-accordion.types';
import { validatePropValue } from '../../shared/utils';

/**
 * @part base - The `<details>` that holds the accordion content
 * @part header - The `<summary>` that holds the accordion header content
 * @part text - The `<span>` that holds the accordion header text
 */
@Component({
  tag: 'bq-accordion',
  styleUrl: './scss/bq-accordion.scss',
  shadow: true,
})
export class BqAccordion {
  // Own Properties
  // ====================

  @Element() el!: HTMLBqAccordionElement;

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  @Prop({ reflect: true, mutable: true }) expanded: boolean = false;

  @Prop({ reflect: true, mutable: true }) size: TAccordionSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(ACCORDION_SIZE, 'medium', this.el, 'size');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
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

  private handleClick = (event: MouseEvent) => {
    event.preventDefault();
    this.expanded = !this.expanded;
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <details
        class={{ [`bq-accordion ${this.size}`]: true }}
        open={this.expanded}
        onClick={this.handleClick}
        part="base"
      >
        <summary class="bq-accordion__summary" part="header">
          <div class="bq-accordion__summary-text" part="text">
            <slot name="header" />
          </div>
          <div class={{ hidden: this.expanded }}>
            <slot name="expanded">
              <bq-icon name="plus" size={24} />
            </slot>
          </div>
          <div class={{ hidden: !this.expanded }}>
            <slot name="collapsed">
              <bq-icon name="minus" size={24} />
            </slot>
          </div>
        </summary>
        <slot />
      </details>
    );
  }
}
