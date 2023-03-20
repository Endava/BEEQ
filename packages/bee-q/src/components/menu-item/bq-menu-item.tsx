import { h, Component, Prop } from '@stencil/core';

import { TMenuItemSize } from './bq-menu-item.types';

@Component({
  tag: 'bq-menu-item',
  styleUrl: './scss/bq-menu-item.scss',
  shadow: true,
})
export class BqMenuItem {
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

  /** State of menu item */
  @Prop() disabled = false;

  @Prop({ reflect: true }) href: string | undefined = undefined;

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
    /** wrapper element needed to show cursor not allowed on item disable */
    const WrapperElem = 'section';
    return (
      <WrapperElem class="wrapper">
        <a
          class={{
            'bq-menu-item': true,
            [`${this.size}`]: true,
            group: true,
            disabled: this.disabled,
          }}
          tabindex={this.disabled ? '-1' : '0'}
          role="menuitem"
          aria-disabled={JSON.stringify(this.disabled)}
          href={this.href}
          target="_self"
          rel="noreferrer noopener"
        >
          <span class="bq-menu-item__child" part="prefix">
            <slot name="prefix" />
          </span>

          <span class="bq-menu-item__child" part="label">
            <slot />
          </span>

          <span class="bq-menu-item__child" part="suffix">
            <slot name="suffix" />
          </span>
        </a>
      </WrapperElem>
    );
  }
}
