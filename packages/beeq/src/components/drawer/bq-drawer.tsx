import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { enter, leave } from 'el-transition';

import { DRAWER_PLACEMENT, TDrawerPlacement } from './bq-drawer.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part body - The `<main>` that holds the drawer body content
 * @part button-close - The button that close the dialog on click
 * @part content - The `<div>` container that holds the drawer title and body content
 * @part wrapper - The `<div>` wrapper container inside the shadow DOM
 * @part footer - The `<footer>` that holds footer content
 * @part header - The `<header>` that holds the icon, title, and close button
 * @part title - The `<div>` that holds the title content
 */

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
  @Prop({ reflect: true, mutable: true }) placement: TDrawerPlacement = 'left';

  /** If true, the backdrop overlay will be shown when the drawer opens */
  @Prop({ reflect: true }) enableBackdrop = false;

  /** If true, the dialog will not close when the [Esc] key is pressed */
  @Prop({ reflect: true }) closeOnEsc = false;

  /** If true, the drawer will not close when clicking outside the panel */
  @Prop({ reflect: true }) closeOnClickOutside = false;

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

  @Watch('placement')
  checkPropValues() {
    validatePropValue(DRAWER_PLACEMENT, 'left', this.el, 'placement');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

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
    if (!this.drawerElem || this.closeOnClickOutside) return;
    // Skip if the mouse button is not the main button
    if (event.button !== 0) return;

    const rect = this.drawerElem.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right) {
      await this.handleHide();
    }
  }

  @Listen('keydown', { target: 'window', capture: true })
  async handleKeyDown(event: KeyboardEvent) {
    if (!this.open) return;
    if (!this.drawerElem || this.closeOnEsc || !(event.key === 'Escape' || event.key === 'Esc')) return;

    await this.handleHide();
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

  private getMoveTranslate = (): string => {
    switch (this.placement) {
      case 'right':
        return `translate-x-full`;
      case 'left':
        return `-translate-x-full`;
      default:
        return '';
    }
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host
        class={{ 'is-hidden': !this.open }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
        role="presentation"
      >
        {this.enableBackdrop && <div class="fixed inset-0 bg-[--bq-drawer--backgroundBackdrop] opacity-60" />}
        <div
          class={{ [`bq-drawer ${this.placement}`]: true }}
          data-transition-enter="transition-all ease-out duration-300"
          data-transition-enter-start={this.getMoveTranslate()}
          data-transition-enter-end="opacity-100"
          data-transition-leave="transition-all ease-in duration-300"
          data-transition-leave-start="opacity-100"
          data-transition-leave-end={this.getMoveTranslate()}
          ref={(div) => (this.drawerElem = div)}
          part="wrapper"
        >
          <header class="flex" part="header">
            <h2 class="flex-1 items-center justify-between font-bold leading-regular text-text-primary" part="title">
              <slot name="title" />
            </h2>
            <div class="flex" role="button" part="button-close">
              <slot name="button-close">
                <bq-button
                  class="[&::part(button)]:h-fit [&::part(button)]:rounded-s [&::part(button)]:border-0 [&::part(button)]:p-0"
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
          <main class="block flex-auto overflow-auto" part="body">
            <slot />
          </main>
          <footer
            class={{
              block: true,
              '!hidden': !this.hasFooter,
            }}
            ref={(footerElem) => (this.footerElem = footerElem)}
            part="footer"
          >
            <bq-divider class="mb-m block" stroke-color="ui--secondary" dashed />
            <slot name="footer" onSlotchange={this.handleFooterSlotChange} />
          </footer>
        </div>
      </Host>
    );
  }
}
