import { h, Component, Prop, State, EventEmitter, Event, Element } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

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
  @Prop() disabled = false;

  /** Attribute link */
  @Prop({ reflect: true }) href: string | undefined = undefined;

  /** If true, the item is set to active */
  @Prop() active = false;

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
            group: true,
            disabled: this.disabled,
            active: this.active,
          }}
          tabindex={this.disabled ? '-1' : '0'}
          role="menuitem"
          aria-disabled={JSON.stringify(this.disabled)}
          href={this.href}
          target="_self"
          part="item"
          rel="noreferrer noopener"
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
