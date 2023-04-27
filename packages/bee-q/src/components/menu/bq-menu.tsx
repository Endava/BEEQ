import { h, Component, Prop, Element, State, Listen, Event, EventEmitter, Watch } from '@stencil/core';
import { isHTMLElement } from '../../shared/utils';

import { MENU_SIZE, TMenuTheme, TMenuSize } from './bq-menu.types';

enum FooterIconName {
  Expand = 'arrow-line-left',
  Collapse = 'arrow-line-right',
}

enum FooterIconSize {
  Small = 34,
  Large = 48,
}

/**
 * A menu is like a widget that offers a list of choices to the user.
 * @part group - The `aside` tag element used to group the menu item elements.
 * @part header - The `span` tag element used to display the header part of the menu (bq-icon, title).
 * @part content - The `span` tag element used to display the content of the menu (bq-menu-item components).
 * @part footer - The `span` tag element used to display the collapsible element (text).
 */
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

  @State() private footerIconName = FooterIconName.Expand;

  // Public Property API
  // ========================

  /** Set menu item size (small/medium) */
  @Prop({ reflect: true }) size: TMenuSize = 'medium';

  /** Show footer for collapsible menu (boolean) */
  @Prop({ reflect: true }) collapsible = true;

  /** Set theme (light/dark) */
  @Prop({ reflect: true }) theme: TMenuTheme = 'light';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  onSizeChange() {
    this.removePreviousSizeFromMenu();
    this.setSizeClass();
  }

  @Watch('theme')
  onThemeChange() {
    this.setButtonAppereance();
  }

  @Watch('collapsible')
  expandMenuWhenFalse() {
    const isMenuCollapsed: boolean = this.asideElement.classList.contains('bq-collapse');

    if (this.collapsible) {
      // setTimeout to wait fot the button element to render
      setTimeout(() => {
        this.setButtonAppereance();
      }, 10);
    }

    if (!this.collapsible && isMenuCollapsed) this.toggleMenu();
  }

  @Watch('size')
  @Watch('theme')
  onSizeThemeChange() {
    this.changeLayoutBqMenuItem();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the item loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqMenuItemElement>;

  /** Handler to be called when the item gets focus */
  @Event() bqFocus: EventEmitter<HTMLBqMenuItemElement>;

  /** Handler to be called when item is clicked */
  @Event() bqClick: EventEmitter<HTMLBqMenuItemElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.changeLayoutBqMenuItem();
    this.setButtonAppereance();
    this.setSizeClass();
    this.activateMenuItemBasedOnURL();
  }

  // Listeners
  // ==============

  @Listen('bqMenuItemBlur')
  onBqMenuItemBlur(event: CustomEvent<HTMLBqMenuItemElement>) {
    this.bqBlur.emit(event.detail);
  }

  @Listen('bqMenuItemFocus')
  onBqMenuItemFocus(event: CustomEvent<HTMLBqMenuItemElement>) {
    this.bqFocus.emit(event.detail);
  }

  @Listen('bqMenuItemClick')
  onBqMenuItemClick(event: CustomEvent<HTMLBqMenuItemElement>) {
    this.bqClick.emit(event.detail);
    this.setMenuItemToActive(event.detail as HTMLBqMenuItemElement);
  }

  @Listen('bqMenuItemOnEnter')
  onBqMenuItemEnterPress(event: CustomEvent<HTMLBqMenuItemElement>) {
    this.setMenuItemToActive(event.detail as HTMLBqMenuItemElement);
  }

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
   * set theme and size to bq-menu-item components
   */
  private changeLayoutBqMenuItem = (): void => {
    this.getBqMenuItemElems.forEach((target: HTMLBqMenuItemElement) =>
      target.addSizeClassAndTheme(this.size, this.theme),
    );
  };

  /**
   * set 'appearance' attr to button based on theme
   * @returns void
   */
  private setButtonAppereance = (): void => {
    const button: HTMLElement = this.el.shadowRoot.querySelector('bq-button');
    if (!button) return;

    button.shadowRoot.querySelector('button').style.background = 'transparent';
    this.theme === 'light' ? button.setAttribute('appearance', 'text') : button.setAttribute('appearance', 'primary');
  };

  /**
   * add size class to menu element
   */
  private setSizeClass = (): void => {
    this.asideElement.classList.add(this.size);
    this.asideElement.querySelector('[part="header"]').classList.add(this.size);
  };

  private removePreviousSizeFromMenu = (): void => {
    MENU_SIZE.forEach((size: TMenuSize) => {
      this.asideElement.classList.remove(size);
      this.asideElement.querySelector('[part="header"]').classList.remove(size);
    });
  };

  private activateMenuItemBasedOnURL = (): void => {
    if (!window) return;

    const pathname: string = window?.location?.pathname || '/';

    this.getBqMenuItemElems.forEach((menuItem: HTMLBqMenuItemElement) => {
      if (!menuItem.getAttribute('disabled') && menuItem.getAttribute('href') === pathname) {
        this.setMenuItemToActive(menuItem);
      }
    });
  };

  private toggleMenu = (): void => {
    this.asideElement.classList.toggle('bq-collapse'); // 'bq' prefix to not interfere with tailwind built-in class

    const innerSlotElement: Element[] = this.asideElement
      .querySelector<HTMLSlotElement>('[part="header-prefix"] > slot')
      .assignedElements({ flatten: true })
      .filter((elem: HTMLElement) => isHTMLElement(elem, 'bq-icon')) as [HTMLBqIconElement];
    const bqIcon = innerSlotElement[0] as HTMLBqIconElement;
    const isMenuCollapsed: boolean = this.asideElement.classList.contains('bq-collapse');

    isMenuCollapsed
      ? (this.footerIconName = FooterIconName.Collapse) && (bqIcon.size = FooterIconSize.Small)
      : (this.footerIconName = FooterIconName.Expand) && (bqIcon.size = FooterIconSize.Large);

    this.hidePartsFromMenuItems(isMenuCollapsed);
  };

  /**
   * on toggle menu, hide parts from menu item based on which slot has inner elem
   * change `collapsed` value
   */
  private hidePartsFromMenuItems = (isMenuCollapsed: boolean): void => {
    this.getBqMenuItemElems.forEach((target: HTMLBqMenuItemElement) => {
      target.hidePartsFromMenuItems();
      target.collapsed = isMenuCollapsed;
    });
  };

  /**
   * set value for `active` attr of menu item
   * @param event
   */
  private setMenuItemToActive = (menuItemElement: HTMLBqMenuItemElement): void => {
    this.getBqMenuItemElems.forEach(
      (bqMenuItem: HTMLBqMenuItemElement) => (bqMenuItem.active = bqMenuItem === menuItemElement),
    );
  };

  private get getBqMenuItemElems(): HTMLBqMenuItemElement[] {
    const slot = this.el.shadowRoot.querySelector('.bq-menu').querySelector<HTMLSlotElement>('[part="content"] > slot');
    return slot
      .assignedElements({ flatten: true })
      .filter((elem: HTMLBqMenuItemElement) => isHTMLElement(elem, 'bq-menu-item')) as [HTMLBqMenuItemElement];
  }

  private get asideElement(): HTMLElement {
    return this.el.shadowRoot.querySelector('.bq-menu');
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <aside class="bq-menu" data-theme={this.theme} role="menu" aria-label="Side menu" part="group">
        <span class="bq-menu__header" part="header">
          <span class="bq-menu__header__prefix" part="header-prefix">
            <slot name="header-prefix"></slot>
          </span>

          <span class="bq-menu__header__suffix" part="header-suffix">
            <slot name="header-suffix" />
          </span>
        </span>

        <span class="bq-menu__content" part="content">
          <slot />
        </span>

        {this.collapsible && (
          <footer class="bq-menu__footer" part="footer">
            <bq-button appearance="text" size={this.size} onBqClick={this.toggleMenu}>
              <bq-icon name={this.footerIconName} size="20" slot="prefix"></bq-icon>
              <slot name="footer" />
            </bq-button>
          </footer>
        )}
      </aside>
    );
  }
}
