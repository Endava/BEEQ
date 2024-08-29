import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { NOTIFICATION_TYPE, TNotificationBorderRadius, TNotificationType } from './bq-notification.types';
import { debounce, enter, hasSlotContent, leave, TDebounce, validatePropValue } from '../../shared/utils';

const NOTIFICATION_PORTAL_SELECTOR = 'bq-notification-portal';

/**
 * @part base - The `<div>` container of the predefined bq-icon component.
 * @part body - The container `<div>` that wraps the notification description content
 * @part btn-close - The `bq-button` used to close the notification
 * @part content - The container `<div>` that wraps all the notification content (title, description, footer)
 * @part footer - The container `<div>` that wraps the notification footer content
 * @part icon - The `<bq-icon>` element used to render a predefined icon based on the notification type
 * @part icon-outline - The container `<div>` that wraps the icon element
 * @part main - The container `<div>` that wraps the notification main content (title, description)
 * @part svg - The `<svg>` element of the predefined bq-icon component.
 * @part title - The container `<div>` that wraps the notification title content
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM
 *
 * @slot - The notification title content
 * @slot body - The notification description content
 * @slot footer - The notification footer content
 * @slot icon - The icon to be displayed in the notification
 * @slot btn-close - The close button of the notification
 */

@Component({
  tag: 'bq-notification',
  styleUrl: './scss/bq-notification.scss',
  shadow: true,
})
export class BqNotification {
  // Own Properties
  // ====================

  private autoDismissDebounce: TDebounce<void>;
  private bodyElem: HTMLDivElement;
  private footerElem: HTMLDivElement;
  private notificationElem: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqNotificationElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasContent = false;
  @State() private hasFooter = false;
  @State() private notificationPortal = document.querySelector(`.${NOTIFICATION_PORTAL_SELECTOR}`);

  // Public Property API
  // ========================

  /** If true, the notification will automatically hide after the specified amount of time */
  @Prop({ reflect: true }) autoDismiss: boolean;

  /** The corder radius of the notification component */
  @Prop({ reflect: true }) border: TNotificationBorderRadius = 's';

  /** If true, the close button at the top right of the notification won't be shown */
  @Prop({ reflect: true }) disableClose: boolean;

  /** If true, the notification icon won't be shown */
  @Prop({ reflect: true }) hideIcon: boolean;

  /** If true, the notification will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** The length of time, in milliseconds, after which the notification will close itself. Only valid if `autoDismiss="true"` */
  @Prop({ reflect: true }) time: number = 3000;

  /** Type of Notification */
  @Prop({ reflect: true }) type: TNotificationType = 'info';

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
    validatePropValue(NOTIFICATION_TYPE, 'info', this.el, 'type');
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

  connectedCallback() {
    const { notificationPortal } = this;
    if (!notificationPortal) {
      this.notificationPortal = Object.assign(document.createElement('div'), {
        className: NOTIFICATION_PORTAL_SELECTOR,
      });
    }
  }

  componentWillLoad() {
    this.checkPropValues();
    this.handleTimeout();
  }

  // Listeners
  // ==============

  @Listen('bqAfterClose')
  afterNotificationClose() {
    try {
      const { notificationPortal } = this;
      notificationPortal.removeChild(this.el);
      // Remove the notification portal from the DOM when there are no more notifications
      if (notificationPortal.querySelector(this.el.tagName.toLowerCase()) === null) {
        notificationPortal.remove();
      }
    } catch (error) {
      /**
       * Skip DOMException error since it could be possible that
       * in some situations the notification portal is missing
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

  /** This method can be used to display notifications in a fixed-position element that allows for stacking multiple notifications vertically */
  @Method()
  async toast() {
    const { notificationPortal } = this;
    if (notificationPortal?.parentElement === null) {
      document.body.append(notificationPortal);
    }

    notificationPortal?.appendChild(this.el);
    requestAnimationFrame(() => {
      this.show();
    });
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleHide = async () => {
    const ev = this.bqHide.emit(this.el);
    if (!ev.defaultPrevented) {
      await leave(this.notificationElem);
      this.open = false;
      this.handleTransitionEnd();
    }
  };

  private handleShow = async () => {
    const ev = this.bqShow.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = true;
      await enter(this.notificationElem);
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
    this.hasContent = hasSlotContent(this.bodyElem);
  };

  private handleFooterSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  private get iconName(): string {
    const typeMap = {
      error: 'x-circle',
      success: 'check-circle',
      warning: 'warning-circle',
    };

    return typeMap[this.type] || 'info';
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const style = {
      ...(this.border && { '--bq-notification--border-radius': `var(--bq-radius--${this.border})` }),
    };

    return (
      <Host
        style={style}
        class={{ 'is-hidden': !this.open }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
        role="alert"
      >
        <div
          class="bq-notification"
          data-transition-enter="transform transition ease-out duration-300"
          data-transition-enter-start="translate-y-xs opacity-0 sm:translate-y-0 sm:translate-x-s"
          data-transition-enter-end="translate-y-0 opacity-100 sm:translate-x-0"
          data-transition-leave="transform transition ease-in duration-100"
          data-transition-leave-start="translate-y-0 opacity-100 sm:translate-x-0"
          data-transition-leave-end="-translate-y-xs opacity-0 sm:translate-y-0 sm:translate-x-s"
          ref={(div) => (this.notificationElem = div)}
          part="wrapper"
        >
          {/* CLOSE BUTTON */}
          {!this.disableClose && (
            <bq-button
              class="notification--close absolute inset-ie-5 [&::part(label)]:inline-flex"
              appearance="text"
              size="small"
              onClick={() => this.hide()}
              part="btn-close"
            >
              <slot name="btn-close">
                <bq-icon name="x" />
              </slot>
            </bq-button>
          )}
          {/* ICON */}
          <div
            class={{
              '!hidden': this.hideIcon,
              [`color-${this.type}`]: true, // The icon color will be based on the type (info, success, warning, error)
              'notification--icon me-xs flex text-left align-top': true,
            }}
            part="icon-outline"
          >
            <slot name="icon">
              <bq-icon name={this.iconName} part="icon" exportparts="base,svg" />
            </slot>
          </div>
          {/* MAIN */}
          <div class="flex flex-col items-start gap-[--bq-notification--content-footer-gap]" part="main">
            <div class="flex flex-col gap-[--bq-notification--title-body-gap]" part="content">
              {/* TITLE */}
              <div class="title-font font-semibold leading-regular" part="title">
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
