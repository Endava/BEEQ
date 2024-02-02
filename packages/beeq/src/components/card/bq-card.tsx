import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

import { CARD_TYPE, TCardType } from './bq-card.types';
import { validatePropValue } from '../../shared/utils';

/**
 *  @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM
 */
@Component({
  tag: 'bq-card',
  styleUrl: './scss/bq-card.scss',
  shadow: true,
})
export class BqCard {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqCardElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Type of card component */
  @Prop({ reflect: true }) type: TCardType = 'default';

  // Prop lifecycle events
  // =======================

  @Watch('type')
  checkPropValue() {
    validatePropValue(CARD_TYPE, 'default', this.el, 'type');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValue();
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
        <div
          class={{
            [`bq-card bq-card__${this.type}`]: true,
          }}
          part="wrapper"
        >
          <slot />
        </div>
      </Host>
    );
  }
}
