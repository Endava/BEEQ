import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { debounce, isClient, type TDebounce, validatePropValue } from '../../shared/utils';
import type { TToastBorderRadius, TToastPlacement, TToastType } from './bq-toast.types';
import { TOAST_PLACEMENT, TOAST_TYPE } from './bq-toast.types';

const TOAST_PORTAL_SELECTOR = 'bq-toast-portal';

/**
 * Toasts are time-based components used to display short messages.
 * Commonly used for errors, confirmations, or progress updates.
 *
 * @example How to use it
 * ```html
 * <bq-toast type="info">
 *   This is a message
 * </bq-toast>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/83da51-toast
 * @status stable
 *
 * @dependency bq-icon
 *
 * @attr {"s" | "none" | "xs2" | "xs" | "m" | "l" | "full"} border - The corder radius of the toast component
 * @attr {"success" | "error" | "loading" | "alert" | "info"} type - Type of toast
 * @attr {"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"} placement - Placement of toast
 * @attr {boolean} hide-icon - If true will hide toast icon
 * @attr {boolean} open - If true, the toast will be shown
 * @attr {number} time - The length of time, in milliseconds, after which the toast will close itself
 *
 * @method show - Method to be called to show the toast component
 * @method hide - Method to be called to hide the toast component
 * @method toast - This method can be used to display toasts in a fixed-position element that allows for stacking multiple toasts vertically
 *
 * @event bqHide - Callback handler to be called when the notification is hidden
 * @event bqShow - Callback handler to be called when the notification is shown
 *
 * @slot - The content to be displayed in the toast component.
 * @slot icon - The icon to be displayed in the toast component.
 *
 * @part wrapper - The component's internal wrapper inside the shadow DOM.
 * @part icon-info - The `<div>` container that holds the icon component.
 * @part base - The `<div>` container of the internal bq-icon component.
 * @part svg - The `<svg>` element of the internal bq-icon component.
 *
 * @cssprop --bq-toast--background - Toast background color
 * @cssprop --bq-toast--box-shadow - Toast box shadow
 * @cssprop --bq-toast--padding-y - Toast vertical padding
 * @cssprop --bq-toast--padding-x - Toast horizontal padding
 * @cssprop --bq-toast--gap - Toast distance between icon and text
 * @cssprop --bq-toast--border-radius - Toast border radius
 * @cssprop --bq-toast--border-color - Toast border color
 * @cssprop --bq-toast--border-style - Toast border style
 * @cssprop --bq-toast--border-width - Toast border width
 * @cssprop --bq-toast--icon-color-info - Toast icon color when type is 'info'
 * @cssprop --bq-toast--icon-color-success - Toast icon color when type is 'success'
 * @cssprop --bq-toast--icon-color-alert - Toast icon color when type is 'alert'
 * @cssprop --bq-toast--icon-color-error - Toast icon color when type is 'error'
 * @cssprop --bq-toast--icon-color-loading - Toast icon color when type is 'loading'
 * @cssprop --bq-toast--icon-color-custom - Toast icon color when type is 'custom'
 */
@Component({
  tag: 'bq-toast',
  styleUrl: './scss/bq-toast.scss',
  shadow: true,
})
export class BqToast {
  // Own Properties
  // ====================

  private autoDismissDebounce: TDebounce<void>;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqToastElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private toastPortal = isClient() ? document.querySelector(`.${TOAST_PORTAL_SELECTOR}`) : null;

  // Public Property API
  // ========================

  /** The corder radius of the toast component */
  @Prop({ reflect: true }) border: TToastBorderRadius = 's';

  /** Type of toast */
  @Prop({ reflect: true, mutable: true }) type: TToastType = 'info';

  /** Placement of toast */
  @Prop({ reflect: true, mutable: true }) placement: TToastPlacement = 'bottom-center';

  /** If true will hide toast icon */
  @Prop({ reflect: true, mutable: true }) hideIcon = false;

  /** If true, the toast will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** The length of time, in milliseconds, after which the toast will close itself */
  @Prop({ reflect: true }) time: number = 3000;

  // Prop lifecycle events
  // =======================

  @Watch('type')
  @Watch('placement')
  checkPropValues() {
    validatePropValue(TOAST_TYPE, 'default', this.el, 'type');
    validatePropValue(TOAST_PLACEMENT, 'bottom-center', this.el, 'placement');

    const { toastPortal } = this;
    toastPortal?.classList.remove(...TOAST_PLACEMENT);
    toastPortal?.classList.add(this.placement);
  }

  @Watch('time')
  handleTimeChange() {
    this.autoDismissDebounce?.cancel();

    this.time = Math.max(0, this.time);

    this.autoDismissDebounce = debounce(() => {
      this.hide();
    }, this.time);
  }

  @Watch('open')
  handleOpenChange() {
    this.autoDismissDebounce?.cancel();

    if (this.open) {
      this.autoDismissDebounce?.();
    }
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the notification is hidden */
  @Event() bqHide: EventEmitter<HTMLBqToastElement>;

  /** Callback handler to be called when the notification is shown */
  @Event() bqShow: EventEmitter<HTMLBqToastElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  connectedCallback() {
    if (!isClient()) return;

    if (this.toastPortal) {
      this.toastPortal = Object.assign(document.createElement('div'), { className: TOAST_PORTAL_SELECTOR });
    }
  }

  componentWillLoad() {
    this.checkPropValues();
    this.handleTimeChange();
    this.handleOpenChange();
  }

  disconnectedCallback() {
    this.autoDismissDebounce?.cancel();
  }

  // Listeners
  // ==============

  @Listen('bqHide')
  onNotificationHide() {
    try {
      const { toastPortal } = this;
      toastPortal?.removeChild(this.el);
      // Remove the toast portal from the DOM when there are no more toasts
      if (toastPortal?.querySelector(this.el.tagName.toLowerCase()) === null) {
        toastPortal?.remove();
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

  /** Method to be called to show the toast component */
  @Method()
  async show(): Promise<void> {
    this.handleShow();
  }

  /** Method to be called to hide the toast component */
  @Method()
  async hide(): Promise<void> {
    this.handleHide();
  }

  /** This method can be used to display toasts in a fixed-position element that allows for stacking multiple toasts vertically */
  @Method()
  async toast() {
    if (!isClient()) return;

    const { toastPortal } = this;
    if (toastPortal?.parentElement === null) {
      document.body.append(toastPortal);
    }

    toastPortal?.appendChild(this.el);

    requestAnimationFrame(() => {
      this.show();
    });
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleShow = () => {
    const ev = this.bqShow.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = true;
    }
  };

  private handleHide = () => {
    const ev = this.bqHide.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = false;
    }
  };

  private get iconName() {
    const typeMap = {
      success: 'check-circle-bold',
      error: 'x-circle-bold',
      loading: 'spinner-gap-bold',
      alert: 'warning-bold',
      info: 'info-bold',
    };

    return typeMap[this.type] || 'info-bold';
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const style = {
      ...(this.border && { '--bq-toast--border-radius': `var(--bq-radius--${this.border})` }),
    };

    return (
      <Host
        aria-hidden={!this.open ? 'true' : 'false'}
        class={{ 'is-hidden': !this.open }}
        hidden={!this.open ? 'true' : 'false'}
        role="status"
        style={style}
      >
        <output class="bq-toast" part="wrapper">
          <div class={{ [`bq-toast--icon ${this.type}`]: true, '!hidden': this.hideIcon }} part="icon">
            <slot name="icon">
              <bq-icon exportparts="base,svg" name={this.iconName} size="24" slot="icon" />
            </slot>
          </div>
          <slot />
        </output>
      </Host>
    );
  }
}
