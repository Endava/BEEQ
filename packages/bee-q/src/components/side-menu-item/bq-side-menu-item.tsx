import { h, Component, Prop, Element, State } from '@stencil/core';

import { getTextContent } from '../../shared/utils';

@Component({
  tag: 'bq-side-menu-item',
  styleUrl: './scss/bq-side-menu-item.scss',
  shadow: true,
})
export class BqSideMenuItem {
  // Own Properties
  // ====================

  private labelElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSideMenuItemElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() textContent: string;

  // Public Property API
  // ========================

  /** If true, the menu item will be shown as active/selected. */
  @Prop({ reflect: true }) active: boolean = false;

  /** If true, the item label and suffix will be hidden and the with will be reduce according to its parent */
  @Prop({ reflect: true }) collapse: boolean = false;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.handleSlotChange();
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

  private handleSlotChange = () => {
    if (!this.labelElem) return;
    this.textContent = getTextContent(this.labelElem.querySelector('slot'));
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      // Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
      <a
        class={{
          'bq-side-menu--item': true,
          active: this.active,
          'is-collapsed': this.collapse,
        }}
        role="menuitem"
        tabindex={0}
        title={this.textContent}
      >
        <div class="bq-side-menu--item__prefix flex items-center" part="prefix">
          <slot name="prefix" />
        </div>
        <div
          class="bq-side-menu--item__label overflow-hidden text-ellipsis whitespace-nowrap"
          ref={(labelElem) => (this.labelElem = labelElem)}
        >
          <slot onSlotchange={this.handleSlotChange} />
        </div>
        <div class="bq-side-menu--item__suffix ml-auto flex items-center" part="suffix">
          <slot name="suffix" />
        </div>
      </a>
    );
  }
}
