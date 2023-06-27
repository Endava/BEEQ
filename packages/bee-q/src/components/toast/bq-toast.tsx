import { h, Host, Element, Event, EventEmitter, Component, Prop, Watch, Method } from '@stencil/core';

import { TOAST_TYPE, TToastType } from './bq-toast.types';
import { TDebounce, debounce, validatePropValue } from '../../shared/utils';

/**
 * @part base - The component's internal wrapper of the Toast component.
 * @part icon - `<div>` container element of toast icon component.
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

  /** If true will hide toast icon */
  @Prop({ reflect: true, mutable: true }) hideIcon = false;

  /** If true, the toast will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** The length of time, in milliseconds, after which the toast will close itself */
  @Prop({ reflect: true }) time: number = 3000;

  // Prop lifecycle events
  // =======================

  @Watch('type')
  checkPropValues() {
    validatePropValue(TOAST_TYPE, 'default', this.el, 'type');
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

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  @Method()
  async show(): Promise<void> {
    this.handleShow();
  }

  @Method()
  async hide(): Promise<void> {
    this.handleHide();
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
      <Host
        class={{ '!hidden': !this.open }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
        role="alert"
      >
        <div class="bq-toast" part="base">
          <div class={{ [`bq-toast--icon ${this.type}`]: true, '!hidden': this.hideIcon }} part="icon">
            <slot name="icon">
              <bq-icon name={this.iconName} size="24" weight="bold" slot="icon"></bq-icon>
            </slot>
          </div>
          <slot />
        </div>
      </Host>
    );
  }
}
