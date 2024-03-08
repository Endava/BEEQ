import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { enter, leave } from 'el-transition';

import { hasSlotContent } from '../../shared/utils';

@Component({
  tag: 'bq-drawer',
  styleUrl: './scss/bq-drawer.scss',
  shadow: true,
})
export class BqDrawer {
  // Own Properties
  // ====================

  private drawerElem: HTMLDivElement;
  private footerElem: HTMLDivElement;
  private iconElement: HTMLSpanElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDrawerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasFooter = false;
  @State() hasIcon: boolean = false;

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

  /** Callback handler to be called when the drawer is hidden */
  @Event() bqHide!: EventEmitter;

  /** Callback handler to be called when the drawer is shown */
  @Event() bqShow!: EventEmitter;

  /** Callback handler to be called after the drawer has been opened */
  @Event() bqAfterOpen!: EventEmitter;

  /** Callback handler to be called after the drawer has been closed */
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

  private handleFooterSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

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

  private handleIconSlotChange = () => {
    this.hasIcon = hasSlotContent(this.iconElement, 'icon');
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
          <div class="flex items-center justify-between">
            {/* Header */}
            <div class="title-font flex items-center gap-2 font-bold leading-regular text-text-primary" part="header">
              <div class="flex" ref={(span: HTMLSpanElement) => (this.iconElement = span)} part="icon">
                <slot name="icon" onSlotchange={this.handleIconSlotChange} />
              </div>
              <div part="title">
                <slot />
              </div>
            </div>
            {/* CLOSE BUTTON */}
            <bq-button
              class="bq-drawer__close focus-visible:focus"
              appearance="text"
              size="small"
              onClick={() => this.hide()}
              part="btn-close"
            >
              <bq-icon weight="bold" name="x" />
            </bq-button>
          </div>
          {/* Body */}
          <div class="bq-drawer__body" part="body">
            <slot name="body" />
          </div>
          {this.hasFooter && <bq-divider dashed stroke-color="ui--secondary"></bq-divider>}
          {/* Footer */}
          <div
            class={{ 'flex items-start gap-xs': true, '!hidden': !this.hasFooter }}
            ref={(div) => (this.footerElem = div)}
            part="footer"
          >
            <slot name="footer" onSlotchange={this.handleFooterSlotChange} />
          </div>
        </div>
      </Host>
    );
  }
}
