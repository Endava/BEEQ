import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, h, Listen, Method, Prop, Watch } from '@stencil/core';

import type { Placement } from '../../services/interfaces';
import { FloatingUI } from '../../services/libraries';
import { isEventTargetChildOfElement } from '../../shared/utils';

/**
 * The Tooltip component is a small pop-up box that appears when a user hovers over or clicks on an element, providing additional information or context.
 *
 * @example How to use it
 * ```html
 * <bq-tooltip visible>
 *   Yuhu! I'm a tooltip 🙃
 *   <bq-button slot="trigger">Hover me!</bq-button>
 * </bq-tooltip>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/64c562-tooltip
 * @status stable
 *
 * @attr {boolean} always-visible - If true, the tooltip will always be visible
 * @attr {number} distance - Distance between trigger element and tooltip
 * @attr {boolean} hide-arrow - If true, the arrow on the tooltip content won't be shown
 * @attr {"top" | "right" | "bottom" | "left"} placement - Defines the position of the tooltip
 * @attr {boolean} same-width - Whether the tooltip should have the same width as the trigger element (applicable only for content shorter than the trigger element)
 * @attr {"click" | "hover"} display-on - Set the action when the tooltip should be displayed, on hover (default) or click
 * @attr {boolean} visible - Indicates whether or not the tooltip is visible when the component is first rendered, and when interacting with the trigger
 *
 * @method show - Shows the tooltip
 * @method hide - Hides the tooltip
 *
 * @slot trigger - The element which displays tooltip on hover
 * @slot - The tooltip content
 *
 * @part base - The component wrapper container inside the shadow DOM
 * @part trigger - The `<div>` container that holds the element which displays tooltip on hover
 * @part panel - The `<div>` container that holds the tooltip content
 *
 * @cssprop --bq-tooltip--background-color - Tooltip background color
 * @cssprop --bq-tooltip--box-shadow - Tooltip box shadow
 * @cssprop --bq-tooltip--font-size - Tooltip font size
 * @cssprop --bq-tooltip--line-height - Tooltip line height
 * @cssprop --bq-tooltip--text-color - Tooltip text color
 * @cssprop --bq-tooltip--paddingX - Tooltip horizontal padding
 * @cssprop --bq-tooltip--paddingY - Tooltip vertical padding
 * @cssprop --bq-tooltip--border-color - Tooltip border color
 * @cssprop --bq-tooltip--border-radius - Tooltip border radius
 * @cssprop --bq-tooltip--border-style - Tooltip border style
 * @cssprop --bq-tooltip--border-width - Tooltip border width
 * @cssprop --bq-tooltip--z-index: Tooltip z-index
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

  /** If true, the tooltip will always be visible */
  @Prop() alwaysVisible?: boolean = false;

  /** Distance between trigger element and tooltip */
  @Prop({ reflect: true }) distance?: number = 10;

  /** If true, the arrow on the tooltip content won't be shown */
  @Prop({ reflect: true }) hideArrow?: boolean = false;

  /* Defines the position of the tooltip */
  @Prop({ reflect: true }) placement?: Placement = 'top';

  /** Whether the tooltip should have the same width as the trigger element
   * (applicable only for content shorter than the trigger element) */
  @Prop({ reflect: true }) sameWidth?: boolean = false;

  /** Set the action when the tooltip should be displayed, on hover (default) or click */
  @Prop({ reflect: true }) displayOn: 'click' | 'hover' = 'hover';

  /**
   * Indicates whether or not the tooltip is visible when the component is first rendered,
   * and when interacting with the trigger
   */
  @Prop({ reflect: true, mutable: true }) visible? = false;

  // Prop lifecycle events
  // =======================

  @Watch('visible')
  async handleVisibleChange() {
    if (!this.visible && !this.alwaysVisible) {
      return await this.hide();
    }

    await this.show();
  }

  @Watch('distance')
  @Watch('hideArrow')
  @Watch('placement')
  @Watch('sameWidth')
  handleFloatingUIOptionsChange() {
    this.floatingUI.init({
      placement: this.placement,
      distance: this.distance,
      sameWidth: this.sameWidth,
      strategy: 'fixed',
    });
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Emitted when the tooltip trigger is clicked */
  @Event() bqClick: EventEmitter<HTMLBqTooltipElement>;

  /** Emitted when the tooltip trigger is focused in */
  @Event() bqFocusIn: EventEmitter<HTMLBqTooltipElement>;

  /** Emitted when the tooltip trigger is focused out */
  @Event() bqFocusOut: EventEmitter<HTMLBqTooltipElement>;

  /** Emitted when the tooltip trigger is hovered in */
  @Event() bqHoverIn: EventEmitter<HTMLBqTooltipElement>;

  /** Emitted when the tooltip trigger is hovered out */
  @Event() bqHoverOut: EventEmitter<HTMLBqTooltipElement>;

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

  @Listen('keydown', { target: 'document' })
  handleDocumentKeyDown(event: KeyboardEvent) {
    // Early returns for performance optimization
    if (this.alwaysVisible || !this.visible || this.displayOn !== 'click') return;
    // Hide tooltip when the user presses the escape key, but only if the displayOn is click and the tooltip is visible
    if (event.key !== 'Escape') return;

    this.hide();
  }

  @Listen('mousedown', { target: 'document' })
  handleDocumentMouseDown(event: MouseEvent) {
    // Early returns for performance optimization
    if (this.alwaysVisible || !this.visible) return;
    // Hide tooltip when the user clicks outside of the tooltip, but only if the displayOn is click and the tooltip is visible
    if (isEventTargetChildOfElement(event, this.el)) return;

    this.hide();
  }

  @Listen('scroll', { target: 'document', passive: true })
  handleDocumentScroll() {
    // Early returns for performance optimization
    if (this.alwaysVisible || !this.visible) return;
    // Hide tooltip when the user scrolls, but only if the the tooltip is visible
    this.hide();
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
    if (this.alwaysVisible) return;

    this.visible = false;
    this.hideTooltip();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleTriggerMouseOver = async () => {
    if (this.displayOn !== 'hover') return;

    const hoverEvent = this.bqHoverIn.emit(this.el);
    if (hoverEvent.defaultPrevented) return;

    await this.show();
  };

  private handleTriggerMouseLeave = async () => {
    if (this.displayOn !== 'hover') return;

    const hoverEvent = this.bqHoverOut.emit(this.el);
    if (hoverEvent.defaultPrevented) return;

    await this.hide();
  };

  private handleTriggerOnClick = async () => {
    if (this.displayOn !== 'click') return;

    const clickEvent = this.bqClick.emit(this.el);
    if (clickEvent.defaultPrevented) return;

    await (this.visible ? this.hide() : this.show());
  };

  private handleTriggerFocusin = async () => {
    if (this.visible || this.displayOn === 'click') return;

    const focusEvent = this.bqFocusIn.emit(this.el);
    if (focusEvent.defaultPrevented) return;

    await this.show();
  };

  private handleTriggerFocusout = async () => {
    if (!this.visible || this.displayOn === 'click') return;

    const focusEvent = this.bqFocusOut.emit(this.el);
    if (focusEvent.defaultPrevented) return;

    await this.hide();
  };

  private showTooltip = () => {
    if (!this.panel) return;
    this.floatingUI?.update();
  };

  private hideTooltip = () => {
    if (!this.panel) return;
    this.visible = false;
  };

  private get isHidden() {
    return !this.visible && !this.alwaysVisible;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-tooltip relative" part="base">
        {/* TRIGGER */}
        {/**
         * NOTE: We could use a native HTML button as trigger container, but it causes issues with
         * certain interactive elements inside the trigger slot (e.g., buttons, links, inputs...).
         * This is because nested interactive elements are not allowed inside a button.
         * Also, that will force the user to focus twice to reach the inner interactive element.
         */}
        {/** biome-ignore lint/a11y/noStaticElementInteractions: bypass the "Static Elements should not be interactive." rule */}
        {/** biome-ignore lint/a11y/useKeyWithClickEvents: bypass the "Enforce to have the onClick mouse event with the onKeyUp, the onKeyDown, or the onKeyPress keyboard event." rule */}
        <div
          class="bq-tooltip--trigger"
          onClick={this.handleTriggerOnClick}
          onFocusin={this.handleTriggerFocusin}
          onFocusout={this.handleTriggerFocusout}
          onMouseEnter={this.handleTriggerMouseOver}
          onMouseLeave={this.handleTriggerMouseLeave}
          part="trigger"
          ref={(el: HTMLDivElement) => {
            this.trigger = el;
          }}
        >
          <slot name="trigger" />
        </div>
        {/* PANEL */}
        <div
          aria-hidden={this.isHidden}
          class="bq-tooltip--panel"
          hidden={this.isHidden}
          part="panel"
          ref={(el: HTMLDivElement) => {
            this.panel = el;
          }}
          role="tooltip"
        >
          {!this.hideArrow && (
            <div
              class="bq-tooltip--arrow"
              ref={(el: HTMLDivElement) => {
                this.arrow = el;
              }}
            />
          )}
          <slot />
        </div>
      </div>
    );
  }
}
