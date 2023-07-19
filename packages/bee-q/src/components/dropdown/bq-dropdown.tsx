import { h, Component, Element, Event, EventEmitter, Prop } from '@stencil/core';

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

  public trigger: HTMLElement;
  public panelElement: HTMLBqPanelElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDropdownElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Distance between the panel and the trigger element. */
  @Prop({ reflect: true }) panelDistance?: number = 0;

  /** Position of the panel */
  @Prop({ reflect: true }) panelPlacement?: FloatingUIPlacement = 'bottom';

  /** If true, panel is visible.
   * You can toggle this attribute to show/hide the panel.
   */
  @Prop({ reflect: true }) panelOpen?: boolean = false;

  /**
   * Determines whether the scrollbar is visible or hidden within the panel.
   */
  @Prop({ reflect: true }) panelScrollbar?: boolean = false;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the `bq-panel` switches state (visible/hidden). */
  @Event() bqPanelOpen: EventEmitter<boolean>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.initFloatingUIFromPanel();
  }

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

  private openPanel = (): void => {
    this.panelElement?.togglePanel();
  };

  private initFloatingUIFromPanel = (): void => {
    this.panelElement?.setTriggerElement(this.el);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div part="base">
        {/* TRIGGER ELEMENT */}
        <div
          class="trigger"
          ref={(el) => (this.trigger = el)}
          onClick={this.openPanel}
          aria-haspopup="true"
          aria-expanded={this.panelOpen}
          part="trigger"
        >
          <slot name="trigger" />
        </div>
        {/* PANEL */}
        <bq-panel
          distance={this.panelDistance}
          placement={this.panelPlacement}
          open={this.panelOpen}
          scrollbar={this.panelScrollbar}
          ref={(el) => (this.panelElement = el)}
          aria-labelledby="dropdown"
          part="panel"
        >
          <slot />
        </bq-panel>
      </div>
    );
  }
}
