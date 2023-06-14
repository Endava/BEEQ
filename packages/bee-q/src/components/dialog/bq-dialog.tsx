import { h, Component, Prop, Element, Watch, State, Method, Host } from '@stencil/core';

import { DIALOG_SIZE, DIALOG_FOOTER_VARIANT, TDialogSize, TDialogFooterVariant } from './bq-dialog.types';
import { validatePropValue } from '../../shared/utils';

/**
 * @part base - The component wrapper container inside the shadow DOM
 * @part container - The `<div>` container that holds the dialog content
 * @part button-close - The button that close the dialog on click
 */

@Component({
  tag: 'bq-dialog',
  styleUrl: './scss/bq-dialog.scss',
  shadow: true,
})
export class BqDialog {
  // Own Properties
  // ====================

  private overlayElem: HTMLDivElement;

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqDialogElement;

  // State() variables
  @State() isOpen = false;
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The size of the dialog */
  @Prop({ reflect: true, mutable: true }) size: TDialogSize = 'large';

  /** The variant of button to apply on top of the appearance */
  @Prop({ reflect: true }) variant: TDialogFooterVariant = 'standard';

  // Prop lifecycle events
  // =======================
  @Watch('size')
  @Watch('variant')
  checkPropValues() {
    validatePropValue(DIALOG_SIZE, 'large', this.el, 'size');
    validatePropValue(DIALOG_FOOTER_VARIANT, 'standard', this.el, 'variant');
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

  /** Shows the dialog */
  @Method()
  async open() {
    this.isOpen = true;
  }

  /** Hides  the dialog */
  @Method()
  async close() {
    this.isOpen = false;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  handleCloseClick = () => {
    this.isOpen = false;
  };

  handleOverlayClick = (event: MouseEvent) => {
    if (event.target !== this.overlayElem) return;
    this.isOpen = false;
  };
  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host class={{ 'is-open': this.isOpen }} part="base">
        <div
          class="overlay fixed h-full w-full bg-bg-tertiary opacity-75"
          onClick={this.handleOverlayClick}
          ref={(el) => (this.overlayElem = el)}
        />
        <div
          class={{
            'z-10 m-auto flex flex-col rounded-s bg-bg-primary shadow-m': true,
            [`size--${this.size}`]: true,
          }}
          part="container"
        >
          <header class="bq-header">
            <div class="bq-placeholder-info">
              <div class="bq-info">
                <slot name="info" />
              </div>
            </div>
            <div class="flex flex-col pl-4">
              <slot name="title" />
              <div class="bq-description">
                <slot name="content" />
              </div>
            </div>
            <div>
              <bq-button
                class="cursor-auto"
                appearance="text"
                size="small"
                onClick={this.handleCloseClick}
                part="button-close"
              >
                <bq-icon class="cursor-pointer" name="x" role="img" title="Close" />
              </bq-button>
            </div>
          </header>
          <footer
            class={{
              'flex h-[72px] w-full items-center justify-end px-6 py-6': true,
              'rounded-s bg-ui-secondary-light': this.variant === 'light',
            }}
          >
            <slot name="buttons" />
          </footer>
        </div>
      </Host>
    );
  }
}
