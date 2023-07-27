import { h, Component, Element } from '@stencil/core';

@Component({
  tag: 'bq-textarea',
  styleUrl: './scss/bq-textarea.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqTextarea {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqTextareaElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

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
      <div class="bq-textarea flex flex-auto flex-col">
        <label class="bq-textarea--label mb-xs text-s font-regular leading-regular" htmlFor="textarea">
          <slot name="label" />
        </label>
        <textarea id="textarea" class="bq-textarea--input" placeholder="Placeholder..." />
        <div class="flex justify-between">
          <span class="bq-textarea--helper-text mt-xs">
            <slot name="helper-text" />
          </span>
          <span class="bq-textarea--counter mt-xs text-s text-text-secondary">
            0/100
            <slot name="counter" />
          </span>
        </div>
      </div>
    );
  }
}
