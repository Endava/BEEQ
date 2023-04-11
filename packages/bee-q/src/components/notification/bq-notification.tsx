import { h, Component, Prop, Element, Method, Host, Watch } from '@stencil/core';
import { validatePropValue } from '../../shared/utils';
import { NOTIFICATION_TYPE, TNotificationType } from './bg-notification.types';

/**
 * @part base - The component's internal wrapper of the notification component.
 * @part icon - `<div>` container element of notification icon component. Will be shown if Prop showIcon is true.
 * @part title - `<div>` container element of notification default slot.
 * @part avatar - `<div>` container element of notification avatar component slot.  Will be shown if Prop showIcon is false.
 * @part description - `<div>` container element of notification description slot
 * @part footer - `<div>` container element of notification footer slot
 * @part close-icon - `<div>` container element of notification close icon component.  Will be shown if Prop showClose is false.
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

  /** If rue, the close button at the top right of the notification won't be shown */
  @Prop({ reflect: true }) disableClose: boolean = false;

  /** If true, the predefined icon type won't be shown and a custom icon provided on integration will be displayed instead */
  @Prop({ reflect: true }) hasCustomIcon = false;

  /** Type of Notification */
  @Prop({ reflect: true }) type: TNotificationType = 'default';

  /** If true, the notification icon won't be shown */
  @Prop({ reflect: true }) hideIcon: boolean = false;

  /** If true, the notification will be shown */
  @Prop({ reflect: true, mutable: true }) isOpen = false;

  // Prop lifecycle events
  // =======================
  @Watch('type')
  checkPropValues() {
    validatePropValue(NOTIFICATION_TYPE, 'default', this.el, 'type');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

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
  }

  /**
   * Trigger function when you want to show Notification
   */
  @Method()
  async show() {
    this.isOpen = true;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private get iconName() {
    if (this.hideIcon) return;

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
            >
              {!this.hasCustomIcon ? <bq-icon name={this.iconName} /> : <slot name="icon" />}
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
