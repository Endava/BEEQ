import { h, Component, State, Prop } from '@stencil/core';

import { hasSlotContent, isDefined } from '../../shared/utils';

@Component({
  tag: 'bq-breadcrumb-item',
  styleUrl: './scss/bq-breadcrumb-item.scss',
  shadow: true,
})
export class BqBreadcrumbItem {
  // Own Properties
  // ====================

  private prefixElem: HTMLElement;
  private suffixElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasPrefix: boolean = false;
  @State() hasSuffix: boolean = false;

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  /** If true, the item is the last element inside breadcrumb */
  @Prop() isLast: boolean = false;

  /** If set, the breadcrumb item will be rendered as an `<a>` with this `href`, otherwise, a `<button>` will be rendered. */
  @Prop({ reflect: true }) href: string;

  /** Where to display the link in the browser context. Relevant only if `href` is set. */
  @Prop({ reflect: true }) target: '_blank' | '_parent' | '_self' | '_top';

  /** Where to display the link in the browser context. Relevant only if `href` is set. */
  @Prop({ reflect: true }) rel: string = 'noreferrer noopener';

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

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

  private onSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const isLink = isDefined(this.href);
    const TagElem = isLink ? 'a' : 'button';

    return (
      <section class="flex h-5 items-center">
        <TagElem
          class="breadcrumb-item"
          role="listitem"
          tabindex="0"
          href={isLink ? this.href : undefined}
          rel={isLink && this.target ? 'noreferrer noopener' : undefined}
          target={isLink ? this.target : undefined}
        >
          <span
            class={{
              'breadcrumb-item__prefix': true,
              'pr-2': this.hasPrefix,
            }}
            ref={(elem) => (this.prefixElem = elem)}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.onSlotChange}></slot>
          </span>
          <span
            class={{
              'breadcrumb-item__label': true,
              'text-text-brand': this.isLast,
            }}
            part="label"
          >
            <slot></slot>
          </span>
          <span
            class={{
              'breadcrumb-item__suffix': true,
              'pl-2': this.hasSuffix,
            }}
            ref={(elem) => (this.suffixElem = elem)}
            part="suffix"
          >
            <slot name="suffix" onSlotchange={this.onSlotChange}></slot>
          </span>
        </TagElem>
        <span
          class={{
            'breadcrumb-separator': true,
            hidden: this.isLast,
          }}
        >
          /
        </span>
      </section>
    );
  }
}
