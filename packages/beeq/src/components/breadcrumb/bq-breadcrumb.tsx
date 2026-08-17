import { Component, Host, h, Listen, Prop } from '@stencil/core';

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
  private breadcrumbSlotElem: HTMLSlotElement;
  private readonly generatedSeparators = new WeakSet<Element>();
  private separatorSlotElem: HTMLSlotElement;

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
    this.reconcileBreadcrumbItems();
  }

  connectedCallback() {
    if (!this.breadcrumbSlotElem || !this.separatorSlotElem) return;

    this.reconcileBreadcrumbItems();
  }

  // Listeners
  // ==============

  @Listen('svgLoaded')
  handleSeparatorReady(event: CustomEvent<string>): void {
    if (event.target !== this.separatorFromSlot) return;

    this.reconcileBreadcrumbItems();
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

  private handleSlotChange = (): void => {
    this.reconcileBreadcrumbItems();
  };

  /**
   * Rebuilds BEEQ-generated separators after breadcrumb items or the separator
   * source change. Consumer-provided item separators are preserved, while the
   * last item remains separator-free and is marked as the current page.
   */
  private reconcileBreadcrumbItems = (): void => {
    const breadcrumbItems = this.breadcrumbItems;
    const lastItemIndex = breadcrumbItems.length - 1;

    for (const [index, item] of breadcrumbItems.entries()) {
      const isLastItem = index === lastItemIndex;
      let hasConsumerSeparator = false;

      // Remove only separators created by a previous reconciliation pass.
      // Any other slotted separator belongs to the consumer and must remain.
      for (const separator of Array.from(item.querySelectorAll<HTMLElement>(':scope > [slot="separator"]'))) {
        if (this.generatedSeparators.has(separator)) {
          separator.remove();
        } else {
          hasConsumerSeparator = true;
        }
      }

      item.setAttribute('aria-current', isLastItem ? 'page' : '');

      // Last items have no separator; consumer separators replace the generated one.
      if (isLastItem || hasConsumerSeparator) continue;

      item.append(this.createSeparator());
    }
  };

  private createSeparator = (): HTMLElement => {
    const source = this.separatorFromSlot;
    const separator = source.cloneNode(true) as HTMLElement;

    if (source.localName === 'bq-icon') {
      const sourceIcon = source as HTMLBqIconElement;
      Object.assign(separator as HTMLBqIconElement, {
        color: sourceIcon.color,
        label: sourceIcon.label,
        name: sourceIcon.name,
        size: sourceIcon.size,
        src: sourceIcon.src,
        // !TO BE REMOVED: Delete this line when the `weight` property is removed from the `bq-icon` component.
        weight: sourceIcon.weight,
      });
    }

    separator.slot = 'separator';
    this.generatedSeparators.add(separator);

    return separator;
  };

  private get separatorFromSlot(): HTMLElement {
    return this.separatorSlotElem.assignedElements({ flatten: true })[0] as HTMLElement;
  }

  private get breadcrumbItems(): HTMLBqBreadcrumbItemElement[] {
    return this.breadcrumbSlotElem.assignedElements({ flatten: true }) as HTMLBqBreadcrumbItemElement[];
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <nav aria-label={this.label} class="flex items-center" part="navigation">
          <slot
            onSlotchange={this.handleSlotChange}
            ref={(element) => {
              this.breadcrumbSlotElem = element;
            }}
          />
        </nav>
        <span aria-hidden="true" hidden part="separator">
          <slot
            name="separator"
            onSlotchange={this.handleSlotChange}
            ref={(element) => {
              this.separatorSlotElem = element;
            }}
          >
            <span class="is-3 flex items-center justify-center">/</span>
          </slot>
        </span>
      </Host>
    );
  }
}
