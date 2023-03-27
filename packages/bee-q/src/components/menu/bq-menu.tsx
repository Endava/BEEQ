import { h, Component, Prop, Element, State } from '@stencil/core';
import { isHTMLElement } from '../../shared/utils';

import { TMenuTheme, TMenuSize } from './bq-menu.types';

const footerIcons = {
  expand: 'arrow-line-left',
  collapse: 'arrow-line-right',
};

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

  @Element() el!: HTMLBqMenuElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private footerIcon = footerIcons.expand;

  // Public Property API
  // ========================

  /** The size of the menu item */
  @Prop({ reflect: true }) size: TMenuSize = 'medium';

  /** Toggle menu */
  @Prop() collapsible = true;

  @Prop({ reflect: true }) theme: TMenuTheme = 'light';

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.changeLayoutBqMenuItem();
    this.setButtonAttribute();
    this.setSizeClass();
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

  /**
   * set theme and size to bq-menu-item elements
   */
  private changeLayoutBqMenuItem = (): void => {
    this.getBqMenuItemElems().forEach((elem: HTMLBqMenuItemElement) => {
      const menuItemWrapper = elem.shadowRoot.querySelector('.wrapper') as HTMLElement;
      menuItemWrapper.setAttribute('data-theme', this.theme);

      const linkElem = menuItemWrapper.querySelector('.bq-menu-item') as HTMLElement;
      linkElem.classList.add(this.size);
    });
  };

  /**
   * set 'appearance' attr to button based on theme
   * @returns void
   */
  private setButtonAttribute = (): void => {
    const button: HTMLElement = this.el.shadowRoot.querySelector('bq-button');
    this.theme === 'light' ? button.setAttribute('appearance', 'text') : button.setAttribute('appearance', 'primary');
  };

  /**
   * set class based on prop size
   */
  private setSizeClass = (): void => {
    this.el.shadowRoot.querySelector('.bq-menu__header').classList.add(this.size);
    this.el.shadowRoot.querySelector('footer').classList.add(this.size);
  };

  private toggleMenu = (): void => {
    this.el.shadowRoot.querySelector('aside').classList.toggle('bq-collapse'); // 'bq' prefix to not interfere with tailwind built-in class
    const footer: HTMLElement = this.el.shadowRoot.querySelector('footer');

    footer.classList.toggle('bq-collapse');
    footer.classList.contains('bq-collapse')
      ? (this.footerIcon = 'arrow-line-right')
      : (this.footerIcon = 'arrow-line-left');

    this.hidePartsFromMenuItems();
  };

  /**
   * on toggle menu, hide parts from menu item based on which slot has inner elem
   */
  private hidePartsFromMenuItems = (): void => {
    const menuItems: HTMLBqMenuItemElement[] = this.getBqMenuItemElems();

    menuItems.forEach((item: HTMLBqMenuItemElement) => {
      const bqIcon: HTMLBqIconElement = item.querySelector('[slot="prefix"]');
      const labelSlotInnerElements: Element[] = item.shadowRoot
        .querySelector<HTMLSlotElement>('[part="label"] > slot')
        .assignedElements({ flatten: true });

      if (bqIcon) {
        item.shadowRoot.querySelector('[part="label"]').classList.toggle('hide');
        item.shadowRoot.querySelector('[part="suffix"]').classList.toggle('hide');
      } else if (labelSlotInnerElements.length) {
        item.shadowRoot.querySelector('[part="suffix"]').classList.toggle('hide');
      } else {
        item.shadowRoot.querySelector('[part="label"]').classList.toggle('hide'); // hide label to set min-w-0 class
      }
    });
  };

  private getBqMenuItemElems = (): HTMLBqMenuItemElement[] => {
    const slot = this.el.shadowRoot.querySelector('.bq-menu').querySelector<HTMLSlotElement>('[part="content"] > slot');
    return slot
      .assignedElements({ flatten: true })
      .filter((elem: HTMLBqMenuItemElement) => isHTMLElement(elem, 'bq-menu-item')) as [HTMLBqMenuItemElement];
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <aside class="bq-menu" data-theme={this.theme} role="menu" aria-label="Side menu" part="group">
        <span class="bq-menu__header" part="header">
          <bq-icon name="dev-to-logo" size="42"></bq-icon>
          <slot name="header" />
        </span>

        <span class="bq-menu__content" part="content">
          <slot />
        </span>

        {this.collapsible && (
          <footer class="bq-menu__footer">
            <bq-button appearance="text" onBqClick={this.toggleMenu}>
              <bq-icon name={this.footerIcon} size="24" slot="prefix"></bq-icon>
              <slot name="footer" />
            </bq-button>
          </footer>
        )}
      </aside>
    );
  }
}
