import { h, Component, Prop, Element, State, Method, Host } from '@stencil/core';
import { hasSlotContent, getColorCSSVariable } from '../../shared/utils';

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
  @State() private isHidden = false;

  // Public Property API
  // ========================

  /** Description text of Notification */
  @Prop({ reflect: true }) description: string;

  /** URL text of Notification description. If you providing URL please make sure it's valid. */
  @Prop({ reflect: true }) href: string;

  /** Type of Notification */
  @Prop({ reflect: true }) type: string;

  /** Set property if you want Notification icon to be shown. */
  @Prop({ reflect: true }) showIcon: boolean;

  /** Set the subject color if you don't want to be black. Subject color will also apply to Icon color if there is one. */
  @Prop({ reflect: true }) subjectColor: string;

  /** Set property if to false if you want to hide Close icon */
  @Prop({ reflect: true }) showClose: boolean;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

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

  private handleSlotChange = () => {
    this.hasBtn = hasSlotContent(this.buttonElem);
  };

  private closeNotification = () => {
    this.isHidden = true;
  };

  private setNotificationOpened = () => {
    this.isHidden = false;
  };

  private isValidURL = (str) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );

    return !!pattern.test(str);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const styles = {
      ...(this.subjectColor && { color: getColorCSSVariable(this.subjectColor) }),
    };

    return (
      <Host aria-hidden={this.isHidden} hidden={this.isHidden}>
        <div
          class="bg-white notification-shadow notification-radius inline-block w-auto px-5 py-4"
          id="notification-main-holder"
        >
          {this.showIcon && (
            <div class="mr-2 inline-block text-left align-top" id="notification-icon-holder">
              <bq-icon name={this.getNotificationIconName()} color={this.subjectColor} size="18"></bq-icon>
            </div>
          )}
          {!this.showIcon && (
            <div class="mr-2 inline-block text-left align-top" id="notification-avatar-holder">
              <slot name="avatar" />
            </div>
          )}
          <div class="max-w-x inline-block text-left align-top">
            <div class="title-font font-semibold" style={styles} id="subject">
              <slot />
            </div>
            <div class="description-font mt-3 font-regular">
              <span id="description">{this.description}</span>
              {this.href && this.isValidURL(this.href) && (
                <span>
                  {' '}
                  <a href={this.href} class="font-medium" target="_blank" id="notification-url">
                    Link
                  </a>
                </span>
              )}
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
                size="14"
                class="cursor-pointer"
                id="close-notification"
                onClick={this.closeNotification}
              ></bq-icon>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
