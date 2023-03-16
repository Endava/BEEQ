import { h, Component, Prop, Element, Watch } from '@stencil/core';

import { validatePropValue } from '../../shared/utils';
import { DIALOG_SIZE, DIALOG_FOOTER_VARIANT, TDialogSize, TDialogFooterVariant } from './bq-dialog.types';

@Component({
  tag: 'bq-dialog',
  styleUrl: './scss/bq-dialog.scss',
  shadow: true,
})
export class BqDialog {
  // Own Properties
  // ====================

  private dialogElement: HTMLDivElement;

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqDialogElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The size of the dialog */
  @Prop({ reflect: true, mutable: true }) size: TDialogSize = 'medium';

  /** The variant of button to apply on top of the appearance */
  @Prop({ reflect: true }) variant: TDialogFooterVariant = 'standard';

  // Prop lifecycle events
  // =======================
  @Prop() isOpen = false;

  @Watch('size')
  @Watch('variant')
  checkPropValues() {
    validatePropValue(DIALOG_SIZE, 'medium', this.el, 'size');
    validatePropValue(DIALOG_FOOTER_VARIANT, 'standard', this.el, 'variant');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================
  componentDidLoad() {
    this.dialogElement = this.el.shadowRoot.querySelector('.dialog');
  }

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

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  openDialog() {
    this.dialogElement.style.display = 'block';
  }

  closeDialog() {
    this.dialogElement.style.display = 'none';
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div>
        <bq-button class="px-3 py-3 no-underline" appearance="primary" onClick={() => this.openDialog()}>
          Open Dialog
        </bq-button>
        <div class="dialog" style={{ display: 'none' }}>
          <div
            class={{
              'bq-dialog-container': true,
              [`size--${this.size}`]: true,
            }}
          >
            <header>
              <bq-icon
                class="h-5 w-5 pl-1 pt-1"
                name="info"
                color="text--accent"
                role="img"
                title="Info"
                part="icon-on"
              />
              <h3>
                <slot name="title" />
              </h3>
              <bq-icon
                class="float-right pl-1 pt-1"
                name="x"
                role="img"
                title="Close"
                part="icon-on"
                onClick={() => this.closeDialog()}
              />
            </header>
            <div class="content">
              <slot name="content" />
            </div>
            <footer
              class={{
                [`${this.variant}`]: true,
              }}
            >
              <slot name="buttons" />
            </footer>
          </div>
        </div>
      </div>
    );
  }
}
