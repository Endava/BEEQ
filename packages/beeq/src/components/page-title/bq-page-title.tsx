import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'bq-page-title',
  styleUrl: './scss/bq-page-title.scss',
  shadow: true,
})
export class BqPageTitle {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  /** If true, the page title back icon will be shown */
  @Prop({ reflect: true }) showBackIcon: boolean;

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
      <div class="flex items-center gap-xs px-xxl4 py-xl" part="wrapper">
        {/* BACK ICON */}
        <div class={{ 'flex items-center p-s': true, hidden: !this.showBackIcon }} part="back">
          <slot name="back">
            <bq-icon
              color="text--primary"
              name="arrow-left"
              size="24"
              weight="bold"
              part="icon"
              exportparts="base,svg"
            />
          </slot>
        </div>
        <div class="title-font text-xxl font-bold leading-regular text-text-primary" part="title">
          <slot />
        </div>
      </div>
    );
  }
}
