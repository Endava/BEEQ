import { h, Component, Element, Prop, Listen } from '@stencil/core';

import { FloatingUIPlacement } from '../../services/interfaces';

/**
 * @part base - The component's internal wrapper.
 * @part dropdown - The `<bq-panel>` element used under the hood to display the dropdown panel
 * @part panel - The `<div>` element used to display and style the panel inside the `<bq-panel>` element
 * @part trigger - The `<div>` element that hosts the trigger element
 */
@Component({
  tag: 'bq-dropdown',
  styleUrl: './scss/bq-dropdown.scss',
  shadow: true,
})
export class BqDropdown {
  // Own Properties
  // ====================

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

  /** When set, it will override the height of the dropdown panel */
  @Prop({ reflect: true }) panelHeight?: string;

  /** If true, the panel will remain open after a selection is made. */
  @Prop({ reflect: true }) keepOpenOnSelect?: boolean = false;

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
    if (this.keepOpenOnSelect) return;

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
    const style = {
      ...(this.panelHeight && { '--bq-panel--height': this.panelHeight }),
    };

    return (
      <div class="bq-dropdown" part="base">
        {/* TRIGGER ELEMENT */}
        <div
          class="bq-dropdown__trigger block"
          onClick={this.togglePanel}
          aria-haspopup="true"
          aria-expanded={this.open ? 'true' : 'false'}
          part="trigger"
        >
          <slot name="trigger" />
        </div>
        {/* PANEL */}
        <bq-panel
          style={style}
          class="bq-dropdown__panel"
          distance={this.distance}
          placement={this.placement}
          open={this.open}
          sameWidth={this.sameWidth}
          skidding={this.skidding}
          strategy={this.strategy}
          aria-labelledby="dropdown"
          role="region"
          part="dropdown"
          exportparts="panel"
        >
          <slot />
        </bq-panel>
      </div>
    );
  }
}
