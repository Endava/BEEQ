import { h, Component } from '@stencil/core';

@Component({
  tag: 'bq-side-menu',
  styleUrl: './scss/bq-side-menu.scss',
  shadow: true,
})
export class BqSideMenu {
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
      <div class="bq-side-menu flex grow flex-col overflow-y-auto bg-ui-secondary-light p-xs" part="base">
        {/* Company logo and name */}
        <div
          class="bq-side-menu--logo box-content flex max-h-10 shrink-0 items-center p-l text-[color:var(--bq-side-menu--logo-color)]"
          part="logo"
        >
          <slot name="logo" />
        </div>
      </div>
    );
  }
}
