import { h, Component, Element, Prop, Watch, Method, State, Host } from '@stencil/core';
import { getColorCSSVariable, validatePropValue } from '../../shared/utils';
import { TOAST_TYPE, TToastType } from './bq-toast.types';

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
    const type = this.type;
    const textColor = this.textColor;
    const defaultColors = {
      success: 'ui--success',
      error: 'ui--danger',
      loading: 'ui--brand',
      alert: 'ui--warning',
      info: 'ui--brand',
      default: 'ui--brand',
    };
    let color = defaultColors[type];
    if (textColor !== '') {
      color = textColor;
    }
    return { color: color };
  }

  private get icon() {
    const type = this.type;
    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      loading: 'spinner-gap',
      alert: 'warning-circle',
      info: 'info',
      default: 'info',
    };
    const icon = icons[type];
    return { icon: icon };
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const styles = { ...(this.textColor && { color: getColorCSSVariable(this.textColor) }) };
    const { color } = this.iconColor;
    const { icon } = this.icon;
    return (
      <Host style={styles} aria-hidden={!this.shouldShowToast} hidden={!this.shouldShowToast}>
        <div class="toast-shadow inline-flex items-center gap-2 rounded-m font-semibold " part="base">
          {this.showIcon && (
            <div class="icon-wraper inline-block text-left align-middle" part="icon">
              <slot name="icon" />
            </div>
          )}
          {!this.showIcon && (
            <bq-icon class={`.bq-toast__icon`} name={icon} color={color} size="24" weight="bold"></bq-icon>
          )}
          <div class="inline-block align-middle font-medium" part="text">
            <slot name="text" />
          </div>
        </div>
      </Host>
    );
  }
}
