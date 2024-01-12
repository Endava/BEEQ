import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { enter, leave } from 'el-transition';

import { DIALOG_FOOTER_APPEARANCE, DIALOG_SIZE, TDialogFooterAppearance, TDialogSize } from './bq-dialog.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part body - The `<main>` that holds the dialog body content
 * @part button-close - The button that close the dialog on click
 * @part content - The `<div>` container that holds the dialog title and body content
 * @part dialog - The `<dialog>` wrapper container inside the shadow DOM
 * @part footer - The `<footer>` that holds footer content
 * @part header - The `<header>` that holds the icon, title, description and close button
 * @part title - The `<div>` that holds the title content
 */

@Component({
  tag: 'bq-dialog',
  styleUrl: './scss/bq-dialog.scss',
  shadow: true,
})
export class BqDialog {
  // Own Properties
  // ====================

  private dialogElem: HTMLDialogElement;
  private contentElem: HTMLElement;
  private footerElem: HTMLElement;
  private OPEN_CSS_CLASS = 'bq-dialog--open';

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqDialogElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasContent = false;
  @State() private hasFooter = false;

  // Public Property API
  // ========================

  /** If true, the backdrop overlay won't be shown when the dialog opens */
  @Prop({ reflect: true }) disableBackdrop = false;

  /** If true, the dialog will not close when the [Esc] key is press */
  @Prop({ reflect: true }) disableCloseEscKeydown = false;

  /** If true, the dialog will not close when clicking on the backdrop overlay */
  @Prop({ reflect: true }) disableCloseClickOutside = false;

  /** The appearance of footer */
  @Prop({ reflect: true }) footerAppearance: TDialogFooterAppearance = 'standard';

  /** If true, it hides the close button */
  @Prop({ reflect: true }) hideCloseButton = false;

  /** If true, the dialog will be shown as open */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /** The size of the dialog */
  @Prop({ reflect: true, mutable: true }) size: TDialogSize = 'medium';

  // Prop lifecycle events
  // =======================
  @Watch('footerAppearance')
  @Watch('size')
  checkPropValues() {
    validatePropValue(DIALOG_SIZE, 'large', this.el, 'size');
    validatePropValue(DIALOG_FOOTER_APPEARANCE, 'standard', this.el, 'footerAppearance');
  }

  @Watch('open')
  async handleOpenChange() {
    if (this.open) {
      await this.handleOpen();
      return;
    }

    await this.handleClose();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler emitted when the dialog has been canceled or dismissed */
  @Event() bqCancel!: EventEmitter<void>;

  /** Callback handler emitted when the dialog will close */
  @Event() bqClose!: EventEmitter<void>;

  /** Callback handler emitted when the dialog will open */
  @Event() bqOpen!: EventEmitter<void>;

  /** Callback handler emitted when the dialog finish opening */
  @Event() bqAfterOpen!: EventEmitter<void>;

  /** Callback handler emitted when the dialog finish closing */
  @Event() bqAfterClose!: EventEmitter<void>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
  }

  componentDidLoad() {
    this.handleOpenChange();
  }

  // Listeners
  // ==============

  @Listen('mousedown', { target: 'window', capture: true })
  async handleMouseClick(event: MouseEvent) {
    if (!this.open) return;
    if (!this.dialogElem || this.disableCloseClickOutside) return;
    // Skip if the mouse button is not the main button
    if (event.button !== 0) return;

    const rect = this.dialogElem.getBoundingClientRect();
    if (
      event.clientY < rect.top ||
      event.clientY > rect.bottom ||
      event.clientX < rect.left ||
      event.clientX > rect.right
    ) {
      await this.cancel();
    }
  }

  @Listen('keydown', { target: 'window', capture: true })
  async handleKeyDown(event: KeyboardEvent) {
    if (!this.open || !this.dialogElem || !(event.key === 'Escape' || event.key === 'Esc')) return;

    await this.cancel();
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /** Open the dialog */
  @Method()
  async show() {
    const ev = this.bqOpen.emit();
    if (ev.defaultPrevented) return;

    this.open = true;
  }

  /** Closes the dialog */
  @Method()
  async hide() {
    const ev = this.bqClose.emit();
    if (ev.defaultPrevented) return;

    this.open = false;
  }

  /** Dismiss or cancel the dialog */
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

  private setInertAttribute() {
    if (!this.dialogElem) return;
    this.dialogElem.setAttribute('inert', 'true');
  }

  private removeInertAttribute() {
    if (!this.dialogElem) return;
    this.dialogElem.removeAttribute('inert');
  }

  private handleClose = async () => {
    if (!this.dialogElem) return;

    this.dialogElem.close();
    await leave(this.dialogElem);
    // Emit bqAfterClose event after the dialog is closed
    this.handleTransitionEnd();
    // Set the inert attribute to the dialog element
    this.setInertAttribute();
  };

  private handleOpen = async () => {
    if (!this.dialogElem) return;

    this.el.classList.add(this.OPEN_CSS_CLASS);
    // Remove the inert attribute from the dialog element
    this.removeInertAttribute();
    // Show the dialog
    this.disableBackdrop ? this.dialogElem.show() : this.dialogElem.showModal();
    await enter(this.dialogElem);
    // Emit bqAfterOpen event after the dialog is opened
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

  private handleContentSlotChange = () => {
    this.hasContent = hasSlotContent(this.contentElem);
  };

  private handleFooterSlotChange = () => {
    this.hasFooter = hasSlotContent(this.footerElem, 'footer');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <dialog
        class={{ [`bq-dialog ${this.size}`]: true }}
        data-transition-enter="transition ease-out duration-200"
        data-transition-enter-start="transform opacity-0 scale-75"
        data-transition-enter-end="transform opacity-100 scale-100"
        data-transition-leave="transition ease-in duration-100"
        data-transition-leave-start="transform opacity-100 scale-100"
        data-transition-leave-end="transform opacity-0 scale-75"
        inert={this.open ? undefined : true}
        ref={(dialogElem) => (this.dialogElem = dialogElem)}
        part="dialog"
      >
        <main class="flex flex-col gap-[var(--bq-dialog--title-body-gap)] overflow-hidden" part="content">
          <header class="bq-dialog--header" part="header">
            <div class="bq-dialog--title flex flex-1 items-center justify-between" part="title">
              <slot name="title" />
            </div>
            <div class="flex" onClick={() => this.hide()} role="button" part="button-close">
              <slot name="button-close">
                {!this.hideCloseButton && (
                  <bq-button class="bq-dialog--close" appearance="text" size="small" slot="button-close">
                    <bq-icon class="cursor-pointer" name="x" role="img" title="Close" />
                  </bq-button>
                )}
              </slot>
            </div>
          </header>
          <div
            class={{
              '!hidden': !this.hasContent,
              'overflow-y-auto px-[var(--bq-dialog--padding)]': this.hasContent,
              '!pb-[var(--bq-dialog--padding)]': !this.hasFooter,
            }}
            ref={(mainElem) => (this.contentElem = mainElem)}
            part="body"
          >
            <slot onSlotchange={this.handleContentSlotChange} />
          </div>
        </main>
        <footer
          class={{
            '!hidden': !this.hasFooter,
            'bq-dialog--footer': this.hasFooter,
            'bg-ui-primary-alt !py-s': this.footerAppearance === 'highlight',
          }}
          ref={(footerElem) => (this.footerElem = footerElem)}
          part="footer"
        >
          <slot name="footer" onSlotchange={this.handleFooterSlotChange} />
        </footer>
      </dialog>
    );
  }
}
