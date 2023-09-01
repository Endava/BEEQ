import { Component, Element, Event, EventEmitter, h, Prop } from '@stencil/core';

import { isDefined } from '../../shared/utils';

/**
 * @part base - The component wrapper container
 * @part base - The breadcrumb item wrapper (`button` or `a`)
 * @part content - The `span` tag that loads the content item
 * @part separator - The `span` tag that loads the separator
 */
@Component({
  tag: 'bq-breadcrumb-item',
  styleUrl: './scss/bq-breadcrumb-item.scss',
  shadow: true,
})
export class BqBreadcrumbItem {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqBreadcrumbItemElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /**
   * The aria-label that corresponds to the full title of the destination page.
   * This won't be shown in the page, but it will be used by screen readers and other assistive devices.
   */
  @Prop() ariaLabel: string;

  /** If true, the item is the last element inside breadcrumb */
  @Prop() isLastItem: boolean = false;

  /** If set, the breadcrumb item will be rendered as an `<a>` with this `href`, otherwise, a `<button>` will be rendered. */
  @Prop({ reflect: true }) href: string;

  /** Where to display the link in the browser context. Relevant only if `href` is set. */
  @Prop({ reflect: true }) target: '_blank' | '_parent' | '_self' | '_top';

  /** Where to display the link in the browser context. Relevant only if `href` is set. */
  @Prop({ reflect: true }) rel: string = 'noreferrer noopener';

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when item loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqBreadcrumbItemElement>;

  /** Handler to be called when item is focused */
  @Event() bqFocus: EventEmitter<HTMLBqBreadcrumbItemElement>;

  /** Handler to be called when item is clicked */
  @Event() bqClick: EventEmitter<HTMLBqBreadcrumbItemElement>;

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
    this.bqBlur.emit(this.el);
  };

  private onFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private onClick = () => {
    this.bqClick.emit(this.el);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const isLink = isDefined(this.href);
    const TagElem = isLink ? 'a' : 'button';

    return (
      <div class="flex items-center" aria-label={this.ariaLabel} part="base">
        <TagElem
          class="breadcrumb-item"
          href={isLink ? this.href : undefined}
          rel={isLink && this.target ? 'noreferrer noopener' : undefined}
          target={isLink ? this.target : undefined}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onClick={this.onClick}
          aria-current={isLink && this.isLastItem ? 'location' : undefined} // indicates the last link as the current page
          part="item"
        >
          <span
            class={{
              'flex items-center gap-xs2': true,
              'text-text-brand': this.isLastItem,
            }}
            part="content"
          >
            <slot></slot>
          </span>
        </TagElem>
        <span
          class={{
            'breadcrumb-separator': true,
          }}
          part="separator"
        >
          <slot name="separator"></slot>
        </span>
      </div>
    );
  }
}
