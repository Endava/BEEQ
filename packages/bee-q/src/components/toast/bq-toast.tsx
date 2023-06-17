import { h, Component, Element, Prop, Watch, Method, State, Host } from '@stencil/core';

import { TOAST_TYPE, TToastType } from './bq-toast.types';
import { assertUnreachable, isDefined, validatePropValue } from '../../shared/utils';

/**
 * @part base - The component's internal wrapper of the Toast component.
 * @part icon - `<div>` container element of toast icon component.
 * @part text - `<div>` container element of toast text slot.
 */
@Component({
  tag: 'bq-toast',
  styleUrl: './scss/bq-toast.scss',
  shadow: true,
})
export class BqToast {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqToastElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================
  /** State of Toast */
  @State() private shouldShowToast = false;

  // Public Property API
  // ========================

  /** Type of Toast */
  @Prop({ reflect: true, mutable: true }) type: TToastType = 'default';

  /** Text color of Toast */
  @Prop({ reflect: true }) textColor: string;

  /** Should show icon of Toast */
  @Prop({ reflect: true }) showIcon = false;

  /** Should hide Toast after period of time */
  @Prop({ reflect: true }) autoCloseTime: number;

  // Prop lifecycle events
  // =======================
  @Watch('type')
  @Watch('autoCloseTime')
  checkPropValues() {
    if (this.autoCloseTime < 0) {
      this.autoCloseTime = Math.max(0, this.autoCloseTime);
    }
    validatePropValue(TOAST_TYPE, 'default', this.el, 'type');
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

  /** Triggers function to show toast */
  @Method()
  async showToast() {
    this.shouldShowToast = true;
    if (this.autoCloseTime > 0) {
      setTimeout(() => {
        this.shouldShowToast = false;
      }, this.autoCloseTime);
    }
  }

  /** Triggers function to hide toast */
  @Method()
  async hideToast() {
    this.shouldShowToast = false;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private get iconColor() {
    if (isDefined(this.textColor)) {
      return this.textColor;
    }

    switch (this.type) {
      case 'success': {
        return 'ui--success';
      }
      case 'error': {
        return 'ui--danger';
      }
      case 'loading': {
        return 'ui--brand';
      }
      case 'alert': {
        return 'ui--warning';
      }
      case 'info': {
        return 'ui--brand';
      }
      case 'default': {
        return 'ui--brand';
      }
      default: {
        assertUnreachable(this.type);
        return 'ui--brand';
      }
    }
  }

  private get icon() {
    switch (this.type) {
      case 'success': {
        return 'check-circle';
      }
      case 'error': {
        return 'x-circle';
      }
      case 'loading': {
        return 'spinner-gap';
      }
      case 'alert': {
        return 'warning-circle';
      }
      case 'info': {
        return 'info';
      }
      case 'default': {
        return 'info';
      }
      default: {
        assertUnreachable(this.type);
        return 'info';
      }
    }
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host aria-hidden={!this.shouldShowToast} hidden={!this.shouldShowToast}>
        <div class="bq-toast" part="base">
          {this.showIcon && (
            <div class="icon-wraper inline-block text-left align-middle" part="icon">
              <slot name="icon" />
            </div>
          )}
          {!this.showIcon && (
            <bq-icon
              class={`.bq-toast__icon`}
              name={this.icon}
              color={this.iconColor}
              size="24"
              weight="bold"
            ></bq-icon>
          )}
          <div class="inline-block align-middle font-medium" part="text">
            <slot name="text" />
          </div>
        </div>
      </Host>
    );
  }
}
