import { h, Component, Element, Host } from '@stencil/core';
import { isHTMLElement } from '../../shared/utils';

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

  // @State() private isVisible = false;

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

  private openPanel = (): void => {
    const slots: Element[] = this.el.shadowRoot
      .querySelector<HTMLSlotElement>('[part="panel"] > slot')
      .assignedElements({ flatten: true })
      .filter((elem: HTMLElement) => isHTMLElement(elem, 'bq-panel')) as [HTMLBqPanelElement];
    const target = slots[0] as HTMLBqPanelElement;

    target.openPanel();
  };

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
