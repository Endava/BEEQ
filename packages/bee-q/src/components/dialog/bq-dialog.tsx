import { h, Component, Prop, Element, Watch, State, Method, Host, Listen } from '@stencil/core';

import { DIALOG_SIZE, TDialogSize, TDialogFooterAppearance, DIALOG_FOOTER_APPEARANCE } from './bq-dialog.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part base - The component wrapper container inside the shadow DOM
 * @part backdrop - The `<div>` that displays the background
 * @part container - The `<div>` container that holds the dialog content
 * @part header - The `<header>` that holds the icon, title, description and close button
 * @part icon - The `<div>` that holds the info icon
 * @part title - The `<div>` that holds the title content
 * @part button-close - The button that close the dialog on click
 * @part description- The `<div>` that holds the description content
 * @part content- The `<main>` that holds the content
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
  private iconElem: HTMLDivElement;
  private contentElem: HTMLElement;
  private footerElem: HTMLElement;

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqDialogElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private isOpen = false;

  @State() private hasIcon = false;

  @State() private hasContent = false;

  @State() private hasFooter = false;

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

  /** If true will not close on escape press */
  @Prop({ reflect: true }) disableEscKeyDownClose = false;

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

  @Listen('keydown', { target: 'body', passive: true })
  async onKeyDown(event: KeyboardEvent) {
    if (!this.open || this.disableEscKeyDownClose) return;

    if (event.key === 'Escape') {
      await this.close();
    }
  }

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

  private handleOverlayClick = (event: MouseEvent) => {
    if (event.target !== this.overlayElem || this.disableOutsideClickClose) return;

    this.isOpen = false;
  };

  private handleCloseClick = () => {
    this.isOpen = false;
  };

  private handleIconSlotChange = () => {
    this.hasIcon = hasSlotContent(this.iconElem, 'icon');
  };

  private handleContentSlotChange = () => {
    this.hasContent = hasSlotContent(this.contentElem, 'content');
  };

  private handleFooterSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host class={{ 'is-open': this.isOpen }} part="base">
        <div
          class="bq-dialog__backdrop"
          ref={(divElem) => (this.overlayElem = divElem)}
          onClick={this.handleOverlayClick}
          part="backdrop"
        />
        <div class={{ [`bq-dialog__container bq-dialog__container--${this.size}`]: true }} part="container">
          <header class="bq-dialog__header" part="header">
            <div class={{ 'bq-dialog__icon': this.hasIcon }} ref={(divElem) => (this.iconElem = divElem)} part="icon">
              <slot name="icon" onSlotchange={this.handleIconSlotChange} />
            </div>
            <div class="flex flex-col gap-s">
              <div class="bq-dialog__title" part="title">
                <slot name="title" />
                <div part="button-close" class="self-baseline" onClick={this.handleCloseClick}>
                  <slot name="button-close">
                    {!this.hideCloseButton && (
                      <bq-button class="bq-dialog__button-close" appearance="text" size="small" slot="button-close">
                        <bq-icon class="cursor-pointer" name="x" role="img" title="Close" />
                      </bq-button>
                    )}
                  </slot>
                </div>
              </div>
              <div part="description">
                <slot name="description" />
              </div>
            </div>
          </header>
          <main
            class={{ hidden: !this.hasContent, 'px-l': this.hasContent }}
            ref={(mainElem) => (this.contentElem = mainElem)}
            part="content"
          >
            <slot name="content" onSlotchange={this.handleContentSlotChange} />
          </main>
          <footer
            class={{
              'bq-dialog__footer': this.hasFooter,
              'bg-ui-secondary-light': this.footerApperance === 'highlight',
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
