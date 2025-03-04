import { Component, Element, h, Prop, State, Watch } from '@stencil/core';

import { EMPTY_STATE_SIZE, SIZE_TO_VALUE_MAP } from './bq-empty-state.types';
import type { TEmptyStateSize } from './bq-empty-state.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * An Empty State is a UI component displayed when there is no data or content available, often used in dynamic or inactive application states.
 *
 * @example How to use it
 * ```html
 * <bq-empty-state size="medium">Title</bq-empty-state>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/673ae0-empty-state/b/09d7b1
 * @status stable
 *
 * @dependency bq-icon
 *
 * @attr {"large" | "medium" | "small"} size - The size of the empty state component
 *
 * @slot thumbnail - The element that wraps the thumbnail element
 * @slot body - The content to be displayed after the thumbnail section
 * @slot footer - The content to be displayed after the body section as footer
 *
 * @part body - The container `<div>` that wraps the alert description content
 * @part footer - The container `<div>` that wraps the alert footer content
 * @part icon - The `<bq-icon>` element used to render a predefined icon size based on the empty state size (small, medium, large)
 * @part thumbnail - The container `<div>` that wraps the thumbnail element
 * @part title - The container `<div>` that wraps the empty state title content
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM
 */

@Component({
  tag: 'bq-empty-state',
  styleUrl: './scss/bq-empty-state.scss',
  shadow: true,
})
export class BqEmptyState {
  // Own Properties
  // ====================

  private bodyElem: HTMLDivElement;
  private footerElem: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqEmptyStateElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasBody = false;
  @State() private hasFooter = false;

  // Public Property API
  // ========================

  /** The size of the empty state component */
  @Prop({ reflect: true, mutable: true }) size: TEmptyStateSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(EMPTY_STATE_SIZE, 'medium', this.el, 'size');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
  }

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

  private handleSlotChange = () => {
    this.hasBody = hasSlotContent(this.bodyElem, 'body');
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  private get iconSize(): number {
    return SIZE_TO_VALUE_MAP[this.size] || SIZE_TO_VALUE_MAP.medium;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="inline-flex flex-col items-center" part="wrapper">
        <div
          class={{
            'm-be-m': this.size === 'small',
            'm-be-xl': this.size === 'medium',
            'm-be-xxl': this.size === 'large',
          }}
          part="thumbnail"
        >
          <slot name="thumbnail">
            <bq-icon size={this.iconSize} name="database" part="icon" exportparts="base,svg" />
          </slot>
        </div>
        <div
          class={{
            'font-bold leading-regular text-primary': true,
            'text-m': this.size === 'small',
            'text-l': this.size === 'medium',
            'text-xxl2': this.size === 'large',
            'm-be-xs': this.size === 'small' && this.hasBody,
            'm-be-m': this.size === 'medium' && this.hasBody,
            'm-be-l': this.size === 'large' && this.hasBody,
          }}
          part="title"
        >
          <slot />
        </div>
        <div
          class={{
            'font-normal leading-regular': true,
            'text-s': this.size === 'small',
            'text-m': this.size === 'medium',
            'text-l': this.size === 'large',
            'm-be-m': this.size === 'small' && this.hasFooter,
            'm-be-l': this.size === 'medium' && this.hasFooter,
            'm-be-xl': this.size === 'large' && this.hasFooter,
          }}
          ref={(div) => (this.bodyElem = div)}
          part="body"
        >
          <slot name="body" onSlotchange={this.handleSlotChange} />
        </div>
        <div class="flex items-start gap-xs" ref={(div) => (this.footerElem = div)} part="footer">
          <slot name="footer" onSlotchange={this.handleSlotChange} />
        </div>
      </div>
    );
  }
}
