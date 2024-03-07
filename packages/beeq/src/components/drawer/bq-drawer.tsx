import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, Watch } from '@stencil/core';
import { enter, leave } from 'el-transition';

@Component({
  tag: 'bq-drawer',
  styleUrl: './scss/bq-drawer.scss',
  shadow: true,
})
export class BqDrawer {
  // Own Properties
  // ====================

  private drawerElem: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDrawerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true, the drawer component will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  // Prop lifecycle events
  // =======================

  @Watch('open')
  handleOpenChange() {
    if (!this.open) {
      this.handleHide();
      return;
    }

    this.handleShow();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the notification is hidden */
  @Event() bqHide!: EventEmitter;

  /** Callback handler to be called when the notification is shown */
  @Event() bqShow!: EventEmitter;

  /** Callback handler to be called after the notification has been opened */
  @Event() bqAfterOpen!: EventEmitter;

  /** Callback handler to be called after the notification has been closed */
  @Event() bqAfterClose!: EventEmitter;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    if (!this.open) {
      this.el.classList.add('is-hidden');
    }
  }

  // Listeners
  // ==============

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /** Method to be called to hide the notification component */
  @Method()
  async hide(): Promise<void> {
    await this.handleHide();
  }

  /** Method to be called to show the notification component */
  @Method()
  async show(): Promise<void> {
    await this.handleShow();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleHide = async () => {
    const ev = this.bqHide.emit(this.el);
    if (!ev.defaultPrevented) {
      await leave(this.drawerElem);
      this.open = false;
      this.handleTransitionEnd();
    }
  };

  private handleShow = async () => {
    const ev = this.bqShow.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = true;
      await enter(this.drawerElem);
      this.handleTransitionEnd();
    }
  };

  private handleTransitionEnd = () => {
    if (this.open) {
      this.bqAfterOpen.emit();
      return;
    }

    this.bqAfterClose.emit();
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host
        class={{ 'is-hidden': !this.open }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
      >
        <div class="bq-drawer" ref={(div) => (this.drawerElem = div)} part="wrapper">
          {/* CLOSE BUTTON */}
          <bq-button
            class="bq-drawer__close absolute right-5 focus-visible:focus"
            appearance="text"
            size="small"
            onClick={() => this.hide()}
            part="btn-close"
          >
            <bq-icon name="x" />
          </bq-button>
          {/* Header */}
          <div class="title-font font-semibold leading-regular text-text-primary" part="header">
            <slot />
          </div>
          {/* Body */}
          <div>Body</div>
          {/* Footer */}
          <div>Footer</div>
        </div>
      </Host>
    );
  }
}
