import { h, Component, Prop, Element } from '@stencil/core';
import { isHTMLElement } from '../../shared/utils';

import { TMenuTheme } from './bq-menu.types';

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

  // Public Property API
  // ========================

  /** Toggle menu */
  @Prop() collapsible = true;

  @Prop({ reflect: true }) theme: TMenuTheme = 'dark';

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.setThemeBqMenuItemElems();
    this.setButtonAttribute();
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

  private setThemeBqMenuItemElems = (): void => {
    const slot = this.el.shadowRoot.querySelector('.bq-menu').querySelector<HTMLSlotElement>('[part="content"] > slot');

    const bqMenuItems: HTMLBqMenuItemElement[] = slot
      .assignedElements({ flatten: true })
      .filter((elem: HTMLBqMenuItemElement) => isHTMLElement(elem, 'bq-menu-item')) as [HTMLBqMenuItemElement];

    // select the wrapper element and add 'data-theme' attr
    bqMenuItems.forEach((elem: HTMLBqMenuItemElement) => {
      const menuItemWrapper = elem.shadowRoot.querySelector('.wrapper');
      menuItemWrapper.setAttribute('data-theme', this.theme);
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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <aside class="bq-menu" data-theme={this.theme} role="menu" aria-label="Side menu" part="group">
        <span class="bq-menu__header" part="header">
          <slot name="header" />
        </span>

        <span class="bq-menu__content" part="content">
          <slot />
        </span>

        {this.collapsible && (
          <footer class="bq-menu__footer">
            <bq-button appearance="text">
              <bq-icon name="arrow-line-left" size="24" slot="prefix"></bq-icon>
              <slot name="footer" />
            </bq-button>
          </footer>
        )}
      </aside>
    );
  }
}
