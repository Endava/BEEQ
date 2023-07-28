import { h, Component, Element, Prop, State } from '@stencil/core';

import { TInputValidation } from '../input/bq-input.types';

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

  /** If `true`, the user cannot interact with the textarea. */
  @Prop({ reflect: true }) disabled: boolean = false;

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

  /**
   * The validation status of the input.
   *
   * @remarks
   * This property is used to indicate the validation status of the input. It can be set to one of the following values:
   * - `'none'`: No validation status is set.
   * - `'error'`: The input has a validation error.
   * - `'warning'`: The input has a validation warning.
   * - `'success'`: The input has passed validation.
   */
  @Prop({ reflect: true }) validationStatus: TInputValidation = 'none';

  /** The value of the textarea. It can be used to reset the input to a previous value. */
  @Prop({ mutable: true }) value: string;

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.numberOfCharacters = this.value?.length ?? 0;
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
        <label class="bq-textarea__label" htmlFor={this.name ?? this.fallbackId}>
          <slot name="label" />
        </label>
        <textarea
          id={this.name ?? this.fallbackId}
          class={{ 'bq-textarea__input': true, [`validation-${this.validationStatus}`]: true }}
          disabled={this.disabled}
          maxLength={this.maxlength > 0 ? this.maxlength : undefined}
          placeholder={this.placeholder}
          rows={this.rows}
          ref={(elem: HTMLTextAreaElement) => (this.textarea = elem)}
          onInput={this.onInput}
        >
          {this.value}
        </textarea>
        <div
          class={{
            'bq-textarea__helper flex items-center justify-between': true,
            [`validation-${this.validationStatus}`]: true,
          }}
        >
          <span class="bq-textarea__helper--text">
            <slot name="helper-text" />
          </span>
          <span class={{ 'bq-textarea__helper--counter': true, '!hidden': !this.maxlength }}>
            {this.numberOfCharacters}/{this.maxlength}
          </span>
        </div>
      </div>
    );
  }
}
