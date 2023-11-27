import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { ALERT_TYPE, TAlertType } from './bq-alert.types';
import { debounce, hasSlotContent, TDebounce, validatePropValue } from '../../shared/utils';

const alertPortal = Object.assign(document.createElement('div'), { className: 'bq-alert-portal' });

/**
 * @part base - The `<div>` container of the predefined bq-icon component
 * @part body - The conatiner `<div>` that wraps the alert description content
 * @part btn-close - The `bq-button` used to close the alert
 * @part content - The conatiner `<div>` that wraps all the alert content (title, description, footer)
 * @part footer - The conatiner `<div>` that wraps the alert footer content
 * @part icon - The `<bq-icon>` element used to render a predefined icon based on the alert type (info, success, warning, error, custom)
 * @part icon-outline - The conatiner `<div>` that wraps the icon element
 * @part main - The conatiner `<div>` that wraps the alert main content (title, description)
 * @part svg - The `<svg>` element of the predefined bq-icon component
 * @part title - The conatiner `<div>` that wraps the alert title content
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM
 */

@Component({
  tag: 'bq-alert',
  styleUrl: './scss/bq-alert.scss',
  shadow: true,
})
export class BqAlert {
  // Own Properties
  // ====================

  private autoDismissDebounce: TDebounce<void>;
  private bodyElem: HTMLDivElement;
  private footerElem: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAlertElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasContent = false;
  @State() private hasFooter = false;

  // Public Property API
  // ========================

  /** If true, the alert will automatically hide after the specified amount of time */
  @Prop({ reflect: true }) autoDismiss: boolean;

  /** If true, the close button at the top right of the alert won't be shown */
  @Prop({ reflect: true }) disableClose: boolean;

  /** If true, the alert icon won't be shown */
  @Prop({ reflect: true }) hideIcon: boolean;

  /** If true, the alert will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** The length of time, in milliseconds, after which the alert will close itself. Only valid if `autoDismiss="true"` */
  @Prop({ reflect: true }) time: number = 3000;

  /** Type of Alert */
  @Prop({ reflect: true }) type: TAlertType = 'info';

  // Prop lifecycle events
  // =======================
  @Watch('autoDismiss')
  @Watch('time')
  handleTimeout() {
    this.autoDismissDebounce?.cancel();
    if (!this.autoDismiss) return;

    this.autoDismissDebounce = debounce(() => {
      this.hide();
    }, this.time);
    // Make sure to autodismiss the notification if the `auto-dismiss` value changed while open
    if (this.open) this.autoDismissDebounce();
  }

  @Watch('open')
  handleOpenChange() {
    this.autoDismissDebounce?.cancel();

    if (!(this.autoDismiss && this.open)) return;
    this.autoDismissDebounce();
  }

  @Watch('type')
  checkPropValues() {
    validatePropValue(ALERT_TYPE, 'info', this.el, 'type');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the notification is hidden */
  @Event() bqHide: EventEmitter;

  /** Callback handler to be called when the notification is shown */
  @Event() bqShow: EventEmitter;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
    this.handleTimeout();
  }
  // Listeners
  // ==============
  @Listen('bqHide')
  onAlertHide() {
    try {
      alertPortal.removeChild(this.el);
      // Remove the alert portal from the DOM when there are no more alerts
      if (alertPortal.querySelector('bq-alert') === null) {
        alertPortal.remove();
      }
    } catch (error) {
      /**
       * Skip DOMExpection error since it could be possible that
       * in some situations the alert portal is missing
       */
      if (error instanceof DOMException) return;
      throw error;
    }
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /** Method to be called to hide the alert component */
  @Method()
  async hide(): Promise<void> {
    this.handleHide();
  }
  /** Method to be called to show the alert component */
  @Method()
  async show(): Promise<void> {
    this.handleShow();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleHide = () => {
    const ev = this.bqHide.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = false;
    }
  };

  private handleShow = () => {
    const ev = this.bqShow.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = false;
    }
  };

  private handleContentSlotChange = () => {
    this.hasContent = hasSlotContent(this.bodyElem, 'body');
  };

  private handleFooterSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  private get iconName(): string {
    switch (this.type) {
      case 'error':
        return 'x-circle';
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning-circle';
      default:
        return 'info';
    }
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host
        class={{ 'is-hidden': !this.open }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
        role="alert"
      >
        <div
          class={{
            'bq-alert': true,
            [`background-${this.type}`]: true,
            [`border-${this.type}`]: true,
            'alert--background alert--border': true,
          }}
          part="wrapper"
        >
          {/* CLOSE BUTTON */}
          {!this.disableClose && (
            <bq-button
              class="alert--close absolute right-5 focus-visible:focus"
              appearance="text"
              size="small"
              onClick={() => this.hide()}
              part="btn-close"
            >
              <bq-icon name="x" />
            </bq-button>
          )}
          {/* ICON */}
          <div
            class={{
              '!hidden': this.hideIcon,
              [`color-${this.type}`]: true, // The icon color will be based on the type (info, success, warning, error)
              'alert--icon mr-xs flex text-left align-top': true,
            }}
            part="icon-outline"
          >
            <slot name="icon">
              <bq-icon name={this.iconName} part="icon" exportparts="base,svg" />
            </slot>
          </div>
          {/* MAIN */}
          <div class="flex flex-col items-start gap-[var(--bq-alert--content-footer-gap)]" part="main">
            <div class="flex flex-col gap-[var(--bq-alert--title-body-gap)]" part="content">
              {/* TITLE */}
              <div class="title-font font-semibold leading-regular text-text-primary" part="title">
                <slot />
              </div>
              {/* BODY */}
              <div
                class={{ 'text-s leading-regular': true, '!hidden': !this.hasContent }}
                ref={(div) => (this.bodyElem = div)}
                part="body"
              >
                <slot name="body" onSlotchange={this.handleContentSlotChange} />
              </div>
            </div>
            {/* FOOTER */}
            <div
              class={{ 'flex items-start gap-xs': true, '!hidden': !this.hasFooter }}
              ref={(div) => (this.footerElem = div)}
              part="footer"
            >
              <slot name="footer" onSlotchange={this.handleFooterSlotChange} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
