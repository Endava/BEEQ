import { Component, Element, Event, EventEmitter, h, Prop } from '@stencil/core';

import { isDefined } from '../../shared/utils';

/**
 * The Breadcrumb Item helps users understand their current location within a website or application's hierarchical structure.
 *
 * @example How to use it
 * ```html
 * <bq-breadcrumb-item label="Home page">
 *   <bq-icon name="house-line" size="16"></bq-icon>
 *   Home
 * </bq-breadcrumb-item>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/61d6c0-breadcrumb
 * @status stable
 *
 * @attr {string} href - If set, the breadcrumb item will be rendered as an `<a>` with this `href`, otherwise, a `<button>` will be rendered.
 * @attr {string} target - Where to display the link in the browser context. Relevant only if `href` is set.
 * @attr {string} rel - Where to display the link in the browser context. Relevant only if `href` is set.
 *
 * @event bqFocus - Handler to be called when item is focused
 * @event bqClick - Handler to be called when item is clicked
 * @event bqBlur - Handler to be called when item loses focus
 *
 * @slot - The default slot is used to add content to the breadcrumb item.
 *
 * @part base - The component wrapper container
 * @part content - The `span` tag that wraps the content item
 * @part item - The breadcrumb item wrapper (`button` or `a`)
 * @part separator - The `span` tag that wraps the separator element
 *
 * @cssprop --bq-breadcrumb-item--background - Background color of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--box-shadow - Box shadow of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--border-color - Border color of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--border-style - Border style of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--border-width - Border width of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--border-radius - Border radius of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--line-height - Line height of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--text-color - Text color of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--text-color-current - Text color of the current breadcrumb item (active)
 * @cssprop --bq-breadcrumb-item--text-size - Text size of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--text-size-separator - Text size of the breadcrumb item separator
 * @cssprop --bq-breadcrumb-item--padding-start - Padding start of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--padding-end - Padding end of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--paddingY - Padding top and bottom of the breadcrumb item
 * @cssprop --bq-breadcrumb-item--padding-start-separator - Padding start of the breadcrumb item separator
 * @cssprop --bq-breadcrumb-item--padding-end-separator - Padding end of the breadcrumb item separator
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
      <div class="flex items-center" part="base">
        <TagElem
          class="breadcrumb-item"
          href={isLink ? this.href : undefined}
          rel={isLink && this.target ? 'noreferrer noopener' : undefined}
          target={isLink ? this.target : undefined}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onClick={this.onClick}
          part="item"
        >
          <span class="flex items-center gap-xs2" part="content">
            <slot></slot>
          </span>
        </TagElem>
        {/* @internal use only */}
        <span class="breadcrumb-separator" part="separator">
          <slot name="separator"></slot>
        </span>
      </div>
    );
  }
}
