import { h, Host, Element, Event, EventEmitter, Component, Prop, Watch, Method, Listen } from '@stencil/core';

import { TOAST_PLACEMENT, TOAST_TYPE, TToastPlacement, TToastType } from './bq-toast.types';
import { TDebounce, debounce, validatePropValue } from '../../shared/utils';

const toastPortal = Object.assign(document.createElement('div'), { className: 'bq-toast-portal' });

/**
 * @part wrapper - The component's internal wrapper inside the shadow DOM.
 * @part icon-info - The `<div>` container that holds the icon component.
 * @part base - The `<div>` container of the internal bq-icon component.
 * @part svg - The `<svg>` element of the internal bq-icon component.
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

  // Public Property API
  // ========================

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

    toastPortal.classList.remove(...TOAST_PLACEMENT);
    toastPortal.classList.add(this.placement);
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
      toastPortal.removeChild(this.el);
      // Remove the toast portal from the DOM when there are no more toasts
      if (toastPortal.querySelector('bq-toast') === null) {
        toastPortal.remove();
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
    if (toastPortal.parentElement === null) {
      document.body.append(toastPortal);
    }

    toastPortal.appendChild(this.el);

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
        return 'warning';
      }
      case 'info': {
        return 'info';
      }
      default: {
        return 'info';
      }
    }
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host aria-hidden={!this.open ? 'true' : 'false'} hidden={!this.open ? 'true' : 'false'} role="status">
        <output class="bq-toast" part="wrapper">
          <div class={{ [`bq-toast--icon ${this.type}`]: true, '!hidden': this.hideIcon }} part="icon">
            <slot name="icon">
              <bq-icon name={this.iconName} size="24" weight="bold" slot="icon" exportparts="base,svg"></bq-icon>
            </slot>
          </div>
          <slot />
        </output>
      </Host>
    );
  }
}
