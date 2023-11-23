import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';
import { ALERT_TYPE, TAlertType } from './bq-alert.types';
import { validatePropValue } from '../../shared/utils';

@Component({
  tag: 'bq-alert',
  styleUrl: './scss/bq-alert.scss',
  shadow: true,
})
export class BqAlert {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAlertElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true, the close button at the top right of the alert won't be shown */
  @Prop({ reflect: true }) disableClose: boolean;

  /** If true, the alert icon won't be shown */
  @Prop({ reflect: true }) hideIcon: boolean;

  /** If true, the alert will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** Type of Alert */
  @Prop({ reflect: true }) type: TAlertType = 'info';

  // Prop lifecycle events
  // =======================

  @Watch('type')
  checkPropValues() {
    validatePropValue(ALERT_TYPE, 'info', this.el, 'type');
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

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

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
        <div class="bq-alert " part="wrapper">
          {/* CLOSE BUTTON */}
          {!this.disableClose && (
            <bq-button class="alert--close absolute right-5" appearance="text" size="small" part="btn-close">
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
          <div class="flex flex-col items-start gap-[var(--bg-alert-content-footer-gap)]" part="main">
            <div class="flex flex-col gap-[var(--bg-alert--title-body-gap)]" part="content">
              {/* TITLE */}
              <div class="title-font font-semibold leading-regular" part="title">
                <slot />
              </div>
              {/* BODY */}
              <div></div>
            </div>
            {/* FOOTER */}
            <div></div>
          </div>
        </div>
      </Host>
    );
  }
}
