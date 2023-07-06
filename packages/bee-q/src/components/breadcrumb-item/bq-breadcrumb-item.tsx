import { h, Component, State, Prop, Element, Event, EventEmitter } from '@stencil/core';

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
  private labelElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqBreadcrumbItemElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasPrefix: boolean = false;
  @State() hasSuffix: boolean = false;
  @State() hasLabel: boolean = false;

  // Public Property API
  // ========================

  /** If true, the item is the last element inside breadcrumb */
  @Prop() hideSeparatorIcon: boolean = false;

  /** The icon name used as separator. Default is `/`. */
  @Prop() separatorIcon!: string;

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

  private onSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
    this.hasLabel = hasSlotContent(this.labelElem, 'label');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const isLink = isDefined(this.href);
    const TagElem = isLink ? 'a' : 'button';
    const separatorElem = this.separatorIcon ? <bq-icon size="12" name={this.separatorIcon}></bq-icon> : '/';

    return (
      <section class="flex h-5 items-center" role="listitem">
        <TagElem
          class="breadcrumb-item"
          tabindex="0"
          href={isLink ? this.href : undefined}
          rel={isLink && this.target ? 'noreferrer noopener' : undefined}
          target={isLink ? this.target : undefined}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onClick={this.onClick}
        >
          <span class="breadcrumb-item__prefix" ref={(elem) => (this.prefixElem = elem)} part="prefix">
            <slot name="prefix" onSlotchange={this.onSlotChange}></slot>
          </span>
          <span
            class={{
              'breadcrumb-item__label': true,
              'text-text-brand': this.hideSeparatorIcon,
              'pl-xs': this.hasPrefix && this.hasLabel,
              'pr-xs': this.hasSuffix && this.hasLabel,
            }}
            ref={(elem) => (this.labelElem = elem)}
            part="label"
          >
            <slot name="label" onSlotchange={this.onSlotChange}></slot>
          </span>
          <span class="breadcrumb-item__suffix" ref={(elem) => (this.suffixElem = elem)} part="suffix">
            <slot name="suffix" onSlotchange={this.onSlotChange}></slot>
          </span>
        </TagElem>
        <span
          class={{
            'breadcrumb-separator': true,
            hidden: this.hideSeparatorIcon,
          }}
        >
          {separatorElem}
        </span>
      </section>
    );
  }
}
