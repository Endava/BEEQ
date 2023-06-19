import { h, Component, Prop } from '@stencil/core';

@Component({
  tag: 'bq-side-menu-item',
  styleUrl: './scss/bq-side-menu-item.scss',
  shadow: true,
})
export class BqSideMenuItem {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true, the menu item will be shown as active/selected. */
  @Prop({ reflect: true }) active: boolean = false;

  /** If true, the container will reduce its width */
  @Prop({ reflect: true }) collapse: boolean = false;

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
      // Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
      <a
        href="#"
        class={{ 'bq-side-menu--item': true, active: this.active, 'is-collapsed': this.collapse }}
        role="menuitem"
      >
        <slot />
      </a>
    );
  }
}
