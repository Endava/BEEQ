import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { TOAST_PLACEMENT, TOAST_TYPE, TToastBorderRadius, TToastPlacement, TToastType } from './bq-toast.types';
import { debounce, TDebounce, validatePropValue } from '../../shared/utils';

const TOAST_PORTAL_SELECTOR = 'bq-toast-portal';

/**
 * @part wrapper - The component's internal wrapper inside the shadow DOM.
 * @part icon-info - The `<div>` container that holds the icon component.
 * @part base - The `<div>` container of the internal bq-icon component.
 * @part svg - The `<svg>` element of the internal bq-icon component.
 *
 * @slot - The content to be displayed in the toast component.
 * @slot icon - The icon to be displayed in the toast component.
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

  @State() private toastPortal = document.querySelector(`.${TOAST_PORTAL_SELECTOR}`);

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
    const { toastPortal } = this;
    if (!toastPortal && typeof document !== 'undefined') {
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
        style={style}
        class={{ 'is-hidden': !this.open }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
        role="status"
      >
        <output class="bq-toast" part="wrapper">
          <div class={{ [`bq-toast--icon ${this.type}`]: true, '!hidden': this.hideIcon }} part="icon">
            <slot name="icon">
              <bq-icon name={this.iconName} size="24" slot="icon" exportparts="base,svg" />
            </slot>
          </div>
          <slot />
        </output>
      </Host>
    );
  }
}
