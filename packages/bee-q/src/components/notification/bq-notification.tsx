import { h, Component, Prop, Element, State, Method, Host, Watch } from '@stencil/core';
import { hasSlotContent, getColorCSSVariable, validatePropValue } from '../../shared/utils';
import { NOTIFICATION_TYPES, TNotificationType } from './bg-notification.types';

/**
 * @part base - The component's internal wrapper of the notification component.
 * @part icon - `<div>` container element of notification icon component. Will be shown if Prop showIcon is true.
 * @part title - `<div>` container element of notification default slot.
 * @part avatar - `<div>` container element of notification avatar component slot.  Will be shown if Prop showIcon is false.
 * @part description - `<div>` container element of notification description slot
 * @part footer - `<div>` container element of notification footer slot
 */
@Component({
  tag: 'bq-notification',
  styleUrl: './scss/bq-notification.scss',
  shadow: true,
})
export class BqNotification {
  // Own Properties
  // ====================

  private footerElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqNotificationElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasFooter = false;
  @State() private isHidden = true;

  // Public Property API
  // ========================

  /** Type of Notification */
  @Prop({ reflect: true }) type: TNotificationType = 'info';

  /** Set property if you want Notification icon to be shown. */
  @Prop({ reflect: true }) showIcon: boolean;

  /** Set the subject color if you don't want to be black. Subject color will also apply to Icon color if there is one. */
  @Prop({ reflect: true }) subjectColor: string;

  /** Set property if to false if you want to hide Close icon */
  @Prop({ reflect: true }) showClose: boolean;

  // Prop lifecycle events
  // =======================
  @Watch('type')
  checkPropValues() {
    validatePropValue(NOTIFICATION_TYPES, 'info', this.el, 'type');
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
  async hideNotification() {
    this.closeNotification();
  }

  /**
   * Trigger function when you want to show Notification
   */
  @Method()
  async showNotification() {
    this.setNotificationOpened();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private getNotificationIconName = () => {
    if (!this.showIcon) return '';

    const type = this.type;
    let icon = 'info';

    if (type === 'success') {
      icon = 'check-circle';
    }

    if (type === 'error') {
      icon = 'x-circle';
    }

    return icon;
  };

  private getNotificationColor = () => {
    const type = this.type;
    const colors = {
      default: 'icon--primary',
      success: 'icon--success',
      info: 'icon--info',
      warning: 'icon--warning',
      error: 'icon--danger',
    };

    return this.subjectColor && this.subjectColor !== '' ? this.subjectColor : colors[type];
  };

  private handleSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem);
  };

  private closeNotification = () => {
    this.isHidden = true;
  };

  private setNotificationOpened = () => {
    this.isHidden = false;
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const styles = {
      ...(this.subjectColor && { color: getColorCSSVariable(this.subjectColor) }),
    };

    return (
      <Host style={styles} aria-hidden={this.isHidden} hidden={this.isHidden}>
        <div
          class="bg-white notification-shadow notification-radius inline-block w-auto min-w-[var(--bq-notification--min-width)] p-[var(--bq-notification--padding)]"
          part="base"
        >
          {this.showIcon && (
            <div class="mr-2 inline-block text-left align-top" part="icon">
              <bq-icon name={this.getNotificationIconName()} color={this.getNotificationColor()} size="24"></bq-icon>
            </div>
          )}
          {!this.showIcon && (
            <div class="avatar-slot-holder inline-block text-left align-top" part="avatar">
              <slot name="avatar" />
            </div>
          )}
          <div class="inline-block max-w-xs text-left align-top">
            <div class="title-font font-semibold" part="title">
              <slot />
            </div>
            <div class="description-slot-holder description-font font-regular" part="description">
              <slot name="description" />
            </div>
            <div class={{ 'mt-3': this.hasFooter }} part="footer" ref={(holderElem) => (this.footerElem = holderElem)}>
              <slot name="notification-footer" onSlotchange={this.handleSlotChange} />
            </div>
          </div>
          {this.showClose && (
            <div class="w-notification-close inline-block text-right align-top">
              <bq-icon
                name="x"
                color="icon--primary"
                size="14"
                class="cursor-pointer"
                onClick={this.closeNotification}
              ></bq-icon>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
