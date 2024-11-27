import { Component, Element, Event, EventEmitter, h, Listen, Prop, Watch } from '@stencil/core';

import { Placement } from '../../services/interfaces';

let id = 0;

/**
 * The Dropdown Component is commonly used when presenting a list of selectable options that are too numerous to fit comfortably on the screen.
 * They provide an efficient way to save space and present a long list of options in a compact and organized manner.
 *
 * @example How to use it
 * ```html
 * <bq-dropdown placement="bottom-start">
 *   <bq-button slot="trigger">Dropdown</bq-button>
 *   <bq-option-list>
 *     <bq-option value="users">...</bq-option>
 *     <bq-option value="user">...</bq-option>
 *     <bq-option value="dashboard">...</bq-option>
 *     <bq-option value="settings">...</bq-option>
 *     <bq-option value="logout">...</bq-option>
 *   </bq-option-list>
 * </bq-dropdown>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/47ff4b-dropdown
 * @status stable
 *
 * @dependency bq-panel
 *
 * @attr {boolean} disabled - If true, the dropdown panel will be visible and won't be shown.
 * @attr {number} distance - Represents the distance (gutter or margin) between the panel and the trigger element.
 * @attr {boolean} keep-open-on-select - If true, the panel will remain open after a selection is made.
 * @attr {"top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end"} placement - Position of the panel.
 * @attr {boolean} open - If true, the panel will be visible.
 * @attr {string} panel-height - When set, it will override the height of the dropdown panel.
 * @attr {boolean} same-width - Whether the panel should have the same width as the trigger element.
 * @attr {number} skidding - Represents the skidding between the panel and the trigger element.
 * @attr {"fixed" | "absolute"} strategy - Defines the strategy to position the panel.
 *
 * @event bqOpen - Callback handler to be called when the dropdown panel is opened or closed.
 *
 * @slot trigger - The trigger element that opens the dropdown panel.
 * @slot - The content of the dropdown panel.
 *
 * @part base - The component's internal wrapper.
 * @part dropdown - The `<bq-panel>` element used under the hood to display the dropdown panel.
 * @part panel - The `<div>` element used to display and style the panel inside the `<bq-panel>` element.
 * @part trigger - The `<div>` element that hosts the trigger element.
 *
 * @cssprop --bq-panel--background - Panel background color
 * @cssprop --bq-panel--border-color - Panel border color
 * @cssprop --bq-panel--border-radius - Panel border radius
 * @cssprop --bq-panel--border-style - Panel border style
 * @cssprop --bq-panel--border-width - Panel border width
 * @cssprop --bq-panel--box-shadow - Panel box shadow
 * @cssprop --bq-panel--padding - Panel padding
 * @cssprop --bq-panel--height - Panel height
 * @cssprop --bq-panel--width - Panel width
 * @cssprop --bq-panel-z-index - Panel z-index applied when opened
 */
@Component({
  tag: 'bq-dropdown',
  styleUrl: './scss/bq-dropdown.scss',
  shadow: true,
})
export class BqDropdown {
  // Own Properties
  // ====================

  private dropdownPanelId = `bq-dropdown-panel-${++id}`;
  private triggerElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDropdownElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true, the dropdown panel will be visible and won't be shown. */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** Represents the distance (gutter or margin) between the panel and the trigger element. */
  @Prop({ reflect: true }) distance?: number = 4;

  /** If true, the panel will remain open after a selection is made. */
  @Prop({ reflect: true }) keepOpenOnSelect?: boolean = false;

  /** Position of the panel */
  @Prop({ reflect: true }) placement?: Placement = 'bottom-start';

  /** If true, the panel will be visible. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** When set, it will override the height of the dropdown panel */
  @Prop({ reflect: true }) panelHeight?: string;

  /** Whether the panel should have the same width as the trigger element */
  @Prop({ reflect: true }) sameWidth?: boolean = false;

  /**  Represents the skidding between the panel and the trigger element. */
  @Prop({ reflect: true }) skidding?: number = 0;

  /** Defines the strategy to position the panel */
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';

  // Prop lifecycle events
  // =======================

  @Watch('open')
  onOpenChange() {
    this.bqOpen.emit({ open: this.open });
  }

  @Watch('disabled')
  handleDisabledChange() {
    if (!this.triggerElem) return;

    // set 'disabled' attribute based on 'this.disabled' value, ensuring consistent state handling
    if (!this.disabled) {
      this.triggerElem?.removeAttribute('disabled');
      return;
    }
    this.triggerElem?.setAttribute('disabled', 'true');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the dropdown panel is opened or closed. */
  @Event() bqOpen: EventEmitter<{ open: boolean }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.triggerElem = this.el.querySelector('[slot="trigger"]');
    this.handleDisabledChange();
  }

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
    // Don't toggle the panel if the component is disabled or the trigger element is disabled
    if (this.disabled || this.triggerElem?.hasAttribute('disabled')) return;

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
        {/* TRIGGER CONTAINER */}
        <div
          class="bq-dropdown__trigger block"
          aria-controls={this.dropdownPanelId}
          aria-haspopup="true"
          onClick={this.togglePanel}
          part="trigger"
        >
          <slot name="trigger" />
        </div>
        {/* PANEL */}
        <bq-panel
          style={style}
          id={this.dropdownPanelId}
          class="bq-dropdown__panel"
          distance={this.distance}
          placement={this.placement}
          open={this.open}
          sameWidth={this.sameWidth}
          skidding={this.skidding}
          strategy={this.strategy}
          role="group"
          part="dropdown"
          exportparts="panel"
        >
          <slot />
        </bq-panel>
      </div>
    );
  }
}
