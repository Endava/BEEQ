import { h, Component, Host, Element, Listen, Event, EventEmitter, Prop } from '@stencil/core';

import { isHTMLElement } from '../../shared/utils';

@Component({
  tag: 'bq-breadcrumb',
  styleUrl: './scss/bq-breadcrumb.scss',
  shadow: true,
})
export class BqBreadcrumb {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqBreadcrumbElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The icon name used as separator. Default is `/`. */
  @Prop() separatorIcon!: string;

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

  componentDidLoad() {
    this.setIconAsSeparator();
  }

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

  private setIconAsSeparator = (): void => {
    this.breadcrumbItems.forEach((item, index, arr) => {
      item.separatorIcon = this.separatorIcon;
      item.isLast = index === arr.length - 1;
    });
  };

  private get breadcrumbItems(): HTMLBqBreadcrumbItemElement[] {
    return Array.from(this.el.querySelectorAll('bq-breadcrumb-item'));
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host role="list">
        <slot></slot>
      </Host>
    );
  }
}
