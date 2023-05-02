import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, Watch } from '@stencil/core';

import { validatePropValue } from '../../shared/utils';
import { NOTIFICATION_TYPE, TNotificationType } from './bg-notification.types';

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

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqNotificationElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true, the close button at the top right of the notification won't be shown */
  @Prop({ reflect: true }) disableClose: boolean;

  /** If true, the predefined icon type won't be shown and a custom icon provided on integration will be displayed instead */
  @Prop({ reflect: true }) hasCustomIcon: boolean;

  /** If true, the notification icon won't be shown */
  @Prop({ reflect: true }) hideIcon: boolean;

  /** If true, the notification will be shown */
  @Prop({ reflect: true, mutable: true }) isOpen: boolean;

  /** Type of Notification */
  @Prop({ reflect: true }) type: TNotificationType = 'default';

  // Prop lifecycle events
  // =======================
  @Watch('type')
  checkPropValues() {
    validatePropValue(NOTIFICATION_TYPE, 'default', this.el, 'type');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  @Event() bqHide: EventEmitter;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
  }

  // Listeners
  // ==============

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /**
   * Trigger function when you want to close Notification
   */
  @Method()
  async hide() {
    this.isOpen = false;
    this.bqHide.emit();
  }

  /**
   * Trigger function when you want to show Notification
   */
  @Method()
  async show() {
    this.isOpen = true;
  }

  /** */
  @Method()
  async toast() {
    return new Promise<void>((resolve) => {
      if (notificationPortal.parentElement === null) {
        document.body.append(notificationPortal);
      }

      notificationPortal.appendChild(this.el);

      requestAnimationFrame(() => {
        this.show();
      });

      this.el.addEventListener(
        'bqHide',
        () => {
          notificationPortal.removeChild(this.el);
          resolve();

          // Remove the notification portal from the DOM when there are no more alerts
          if (notificationPortal.querySelector('bq-notification') === null) {
            notificationPortal.remove();
          }
        },
        { once: true },
      );
    });
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private get iconName() {
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
                'notification--icon mr-2 inline-block text-left align-top': true,
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
          <div class="flex flex-col items-start gap-4" part="content">
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
