import { h, Component, Prop } from '@stencil/core';
import { TMenuItemSize } from './bq-menu.types';

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

  /** The size of the menu item */
  @Prop({ reflect: true }) size: TMenuItemSize = 'medium';

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
      <menu
        role="menu"
        class={{
          'bq-menu': true,
        }}
      >
        <li
          class={{
            'bq-menu__item': true,
            [`${this.size}`]: true,
          }}
          tabindex="0"
          role="menuitem"
        >
          <div class="bq-menu__item__container">
            <bq-icon
              class="bq-menu__item__container__icon"
              name="user"
              size={this.size === 'medium' ? '16' : '14'}
              role="img"
              title="Menu item"
            />
            <span
              class={{
                'bq-menu__item__container__label': true,
                [`label--${this.size}`]: true,
              }}
            >
              Label
            </span>
          </div>
        </li>
      </menu>
    );
  }
}
