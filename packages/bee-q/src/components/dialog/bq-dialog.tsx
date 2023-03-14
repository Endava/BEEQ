import { h, Component, Prop, Element } from '@stencil/core';

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

  // Prop lifecycle events
  // =======================
  @Prop() isOpen = false;

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================
  componentDidLoad() {
    this.dialogElement = this.el.shadowRoot.querySelector('.dialog');
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
          <div class="dialog-container">
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
