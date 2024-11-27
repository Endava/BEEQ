import { Component, Element, Event, EventEmitter, Fragment, h, Prop, State } from '@stencil/core';

import { getTextContent } from '../../shared/utils';

/**
 * Represents the default side menu item for standard navigation elements, providing a clean and straightforward way to display menu options.
 *
 * @example How to use it
 * ```html
 * <bq-side-menu-item>
 *   <bq-icon name="star-four" slot="prefix"></bq-icon>
 *   Menu item
 *   <bq-badge slot="suffix">5</bq-badge>
 * </bq-side-menu-item>
 * ```
 * @documentation https://www.beeq.design/3d466e231/p/99822d-side-menu/b/09d7b1
 * @status stable
 *
 * @dependency bq-tooltip
 *
 * @attr {boolean} active - If `true`, the menu item will be shown as active/selected.
 * @attr {boolean} collapse - If `true`, the item label and suffix will be hidden and the with will be reduced according to its parent.
 * @attr {boolean} disabled - If `true`, the menu item will be disabled (no interaction allowed).
 *
 * @event bqBlur - Handler to be called when the button loses focus.
 * @event bqClick - Handler to be called when the button gets focused.
 * @event bqFocus - Handler to be called when the button is clicked.
 *
 * @slot prefix - The prefix part of menu item.
 * @slot - The content of the menu item.
 * @slot suffix - The suffix part of menu item.
 *
 * @part base - The component wrapper container inside the shadow DOM
 * @part label - The label slot
 * @part prefix - The prefix slot
 * @part suffix - The suffix slot
 * @part panel - The `<div>` container that holds the tooltip content (when the side menu is collapsed)
 * @part trigger - The `<div>` container that holds the element which displays tooltip on hover (when the side menu is collapsed)
 *
 * @cssprop --bq-side-menu-item--bg-default - Side menu item default background color
 * @cssprop --bq-side-menu-item--bg-hover - Side menu item hover background color
 * @cssprop --bq-side-menu-item--bg-active - Side menu item active background color
 * @cssprop --bq-side-menu-item--text-default - Side menu item default text color
 * @cssprop --bq-side-menu-item--text-hover - Side menu item hover text color
 * @cssprop --bq-side-menu-item--text-active - Side menu item active text color
 * @cssprop --bq-side-menu-item--text-disabled - Side menu item disable text color
 * @cssprop --bq-side-menu-item--paddingX - Side menu item vertical padding
 * @cssprop --bq-side-menu-item--paddingY - Side menu item horizontal padding
 */
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
  @Prop() active: boolean = false;

  /** If true, the item label and suffix will be hidden and the with will be reduce according to its parent */
  @Prop() collapse: boolean = false;

  /** If true, the menu item will be disabled (no interaction allowed) */
  @Prop() disabled: boolean = false;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the button loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqSideMenuItemElement>;

  /** Handler to be called when the button is clicked */
  @Event() bqFocus: EventEmitter<HTMLBqSideMenuItemElement>;

  /** Handler to be called when button gets focus */
  @Event() bqClick: EventEmitter<HTMLBqSideMenuItemElement>;

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

  handleBlur = (ev: Event) => {
    if (this.disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    this.bqBlur.emit(this.el);
  };

  handleFocus = (ev: Event) => {
    if (this.disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    this.bqFocus.emit(this.el);
  };

  handleClick = (ev: Event) => {
    if (this.disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    this.bqClick.emit(this.el);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  private menuItem = () => (
    <Fragment>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        class={{
          'bq-side-menu__item': true,
          active: this.active,
          disabled: this.disabled,
          'is-collapsed': this.collapse,
        }}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onClick={this.handleClick}
        aria-disabled={this.disabled ? 'true' : 'false'}
        role="menuitem"
        tabindex={this.disabled ? -1 : 0}
        slot="trigger"
        part="base"
      >
        <div class="bq-side-menu__item--prefix flex items-center" part="prefix">
          <slot name="prefix" />
        </div>
        <div
          class="bq-side-menu__item--label overflow-hidden text-ellipsis whitespace-nowrap"
          ref={(labelElem) => (this.labelElem = labelElem)}
        >
          <slot onSlotchange={this.handleSlotChange} />
        </div>
        <div class="bq-side-menu__item--suffix ml-auto flex items-center" part="suffix">
          <slot name="suffix" />
        </div>
      </a>
    </Fragment>
  );

  render() {
    return !this.collapse ? (
      this.menuItem()
    ) : (
      <bq-tooltip class="bq-side-menu__item--tooltip block" placement="right" exportparts="trigger, panel">
        {this.textContent}
        {this.menuItem()}
      </bq-tooltip>
    );
  }
}
