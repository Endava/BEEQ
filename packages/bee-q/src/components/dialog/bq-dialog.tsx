import { h, Component, Prop, Element, Watch, State, Method, Host } from '@stencil/core';

import { DIALOG_SIZE, TDialogSize, TDialogFooterAppearance, DIALOG_FOOTER_APPEARANCE } from './bq-dialog.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part base - The component wrapper container inside the shadow DOM
 * @part container - The `<div>` container that holds the dialog content
 * @part icon - The `<div>` that holds the info icon
 * @part button-close - The button that close the dialog on click
 * @part footer - The `<footer>` that holds footer content
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
  private iconElem: HTMLElement;

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqDialogElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private isOpen = false;

  @State() private hasIconIcon = false;

  // Public Property API
  // ========================

  /** The size of the dialog */
  @Prop({ reflect: true, mutable: true }) size: TDialogSize = 'medium';

  /** The appearance of footer */
  @Prop({ reflect: true }) footerApperance: TDialogFooterAppearance = 'standard';

  /** If true it hides close button */
  @Prop({ reflect: true }) hideCloseButton = false;

  /** If true will not close on outside click */
  @Prop({ reflect: true }) disableOutsideClickClose = false;

  // Prop lifecycle events
  // =======================
  @Watch('size')
  @Watch('footerApperance')
  checkPropValues() {
    validatePropValue(DIALOG_SIZE, 'large', this.el, 'size');
    validatePropValue(DIALOG_FOOTER_APPEARANCE, 'standard', this.el, 'footerApperance');
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
    if (event.target !== this.overlayElem || this.disableOutsideClickClose) return;
    this.isOpen = false;
  };

  private handleIconSlotChange = () => {
    this.hasIconIcon = hasSlotContent(this.iconElem, 'icon');
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
            [`bq-dialog__size--${this.size}`]: true,
          }}
          part="container"
        >
          <header class="bq-dialog__header">
            <div
              class={{ 'bq-dialog__icon': this.hasIconIcon }}
              ref={(divElem) => (this.iconElem = divElem)}
              part="icon"
            >
              <slot name="icon" onSlotchange={this.handleIconSlotChange} />
            </div>
            <div class="flex flex-col pl-m">
              <slot name="title" />
              <div class="bq-description">
                <slot name="content" />
              </div>
            </div>
            <div part="button-close" onClick={this.handleCloseClick}>
              <slot name="button-close">
                {!this.hideCloseButton && (
                  <bq-button class="cursor-auto" appearance="text" size="small" slot="button-close">
                    <bq-icon class="cursor-pointer" name="x" role="img" title="Close" />
                  </bq-button>
                )}
              </slot>
            </div>
          </header>
          <footer
            class={{
              'flex w-full items-center justify-end px-l py-s': true,
              'bg-ui-secondary-light': this.footerApperance === 'highlight',
            }}
            part="footer"
          >
            <slot name="footer" />
          </footer>
        </div>
      </Host>
    );
  }
}
