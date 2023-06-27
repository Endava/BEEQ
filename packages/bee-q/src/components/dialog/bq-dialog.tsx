import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import { DIALOG_FOOTER_APPEARANCE, DIALOG_SIZE, TDialogFooterAppearance, TDialogSize } from './bq-dialog.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part body- The `<main>` that holds the dialog body content
 * @part button-close - The button that close the dialog on click
 * @part container - The `<div>` container that holds the dialog content
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

  /** If true, the dialog will not close when the [Esc] key is press */
  @Prop({ reflect: true }) disableCloseEscKeydown = false;

  /** If true, the dialog will not close when clicking on the backdrop overlay */
  @Prop({ reflect: true }) disableCloseClickOutside = false;

  /** The appearance of footer */
  @Prop({ reflect: true }) footerApperance: TDialogFooterAppearance = 'standard';

  /** If true, it hides the close button */
  @Prop({ reflect: true }) hideCloseButton = false;

  /** If true, the dialog will be shown as open */
  @Prop({ reflect: true }) open: boolean = false;

  /** The size of the dialog */
  @Prop({ reflect: true, mutable: true }) size: TDialogSize = 'medium';

  // Prop lifecycle events
  // =======================
  @Watch('footerApperance')
  @Watch('size')
  checkPropValues() {
    validatePropValue(DIALOG_SIZE, 'large', this.el, 'size');
    validatePropValue(DIALOG_FOOTER_APPEARANCE, 'standard', this.el, 'footerApperance');
  }

  @Watch('open')
  handleOpenChange() {
    if (this.open) {
      this.dialogElem.showModal();
    } else {
      this.dialogElem.close();
    }
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

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
  }

  componentDidLoad() {
    this.handleOpenChange();
    this.dialogElem.addEventListener('cancel', this.handleEscDown);
  }

  disconnectedCallback() {
    this.dialogElem.removeEventListener('cancel', this.handleEscDown);
  }

  // Listeners
  // ==============

  @Listen('mousedown', { target: 'window', capture: true })
  handleMouseClick(event: MouseEvent) {
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
      this.handleCancel();
    }
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
    this.handleOpen();
  }

  /** Closes the dialog */
  @Method()
  async hide() {
    this.handleClose();
  }

  /** Dismiss or cancel the dialog */
  @Method()
  async cancel() {
    this.handleCancel();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleClose = () => {
    if (!this.dialogElem) return;

    const ev = this.bqClose.emit();
    if (ev.defaultPrevented) return;

    this.dialogElem.setAttribute('inert', 'true');
    this.open = false;
  };

  private handleOpen = () => {
    if (!this.dialogElem) return;

    const ev = this.bqOpen.emit();
    if (ev.defaultPrevented) return;

    this.dialogElem.removeAttribute('inert');
    this.open = true;
  };

  private handleCancel = () => {
    const ev = this.bqCancel.emit();
    if (ev.defaultPrevented) return;

    this.dialogElem.setAttribute('inert', 'true');
    this.open = false;
  };

  private handleEscDown = (event: KeyboardEvent) => {
    if (this.disableCloseEscKeydown) {
      event.preventDefault();
      return;
    }

    this.handleCancel();
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
      <dialog class={`bq-dialog ${this.size}`} ref={(dialogElem) => (this.dialogElem = dialogElem)} part="dialog">
        <header class="bq-dialog--header" part="header">
          <div class="bq-dialog--title flex flex-1 items-center justify-between" part="title">
            <slot name="title" />
          </div>
          <div class="flex" onClick={this.handleCancel} part="button-close">
            <slot name="button-close">
              {!this.hideCloseButton && (
                <bq-button class="bq-dialog--close" appearance="text" size="small" slot="button-close">
                  <bq-icon class="cursor-pointer" name="x" role="img" title="Close" />
                </bq-button>
              )}
            </slot>
          </div>
        </header>
        <main
          class={{
            hidden: !this.hasContent,
            'overflow-y-auto px-[var(--bq-dialog--padding)]': this.hasContent,
            '!pb-[var(--bq-dialog--padding)]': !this.hasFooter,
          }}
          ref={(mainElem) => (this.contentElem = mainElem)}
          part="body"
        >
          <slot onSlotchange={this.handleContentSlotChange} />
        </main>
        <footer
          class={{
            hidden: !this.hasFooter,
            'bq-dialog--footer': this.hasFooter,
            'bg-ui-secondary-light !pt-s': this.footerApperance === 'highlight',
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
