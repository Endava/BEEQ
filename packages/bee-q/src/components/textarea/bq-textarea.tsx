import { h, Component, Element, Prop, State } from '@stencil/core';

@Component({
  tag: 'bq-textarea',
  styleUrl: './scss/bq-textarea.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqTextarea {
  // Own Properties
  // ====================

  private textarea: HTMLTextAreaElement;
  private fallbackId = 'textarea';

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqTextareaElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private numberOfCharacters: number = 0;

  // Public Property API
  // ========================

  /**
   * If `true`, the textarea will automatically grow and shrink to fit its contents.
   * If `false`, the textarea will have a fixed height specified by the `rows` property.
   */
  @Prop({ reflect: true }) autoGrow: boolean = false;

  /**
   * The maximum number of characters that can be entered into the textarea (`0`: no limit).
   * When enabled, a character counter will be shown underneath the textarea.
   */
  @Prop({ reflect: true }) maxlength: number;

  /** The name of the textarea element. */
  @Prop({ reflect: true }) name!: string;

  /** The placeholder text to show when there is no value. */
  @Prop({ reflect: true }) placeholder!: string;

  /** The number of visible text lines for the control. It must be a positive integer. */
  @Prop({ reflect: true }) rows: number = 5;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

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

  private autoResize = () => {
    if (!this.autoGrow) return;

    const inputElem = this.textarea;
    if (!inputElem) return;

    inputElem.style.height = 'auto';
    inputElem.style.height = `${inputElem.scrollHeight}px`;
  };

  private countCharacters = () => {
    if (!this.maxlength || !this.textarea) return;

    this.numberOfCharacters = this.textarea.value.length;
  };

  private onInput = () => {
    this.autoResize();
    this.countCharacters();
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-textarea flex flex-auto flex-col">
        <label
          class="bq-textarea--label mb-xs text-s font-regular leading-regular"
          htmlFor={this.name ?? this.fallbackId}
        >
          <slot name="label" />
        </label>
        <textarea
          id={this.name ?? this.fallbackId}
          class="bq-textarea--input"
          maxLength={this.maxlength > 0 ? this.maxlength : undefined}
          placeholder={this.placeholder}
          rows={this.rows}
          ref={(elem: HTMLTextAreaElement) => (this.textarea = elem)}
          onInput={this.onInput}
        />
        <div class="flex justify-between">
          <span class="bq-textarea--helper-text mt-xs">
            <slot name="helper-text" />
          </span>
          <span class={{ 'bq-textarea--counter mt-xs text-s text-text-secondary': true, '!hidden': !this.maxlength }}>
            {this.numberOfCharacters}/{this.maxlength}
          </span>
        </div>
      </div>
    );
  }
}
