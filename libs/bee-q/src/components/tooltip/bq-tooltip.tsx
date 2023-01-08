import { Component, Element, h, Listen, Method, Prop, Watch } from '@stencil/core';
import { FloatingUIPlacement } from '../../services/interfaces';
import { FloatingUI } from '../../services/libraries';

/**
 * @part base - The component wrapper container inside the shadow DOM
 * @part trigger - The `<div>` container that holds the element which displays tooltip on hover
 * @part panel - The `<div>` container that holds the tooltip content
 */
@Component({
  tag: 'bq-tooltip',
  styleUrl: './scss/bq-tooltip.scss',
  shadow: true,
})
export class BqTooltip {
  // Own Properties
  // ====================
  private trigger: HTMLElement;
  private panel: HTMLElement;
  private arrow: HTMLElement;
  private floatingUI: FloatingUI;

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqTooltipElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Distance between trigger element and tooltip */
  @Prop({ reflect: true }) distance?: number = 10;

  /** If true, the arrow on the tooltip content won't be shown */
  @Prop({ reflect: true }) hideArrow?: boolean = false;

  /* Defines the position of the tooltip */
  @Prop({ reflect: true }) placement?: FloatingUIPlacement = 'top';

  /** Whether the tooltip should have the same width as the trigger element
   * (applicable only for content shorter than the trigger element) */
  @Prop({ reflect: true }) sameWidth?: boolean = false;

  /** Set the action when the tooltip should be displayed, on hover (default) or click */
  @Prop({ reflect: true }) displayOn: 'click' | 'hover' = 'hover';

  /** Indicates whether or not the tooltip is visible */
  @Prop({ reflect: true, mutable: true }) visible? = false;

  // Prop lifecycle events
  // =======================

  @Watch('visible')
  handleVisibleChange() {
    if (!this.visible) {
      this.hide();
      return;
    }

    this.show();
  }

  @Watch('distance')
  @Watch('hideArrow')
  @Watch('placement')
  @Watch('sameWidth')
  handleFloatingUIOptionsChange() {
    this.floatingUI.init({
      placement: this.placement,
      strategy: 'fixed',
    });
  }
  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.floatingUI = new FloatingUI(this.trigger, this.panel, {
      ...(!this.hideArrow && { arrow: this.arrow }),
      placement: this.placement,
      distance: this.distance,
      sameWidth: this.sameWidth,
      strategy: 'fixed',
      skidding: 0,
    });
  }

  disconnectedCallback() {
    this.floatingUI?.destroy();
  }
  // Listeners
  // ==============

  @Listen('mousedown', { target: 'document' })
  handleDocumentMouseDown(event: MouseEvent) {
    // Close when clicking outside of the close element
    const path = event.composedPath();
    if (!path.includes(this.el)) {
      this.hide();
    }
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /** Shows the tooltip */
  @Method()
  async show() {
    this.visible = true;
    this.showTooltip();
  }

  /** Hides the tooltip */
  @Method()
  async hide() {
    this.visible = false;
    this.hideTooltip();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleTriggerMouseOver = () => {
    if (this.displayOn !== 'hover') return;
    this.show();
  };

  private handleTriggerMouseLeave = () => {
    if (this.displayOn !== 'hover') return;
    this.hide();
  };

  private handleTriggerOnClick = () => {
    if (this.displayOn !== 'click') return;
    this.visible ? this.hide() : this.show();
  };

  private showTooltip = () => {
    if (!this.panel) return;
    this.floatingUI?.update();
  };

  private hideTooltip = () => {
    if (!this.panel) return;
    this.visible = false;
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="relative" part="base">
        {/* TRIGGER */}
        <div
          class="bq-tooltip__trigger"
          onMouseOver={this.handleTriggerMouseOver}
          onMouseLeave={this.handleTriggerMouseLeave}
          onClick={this.handleTriggerOnClick}
          ref={(el) => (this.trigger = el)}
          part="trigger"
        >
          <slot name="trigger" />
        </div>
        {/* PANEL */}
        <div
          class="bq-tooltip__panel"
          aria-hidden={!this.visible}
          hidden={!this.visible}
          role="tooltip"
          ref={(el) => (this.panel = el)}
          part="panel"
        >
          {!this.hideArrow && <div class="bq-tooltip__arrow" ref={(el) => (this.arrow = el)} />}
          <slot />
        </div>
      </div>
    );
  }
}
