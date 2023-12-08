import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'bq-tag',
  styleUrl: './scss/bq-tag.scss',
  shadow: true,
})
export class BqTag {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true, the tag component has an icon */
  @Prop({ reflect: true }) hasIcon: boolean;

  /** If true, the tag component can be closed */
  @Prop({ reflect: true }) isRemovable: boolean;

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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <div class="bq-tag gap-2 px-s py-xs2 text-m font-medium leading-regular" part="wrapper">
          <div class="bq-tag__icon">
            <slot name="icon">
              <bq-icon name="star" part="icon" exportparts="base,svg" />
            </slot>
          </div>
          <div class="bq-tag__label">
            <slot name="tag" />
          </div>
          {this.isRemovable && (
            <bq-button class="bq-tag__close" appearance="text" size="small" part="btn-close">
              <bq-icon name="x-circle" />
            </bq-button>
          )}
        </div>
      </Host>
    );
  }
}
