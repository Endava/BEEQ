import { h, Component, Prop, Listen, Element, Method, Host, Watch } from '@stencil/core';

import { FloatingUI } from '../../services/libraries';
import { FloatingUIPlacement } from '../../services/interfaces';

@Component({
  tag: 'bq-panel',
  styleUrl: './scss/bq-panel.scss',
  shadow: true,
})
export class BqPanel {
  // Own Properties
  // ====================

  private panel: HTMLElement;
  private floatingUI: FloatingUI;
  private trigger: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqPanelElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  @Watch('distance')
  @Watch('placement')
  onPropChange() {
    this.floatingUI.init({
      placement: this.placement,
      distance: this.distance,
      sameWidth: false,
      strategy: 'fixed',
      skidding: 0,
    });
  }

  /** Distance between the panel and the trigger element */
  @Prop({ reflect: true }) distance?: number = 0;

  /** Position of the panel */
  @Prop({ reflect: true }) placement?: FloatingUIPlacement = 'bottom';

  /** If true, panel is visible */
  @Prop({ reflect: true }) isVisible?: boolean = false;

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  disconnectedCallback() {
    this.floatingUI?.destroy();
  }

  // Listeners
  // ==============

  /** On click outside the panel */
  @Listen('click', { target: 'document' })
  onClickOutsidePanel(event: MouseEvent) {
    if (!event.composedPath().includes(this.panel) && !event.composedPath().includes(this.trigger)) {
      this.isVisible = false;
    }
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  @Method()
  async openPanel() {
    this.isVisible = !this.isVisible;
    this.floatingUI?.update();
  }

  /**
   * set trigger element and init FloatingUI
   * @param trigger - trigger element for the panel
   */
  @Method()
  async setTriggerElement(trigger: HTMLElement) {
    this.trigger = trigger;

    this.initFloatingUI();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private initFloatingUI = () => {
    this.floatingUI = new FloatingUI(this.trigger, this.panel, {
      placement: this.placement,
      distance: this.distance,
      sameWidth: false,
      strategy: 'fixed',
      skidding: 0,
    });
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host class="panel" ref={(el) => (this.panel = el)} aria-hidden={!this.isVisible} hidden={!this.isVisible}>
        <slot />
      </Host>
    );
  }
}
