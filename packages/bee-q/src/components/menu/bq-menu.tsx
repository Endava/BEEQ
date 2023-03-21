import { h, Component, Prop } from '@stencil/core';

@Component({
  tag: 'bq-menu',
  styleUrl: './scss/bq-menu.scss',
  shadow: true,
})
export class BqMenu {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Toggle menu */
  @Prop() collapsible = true;

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
      <aside class="bq-menu" role="menu" aria-label="Side menu" part="group">
        <span class="bq-menu__header" part="header">
          <slot name="header" />
        </span>

        <span class="bq-menu__content">
          <slot />
        </span>

        {this.collapsible && (
          <footer class="bq-menu__footer">
            <bq-button appearance="text">
              <bq-icon name="arrow-line-left" size="24" slot="prefix"></bq-icon>
              <slot name="footer" />
            </bq-button>
          </footer>
        )}
      </aside>
    );
  }
}
