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
  onDistanceChange() {
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

  componentDidLoad() {
    this.floatingUI = new FloatingUI(this.getTriggerElement(), this.panel, {
      placement: this.placement,
      distance: this.distance,
      sameWidth: false,
      strategy: 'fixed',
      skidding: 0,
    });
  }

  disconnectedCallback() {
    this.floatingUI?.destroy();
  }

  // Listeners
  // ==============

  /** On click outside the panel */
  @Listen('click', { target: 'document' })
  onClickOutsidePanel(event: MouseEvent) {
    if (!event.composedPath().includes(this.panel) && !event.composedPath().includes(this.getTriggerElement())) {
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

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private getTriggerElement = (): HTMLElement => {
    return document.querySelector('bq-dropdown').shadowRoot.querySelector('[part="trigger"]');
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
