import { ReferenceElement } from '@floating-ui/dom';
import { Component, Element, h, Prop, Watch } from '@stencil/core';

import { Placement } from '../../services/interfaces';
import { FloatingUI } from '../../services/libraries';

/**
 * The Panel component is a versatile and essential element used to wrap and display content in a floating panel.
 *
 * @example How to use it
 * ```html
 * <bq-panel open>
 *   <div>Panel content</div>
 * </bq-panel>
 * ```
 *
 * @status stable
 *
 * @attr {number} distance - Represents the distance (gutter or margin) between the panel and the trigger element.
 * @attr {"top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end"} placement - Position of the panel.
 * @attr {boolean} open - If true, the panel will be visible.
 * @attr {boolean} same-width - Whether the panel should have the same width as the trigger element.
 * @attr {number} skidding - Represents the skidding between the panel and the trigger element.
 * @attr {"fixed" | "absolute"} strategy - Defines the strategy to position the panel.
 *
 * @slot - The content of the panel.
 *
 * @part panel - The `<div>` element used to display and style the panel
 *
 * @prop --bq-panel--background - Panel background color
 * @prop --bq-panel--border-color - Panel border color
 * @prop --bq-panel--border-radius - Panel border radius
 * @prop --bq-panel--border-style - Panel border style
 * @prop --bq-panel--border-width - Panel border width
 * @prop --bq-panel--box-shadow - Panel box shadow
 * @prop --bq-panel--padding - Panel padding
 * @prop --bq-panel--height - Panel height
 * @prop --bq-panel--width - Panel width
 * @prop --bq-panel-z-index - Panel z-index applied when opened
 */
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
  private trigger: ReferenceElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqPanelElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Represents the distance (gutter or margin) between the panel and the trigger element. */
  @Prop({ reflect: true }) distance?: number = 4;

  /** Position of the panel */
  @Prop({ reflect: true }) placement?: Placement = 'bottom-start';

  /** If true, the panel will be visible. */
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;

  /** Whether the panel should have the same width as the trigger element */
  @Prop({ reflect: true }) sameWidth?: boolean = false;

  /**  Represents the skidding between the panel and the trigger element. */
  @Prop({ reflect: true }) skidding?: number = 0;

  /** Defines the strategy to position the panel */
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';

  // Prop lifecycle events
  // =======================

  @Watch('open')
  handleOpenChange() {
    if (!this.open) {
      this.hidePanel();
      return;
    }

    this.showPanel();
  }

  @Watch('distance')
  @Watch('placement')
  @Watch('sameWidth')
  @Watch('skidding')
  @Watch('strategy')
  onPropChange() {
    this.floatingUI?.init({ ...this.options });
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    // We need to find the trigger element from the parent to position the panel relative to it.
    const parentTrigger = this.el.parentElement.querySelector('div[part="trigger"]');
    if (!parentTrigger) return;

    this.trigger = {
      getBoundingClientRect: () => parentTrigger.getBoundingClientRect(),
      contextElement: parentTrigger,
    };

    this.floatingUI = new FloatingUI(this.trigger, this.panel, { ...this.options });
    this.handleOpenChange();
  }

  disconnectedCallback() {
    this.floatingUI?.destroy();
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

  private showPanel() {
    this.floatingUI?.update();
  }

  private async hidePanel() {
    this.open = false;
  }

  private get options() {
    return {
      distance: this.distance,
      placement: this.placement,
      sameWidth: this.sameWidth,
      skidding: this.skidding,
      strategy: this.strategy,
    };
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        class="bq-panel"
        ref={(el) => (this.panel = el)}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open}
        part="panel"
      >
        <slot />
      </div>
    );
  }
}
