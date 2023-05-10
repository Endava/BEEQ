import { h, Component, Element, Host, Listen, Event, EventEmitter } from '@stencil/core';
import { isHTMLElement } from '../../shared/utils';

/**
 * @part trigger - The `div` element used to display the trigger element
 * @part panel - The `div` element used to display the panel element (bq-panel)
 */
@Component({
  tag: 'bq-dropdown',
  styleUrl: './scss/bq-dropdown.scss',
  shadow: true,
})
export class BqDropdown {
  // Own Properties
  // ====================

  public trigger: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDropdownElement;

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

  /** Handler to be called when the item loses focus */
  @Event() bqBlur: EventEmitter<HTMLElement>;

  /** Handler to be called when the item gets focus */
  @Event() bqFocus: EventEmitter<HTMLElement>;

  /** Handler to be called when item is changed (click/enter press) */
  @Event() bqSelect: EventEmitter<HTMLElement>; // switch to HTMLBqOptionElement

  /** Handler to be called when the panel switches state (visible/hidden) */
  @Event() bqPanelOpen: EventEmitter<boolean>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.initFloatingUIFromPanel();
  }

  // Listeners
  // ==============

  @Listen('bqOptionBlur')
  onBqOptionBlur(event: CustomEvent<HTMLElement>) {
    // switch type to HTMLBqOptionElement
    this.bqBlur.emit(event.detail);
  }

  @Listen('bqOptionFocus')
  onBqOptionFocus(event: CustomEvent<HTMLElement>) {
    // switch type to HTMLBqOptionElement
    this.bqFocus.emit(event.detail);
  }

  @Listen('bqOptionClick')
  @Listen('bqOptionOnEnter')
  onBqOptionSelect(event: CustomEvent<HTMLElement>) {
    // switch type to HTMLBqOptionElement
    this.bqSelect.emit(event.detail);
  }

  @Listen('bqPanelVisibility')
  onPanelStateChange(event: CustomEvent<boolean>) {
    this.bqPanelOpen.emit(event.detail);
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

  private openPanel = (): void => {
    const target: HTMLBqPanelElement = this.panelElement;

    target?.togglePanel();
  };

  private initFloatingUIFromPanel = (): void => {
    const target: HTMLBqPanelElement = this.panelElement;

    target?.setTriggerElement(this.el);
  };

  private get panelElement(): HTMLBqPanelElement {
    const slots: Element[] = this.el.shadowRoot
      .querySelector<HTMLSlotElement>('[part="panel"] > slot')
      .assignedElements({ flatten: true })
      .filter((elem: HTMLElement) => isHTMLElement(elem, 'bq-panel')) as [HTMLBqPanelElement];

    return slots[0] as HTMLBqPanelElement;
  }

  render() {
    return (
      <Host>
        <div class="trigger" ref={(el) => (this.trigger = el)} onClick={this.openPanel} part="trigger">
          <slot name="trigger" />
        </div>
        <div part="panel">
          <slot />
        </div>
      </Host>
    );
  }
}
