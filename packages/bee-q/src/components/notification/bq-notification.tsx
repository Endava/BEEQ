import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, Watch } from '@stencil/core';

import { NOTIFICATION_TYPE, TNotificationType } from './bq-notification.types';
import { debounce, TDebounce, validatePropValue } from '../../shared/utils';

const notificationPortal = Object.assign(document.createElement('div'), { className: 'bq-notification-portal' });

/**
 * @part base - The wrapper container `<div>` of the element inside the shadow DOM
 * @part body - The conatiner `<div>` that wraps the notification description content
 * @part btn-close - The `bq-button` used to close the notification
 * @part content - The conatiner `<div>` that wraps all the notification content (title, description, footer)
 * @part footer - The conatiner `<div>` that wraps the notification footer content
 * @part icon-outline - The conatiner `<div>` that wraps the icon element
 * @part icon - The `<bq-icon>` element used to render a predefined icon based on the notification type
 * @part title - The conatiner `<div>` that wraps the notification title content
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

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqNotificationElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true, the notification will automatically hide after the specified amount of time */
  @Prop({ reflect: true }) autoDismiss: boolean;

  /** If true, the close button at the top right of the notification won't be shown */
  @Prop({ reflect: true }) disableClose: boolean;

  /** If true, the predefined icon type won't be shown and a custom icon provided on integration will be displayed instead */
  @Prop({ reflect: true }) hasCustomIcon: boolean;

  /** If true, the notification icon won't be shown */
  @Prop({ reflect: true }) hideIcon: boolean;

  /** If true, the notification will be shown */
  @Prop({ reflect: true, mutable: true }) isOpen: boolean;

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
    if (this.isOpen) this.autoDismissDebounce();
  }

  @Watch('isOpen')
  handleOpenChange() {
    this.autoDismissDebounce?.cancel();

    if (!(this.autoDismiss && this.isOpen)) return;
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
  onNotificationHide() {
    try {
      notificationPortal.removeChild(this.el);
      // Remove the notification portal from the DOM when there are no more notifications
      if (notificationPortal.querySelector('bq-notification') === null) {
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
    this.handleHide();
  }

  /** Method to be called to show the notification component */
  @Method()
  async show(): Promise<void> {
    this.handleShow();
  }

  /** This method can be used to display notifications in a fixed-position element
   * that allows for stacking multiple notifications vertically. */
  @Method()
  async toast() {
    if (notificationPortal.parentElement === null) {
      document.body.append(notificationPortal);
    }

    notificationPortal.appendChild(this.el);
    requestAnimationFrame(() => {
      this.show();
    });
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleHide = () => {
    const ev = this.bqHide.emit(this.el);
    if (!ev.defaultPrevented) {
      this.isOpen = false;
    }
  };

  private handleShow = () => {
    const ev = this.bqShow.emit(this.el);
    if (!ev.defaultPrevented) {
      this.isOpen = true;
    }
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
        class={{ '!hidden': !this.isOpen }}
        aria-hidden={!this.isOpen ? 'true' : 'false'}
        hidden={!this.isOpen ? 'true' : 'false'}
        role="alert"
      >
        <div
          class="relative inline-flex min-w-[var(--bq-notification--min-width)] items-start rounded-[var(--bq-notification--border-radius)] bg-bg-primary p-[var(--bq-notification--padding)] shadow-m"
          part="base"
        >
          {/* CLOSE BUTTON */}
          {!this.disableClose && (
            <bq-button
              class="notification--close absolute right-5"
              appearance="text"
              size="small"
              onClick={() => this.hide()}
              part="btn-close"
            >
              <bq-icon name="x" />
            </bq-button>
          )}
          {/* ICON */}
          {!this.hideIcon && (
            <div
              class={{
                'notification--icon mr-2 flex text-left align-top': true,
                [`color-${this.type}`]: true, // The icon color will be based on the type (info, success, warning, error)
              }}
              part="icon-outline"
            >
              {!this.hideIcon && [
                !this.hasCustomIcon ? <bq-icon name={this.iconName} part="icon" /> : <slot name="icon" />,
              ]}
            </div>
          )}
          {/* CONTENT */}
          <div class="flex flex-col items-start" part="content">
            {/* TITLE */}
            <div class="title-font font-semibold leading-large" part="title">
              <slot />
            </div>
            {/* BODY */}
            <div class="text-s leading-regular" part="body">
              <slot name="body" />
            </div>
            {/* FOOTER */}
            <div class="flex items-start gap-2" part="footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
