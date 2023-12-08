import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

import { SIZE_TO_VALUE_MAP, TAG_SIZE, TTagSize } from './bq-tag.types';
import { validatePropValue } from '../../shared/utils';
@Component({
  tag: 'bq-tag',
  styleUrl: './scss/bq-tag.scss',
  shadow: true,
})
export class BqTag {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqTagElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The type of the tag component */
  @Prop({ reflect: true }) size: TTagSize = 'small';

  /** If true, the tag component has an icon */
  @Prop({ reflect: true }) hasIcon: boolean;

  /** If true, the tag component can be closed */
  @Prop({ reflect: true }) isRemovable: boolean;

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(TAG_SIZE, 'small', this.el, 'size');
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

  // render() function
  // Always the last one in the class.
  // ===================================

  private get iconSize(): number {
    return SIZE_TO_VALUE_MAP[this.size] || SIZE_TO_VALUE_MAP.small;
  }

  render() {
    return (
      <Host>
        <div class={{ [`bq-tag bq-tag__wrapper--${this.size} font-medium leading-regular`]: true }} part="wrapper">
          <div class="bq-tag__icon">
            <slot name="icon">
              <bq-icon size={this.iconSize} name="star" part="icon" exportparts="base,svg" />
            </slot>
          </div>
          <div
            class={{
              'text-xs': this.size === 'extra_small',
              'text-s': this.size === 'small',
              'text-m': this.size === 'medium',
            }}
          >
            <slot name="tag" />
          </div>
          {this.isRemovable && (
            <bq-button class="bq-tag__close" appearance="text" size="small" part="btn-close">
              <bq-icon size={this.iconSize} name="x-circle" />
            </bq-button>
          )}
        </div>
      </Host>
    );
  }
}
