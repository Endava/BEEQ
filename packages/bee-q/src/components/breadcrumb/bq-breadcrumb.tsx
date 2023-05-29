import { h, Component, Host, Element, Listen, Event, EventEmitter } from '@stencil/core';

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
    this.hideSeparatorFromLastItem();
  }

  // Listeners
  // ==============

  @Listen('bqBlur')
  onBlur(event: CustomEvent<HTMLElement>) {
    if (isHTMLElement(event.detail, 'bq-breadcrumb-item')) this.bqBreadcrumbBlur.emit(event.detail);
  }

  @Listen('bqFocus')
  onFocus(event: CustomEvent<HTMLElement>) {
    if (isHTMLElement(event.detail, 'bq-breadcrumb-item')) this.bqBreadcrumbFocus.emit(event.detail);
  }

  @Listen('bqClick')
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

  private hideSeparatorFromLastItem = () => {
    const elements = this.el.shadowRoot
      .querySelector<HTMLSlotElement>('slot')
      .assignedElements({ flatten: true })
      .filter((elem: HTMLElement) => isHTMLElement(elem, 'bq-breadcrumb-item')) as [HTMLBqBreadcrumbItemElement];

    elements.slice(-1)[0].isLast = true;
  };

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
