import { Component, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

import type { TSideMenuAppearance, TSideMenuSize } from './bq-side-menu.types';
import { isClient, isHTMLElement } from '../../shared/utils';

/**
 *The default side menu serves as a versatile container for organizing and displaying navigation elements,
 * with default side menu items providing a clean and straightforward way to represent individual menu options.
 * Together, they form the foundation for building structured and intuitive side menu layouts.
 *
 * @example How to use it
 * ```html
 * <bq-side-menu>
 *   <div slot="logo">
 *     <h1>Your Logo</h1>
 *   </div>
 *   <bq-side-menu-item active>
 *     <bq-icon name="home" slot="prefix"></bq-icon>
 *     Home
 *   </bq-side-menu-item>
 *   <bq-side-menu-item>
 *     <bq-icon name="settings" slot="prefix"></bq-icon>
 *     Settings
 *   </bq-side-menu-item>
 *   <bq-side-menu-item disabled>
 *     <bq-icon name="help" slot="prefix"></bq-icon>
 *     Help
 *   </bq-side-menu-item>
 * </bq-side-menu>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/99822d-side-menu/b/09d7b1
 * @status stable
 *
 * @attr {"brand" | "default" | "inverse"} appearance - It sets a predefined appearance of the side menu.
 * @attr {boolean} collapse - If `true`, the container will reduce its width.
 * @attr {"medium" | "small"} - size - It sets the size of the navigation menu items.
 *
 * @method toggleCollapse - Method to be called to toggle the collapse state of the side menu.
 *
 * @event bqCollapse - Callback handler to be called when the Side menu changes its width from expanded to collapse and vice versa.
 * @event bqSelect - Callback handler to be called when the active/selected menu item changes.
 *
 * @slot logo - The section for displaying the logo or brand in the side menu.
 * @slot The main section that holds all menu items.
 * @slot footer - The section for adding footer content to the side menu.
 *
 * @part base - HTML `<aside>` root container
 * @part footer - HTML `<div>` element that holds the footer
 * @part logo - HTML `<div>` element that holds the logo
 * @part nav - HTML `<nav>` element that holds the navigation items
 *
 * @cssprop --bq-side-menu--bg-color - Side menu background color
 * @cssprop --bq-side-menu--brand-color - Side menu logo color
 * @cssprop --bq-side-menu--border-color - Side menu border color
 */
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

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private documentBody: HTMLBodyElement;

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
    this.handleCollapse();
    this.bqCollapse.emit({ collapse: this.collapse });
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the Side menu changes its width from expanded to collapse and vice versa */
  @Event() bqCollapse: EventEmitter<{ collapse: boolean }>;

  /** Callback handler to be called when the active/selected menu item changes */
  @Event() bqSelect: EventEmitter<HTMLBqSideMenuItemElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    if (!isClient()) return;

    this.documentBody = document.querySelector('body');
    this.documentBody.classList.add(this.bodyCss);
    this.handleCollapse();
  }

  disconnectedCallback() {
    this.cleanDocumentBodyClass();
  }

  // Listeners
  // ==============

  @Listen('bqClick', { passive: true })
  onMenuItemClick(event: Event) {
    const { target: item } = event;
    if (!isHTMLElement(item, 'bq-side-menu-item')) return;

    this.menuItems.forEach(
      (menuItem: HTMLBqSideMenuItemElement) => (menuItem.active = !menuItem.disabled && menuItem === item),
    );
    this.bqSelect.emit(item);
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /** Toggle the collapse state of the side menu */
  @Method()
  async toggleCollapse() {
    this.collapse = !this.collapse;
  }

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

  private handleCollapse = () => {
    if (!this.menuItems.length) return;

    this.menuItems.forEach((menuItem: HTMLBqSideMenuItemElement) => (menuItem.collapse = this.collapse));
    if (this.collapse) {
      this.collapseDocumentBody();
    } else {
      this.expandDocumentBody();
    }
  };

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
        {/* Navigation content */}
        <nav
          class="bq-side-menu--nav flex flex-col gap-y-xs px-xs pt-xs2"
          ref={(navElem) => (this.menuElem = navElem)}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="menu"
          part="nav"
        >
          <slot />
        </nav>
        {/* Footer */}
        <div
          class="bq-side-menu--footer sticky flex justify-center bg-[var(--bq-side-menu--bg-color)] p-xs inset-be-0 m-bs-[auto]"
          part="footer"
        >
          <slot name="footer"></slot>
        </div>
      </aside>
    );
  }
}
