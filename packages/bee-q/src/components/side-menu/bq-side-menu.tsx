import { h, Component, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'bq-side-menu',
  styleUrl: './scss/bq-side-menu.scss',
  shadow: true,
})
export class BqSideMenu {
  // Own Properties
  // ====================

  private MENU_ITEM_SELECTOR = 'bq-side-menu-item';
  private menuElem: HTMLElement;

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

  @Watch('collapse')
  onCollapsePropChange() {
    if (!this.menuItems.length) return;

    this.menuItems.forEach((menuItem: HTMLBqSideMenuItemElement) => (menuItem.collapse = this.collapse));
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.onCollapsePropChange();
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

  private get menuItems() {
    if (!this.menuElem) return [];

    const slot = this.menuElem.querySelector('slot');
    return [...slot.assignedElements({ flatten: true })].filter(
      (el: HTMLBqSideMenuItemElement) => el.tagName.toLowerCase() === this.MENU_ITEM_SELECTOR,
    ) as [HTMLBqSideMenuItemElement];
  }

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
        <nav class="flex flex-col gap-y-xs" role="menu" ref={(navElem) => (this.menuElem = navElem)}>
          <slot />
        </nav>
      </aside>
    );
  }
}
