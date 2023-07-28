import { Component, Element, h, Prop, State, Watch } from '@stencil/core';

import { ACCORDION_APPEARANCE, ACCORDION_SIZE, TAccordionAppearance, TAccordionSize } from './bq-accordion.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part base - The `<details>` that holds the accordion content
 * @part header - The `<summary>` that holds the accordion header content
 * @part prefix - The `<div>` that holds the accordion text prefix icon / avatar
 * @part text - The `<div>` that holds the accordion header text
 */
@Component({
  tag: 'bq-accordion',
  styleUrl: './scss/bq-accordion.scss',
  shadow: true,
})
export class BqAccordion {
  // Own Properties
  // ====================

  prefixElem: HTMLDivElement;
  suffixElem: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAccordionElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasPrefix = false;
  @State() private hasSuffix = false;

  // Public Property API
  // ========================

  @Prop({ reflect: true, mutable: true }) expanded: boolean = false;

  @Prop({ reflect: true }) disabled: boolean = false;

  @Prop({ reflect: true, mutable: true }) size: TAccordionSize = 'medium';

  @Prop({ reflect: true, mutable: true }) appearance: TAccordionAppearance = 'filled';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(ACCORDION_SIZE, 'medium', this.el, 'size');
    validatePropValue(ACCORDION_APPEARANCE, 'filled', this.el, 'appearance');
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

  private handleClick = (event: MouseEvent) => {
    event.preventDefault();
    this.expanded = !this.expanded;
  };

  private handlePrefixSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
  };

  private handleSuffixSlotChange = () => {
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <details
        class={{ [`bq-accordion ${this.size} ${this.appearance}`]: true, disabled: this.disabled }}
        open={this.expanded}
        onClick={this.handleClick}
        part="base"
      >
        <summary class="bq-accordion__summary" part="header">
          <div
            ref={(element) => (this.prefixElem = element)}
            class={{ 'bq-accordion__summary-prefix': true, '!hidden': !this.hasPrefix }}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.handlePrefixSlotChange} />
          </div>
          <div class="bq-accordion__summary-text" part="text">
            <slot name="header" />
          </div>
          <div
            ref={(element) => (this.suffixElem = element)}
            class={{ 'bq-accordion__summary-suffix': true, '!hidden': !this.hasSuffix }}
            part="suffix"
          >
            <slot name="suffix" onSlotchange={this.handleSuffixSlotChange} />
          </div>

          <div class={{ 'flex items-center justify-center': true, '!hidden': this.expanded }}>
            <slot name="expanded">
              <bq-icon name="plus" />
            </slot>
          </div>
          <div class={{ 'flex items-center justify-center': true, '!hidden': !this.expanded }}>
            <slot name="collapsed">
              <bq-icon name="minus" />
            </slot>
          </div>
        </summary>
        <slot />
      </details>
    );
  }
}
