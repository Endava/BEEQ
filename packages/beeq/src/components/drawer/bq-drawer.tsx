import { Component, Element, Event, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

import { DRAWER_PLACEMENT, DRAWER_POSITIONS } from './bq-drawer.types';
import type { TDrawerPlacement, TDrawerPosition } from './bq-drawer.types';
import { enter, hasSlotContent, isNil, leave, validatePropValue } from '../../shared/utils';

/**
 * The Drawer component provides a sliding panel interface commonly used for navigation or presenting additional content without taking up significant screen space.
 *
 * @example How to use it
 * ```html
 * <bq-drawer position="end">
 *   <div class="flex gap-xs" slot="title">Title</div>
 *   <div class="...">
 *     Content
 *   </div>
 *   <div class="flex flex-1 justify-center gap-xs" slot="footer">
 *     <bq-button appearance="primary" block="" size="small">Button</bq-button>
 *     <bq-button appearance="link" block="" size="small">Button</bq-button>
 *   </div>
 * </bq-drawer>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/871139-drawer
 * @status stable
 *
 * @dependency bq-button
 * @dependency bq-icon
 * @dependency bq-divider
 *
 * @attr {boolean} enable-backdrop - If true, the backdrop overlay will be shown when the drawer opens.
 * @attr {boolean} close-on-click-outside - If true, the drawer will not close when clicking outside the panel.
 * @attr {boolean} close-on-esc - If true, the drawer will not close when the [Esc] key is pressed.
 * @attr {boolean} open - If true, the drawer component will be shown.
 * @attr {"start" | "end"} position - Defines the position of the drawer.
 *
 * @method show - Method to be called to show the drawer component.
 * @method hide - Method to be called to hide the drawer component.
 *
 * @event bqClose - Callback handler to be called when the drawer is closed.
 * @event bqOpen - Callback handler to be called when the drawer is opened.
 * @event bqAfterOpen - Callback handler to be called after the drawer has been opened.
 * @event bqAfterClose - Callback handler to be called after the drawer has been closed.
 *
 * @slot title - The title content of the drawer.
 * @slot - The body content of the drawer.
 * @slot footer - The footer content of the drawer.
 * @slot button-close - The close button content of the drawer.
 * @slot footer-divider - The footer divider content of the drawer.
 *
 * @part backdrop - The `<div>` that holds the backdrop overlay.
 * @part button-close - The BqButton that closes the drawer.
 * @part button-close__btn - The native button used under the hood that closes the drawer.
 * @part button-close__label - The text inside the native button that closes the drawer.
 * @part panel - The `<div>` that holds the drawer entire content.
 * @part header - The `<header>` that holds the icon, title, and close button.
 * @part title - The `<div>` that holds the title content.
 * @part body - The `<main>` that holds the drawer body content.
 * @part footer - The `<footer>` that holds footer content.
 *
 * @cssprop --bq-drawer--backgroundBackdrop - Background color of the backdrop
 * @cssprop --bq-drawer--gap - Gap between the drawer and the viewport
 * @cssprop --bq-drawer--width - Width of the drawer
 * @cssprop --bq-drawer--paddingX - Padding left and right of the drawer
 * @cssprop --bq-drawer--paddingY - Padding top and bottom of the drawer
 * @cssprop --bq-drawer--zIndex - Z-index of the drawer component
 */
@Component({
  tag: 'bq-drawer',
  styleUrl: './scss/bq-drawer.scss',
  shadow: true,
})
export class BqDrawer {
  // Own Properties
  // ====================

  private footerElem: HTMLElement;
  private drawerElem: HTMLDivElement;
  private OPEN_CSS_CLASS = 'bq-drawer--open';

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

  /** If true, the backdrop overlay will be shown when the drawer opens */
  @Prop({ reflect: true }) enableBackdrop = false;

  /** If true, the drawer will not close when clicking outside the panel */
  @Prop({ reflect: true }) closeOnClickOutside = false;

  /** If true, the dialog will not close when the [Esc] key is pressed */
  @Prop({ reflect: true }) closeOnEsc = false;

  /** If true, the drawer component will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** @deprecated Defines the position of the drawer */
  @Prop({ reflect: true, mutable: true }) placement: TDrawerPlacement = 'right';

  /** Defines the position of the drawer */
  @Prop({ reflect: true, mutable: true }) position: TDrawerPosition = 'end';

  // Prop lifecycle events
  // =======================

  @Watch('open')
  async handleOpenChange() {
    if (!this.open) {
      await this.handleAfterHide();
      return;
    }

    await this.handleAfterShow();
  }

  /**
   * !TO BE REMOVED: Delete this `@Watch()` once the deprecated `placement` property is removed
   * We need to maintain retro-compatibility with the deprecated `placement` property
   */
  @Watch('placement')
  handlePlacementChange() {
    if (!isNil(this.placement)) {
      console.warn(
        `❗️ [bq-drawer]: the 'placement' prop is deprecated and it will be removed in the future. Please use 'position' instead.`,
      );
    }
    validatePropValue(DRAWER_PLACEMENT, 'right', this.el, 'placement');
    // Sync 'position' property
    const synPositionMap = {
      right: 'end',
      left: 'start',
    };
    this.position = (synPositionMap[this.placement] as TDrawerPosition) || this.position;
  }

  @Watch('position')
  handlePositionChange() {
    validatePropValue(DRAWER_POSITIONS, 'start', this.el, 'position');
    /**
     * Sync 'placement' property
     * !TO BE REMOVED: Delete the code below once the deprecated `placement` property is removed
     */
    const syncPlacementMap = {
      end: 'right',
      start: 'left',
    };
    this.placement = (syncPlacementMap[this.position] as TDrawerPlacement) || this.placement;
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

  componentWillLoad() {
    this.handlePositionChange();
    // !TO BE REMOVED: Delete this once the deprecated `placement` property is removed
    this.handlePlacementChange();
  }

  componentDidLoad() {
    this.handleFooterSlotChange();
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
      await this.hide();
    }
  }

  @Listen('keydown', { target: 'window', capture: true })
  async handleKeyDown(event: KeyboardEvent) {
    if (!this.open) return;
    if (!this.drawerElem || this.closeOnEsc || !(event.key === 'Escape' || event.key === 'Esc')) return;

    await this.hide();
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
    const ev = this.bqClose.emit();
    if (ev.defaultPrevented) return;

    this.open = false;
  }

  /** Method to be called to show the drawer component */
  @Method()
  async show(): Promise<void> {
    const ev = this.bqOpen.emit();
    if (ev.defaultPrevented) return;

    this.open = true;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleFooterSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  private handleAfterHide = async () => {
    if (!this.drawerElem) return;

    await leave(this.drawerElem);
    this.handleTransitionEnd();
  };

  private handleAfterShow = async () => {
    if (!this.drawerElem) return;

    this.el.classList.add(this.OPEN_CSS_CLASS);
    await enter(this.drawerElem);
    this.handleTransitionEnd();
  };

  private handleTransitionEnd = () => {
    if (this.open) {
      this.bqAfterOpen.emit();
      return;
    }

    this.bqAfterClose.emit();
    this.el.classList.remove(this.OPEN_CSS_CLASS);
  };

  private get isPositionStart() {
    // !TO BE REMOVED: `placement` is deprecated and will be removed in the future
    return this.position === 'start' || this.placement === 'left';
  }

  private get isPositionEnd() {
    // !TO BE REMOVED: `placement` is deprecated and will be removed in the future
    return this.position === 'end' || this.placement === 'right';
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        {/* BACKDROP */}
        {this.enableBackdrop && (
          <div
            class={{
              'fixed inset-0 block bg-[--bq-drawer--backgroundBackdrop] opacity-0 transition-opacity duration-300': true,
              'pointer-events-none': !this.open,
              'opacity-60': this.open,
            }}
            tabIndex={-1}
            part="backdrop"
          />
        )}
        {/* DRAWER PANEL */}
        <div
          class={{
            [`bq-drawer transition-all duration-300 ease-in-out ${this.position || this.placement}`]: true,
            '-start-[--bq-drawer--width]': this.isPositionStart,
            '-end-[--bq-drawer--width]': this.isPositionEnd,
            'start-0': this.open && this.isPositionStart,
            'end-0': this.open && this.isPositionEnd,
          }}
          ref={(div) => (this.drawerElem = div)}
          aria-hidden={!this.open ? 'true' : 'false'}
          aria-labelledby="bq-drawer__title"
          aria-modal="true"
          hidden={!this.open}
          part="panel"
          role="dialog"
        >
          <header class="flex items-center" part="header">
            <h2
              class="flex-1 items-center justify-between text-xl font-bold leading-regular text-primary"
              id="bq-drawer__title"
              part="title"
            >
              <slot name="title" />
            </h2>
            <div class="flex" part="button-close">
              <bq-button
                class="[&::part(button)]:rounded-s [&::part(button)]:border-0 [&::part(button)]:bs-fit [&::part(button)]:p-b-0 [&::part(button)]:p-i-0 [&::part(label)]:inline-flex"
                appearance="text"
                size="small"
                slot="button-close"
                exportparts="button:button-close__btn,label:button-close__label"
                onClick={this.hide.bind(this)}
              >
                <slot name="button-close">
                  <bq-icon name="x-bold" role="img" title="Close" />
                </slot>
              </bq-button>
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
            <slot name="footer-divider">
              <bq-divider class="mb-m block" dashed />
            </slot>
            <slot name="footer" onSlotchange={this.handleFooterSlotChange} />
          </footer>
        </div>
      </Host>
    );
  }
}
