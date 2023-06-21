import { h, Component, Prop, Watch } from '@stencil/core';

import { TSideMenuAppearance, TSideMenuSize } from './bq-side-menu.types';

@Component({
  tag: 'bq-side-menu',
  styleUrl: './scss/bq-side-menu.scss',
  shadow: true,
})
export class BqSideMenu {
  // Own Properties
  // ====================

  private menuItemCssSelector = 'bq-side-menu-item';

  private bodyCss = 'bq-body--side-menu';
  private bodyCssExpand = 'bq-body--side-menu__expand';
  private bodyCssCollapse = 'bq-body--side-menu__collapse';

  private menuElem: HTMLElement;
  private documentBody: HTMLBodyElement = document.querySelector('body');

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** It sets a predefined appearance of the side menu */
  @Prop({ reflect: true }) appearance: TSideMenuAppearance = 'default';

  /** If true, the container will reduce its width */
  @Prop({ reflect: true }) collapse: boolean = false;

  /** It sets the size of the navigation menu items */
  @Prop({ reflect: true }) size: TSideMenuSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('collapse')
  onCollapsePropChange() {
    if (!this.menuItems.length) return;

    this.menuItems.forEach((menuItem: HTMLBqSideMenuItemElement) => (menuItem.collapse = this.collapse));
    this.collapse ? this.collapseDocumentBody() : this.expandDocumentBody();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.documentBody.classList.add(this.bodyCss);
    this.onCollapsePropChange();
  }

  disconnectedCallback() {
    this.cleanDocumentBodyClass();
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
      (el: HTMLBqSideMenuItemElement) => el.tagName.toLowerCase() === this.menuItemCssSelector,
    ) as [HTMLBqSideMenuItemElement];
  }

  private collapseDocumentBody = () => {
    if (!this.collapse) return;

    this.documentBody.classList.remove(this.bodyCssExpand);
    this.documentBody.classList.add(this.bodyCssCollapse);
  };

  private expandDocumentBody = () => {
    if (this.collapse) return;

    this.documentBody.classList.remove(this.bodyCssCollapse);
    this.documentBody.classList.add(this.bodyCssExpand);
  };

  private cleanDocumentBodyClass = () => {
    this.documentBody.classList.remove(this.bodyCss, this.bodyCssCollapse, this.bodyCssExpand);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <aside class={{ 'bq-side-menu overflow-y-auto': true, 'is-collapsed': this.collapse }} part="base">
        {/* Company logo and name */}
        <div class={{ 'bq-side-menu--logo': true, 'is-collapsed': this.collapse }} part="logo">
          <slot name="logo" />
        </div>
        <nav
          class="bq-side-menu--nav flex flex-col gap-y-xs px-xs pt-xs2"
          role="menu"
          ref={(navElem) => (this.menuElem = navElem)}
        >
          <slot />
        </nav>
      </aside>
    );
  }
}
