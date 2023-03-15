import { h, Component, Prop, Element, Watch } from '@stencil/core';

import { validatePropValue } from '../../shared/utils';
import { DIALOG_SIZE, TDialogSize } from './bq-dialog.types';

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

  // Prop lifecycle events
  // =======================
  @Prop() isOpen = false;

  @Watch('size')
  checkPropValues() {
    validatePropValue(DIALOG_SIZE, 'medium', this.el, 'size');
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
            <bq-icon
              class="h-5 w-5 pl-1 pt-1"
              name="info"
              color="text--accent"
              role="img"
              title="Info"
              part="icon-on"
            />
            <h3>
              <slot name="title"></slot>
            </h3>
            <div class="content">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
