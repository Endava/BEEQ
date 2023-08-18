import { h, Component, Event, EventEmitter, Listen, Element, Prop } from '@stencil/core';

import { isHTMLElement } from '../../shared/utils';

/**
 * @part base - The component's internal wrapper.
 */
@Component({
  tag: 'bq-option-list',
  styleUrl: './scss/bq-option-list.scss',
  shadow: true,
})
export class BqOptionList {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqOptionListElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  /** If true, the option is selected and active. */
  @Prop({ reflect: true }) ariaLabel: string = 'Options';

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when `bq-option` is selected (on click/enter press). */
  @Event() bqSelect: EventEmitter<{ value: string; item: HTMLBqOptionElement }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.el.setAttribute('role', 'listbox');
  }

  // Listeners
  // ==============

  @Listen('bqClick', { passive: true })
  @Listen('bqEnter', { passive: true })
  onBqSelect(event: CustomEvent<HTMLElement>) {
    const { target: item } = event;

    if (isHTMLElement(item, 'bq-option')) {
      this.bqSelect.emit({ item, value: item.value });
    }
  }

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
      <div
        class="bq-option__list flex flex-col gap-y-[--bq-option-group--gapY-list]"
        part="base"
        role="group"
        aria-label={this.ariaLabel}
      >
        <slot />
      </div>
    );
  }
}
