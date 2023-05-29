import { h, Component, State, Prop } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

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

  @Prop() isLast: boolean = false;

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
    return (
      <section class="flex h-5 items-center">
        <div class="breadcrumb-item" role="listitem" tabindex="0">
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
        </div>
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
