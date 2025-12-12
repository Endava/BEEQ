import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, h, Method, Prop, State, Watch } from '@stencil/core';

import { debounce, enter, hasSlotContent, leave, type TDebounce, validatePropValue } from '../../shared/utils';
import type { TAlertBorderRadius, TAlertType } from './bq-alert.types';
import { ALERT_TYPE } from './bq-alert.types';

/**
 * The Alert is a user interface component used to convey important information to the user in a clear and concise manner.
 * It can be used to notify users of success, failure, warning, or any other type of information that needs to be brought to their attention.
 *
 * @example How to use it
 * ```html
 * <bq-alert>
 *   <bq-icon name="star" slot="icon"></bq-icon>
 *   Title
 *   <span slot="body">
 *     Description
 *     <a class="bq-link" href="https://example.com">Link</a>
 *   </span>
 *   <div slot="footer">
 *     <bq-button appearance="primary" size="small">Button</bq-button>
 *     <bq-button appearance="link" size="small">Button</bq-button>
 *   </div>
 * </bq-alert>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/848a50-alert
 * @status stable
 *
 * @dependency bq-button
 * @dependency bq-icon
 *
 * @attr {boolean} [auto-dismiss=false] - If true, the alert will automatically hide after the specified amount of time
 * @attr {"none" | "xs2" | "xs" | "s" | "m" | "l" | "full"} [border='s'] - The corner radius of the alert component
 * @attr {boolean} [disable-close=false] - If true, the close button at the top right of the alert won't be shown
 * @attr {boolean} [hide-icon=false] - If true, the alert icon won't be shown
 * @attr {boolean} [open=false] - If true, the alert will be shown
 * @attr {number} [time=3000] - The length of time, in milliseconds, after which the alert will close itself. Only valid if `autoDismiss="true"`
 * @attr {"info" | "success" | "warning" | "error" | "default"} [type='default'] - Type of Alert
 * @attr {boolean} [sticky=false] - If true, the alert component will remain fixed at the top of the page, occupying the full viewport
 *
 * @event bqHide - Callback handler to be called when the alert is hidden
 * @event bqShow - Callback handler to be called when the alert is shown
 * @event bqAfterShow - Callback handler to be called after the alert has been shown
 * @event bqAfterHide - Callback handler to be called after the alert has been hidden
 *
 * @slot - The alert title content (no slot name required)
 * @slot body - The alert description content
 * @slot footer - The alert footer content
 * @slot icon - The predefined icon based on the alert type (info, success, warning, error, default)
 * @slot btn-close - The close button of the alert
 *
 * @part base - The `<div>` container of the predefined bq-icon component
 * @part body - The container `<div>` that wraps the alert description content
 * @part btn-close - The native button of the `bq-button` used to close the alert
 * @part content - The container `<div>` that wraps all the alert content (title, description, footer)
 * @part footer - The container `<div>` that wraps the alert footer content
 * @part icon - The `<bq-icon>` element used to render a predefined icon based on the alert type (info, success, warning, error, default)
 * @part icon-outline - The container `<div>` that wraps the icon element
 * @part main - The container `<div>` that wraps the alert main content (title, description)
 * @part svg - The `<svg>` element of the predefined bq-icon component
 * @part title - The container `<div>` that wraps the alert title content
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM
 *
 * @cssprop --bq-alert--background - The alert background color
 * @cssprop --bq-alert--border-radius - The alert border radius
 * @cssprop --bq-alert--content-footer-gap - The alert content and footer gap
 * @cssprop --bq-alert--title-body-gap - The alert title and body gap
 *
 * @cssprop --bq-alert--border-color - The alert border color
 * @cssprop --bq-alert--border-style - The alert border style
 * @cssprop --bq-alert--border-width - The alert border width
 *
 * @cssprop --bq-alert--background-info - The alert background color for info type
 * @cssprop --bq-alert--background-success - The alert background color for success type
 * @cssprop --bq-alert--background-warning - The alert background color for warning type
 * @cssprop --bq-alert--background-error - The alert background color for error type
 *
 * @cssprop --bq-alert--border-info - The alert border color for info type
 * @cssprop --bq-alert--border-success - The alert border color for success type
 * @cssprop --bq-alert--border-warning - The alert border color for warning type
 * @cssprop --bq-alert--border-error - The alert border color for error type
 *
 * @cssprop --bq-alert--icon-color-info - The alert icon color for info type
 * @cssprop --bq-alert--icon-color-success - The alert icon color for success type
 * @cssprop --bq-alert--icon-color-warning - The alert icon color for warning type
 * @cssprop --bq-alert--icon-color-error - The alert icon color for error type
 *
 * @cssprop --bq-alert--padding - The alert padding
 * @cssprop --bq-alert--min-width - The alert min width
 */
@Component({
  tag: 'bq-alert',
  styleUrl: './scss/bq-alert.scss',
  shadow: true,
})
export class BqAlert {
  // Own Properties
  // ====================

  private autoDismissDebounce: TDebounce<void>;
  private bodyElem: HTMLDivElement;
  private footerElem: HTMLDivElement;
  private alertElement: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAlertElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasContent = false;
  @State() private hasFooter = false;

  // Public Property API
  // ========================

  /** If true, the alert will automatically hide after the specified amount of time */
  @Prop({ reflect: true }) autoDismiss: boolean;

  /** The corner radius of the alert component */
  @Prop({ reflect: true }) border: TAlertBorderRadius = 's';

  /** If true, the close button at the top right of the alert won't be shown */
  @Prop({ reflect: true }) disableClose: boolean;

  /** If true, the alert icon won't be shown */
  @Prop({ reflect: true }) hideIcon: boolean;

  /** If true, the alert will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** The length of time, in milliseconds, after which the alert will close itself. Only valid if `autoDismiss="true"` */
  @Prop({ reflect: true }) time: number = 3000;

  /** Type of Alert */
  @Prop({ reflect: true }) type: TAlertType = 'default';

  /** If true, the alert component will remain fixed at the top of the page, occupying the full viewport */
  @Prop({ reflect: true }) sticky: boolean;

  // Prop lifecycle events
  // =======================
  @Watch('autoDismiss')
  @Watch('time')
  handleTimeout() {
    this.autoDismissDebounce?.cancel();
    if (!this.autoDismiss) return;

    this.autoDismissDebounce = debounce(() => {
      this.hide();
    }, this.time);
    // Make sure to autodismiss the notification if the `auto-dismiss` value changed while open
    if (this.open) this.autoDismissDebounce();
  }

  @Watch('open')
  handleOpenChange() {
    this.autoDismissDebounce?.cancel();

    if (!this.open) {
      this.handleHide();
      return;
    }

    this.handleShow();

    if (this.autoDismiss) {
      this.autoDismissDebounce();
    }
  }

  @Watch('type')
  checkPropValues() {
    validatePropValue(ALERT_TYPE, 'info', this.el, 'type');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the alert is hidden */
  @Event() bqHide!: EventEmitter;

  /** Callback handler to be called when the alert is shown */
  @Event() bqShow!: EventEmitter;

  /** Callback handler to be called after the alert has been shown */
  @Event() bqAfterShow!: EventEmitter;

  /** Callback handler to be called after the alert has been hidden */
  @Event() bqAfterHide!: EventEmitter;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
    this.handleTimeout();
  }

  componentDidLoad() {
    this.handleSlotChange();

    if (!this.open) {
      this.el.classList.add('is-hidden');
    }
  }

  // Listeners
  // ==============

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /** Method to be called to hide the alert component */
  @Method()
  async hide(): Promise<void> {
    this.open = false;
  }

  /** Method to be called to show the alert component */
  @Method()
  async show(): Promise<void> {
    this.open = true;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleHide = async () => {
    const ev = this.bqHide.emit(this.el);
    if (!ev.defaultPrevented) {
      await leave(this.alertElement);
      this.el.classList.add('is-hidden');
      this.handleTransitionEnd();
    }
  };

  private handleShow = async () => {
    const ev = this.bqShow.emit(this.el);
    if (!ev.defaultPrevented) {
      this.el.classList.remove('is-hidden');
      await enter(this.alertElement);
      this.handleTransitionEnd();
    }
  };

  private handleTransitionEnd = () => {
    if (this.open) {
      this.bqAfterShow.emit();
      return;
    }

    this.bqAfterHide.emit();
  };

  private handleSlotChange = () => {
    this.hasContent = hasSlotContent(this.bodyElem, 'body');
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  private get iconName(): string {
    const iconName = {
      error: 'x-circle',
      success: 'check-circle',
      warning: 'warning-circle',
    };

    return iconName[this.type] || 'info';
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const style = {
      ...(this.border && { '--bq-alert--border-radius': `var(--bq-radius--${this.border})` }),
    };

    return (
      <Host
        aria-hidden={!this.open ? 'true' : 'false'}
        class={{ 'is-sticky': this.sticky }}
        hidden={!this.open ? 'true' : 'false'}
        role="alert"
        style={style}
      >
        <div
          class={{ [`bq-alert bq-alert__${this.type}`]: true, 'is-sticky': this.sticky }}
          data-transition-enter="transition ease-out duration-300"
          data-transition-enter-end="opacity-100"
          data-transition-enter-start="opacity-0"
          data-transition-leave="transition ease-in duration-200"
          data-transition-leave-end="opacity-0"
          data-transition-leave-start="opacity-100"
          part="wrapper"
          ref={(div) => {
            this.alertElement = div;
          }}
        >
          {/* CLOSE BUTTON */}
          {!this.disableClose && (
            <bq-button
              appearance="text"
              class="absolute end-s [&::part(label)]:inline-flex"
              exportparts="button:btn-close"
              label="Close alert"
              onBqClick={() => this.hide()}
              onlyIcon
              size="small"
            >
              <slot name="btn-close">
                <bq-icon name="x" size={16} aria-hidden="true" />
              </slot>
            </bq-button>
          )}
          {/* ICON */}
          <div
            class={{
              [`bq-alert__icon--${this.type} me-s flex text-left align-top`]: true,
              '!hidden': this.hideIcon,
            }}
            part="icon-outline"
          >
            <slot name="icon">
              {this.type !== 'default' && <bq-icon exportparts="base,svg" name={this.iconName} part="icon" />}
            </slot>
          </div>
          {/* MAIN */}
          <div class="flex flex-col items-start gap-[--bq-alert--content-footer-gap]" part="main">
            <div class="flex flex-col gap-[--bq-alert--title-body-gap]" part="content">
              {/* TITLE */}
              <div
                class={{
                  'title-font font-semibold text-primary leading-regular': true,
                  'flex items-center': this.sticky,
                }}
                part="title"
              >
                <slot />
              </div>
              {/* BODY */}
              <div
                class={{ 'text-primary text-s leading-regular': true, '!hidden': !this.hasContent }}
                part="body"
                ref={(div) => {
                  this.bodyElem = div;
                }}
              >
                <slot name="body" onSlotchange={this.handleSlotChange} />
              </div>
            </div>
            {/* FOOTER */}
            <div
              class={{ 'flex items-start gap-xs': true, '!hidden': !this.hasFooter }}
              part="footer"
              ref={(div) => {
                this.footerElem = div;
              }}
            >
              <slot name="footer" onSlotchange={this.handleSlotChange} />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
