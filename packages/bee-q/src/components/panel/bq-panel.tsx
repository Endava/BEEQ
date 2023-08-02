import { h, Component, Prop, Element, Method, Watch, EventEmitter, Event } from '@stencil/core';

import { FloatingUIPlacement } from '../../services/interfaces';
import { FloatingUI } from '../../services/libraries';

/**
 * @part base - The `div` element which acts as a container for the panel content
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
  private trigger: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqPanelElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Distance (px) between the panel and the trigger element. */
  @Prop({ reflect: true }) distance?: number = 0;

  /** Position of the panel */
  @Prop({ reflect: true }) placement?: FloatingUIPlacement = 'bottom';

  /** If true, panel is visible.
   * You can toggle this attribute to show/hide the panel.
   */
  @Prop({ reflect: true }) open?: boolean = false;

  /** If true, the scrollbar is visible.
   * You can toggle this attribute to show/hide the scrollbar.
   */
  @Prop({ reflect: true }) scrollbar?: boolean = false;

  // Prop lifecycle events
  // =======================

  @Watch('open')
  handleOpenProp() {
    this.bqPanelVisibility.emit(this.open);
  }

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

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called to check if the panel is open or closed.
   * Will emit every time the state of the panel is changed.
   */
  @Event() bqPanelVisibility: EventEmitter<boolean>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

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

  @Method()
  async togglePanel() {
    this.floatingUI?.update();
  }

  /**
   * set trigger element and init FloatingUI
   * @param trigger - the trigger element for the panel
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
      <div
        class={{
          'bq-panel': true,
          'hide-scrollbar': !this.scrollbar,
        }}
        ref={(el) => (this.panel = el)}
        aria-hidden={!this.open}
        hidden={!this.open}
        part="base"
      >
        <slot />
      </div>
    );
  }
}
