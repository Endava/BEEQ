import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { DRAWER_PLACEMENT, DRAWER_POSITIONS, TDrawerPlacement, TDrawerPosition } from './bq-drawer.types';
import { enter, hasSlotContent, isNil, leave, validatePropValue } from '../../shared/utils';

/**
 * @part backdrop - The `<div>` that holds the backdrop overlay
 * @part button-close - The button that close the dialog on click
 * @part panel - The `<div>` that holds the drawer entire content
 * @part header - The `<header>` that holds the icon, title, and close button
 * @part title - The `<div>` that holds the title content
 * @part body - The `<main>` that holds the drawer body content
 * @part footer - The `<footer>` that holds footer content
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
  @Prop({ reflect: true }) position: TDrawerPosition = 'end';

  // Prop lifecycle events
  // =======================

  @Watch('open')
  async handleOpenChange() {
    if (!this.open) {
      await this.handleHide();
      return;
    }

    await this.handleShow();
  }

  /**
   * !⚠️ Delete this `@Watch()` once the deprecated `placement` property is removed
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
     * !⚠️ Delete the code below once the deprecated `placement` property is removed
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
    // !⚠️ Delete this once the deprecated `placement` property is removed
    this.handlePlacementChange();
  }

  componentDidLoad() {
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
    this.open = false;
  }

  /** Method to be called to show the drawer component */
  @Method()
  async show(): Promise<void> {
    this.open = true;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleFooterSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  private handleHide = async () => {
    if (!this.drawerElem) return;

    const ev = this.bqClose.emit();
    if (ev.defaultPrevented) return;

    await leave(this.drawerElem);
    this.handleTransitionEnd();
  };

  private handleShow = async () => {
    if (!this.drawerElem) return;

    const ev = this.bqOpen.emit();
    if (ev.defaultPrevented) return;

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

  private getMoveTranslate = (): string => {
    const positionMap = {
      start: '-translate-x-full',
      end: 'translate-x-full',
    };

    return positionMap[this.position] || '';
  };

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
              'fixed inset-0 block bg-[--bq-drawer--backgroundBackdrop] opacity-0 transition-opacity duration-300':
                true,
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
            // !⚠️ `placement` is deprecated and will be removed in the future
            [`bq-drawer ${this.position || this.placement}`]: true,
            'end-0': this.position === 'end' || this.placement === 'right',
            'start-0': this.position === 'start' || this.placement === 'left',
          }}
          data-transition-enter="transition-transform ease-in duration-300"
          data-transition-enter-start={this.getMoveTranslate()}
          data-transition-enter-end="opacity-100"
          data-transition-leave="transition-transform ease-in duration-300"
          data-transition-leave-start="opacity-100"
          data-transition-leave-end={this.getMoveTranslate()}
          ref={(div) => (this.drawerElem = div)}
          aria-hidden={!this.open ? 'true' : 'false'}
          aria-labelledby="bq-drawer__title"
          aria-modal="true"
          hidden={!this.open}
          part="panel"
          role="dialog"
        >
          <header class="flex" part="header">
            <h2
              class="flex-1 items-center justify-between font-bold leading-regular text-text-primary"
              id="bq-drawer__title"
              part="title"
            >
              <slot name="title" />
            </h2>
            <div class="flex" part="button-close">
              <slot name="button-close">
                <bq-button
                  class="[&::part(button)]:rounded-s [&::part(button)]:border-0 [&::part(button)]:bs-fit [&::part(button)]:p-b-0 [&::part(button)]:p-i-0"
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
            <slot name="footer-divider">
              <bq-divider class="mb-m block" stroke-color="ui--secondary" dashed />
            </slot>
            <slot name="footer" onSlotchange={this.handleFooterSlotChange} />
          </footer>
        </div>
      </Host>
    );
  }
}
