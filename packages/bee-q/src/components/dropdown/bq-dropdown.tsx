import { h, Component, Element, Event, EventEmitter, Prop, Listen } from '@stencil/core';

import { FloatingUIPlacement } from '../../services/interfaces';

/**
 * @part base - The component's internal wrapper.
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

  private trigger: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDropdownElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Represents the distance (gutter or margin) between the panel and the trigger element. */
  @Prop({ reflect: true }) distance?: number = 4;

  /** Position of the panel */
  @Prop({ reflect: true }) placement?: FloatingUIPlacement = 'bottom-start';

  /** If true, the panel will be visible. */
  @Prop({ reflect: true }) open?: boolean = false;

  /** The trigger element for the panel */
  @Prop() triggerElement?: HTMLElement;

  /** Whether the panel should have the same width as the trigger element */
  @Prop({ reflect: true }) sameWidth?: boolean = false;

  /**  Represents the skidding between the panel and the trigger element. */
  @Prop({ reflect: true }) skidding?: number = 0;

  /** Defines the strategy to position the panel */
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /**
   * Handler to be called to check if the `bq-panel` switches state (visible/hidden).
   * @returns CustomEvent - with value `{ opened: boolean }`
   */
  @Event() bqPanelChange: EventEmitter<{ opened: boolean }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  // Listeners
  // ==============

  /** Listens for the 'click' event on the document object
   * and closes the dropdown panel if the click is outside the component.
   */
  @Listen('click', { target: 'document', passive: true })
  onClickOutside(event: MouseEvent) {
    if (!this.open) return;

    // Close when clicking outside of the close element
    const path = event.composedPath();
    if (!path.includes(this.el)) {
      this.open = false;
    }
  }

  /**
   * Listens for the 'keyup' event on the window object
   * and closes the dropdown panel if the 'Escape' key or 'Tab' key outside the component is pressed.
   */
  @Listen('keyup', { target: 'window', passive: true })
  onEscape(event: KeyboardEvent) {
    if (!this.open) return;

    if (event.key === 'Escape' || (event.key === 'Tab' && !event.composedPath().includes(this.el))) {
      this.open = false;
    }
  }

  @Listen('bqSelect', { passive: true })
  onItemSelect() {
    this.open = false;
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

  private togglePanel = (): void => {
    this.open = !this.open;
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-dropdown" part="base">
        {/* TRIGGER ELEMENT */}
        <div
          class="bq-dropdown__trigger"
          ref={(el) => (this.trigger = el)}
          onClick={this.togglePanel}
          aria-haspopup="true"
          aria-expanded={this.open}
          part="trigger"
        >
          <slot name="trigger" />
        </div>
        {/* PANEL */}
        <bq-panel
          class="bq-dropdown__panel"
          distance={this.distance}
          placement={this.placement}
          open={this.open}
          sameWidth={this.sameWidth}
          skidding={this.skidding}
          strategy={this.strategy}
          triggerElement={this.trigger}
          aria-labelledby="dropdown"
          role="region"
          part="panel"
        >
          <slot />
        </bq-panel>
      </div>
    );
  }
}
