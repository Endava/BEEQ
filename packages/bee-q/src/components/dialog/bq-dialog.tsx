import { h, Component, Prop, Element, Watch, State } from '@stencil/core';

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

  handleCloseClick = () => {
    this.isOpen = false;
  };

  handleOverlayClick = (event: MouseEvent) => {
    if (event.target === this.dialogElement) {
      this.isOpen = false;
    }
  };
  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div>
        <bq-button class="px-3 py-3 no-underline" appearance="primary" onClick={() => (this.isOpen = true)}>
          Open Dialog
        </bq-button>
        {this.isOpen && (
          <div
            class="overlay dialog fixed flex h-screen w-full items-center justify-center"
            onClick={this.handleOverlayClick}
            ref={(el) => (this.dialogElement = el)}
          >
            <div
              class={{
                'bq-dialog-container': true,
                [`size--${this.size}`]: true,
              }}
            >
              <header
                class={{
                  [`size-header--${this.size}`]: true,
                }}
              >
                <div class="bq-header flex">
                  <div class="bq-placeholder-info">
                    <slot name="info" />
                  </div>
                  <h3>
                    <div
                      class={{
                        [`size-title--${this.size}`]: true,
                      }}
                    >
                      <slot name="title" />
                    </div>
                  </h3>
                  <bq-icon
                    class="float-right pl-1 pt-1"
                    name="x"
                    role="img"
                    title="Close"
                    part="icon-on"
                    onClick={this.handleCloseClick}
                  />
                </div>
                <div class="bq-content-container">
                  <slot name="content" />
                </div>
              </header>
              <footer
                class={{
                  [`${this.variant}`]: true,
                }}
              >
                <slot name="buttons" />
              </footer>
            </div>
          </div>
        )}
      </div>
    );
  }
}
