import { Component, Element, h, Prop, State } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

/**
 * @part base - The component's base wrapper.
 * @part input - The native HTML input element used under the hood.
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 */
@Component({
  tag: 'bq-input',
  styleUrl: './scss/bq-input.scss',
  shadow: true,
})
export class BqInput {
  // Own Properties
  // ====================

  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqInputElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasPrefix = false;
  @State() hasSuffix = false;

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  /** The input placeholder text value */
  @Prop() placeholder: string;

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

  private handlePrefixSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem);
  };

  private handleSuffixSlotChange = () => {
    this.hasSuffix = hasSlotContent(this.suffixElem);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-input relative rounded-s" part="base">
        {/* Prefix */}
        <span
          class={{ 'bq-input--prefix pl-m': true, hidden: !this.hasPrefix }}
          part="prefix"
          ref={(spanElem) => (this.prefixElem = spanElem)}
        >
          <slot name="prefix" onSlotchange={this.handlePrefixSlotChange} />
        </span>
        {/* HTML Input */}
        <input
          class={{ 'bq-input--input': true, '!pl-m': !this.hasPrefix, '!pr-m': !this.hasSuffix }}
          placeholder={this.placeholder}
          part="input"
        />
        {/* Suffix */}
        <span
          class={{ 'bq-input--suffix pr-m': true, hidden: !this.hasSuffix }}
          part="suffix"
          ref={(spanElem) => (this.suffixElem = spanElem)}
        >
          <slot name="suffix" onSlotchange={this.handleSuffixSlotChange} />
        </span>
      </div>
    );
  }
}
