import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

import { EMPTY_STATE_SIZE, SIZE_TO_VALUE_MAP, TEmptyStateSize } from './bq-empty-state.types';
import { validatePropValue } from '../../shared/utils';

/**
 * @part body - The container `<div>` that wraps the alert description content
 * @part footer - The container `<div>` that wraps the alert footer content
 * @part icon - The `<bq-icon>` element used to render a predefined icon size based on the empty state size (small, medium, large)
 * @part title - The container `<div>` that wraps the empty state title content
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM
 */

@Component({
  tag: 'bq-empty-state',
  styleUrl: './scss/bq-empty-state.scss',
  shadow: true,
})
export class BqEmptyState {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqEmptyStateElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The size of the empty state component */
  @Prop({ reflect: true, mutable: true }) size: TEmptyStateSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(EMPTY_STATE_SIZE, 'medium', this.el, 'size');
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

  private get iconSize(): number {
    return SIZE_TO_VALUE_MAP[this.size] || SIZE_TO_VALUE_MAP.medium;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <div class="bq-empty-state" part="wrapper">
          <div class={{ [`bq-empty-state-icon-margin-bottom__${this.size}`]: true }}>
            <slot name="icon">
              <bq-icon size={this.iconSize} name="database" part="icon" exportparts="base,svg" />
            </slot>
          </div>
          <div
            class={{
              'title-font font-bold leading-regular text-text-primary': true,
              [`bq-empty-state-title-font-size__${this.size}`]: true,
              [`bq-empty-state-title-margin-bottom__${this.size}`]: true,
            }}
            part="title"
          >
            <slot />
          </div>
          <div
            class={{
              'font-normal leading-regular': true,
              [`bq-empty-state-body-font-size__${this.size}`]: true,
              [`bq-empty-state-body-margin-bottom__${this.size}`]: true,
            }}
            part="body"
          >
            <slot name="body" />
          </div>
          <div class={{ 'flex items-start gap-xs': true }} part="footer">
            <slot name="footer" />
          </div>
        </div>
      </Host>
    );
  }
}
