import { h, Component, Prop } from '@stencil/core';

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
      <aside class={{ 'bq-side-menu': true, 'is-collapsed': this.collapse }} part="base">
        {/* Company logo and name */}
        <div class={{ 'bq-side-menu--logo': true, 'is-collapsed': this.collapse }} part="logo">
          <slot name="logo" />
        </div>
        <nav role="menu">
          <slot />
        </nav>
      </aside>
    );
  }
}
