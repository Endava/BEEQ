import { Component, Element, Host, h, Prop } from '@stencil/core';

/**
 * The Breadcrumb is used to wraps a series of breadcrumb items to indicate the current page's location within a navigational hierarchy.
 *
 * @example How to use it
 * ```html
 * <bq-breadcrumb label="Breadcrumb">
 *   <bq-breadcrumb-item>Home</bq-breadcrumb-item>
 *   <bq-breadcrumb-item>Men's clothing</bq-breadcrumb-item>
 *   <bq-breadcrumb-item>Shirt</bq-breadcrumb-item>
 *   <bq-breadcrumb-item>Casual shirts</bq-breadcrumb-item>
 * </bq-breadcrumb>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/194fd1-breadcrumb
 * @status stable
 *
 * @attr {string} label - The `aria-label` attribute to describe the type of navigation
 *
 * @slot - The default slot is used to add `bq-breadcrumb-item` items to the breadcrumb.
 * @slot separator - The slot to add a separator between breadcrumb items. Default separator is `/`.
 *
 * @part navigation - The `nav` tag that loads the breadcrumb items
 * @part separator - The container that wraps the separator element
 */
@Component({
  tag: 'bq-breadcrumb',
  styleUrl: './scss/bq-breadcrumb.scss',
  shadow: true,
})
export class BqBreadcrumb {
  // Own Properties
  // ====================

  private navElem: HTMLElement;
  private spanElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqBreadcrumbElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The `aria-label` attribute to describe the type of navigation */
  @Prop({ reflect: true }) label: string = 'Breadcrumbs';

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

  private handleSlotChange = (): void => {
    const breadcrumbItems = this.breadcrumbItems;
    const itemCount = breadcrumbItems.length;
    const separatorElem = this.getSeparatorElem();

    breadcrumbItems.forEach((item, index) => {
      const isLastItem = index === itemCount - 1;
      const separatorSlot = item.querySelector('[slot="separator"]');

      if (!separatorSlot && !isLastItem) {
        item.append(separatorElem.cloneNode(true));
      }

      item.setAttribute('aria-current', isLastItem ? 'page' : '');
    });
  };

  private getSeparatorElem = (): HTMLElement => {
    const clone = this.separatorFromSlot.cloneNode(true) as HTMLElement;
    clone.slot = 'separator';

    return clone;
  };

  private get separatorFromSlot() {
    return this.spanElem
      .querySelector<HTMLSlotElement>('slot[name="separator"]')
      .assignedElements({ flatten: true })[0] as HTMLElement;
  }

  private get breadcrumbItems(): HTMLBqBreadcrumbItemElement[] {
    return this.navElem
      .querySelector<HTMLSlotElement>('slot')
      .assignedElements({ flatten: true }) as HTMLBqBreadcrumbItemElement[];
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <nav
          aria-label={this.label}
          class="flex items-center"
          part="navigation"
          ref={(elem) => {
            this.navElem = elem;
          }}
        >
          <slot onSlotchange={this.handleSlotChange}></slot>
        </nav>
        <span
          aria-hidden="true"
          hidden
          part="separator"
          ref={(element) => {
            this.spanElem = element;
          }}
        >
          <slot name="separator">
            <span class="is-3 flex items-center justify-center">/</span>
          </slot>
        </span>
      </Host>
    );
  }
}
