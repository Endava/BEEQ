import { Component, Element, h, Prop, Watch } from '@stencil/core';

import { isNil } from '../../shared/utils';

@Component({
  tag: 'bq-accordion-group',
  styleUrl: './scss/bq-accordion-group.scss',
  shadow: true,
})
export class BqAccordionGroup {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAccordionGroupElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  @Prop({ reflect: true }) expandAll: boolean;

  // Prop lifecycle events
  // =======================

  @Watch('expandAll')
  checkPropValues() {
    this.bqAccordionElements.forEach((bqAccordionElement) => {
      // NOTE: if expandAll is nil we will keep accordion default state
      if (!isNil(this.expandAll)) {
        bqAccordionElement.expanded = this.expandAll;
      }
    });
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

  private get bqAccordionElements(): HTMLBqAccordionElement[] {
    return Array.from(this.el.querySelectorAll('bq-accordion'));
  }
  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-accordion-group">
        <slot />
      </div>
    );
  }
}
