import { h, Component, Prop, Element } from '@stencil/core';

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

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqInputElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-input relative rounded-s" part="base">
        <span class="bq-input--prefix pl-m" part="prefix">
          <slot name="prefix" />
        </span>
        <input class="bq-input--input" placeholder={this.placeholder} part="input" />
        <span class="bq-input--suffix pr-m" part="suffix">
          <slot name="suffix" />
        </span>
      </div>
    );
  }
}
