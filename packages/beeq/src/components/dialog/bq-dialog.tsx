import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import {
  DIALOG_FOOTER_APPEARANCE,
  DIALOG_SIZE,
  TDialogBorderRadius,
  TDialogFooterAppearance,
  TDialogSize,
} from './bq-dialog.types';
import { enter, hasSlotContent, leave, validatePropValue } from '../../shared/utils';

/**
 * The Dialog component is used to display additional content or prompt a user for action.
 * It provides a way to display additional information, options, or controls in a separate, non-obstructive interface element.
 *
 * @example How to use it
 * ```html
 * <bq-dialog footer-appearance="standard" border="m" size="medium">
 *   <h5 class="bold flex items-center gap-s" slot="title">
 *     <bq-icon name="info" size="30" color="text--accent" role="img" title="Info"></bq-icon>
 *     Title
 *   </h5>
 *   <p>
 *     Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
 *     standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
 *     type specimen book.
 *   </p>
 *   <div class="flex gap-xs" slot="footer">
 *     <bq-button appearance="link">Button</bq-button>
 *     <bq-button variant="ghost">Button</bq-button>
 *     <bq-button variant="standard" slot="footer">Button</bq-button>
 *   </div>
 * </bq-dialog>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/15b6fc-dialog
 * @status stable
 *
 * @attr {"none" | "xs2" | "xs" | "s" | "m" | "l" | "full"} border - Border radius of the dialog component.
 * @attr {boolean} disable-backdrop - If true, the backdrop overlay won't be shown when the dialog opens.
 * @attr {boolean} disable-close-esc-keydown - If true, the dialog will not close when the [Esc] key is pressed.
 * @attr {boolean} disable-close-click-outside - If true, the dialog will not close when clicking on the backdrop overlay.
 * @attr {"standard" | "highlight"} footer-appearance - The appearance of the footer.
 * @attr {boolean} hide-close-button - If true, it hides the close button.
 * @attr {boolean} open - If true, the dialog will be shown as open.
 * @attr {"small" | "medium" | "large"} size - The size of the dialog.
 *
 * @method show - Open the dialog.
 * @method hide - Closes the dialog.
 * @method cancel - Dismiss or cancel the dialog.
 *
 * @event bqCancel - Callback handler emitted when the dialog has been canceled or dismissed.
 * @event bqClose - Callback handler emitted when the dialog will close.
 * @event bqOpen - Callback handler emitted when the dialog will open.
 * @event bqAfterOpen - Callback handler emitted when the dialog finish opening.
 * @event bqAfterClose - Callback handler emitted when the dialog finish closing.
 *
 * @slot title - The title content of the dialog.
 * @slot - The body content of the dialog.
 * @slot footer - The footer content of the dialog.
 * @slot button-close - The close button content of the dialog.
 *
 * @part body - The `<main>` that holds the dialog body content.
 * @part button-close - The button that closes the dialog on click.
 * @part content - The `<div>` container that holds the dialog title and body content.
 * @part dialog - The `<dialog>` wrapper container inside the shadow DOM.
 * @part footer - The `<footer>` that holds footer content.
 * @part header - The `<header>` that holds the icon, title, description and close button.
 * @part title - The `<div>` that holds the title content.
 *
 * @cssprop --bq-dialog--background - Dialog background color
 * @cssprop --bq-dialog--background-backdrop - Dialog backdrop background color
 * @cssprop --bq-dialog--box-shadow - Dialog box shadow
 * @cssprop --bq-dialog--border-color - Dialog border color
 * @cssprop --bq-dialog--border-style - Dialog border style
 * @cssprop --bq-dialog--border-width - Dialog border width
 * @cssprop --bq-dialog--border-radius - Dialog border radius
 * @cssprop --bq-dialog--padding - Dialog padding
 * @cssprop --bq-dialog--content-footer-gap - Dialog gap distance between content and footer elements
 * @cssprop --bq-dialog--title-body-gap - Dialog gap distance between title and body elements
 * @cssprop --bq-dialog--width-small - Dialog small width
 * @cssprop --bq-dialog--width-medium - Dialog medium width
 * @cssprop --bq-dialog--width-large - Dialog large width
 * @cssprop --bq-dialog-z-index - Dialog z-index applied when opened
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
  private closeSlotElem: HTMLElement;
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

  /** Border radius of the dialog component */
  @Prop({ reflect: true }) border: TDialogBorderRadius = 'm';

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
    this.closeSlotElem = this.el.shadowRoot.querySelector('slot[name="button-close"]');
    this.closeSlotElem?.addEventListener('click', () => this.hide());
  }

  disconnectedCallback() {
    this.closeSlotElem?.removeEventListener('click', () => this.hide());
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
  async handleKeyDown(ev: KeyboardEvent) {
    const isEscapeKey = ev.key === 'Escape' || ev.key === 'Esc';
    if (!this.open || !this.dialogElem || !isEscapeKey) return;

    if (this.disableCloseEscKeydown) {
      ev.preventDefault();
      return;
    }

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

  private handleClose = async () => {
    if (!this.dialogElem) return;

    await leave(this.dialogElem);
    this.dialogElem.close();
    // Emit bqAfterClose event after the dialog is closed
    this.handleTransitionEnd();
  };

  private handleOpen = async () => {
    if (!this.dialogElem) return;

    this.el.classList.add(this.OPEN_CSS_CLASS);
    // Show the dialog
    if (this.disableBackdrop) {
      this.dialogElem.show();
    } else {
      this.dialogElem.showModal();
    }
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
    const style = {
      ...(this.border && { '--bq-dialog--border-radius': `var(--bq-radius--${this.border})` }),
    };

    return (
      <dialog
        style={style}
        class={{
          [`bq-dialog hidden ${this.size} m-auto focus-visible:outline-none`]: true,
          'inset-be-[50%] inset-bs-[50%]': this.disableBackdrop,
        }}
        data-transition-enter="transition ease-in duration-300"
        data-transition-enter-start="opacity-0 scale-90"
        data-transition-enter-end="opacity-100 scale-100"
        data-transition-leave="transition ease-out duration-300"
        data-transition-leave-start="opacity-100 scale-100"
        data-transition-leave-end="opacity-0 scale-90"
        inert={this.open ? undefined : true}
        ref={(dialogElem) => (this.dialogElem = dialogElem)}
        aria-modal="true"
        aria-labelledby="bq-dialog--title"
        part="dialog"
      >
        <main class="flex flex-col gap-[--bq-dialog--title-body-gap] overflow-hidden" part="content">
          <header class="bq-dialog--header" part="header">
            <div id="bq-dialog--title" class="bq-dialog--title flex flex-1 items-center justify-between" part="title">
              <slot name="title" />
            </div>
            <slot name="button-close">
              {!this.hideCloseButton && (
                <bq-button class="bq-dialog--close" appearance="text" size="small">
                  <bq-icon class="cursor-pointer" name="x" role="img" title="Close" />
                </bq-button>
              )}
            </slot>
          </header>
          <div
            class={{
              '!hidden': !this.hasContent,
              'overflow-y-auto p-i-[--bq-dialog--padding]': this.hasContent,
              '!p-be-[--bq-dialog--padding]': !this.hasFooter,
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
            'bg-ui-alt !p-b-s': this.footerAppearance === 'highlight',
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
