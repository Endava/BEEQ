import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';

import { ALERT_TYPE, TAlertBorderRadius, TAlertType } from './bq-alert.types';
import { debounce, enter, hasSlotContent, leave, TDebounce, validatePropValue } from '../../shared/utils';

/**
 * @part base - The `<div>` container of the predefined bq-icon component
 * @part body - The container `<div>` that wraps the alert description content
 * @part btn-close - The `bq-button` used to close the alert
 * @part content - The container `<div>` that wraps all the alert content (title, description, footer)
 * @part footer - The container `<div>` that wraps the alert footer content
 * @part icon - The `<bq-icon>` element used to render a predefined icon based on the alert type (info, success, warning, error, default)
 * @part icon-outline - The container `<div>` that wraps the icon element
 * @part main - The container `<div>` that wraps the alert main content (title, description)
 * @part svg - The `<svg>` element of the predefined bq-icon component
 * @part title - The container `<div>` that wraps the alert title content
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
  private alertElement: HTMLDivElement;

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

  /** The corner radius of the alert component */
  @Prop({ reflect: true }) border: TAlertBorderRadius = 's';

  /** If true, the close button at the top right of the alert won't be shown */
  @Prop({ reflect: true }) disableClose: boolean;

  /** If true, the alert icon won't be shown */
  @Prop({ reflect: true }) hideIcon: boolean;

  /** If true, the alert will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** The length of time, in milliseconds, after which the alert will close itself. Only valid if `autoDismiss="true"` */
  @Prop({ reflect: true }) time: number = 3000;

  /** Type of Alert */
  @Prop({ reflect: true }) type: TAlertType = 'default';

  /** If true, the alert component will remain fixed at the top of the page, occupying the full viewport */
  @Prop({ reflect: true }) sticky: boolean;

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

    if (!this.open) {
      this.handleHide();
      return;
    }

    this.handleShow();

    if (this.autoDismiss) {
      this.autoDismissDebounce();
    }
  }

  @Watch('type')
  checkPropValues() {
    validatePropValue(ALERT_TYPE, 'info', this.el, 'type');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the alert is hidden */
  @Event() bqHide!: EventEmitter;

  /** Callback handler to be called when the alert is shown */
  @Event() bqShow!: EventEmitter;

  /** Callback handler to be called after the alert has been opened */
  @Event() bqAfterOpen!: EventEmitter;

  /** Callback handler to be called after the alert has been closed */
  @Event() bqAfterClose!: EventEmitter;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
    this.handleTimeout();
  }

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

  /** Method to be called to hide the alert component */
  @Method()
  async hide(): Promise<void> {
    await this.handleHide();
  }
  /** Method to be called to show the alert component */
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
      await leave(this.alertElement);
      this.el.classList.add('is-hidden');
      this.handleTransitionEnd();
      this.open = false;
    }
  };

  private handleShow = async () => {
    const ev = this.bqShow.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = true;
      this.el.classList.remove('is-hidden');
      await enter(this.alertElement);
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
    const style = {
      ...(this.border && { '--bq-alert--border-radius': `var(--bq-radius--${this.border})` }),
    };

    return (
      <Host
        style={style}
        class={{ 'is-sticky': this.sticky }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
        role="alert"
      >
        <div
          class={{
            [`bq-alert bq-alert__${this.type}`]: true,
            'is-sticky': this.sticky,
          }}
          data-transition-enter="transition ease-out duration-300"
          data-transition-enter-start="opacity-0"
          data-transition-enter-end="opacity-100"
          data-transition-leave="transition ease-in duration-200"
          data-transition-leave-start="opacity-100"
          data-transition-leave-end="opacity-0"
          ref={(div) => (this.alertElement = div)}
          part="wrapper"
        >
          {/* CLOSE BUTTON */}
          {!this.disableClose && (
            <bq-button
              class="bq-alert__close absolute end-5 focus-visible:focus"
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
              [`bq-alert__icon--${this.type} me-s flex text-left align-top`]: true,
              '!hidden': this.hideIcon,
            }}
            part="icon-outline"
          >
            <slot name="icon">
              {this.type !== 'default' && <bq-icon name={this.iconName} part="icon" exportparts="base,svg" />}
            </slot>
          </div>
          {/* MAIN */}
          <div class="flex flex-col items-start gap-[--bq-alert--content-footer-gap]" part="main">
            <div class="flex flex-col gap-[--bq-alert--title-body-gap]" part="content">
              {/* TITLE */}
              <div
                class={{
                  'title-font font-semibold leading-regular text-text-primary': true,
                  'flex items-center': this.sticky,
                }}
                part="title"
              >
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
