import { h, Component, Event, EventEmitter, Listen } from '@stencil/core';

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

  private baseElem: HTMLElement;
  slot: HTMLSlotElement;

  // Reference to host HTML element
  // ===================================

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

  /** Handler to be called when `bq-option` item loses focus. */
  @Event() bqBlur: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called when `bq-option` item gets focus. */
  @Event() bqFocus: EventEmitter<HTMLBqOptionElement>;

  /** Handler to be called when `bq-option` is selected (on click/enter press). */
  @Event() bqSelect: EventEmitter<HTMLBqOptionElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  // Listeners
  // ==============

  @Listen('bqOptionBlur', { passive: true })
  onBqOptionBlur(event: CustomEvent<HTMLElement>) {
    const { target: item } = event;
    if (isHTMLElement(item, 'bq-option')) this.bqBlur.emit(item);
  }

  @Listen('bqOptionFocus', { passive: true })
  onBqOptionFocus(event: CustomEvent<HTMLElement>) {
    const { target: item } = event;
    if (isHTMLElement(item, 'bq-option')) this.bqFocus.emit(item);
  }

  @Listen('bqOptionClick', { passive: true })
  @Listen('bqOptionEnter', { passive: true })
  onBqSelect(event: CustomEvent<HTMLElement>) {
    const { target: item } = event;

    this.optionItems.forEach((option: HTMLBqOptionElement) => (option.selected = option === item));
    if (isHTMLElement(item, 'bq-option')) this.bqSelect.emit(item);
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

  private setSlotElem = () => {
    this.slot = this.baseElem.querySelector('slot');
  };

  /**
   * get all option elements (direct and nested children within `<bq-option-group>`)
   */
  private get optionItems(): HTMLBqOptionElement[] | [] {
    if (!this.baseElem) return [];

    const bqOptionItems: HTMLBqOptionElement[] = [];

    this.slot.assignedElements({ flatten: true }).filter((elem: HTMLBqOptionElement | HTMLBqOptionGroupElement) => {
      if (isHTMLElement(elem, 'bq-option')) bqOptionItems.push(elem);
      if (isHTMLElement(elem, 'bq-option-group'))
        Array.from(elem.querySelectorAll('bq-option')).forEach((bqOption) => bqOptionItems.push(bqOption));
    });

    return bqOptionItems;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div ref={(element) => (this.baseElem = element)} part="base" role="listbox" aria-label="Options">
        <slot onSlotchange={this.setSlotElem} />
      </div>
    );
  }
}
