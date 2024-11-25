import { Component, Element, Event, EventEmitter, h, Listen, Prop } from '@stencil/core';

import { isEventTargetChildOfElement, isHTMLElement } from '../../shared/utils';

/**
 * The option list component is a container for multiple option elements.
 * It allows to manage the appearance and size of all options at once.
 *
 * @example How to use it
 * ```html
 * <bq-option-list>
 *   <bq-option value="football">Football</bq-option>
 *   <bq-option value="basketball">Basketball</bq-option>
 *   <bq-option value="tennis">Tennis</bq-option>
 * </bq-option-list>
 * ```
 *
 * @documentation https://storybook.beeq.design/?path=/story/components-option--default
 * @status stable
 *
 * @attr {string} aria-label - Aria label for the list.
 *
 * @slot - The option items
 *
 * @part base - The component's internal wrapper.
 *
 * @cssprop --bq-option-group--gapY-list - Option group gap between items Y axis
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

  /** Aria label for the list. */
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
    if (!isHTMLElement(item, 'bq-option') || !isEventTargetChildOfElement(event, this.el)) return;

    this.bqSelect.emit({ item, value: item.value });
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
      <div class="bq-option__list flex flex-col gap-y-[--bq-option-group--gapY-list]" part="base">
        <slot />
      </div>
    );
  }
}
