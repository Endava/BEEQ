import { h, Component, Element, Host, Listen, Event, EventEmitter, Prop } from '@stencil/core';

import { FloatingUIPlacement } from '../../services/interfaces';

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
  public panelElement: HTMLBqPanelElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDropdownElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Distance between the panel and the trigger element */
  @Prop({ reflect: true }) panelDistance?: number = 0;

  /** Position of the panel */
  @Prop({ reflect: true }) panelPlacement?: FloatingUIPlacement = 'bottom';

  /** If true, panel is visible.
   * You can toggle this attribute to show/hide the panel.
   */
  @Prop({ reflect: true }) panelOpen?: boolean = false;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when `bq-option` item loses focus. */
  @Event() bqOptionBlur: EventEmitter<HTMLElement>; // switch to HTMLBqOptionElement

  /** Handler to be called when `bq-option` item gets focus. */
  @Event() bqOptionFocus: EventEmitter<HTMLElement>; // switch to HTMLBqOptionElement

  /** Handler to be called when `bq-option` is selected (on click/enter press). */
  @Event() bqOptionSelect: EventEmitter<HTMLElement>; // switch to HTMLBqOptionElement

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

  @Listen('bqBlur')
  onBqOptionBlur(event: CustomEvent<HTMLElement>) {
    // add condition `if (isHTMLElement(event.detail, 'bq-option'))`
    this.bqOptionBlur.emit(event.detail);
  }

  @Listen('bqFocus')
  onBqOptionFocus(event: CustomEvent<HTMLElement>) {
    // add condition `if (isHTMLElement(event.detail, 'bq-option'))`
    this.bqOptionFocus.emit(event.detail);
  }

  @Listen('bqClick')
  @Listen('bqOnEnter')
  onBqSelect(event: CustomEvent<HTMLElement>) {
    // add condition `if (isHTMLElement(event.detail, 'bq-option'))`
    this.bqOptionSelect.emit(event.detail);
  }

  @Listen('bqClick')
  onBqClick() {
    // add condition `if (isHTMLElement(event.detail, 'bq-option'))`
    this.panelElement?.togglePanel();
  }

  @Listen('bqOnEnterKeyUp')
  onBqEnterKeyUp(event: CustomEvent<HTMLElement>) {
    // add condition `if (isHTMLElement(event.detail, 'bq-option'))`
    this.panelElement?.togglePanel();
    event.detail.setAttribute('selected', 'false');
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
      <Host>
        <div class="trigger" ref={(el) => (this.trigger = el)} onClick={this.openPanel} part="trigger">
          <slot name="trigger" />
        </div>
        <bq-panel
          distance={this.panelDistance}
          placement={this.panelPlacement}
          open={this.panelOpen}
          ref={(el) => (this.panelElement = el)}
          part="panel"
        >
          <slot />
        </bq-panel>
      </Host>
    );
  }
}
