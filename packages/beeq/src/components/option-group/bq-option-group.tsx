import { Component, Element, h } from '@stencil/core';

/**
 * @part label - The `legend` tag element which acts as a container for the label
 * @part prefix - The prefix of the label
 * @part label - The text of the label
 * @part suffix - The suffix of the label
 * @part group - The `div` element which holds the option items
 */
@Component({
  tag: 'bq-option-group',
  styleUrl: './scss/bq-option-group.scss',
  shadow: true,
})
export class BqOptionGroup {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLElement;

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
      <div class="bg-ui-primary">
        <legend class="bq-option-group mb-[--bq-option-group--gapY-list]" part="label">
          <span class="option-group__prefix flex items-center" part="prefix">
            <slot name="header-prefix" />
          </span>
          <span
            class="bq-option-group__label inline-block w-auto overflow-hidden text-ellipsis whitespace-nowrap"
            part="label"
          >
            <slot name="header-label" />
          </span>
          <span class="bq-option-group__suffix" part="suffix">
            <slot name="header-suffix" />
          </span>
        </legend>
        <div
          class="bq-option-group__container flex flex-col gap-[--bq-option-group--gapY-list]"
          role="group"
          aria-label="Options"
          part="group"
        >
          <slot />
        </div>
      </div>
    );
  }
}
