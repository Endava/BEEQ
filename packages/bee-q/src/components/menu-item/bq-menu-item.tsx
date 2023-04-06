import { h, Component, Prop, State, EventEmitter, Event, Element, Method } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';
import { TMenuSize, TMenuTheme } from '../menu/bq-menu.types';

/**
 * The menu item is used inside a `bq-menu` component
 * @part item - The anchor tag element used to display a menu item.
 * @part prefix - The `<span>` tag element that acts as prefix container (bq-icon).
 * @part label - The `<span>` tag element that acts as prefix container for the menu item label.
 * @part suffix - The `<span>` tag element that acts as prefix container (bq-icon).
 */
@Component({
  tag: 'bq-menu-item',
  styleUrl: './scss/bq-menu-item.scss',
  shadow: true,
})
export class BqMenuItem {
  // Own Properties
  // ====================

  private prefixElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqMenuItemElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasPrefix = false;

  // Public Property API
  // ========================

  /** If true, the item will be disabled (no interaction allowed) */
  @Prop({ reflect: true }) disabled = false;

  /** Attribute link */
  @Prop({ reflect: true }) href: string | undefined = undefined;

  /** If true, the item is set to active */
  @Prop({ reflect: true }) active = false;

  /** If true, the menu component is collapsed */
  @Prop() collapsed = false;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the item loses focus */
  @Event() bqMenuItemBlur: EventEmitter<HTMLBqMenuItemElement>;

  /** Handler to be called when the item is clicked */
  @Event() bqMenuItemFocus: EventEmitter<HTMLBqMenuItemElement>;

  /** Handler to be called when item gets focus */
  @Event() bqMenuItemClick: EventEmitter<HTMLBqMenuItemElement>;

  /** Handler to be called on enter key press */
  @Event() bqMenuItemOnEnter: EventEmitter<HTMLBqMenuItemElement>;

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

  /**
   * called from menu component on collapse
   */
  @Method()
  async hidePartsFromMenuItems() {
    const bqIcon: HTMLBqIconElement = this.el.querySelector('[slot="prefix"]');
    const labelSlotInnerElements = this.el.shadowRoot
      .querySelector<HTMLSlotElement>('[part="label"] > slot')
      .assignedElements({ flatten: true });

    if (bqIcon) {
      this.el.shadowRoot.querySelector('[part="label"]').classList.toggle('hide');
      this.el.shadowRoot.querySelector('[part="suffix"]').classList.toggle('hide');
    } else if (labelSlotInnerElements.length) {
      this.el.shadowRoot.querySelector('[part="suffix"]').classList.toggle('hide');
    } else {
      this.el.shadowRoot.querySelector('[part="label"]').classList.toggle('hide'); // hide label to set min-w-0 class
    }
  }

  /**
   * on Menu component componentDidLoad() hook, add size class and theme
   */
  @Method()
  async addSizeClassAndTheme(size: TMenuSize, theme: TMenuTheme) {
    this.el.shadowRoot.querySelector<HTMLElement>('.bq-menu-item').classList.add(size);
    this.el.shadowRoot.querySelector<HTMLElement>('.wrapper').setAttribute('data-theme', theme);
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private onBlur = () => {
    this.bqMenuItemBlur.emit(this.el);
  };

  private onFocus = () => {
    this.bqMenuItemFocus.emit(this.el);
  };

  private onClick = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqMenuItemClick.emit(this.el);
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') this.bqMenuItemOnEnter.emit(this.el);
  };

  private onSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
  };

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
            'bq-collapsed': this.collapsed,
            group: true,
            disabled: this.disabled,
            active: this.active,
          }}
          tabindex={this.disabled ? '-1' : '0'}
          role="menuitem"
          aria-disabled={JSON.stringify(this.disabled)}
          href={this.href}
          target="_self"
          rel="noreferrer noopener"
          part="item"
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onClick={this.onClick}
          onKeyDown={this.onKeyDown}
        >
          <span class="bq-menu-item__child" ref={(elem) => (this.prefixElem = elem)} part="prefix">
            <slot name="prefix" onSlotchange={this.onSlotChange} />
          </span>

          <span
            class={{
              'bq-menu-item__child': true,
              label: true,
              'has-prefix': this.hasPrefix,
            }}
            part="label"
          >
            <slot />
          </span>

          <span class="bq-menu-item__child suffix" part="suffix">
            <slot name="suffix" />
          </span>
        </a>
      </WrapperElem>
    );
  }
}
