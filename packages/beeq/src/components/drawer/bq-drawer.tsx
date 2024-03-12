import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { enter, leave } from 'el-transition';

import { TDrawerPlacement } from './bq-drawer.types';
import { hasSlotContent } from '../../shared/utils';

@Component({
  tag: 'bq-drawer',
  styleUrl: './scss/bq-drawer.scss',
  shadow: true,
})
export class BqDrawer {
  // Own Properties
  // ====================

  private drawerElem: HTMLDivElement;
  private footerElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDrawerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasFooter = false;
  @State() hasIcon: boolean = false;

  // Public Property API
  // ========================

  /** If true, the drawer component will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** Defines the position of the drawer */
  @Prop({ reflect: true, mutable: true }) placement?: TDrawerPlacement = 'left';

  /** If true, the backdrop overlay will be shown when the drawer opens */
  @Prop({ reflect: true }) enableBackdrop = false;

  /** If true, the dialog will not close when the [Esc] key is press */
  @Prop({ reflect: true }) disableCloseEscKeydown = true;

  /** If true, the drawer will not close when clicking on the backdrop overlay */
  @Prop({ reflect: true }) disableCloseClickOutside = true;

  // Prop lifecycle events
  // =======================

  @Watch('open')
  handleOpenChange() {
    if (!this.open) {
      this.handleHide();
      return;
    }

    this.handleShow();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler emitted when the drawer has been canceled or dismissed */
  @Event() bqCancel!: EventEmitter<void>;

  /** Callback handler to be called when the drawer is closed */
  @Event() bqClose!: EventEmitter;

  /** Callback handler to be called when the drawer is opened */
  @Event() bqOpen!: EventEmitter;

  /** Callback handler to be called after the drawer has been opened */
  @Event() bqAfterOpen!: EventEmitter;

  /** Callback handler to be called after the drawer has been closed */
  @Event() bqAfterClose!: EventEmitter;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    if (!this.open) {
      this.el.classList.add('is-hidden');
    }
    this.handleOpenChange();
  }

  // Listeners
  // ==============

  @Listen('mousedown', { target: 'window', capture: true })
  async handleMouseClick(event: MouseEvent) {
    if (!this.open) return;
    if (!this.drawerElem || this.disableCloseClickOutside) return;
    // Skip if the mouse button is not the main button
    if (event.button !== 0) return;

    const rect = this.drawerElem.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right) {
      await this.cancel();
    }
  }

  @Listen('keydown', { target: 'window', capture: true })
  async handleKeyDown(event: KeyboardEvent) {
    if (!this.open) return;
    if (!this.drawerElem || this.disableCloseEscKeydown || !(event.key === 'Escape' || event.key === 'Esc')) return;

    await this.cancel();
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /** Method to be called to hide the drawer component */
  @Method()
  async hide(): Promise<void> {
    await this.handleHide();
  }

  /** Method to be called to show the drawer component */
  @Method()
  async show(): Promise<void> {
    await this.handleShow();
  }

  /** Methos to be called to dismiss or cancel the drawer */
  @Method()
  async cancel() {
    const ev = this.bqCancel.emit();
    if (ev.defaultPrevented) return;

    this.open = false;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleFooterSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  private handleHide = async () => {
    const ev = this.bqClose.emit(this.el);
    if (!ev.defaultPrevented) {
      await leave(this.drawerElem);
      this.open = false;
      this.handleTransitionEnd();
    }
  };

  private handleShow = async () => {
    const ev = this.bqOpen.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = true;
      await enter(this.drawerElem);
      this.handleTransitionEnd();
    }
  };

  private handleTransitionEnd = () => {
    if (this.open) {
      this.bqAfterOpen.emit();
      return;
    }
    this.bqAfterClose.emit();
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    console.log('enableBackdrop', this.enableBackdrop);
    console.log('disableCloseEscKeydown', this.disableCloseEscKeydown);
    console.log('disableCloseClickOutside', this.disableCloseClickOutside);
    return (
      <Host
        class={{ 'is-hidden': !this.open }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
        role="dialog"
      >
        <div class={{ 'bq-drawer-backdrop': this.enableBackdrop }}></div>
        <div
          class={{ [`bq-drawer ${this.placement}`]: true }}
          data-transition-enter="transition-all ease-in-out duration-500"
          data-transition-enter-start={`opacity-0 ${this.placement === 'left' ? '-translate-x-full' : 'translate-x-full'}`}
          data-transition-enter-end="opacity-100"
          data-transition-leave="transition-all ease-in-out duration-500"
          data-transition-leave-start="opacity-100"
          data-transition-leave-end={`opacity-0 ${this.placement === 'left' ? '-translate-x-full' : 'translate-x-full'}`}
          ref={(div) => (this.drawerElem = div)}
          part="wrapper"
        >
          <main class="bq-drawer__content" part="content">
            <header class="bq-drawer__header" part="header">
              <div class="bq-drawer__title" part="title">
                <slot name="title" />
              </div>
              <div class="flex" role="button" part="button-close">
                <slot name="button-close">
                  <bq-button
                    class="bq-drawer__close focus-visible:focus"
                    appearance="text"
                    size="small"
                    slot="button-close"
                    onClick={() => this.hide()}
                  >
                    <bq-icon weight="bold" name="x" role="img" title="Close" />
                  </bq-button>
                </slot>
              </div>
            </header>
            <div class="bq-drawer__body" part="body">
              <slot name="body" />
            </div>
            {this.hasFooter && <bq-divider dashed stroke-color="ui--secondary"></bq-divider>}
          </main>
          <footer
            class={{
              'bq-drawer__footer': true,
              '!hidden': !this.hasFooter,
            }}
            ref={(footerElem) => (this.footerElem = footerElem)}
            part="footer"
          >
            <slot name="footer" onSlotchange={this.handleFooterSlotChange} />
          </footer>
        </div>
      </Host>
    );
  }
}
