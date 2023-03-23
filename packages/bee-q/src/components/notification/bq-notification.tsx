import { h, Component, Prop, Element, State, Method, Host, Watch } from '@stencil/core';
import { hasSlotContent, getColorCSSVariable, validatePropValue } from '../../shared/utils';
import { NOTIFICATION_TYPES, TNotificationType } from './bg-notification.types';

@Component({
  tag: 'bq-notification',
  styleUrl: './scss/bq-notification.scss',
  shadow: true,
})
export class BqNotification {
  // Own Properties
  // ====================

  private buttonElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqNotificationElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasBtn = false;
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
      default: 'ui--inverse-active',
      success: 'ui--success',
      info: 'ui--brand',
      warning: 'ui--warning',
      error: 'ui--danger',
    };

    return this.subjectColor && this.subjectColor !== '' ? this.subjectColor : colors[type];
  };

  private handleSlotChange = () => {
    this.hasBtn = hasSlotContent(this.buttonElem);
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
        <div class="bg-white notification-shadow notification-radius inline-block w-auto px-5 py-4">
          {this.showIcon && (
            <div class="mr-2 inline-block text-left align-top">
              <bq-icon name={this.getNotificationIconName()} color={this.getNotificationColor()} size="24"></bq-icon>
            </div>
          )}
          {!this.showIcon && (
            <div class="avatar-slot-holder inline-block text-left align-top">
              <slot name="avatar" />
            </div>
          )}
          <div class="max-w-x inline-block text-left align-top">
            <div class="title-font font-semibold">
              <slot />
            </div>
            <div class="description-slot-holder description-font font-regular">
              <slot name="description" />
            </div>
            <div class={{ 'mt-3': this.hasBtn }}>
              <span class={{ 'mr-2': this.hasBtn }} ref={(spanElem) => (this.buttonElem = spanElem)}>
                <slot name="first-button" onSlotchange={this.handleSlotChange} />
              </span>
              <span>
                <slot name="second-button" />
              </span>
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
