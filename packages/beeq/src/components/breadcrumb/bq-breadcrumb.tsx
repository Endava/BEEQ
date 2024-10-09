import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop } from '@stencil/core';

import { isHTMLElement } from '../../shared/utils';

/**
 * @part navigation - The `nav` tag that loads the breadcrumb items
 */
@Component({
  tag: 'bq-breadcrumb',
  styleUrl: './scss/bq-breadcrumb.scss',
  shadow: true,
})
export class BqBreadcrumb {
  // Own Properties
  // ====================

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
  @Prop({ reflect: true }) ariaLabel: string = 'Breadcrumbs';

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when `bq-breadcrumb-item` item loses focus. */
  @Event() bqBreadcrumbBlur: EventEmitter<HTMLBqBreadcrumbItemElement>;

  /** Handler to be called when `bq-breadcrumb-item` item gets focus. */
  @Event() bqBreadcrumbFocus: EventEmitter<HTMLBqBreadcrumbItemElement>;

  /** Handler to be called when `bq-breadcrumb-item` is selected (on click/enter press). */
  @Event() bqBreadcrumbClick: EventEmitter<HTMLBqBreadcrumbItemElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  // Listeners
  // ==============

  @Listen('bqBlur', { passive: true })
  onBlur(event: CustomEvent<HTMLElement>) {
    if (isHTMLElement(event.detail, 'bq-breadcrumb-item')) this.bqBreadcrumbBlur.emit(event.detail);
  }

  @Listen('bqFocus', { passive: true })
  onFocus(event: CustomEvent<HTMLElement>) {
    if (isHTMLElement(event.detail, 'bq-breadcrumb-item')) this.bqBreadcrumbFocus.emit(event.detail);
  }

  @Listen('bqClick', { passive: true })
  onClick(event: CustomEvent<HTMLElement>) {
    if (isHTMLElement(event.detail, 'bq-breadcrumb-item')) this.bqBreadcrumbClick.emit(event.detail);
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

  private setSeparator = (): void => {
    this.breadcrumbItems.forEach((item, index, arr) => {
      item.isLastItem = index === arr.length - 1;
      if (!item.isLastItem) {
        item.append(this.getSeparatorElem());
      }
    });
  };

  /**
   * clone original element and add slot attr
   * @returns cloned separator element
   */
  private getSeparatorElem = (): HTMLElement => {
    const clone = this.separatorFromSlot.cloneNode(true) as HTMLElement;
    clone.slot = 'separator';

    return clone;
  };

  private get breadcrumbItems(): HTMLBqBreadcrumbItemElement[] {
    return Array.from(this.el.querySelectorAll('bq-breadcrumb-item'));
  }

  private get separatorFromSlot() {
    return this.spanElem
      .querySelector<HTMLSlotElement>('slot[name="separator"]')
      .assignedElements({ flatten: true })[0] as HTMLElement;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <nav class="flex items-center" aria-label={this.ariaLabel} part="navigation">
          <slot onSlotchange={this.setSeparator}></slot>
        </nav>

        <span hidden aria-hidden="true" ref={(element) => (this.spanElem = element)}>
          <slot name="separator">
            <span class="flex items-center justify-center is-3">/</span>
          </slot>
        </span>
      </Host>
    );
  }
}
