import { h, Component, Prop, Element, Watch, EventEmitter, Event } from '@stencil/core';

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
  @Prop({ reflect: true }) placement?: FloatingUIPlacement = 'bottom-start';

  /** If true, the panel will be visible. */
  @Prop({ reflect: true }) open?: boolean = false;

  /** The trigger element for the panel */
  @Prop() triggerElement?: HTMLElement;

  /** Whether the panel should have the same width as the trigger element */
  @Prop({ reflect: true }) sameWidth?: boolean = false;

  /**  Represents the skidding between the panel and the trigger element. */
  @Prop({ reflect: true }) skidding?: number = 0;

  /** Defines the strategy to position the panel */
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';

  /** If true, the scrollbar is visible.
   * You can toggle this attribute to show/hide the scrollbar.
   */
  @Prop({ reflect: true }) scrollbar?: boolean = false;

  // Prop lifecycle events
  // =======================

  @Watch('triggerElement')
  onTriggerElementChange() {
    if (!this.triggerElement) return;

    this.floatingUI = new FloatingUI(this.triggerElement, this.panel, { ...this.options });
  }

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

  /** Handler to be called to check if the panel is open or closed.
   * Will emit every time the state of the panel is changed.
   */
  @Event() bqPanelVisibility: EventEmitter<boolean>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.onTriggerElementChange();
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
