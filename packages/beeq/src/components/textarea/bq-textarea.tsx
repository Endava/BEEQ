import { AttachInternals, Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { TTextareaAutoCapitalize, TTextareaWrap } from './bq-textarea.types';
import { debounce, hasSlotContent, isHTMLElement, isNil, TDebounce } from '../../shared/utils';
import { TInputValidation } from '../input/bq-input.types';

/**
 * The Textarea component is a multi-line text input control that is often used in a form to collect user inputs like comments or reviews.
 *
 * @example How to use it
 * ```html
 * <bq-textarea maxlength="0" name="textarea" placeholder="Placeholder..." rows="5">
 *   <label slot="label">Label</label>
 *   <span class="flex items-center gap-xs" slot="helper-text">
 *     <bq-icon name="star"></bq-icon>
 *     Helper text
 *   </span>
 * </bq-textarea>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/16792c-textarea
 * @status stable
 *
 * @attr {string} autocapitalize - Controls whether or not the textarea field should be capitalized and how.
 * @attr {string} autocomplete - Specifies whether or not the textarea field should have autocomplete enabled.
 * @attr {string} autocorrect - Controls whether or not the textarea field should have autocorrect enabled.
 * @attr {boolean} autofocus - If `true`, the textarea will be focused on component render.
 * @attr {boolean} auto-grow - If `true`, the textarea will automatically grow and shrink to fit its contents.
 * @attr {number} debounce-time - The amount of time, in milliseconds, to wait before emitting the `bqInput` event after the textarea value changes.
 * @attr {boolean} disabled - If `true`, the user cannot interact with the textarea.
 * @attr {boolean} disable-resize - If `true`, it will block the user's ability to resize the textarea.
 * @attr {string} form - The ID of the form that the textarea field belongs to.
 * @attr {string} form-validation-message - The native form validation message.
 * @attr {number} maxlength - The maximum number of characters that can be entered into the textarea (`0`: no limit).
 * @attr {string} name - The name of the textarea element.
 * @attr {string} placeholder - The placeholder text to show when there is no value.
 * @attr {boolean} readonly - If `true`, the textarea field cannot be modified.
 * @attr {boolean} required - Indicates whether or not the textarea field is required to be filled out before submitting the form.
 * @attr {number} rows - The number of visible text lines for the control. It must be a positive integer.
 * @attr {boolean} spellcheck - If `true`, the textarea content may be checked for spelling errors.
 * @attr {"error" | "none" | "success" | "warning"} validation-status - The validation status of the textarea.
 * @attr {string} value - The value of the textarea. It can be used to reset the textarea to a previous value.
 * @attr {"soft" | "hard"} wrap - Specifies how the text in a text area is to be wrapped when submitted in a form.
 *
 * @event bqBlur - Handler to be called when the textarea loses focus.
 * @event bqChange - Handler to be called when the textarea value has changed and the textarea loses focus.
 * @event bqClear - Handler to be called when the textarea value has been cleared.
 * @event bqFocus - Handler to be called when the textarea has received focus.
 * @event bqInput - Handler to be called when the textarea value changes.
 *
 * @slot label - The textarea label.
 * @slot helper-text - The helper text.
 *
 * @part base - The component's base wrapper.
 * @part input - The textarea element.
 * @part label - The textarea label.
 * @part helper-info - The helper info container.
 * @part helper-text - The helper text.
 * @part helper-counter - The helper counter.
 *
 * @cssprop --bq-textarea--background-color - Textarea background color
 * @cssprop --bq-textarea--border-color - Textarea border color
 * @cssprop --bq-textarea--border-color-focus - Textarea border color on focus
 * @cssprop --bq-textarea--border-radius - Textarea border radius
 * @cssprop --bq-textarea--border-width - Textarea border width
 * @cssprop --bq-textarea--border-style - Textarea border style
 * @cssprop --bq-textarea--helper-margin-top - Textarea helper text margin top
 * @cssprop --bq-textarea--helper-text-color - Textarea helper text color
 * @cssprop --bq-textarea--helper-text-size - Textarea helper text size
 * @cssprop --bq-textarea--label-margin-bottom - Textarea label margin bottom
 * @cssprop --bq-textarea--label-text-color - Textarea label text color
 * @cssprop --bq-textarea--label-text-size - Textarea label text size
 * @cssprop --bq-textarea--paddingY - Textarea padding top and bottom
 * @cssprop --bq-textarea--padding-start - Textarea padding start
 * @cssprop --bq-textarea--padding-end - Textarea padding end
 * @cssprop --bq-textarea--text-color - Textarea text color
 * @cssprop --bq-textarea--text-size - Textarea text size
 * @cssprop --bq-textarea--text-placeholder-color - Textarea placeholder text color
 */
@Component({
  tag: 'bq-textarea',
  styleUrl: './scss/bq-textarea.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqTextarea {
  // Own Properties
  // ====================

  private debounceBqInput: TDebounce<void>;
  private fallbackId = 'textarea';

  private helperTextElem?: HTMLElement;
  private labelElem?: HTMLLabelElement;
  private textarea: HTMLTextAreaElement;

  // Reference to host HTML element
  // ===================================

  @AttachInternals() internals!: ElementInternals;
  @Element() el!: HTMLBqTextareaElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasHelperText = false;
  @State() private hasLabel = false;

  // Public Property API
  // ========================

  /**
   * Controls whether or not the textarea field should be capitalized and how.
   * Possible values are 'off', 'none', 'on', 'sentences', 'words', and 'characters'.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize
   */
  @Prop({ reflect: true }) autocapitalize: TTextareaAutoCapitalize = 'off';

  /**
   * Specifies whether or not the textarea field should have autocomplete enabled.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values
   */
  @Prop({ reflect: true }) autocomplete: string = 'off';

  /**
   * Controls whether or not the textarea field should have autocorrect enabled.
   * Possible values are 'on' and 'off'.
   */
  @Prop({ reflect: true }) autocorrect: 'on' | 'off' = 'off';

  /** If true, the textarea will be focused on component render */
  @Prop({ reflect: true }) autofocus: boolean;

  /**
   * If `true`, the textarea will automatically grow and shrink to fit its contents.
   * If `false`, the textarea will have a fixed height specified by the `rows` property.
   */
  @Prop({ reflect: true }) autoGrow: boolean = false;

  /**
   * The amount of time, in milliseconds, to wait before emitting the `bqInput` event after the textarea value changes.
   * A value of 0 means no debouncing will occur.
   */
  @Prop({ reflect: true, mutable: true }) debounceTime? = 0;

  /** If `true`, the user cannot interact with the textarea. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** If `true`, it will block the user's ability to resize the textarea. */
  @Prop({ reflect: true }) disableResize?: boolean = false;

  /** The ID of the form that the textarea field belongs to. */
  @Prop({ reflect: true }) form?: string;

  /** The native form validation message */
  @Prop({ mutable: true }) formValidationMessage?: string;

  /**
   * The maximum number of characters that can be entered into the textarea (`0`: no limit).
   * When enabled, a character counter will be shown underneath the textarea.
   */
  @Prop({ reflect: true }) maxlength: number;

  /** The name of the textarea element. */
  @Prop({ reflect: true }) name!: string;

  /** The placeholder text to show when there is no value. */
  @Prop({ reflect: true }) placeholder!: string;

  /** If true, the textarea field cannot be modified. */
  @Prop({ reflect: true }) readonly?: boolean = false;

  /** Indicates whether or not the textarea field is required to be filled out before submitting the form. */
  @Prop({ reflect: true }) required?: boolean = false;

  /** The number of visible text lines for the control. It must be a positive integer. */
  @Prop({ reflect: true }) rows: number = 5;

  /** If true, the textarea content may be checked for spelling errors. */
  @Prop({ reflect: true }) spellcheck: boolean = false;
  /**
   * The validation status of the textarea.
   *
   * @remarks
   * This property is used to indicate the validation status of the textarea. It can be set to one of the following values:
   * - `'none'`: No validation status is set.
   * - `'error'`: The textarea has a validation error.
   * - `'warning'`: The textarea has a validation warning.
   * - `'success'`: The textarea has passed validation.
   */
  @Prop({ reflect: true, mutable: true }) validationStatus: TInputValidation = 'none';

  /** The value of the textarea. It can be used to reset the textarea to a previous value. */
  @Prop({ mutable: true }) value: string = '';

  /** Specifies how the text in a text area is to be wrapped when submitted in a form */
  @Prop({ reflect: true }) wrap: TTextareaWrap = 'soft';

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValueChange() {
    if (!this.textarea) return;
    if (!this.maxlength || this.value?.length < this.maxlength) return;
    // If the value is longer than the maxlength, we need to truncate it
    this.value = this.value?.substring(0, this.maxlength);
    this.textarea.value = this.value;
  }

  @Watch('required')
  handleRequiredPropChange() {
    this.updateFormValidity();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler emitted when the textarea loses focus */
  @Event() bqBlur!: EventEmitter<HTMLBqTextareaElement>;

  /**
   * Callback handler emitted when the textarea value has changed and the textarea loses focus.
   * This handler is called whenever the user finishes typing or pasting text into the textarea field and then clicks outside of the textarea field.
   */
  @Event() bqChange!: EventEmitter<{ value: string; el: HTMLBqTextareaElement }>;

  /** Callback handler emitted when the textarea value has been cleared */
  @Event() bqClear!: EventEmitter<HTMLBqTextareaElement>;

  /** Callback handler emitted when the textarea has received focus */
  @Event() bqFocus!: EventEmitter<HTMLBqTextareaElement>;

  /**
   * Callback handler emitted when the textarea value changes.
   * This handler is called whenever the user types or pastes text into the textarea field.
   */
  @Event() bqInput!: EventEmitter<{ value: string; el: HTMLBqTextareaElement }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.handleValueChange();
  }

  formAssociatedCallback() {
    this.setFormValue(this.value);
    this.updateFormValidity();
  }

  formResetCallback() {
    this.clearSelection();
    // Reset the form validity state
    this.setFormValue();
    this.updateFormValidity();
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

  private get numberOfCharacters() {
    if (!this.maxlength || !this.textarea) return 0;

    return this.value?.length;
  }

  private handleBlur = () => {
    if (this.disabled) return;

    this.bqBlur.emit(this.el);
  };

  private handleFocus = () => {
    if (this.disabled) return;

    this.bqFocus.emit(this.el);
  };

  private handleChange = (ev: Event) => {
    if (this.disabled) return;

    if (!isHTMLElement(ev.target, 'textarea')) return;
    this.value = ev.target.value;
    this.setFormValue(this.value);
    this.updateFormValidity();

    this.bqChange.emit({ value: this.value, el: this.el });
  };

  private handleInput = (ev: Event) => {
    if (this.disabled) return;

    this.debounceBqInput?.cancel();

    if (!isHTMLElement(ev.target, 'textarea')) return;
    this.value = ev.target.value;

    this.debounceBqInput = debounce(() => {
      this.bqInput.emit({ value: this.value, el: this.el });
    }, this.debounceTime);
    this.debounceBqInput();

    this.autoResize();
  };

  private autoResize = () => {
    if (!this.autoGrow) return;

    const inputElem = this.textarea;
    if (!inputElem) return;

    inputElem.style.height = 'auto';
    inputElem.style.height = `${inputElem.scrollHeight}px`;
  };

  private handleLabelSlotChange = () => {
    this.hasLabel = hasSlotContent(this.labelElem);
  };

  private handleHelperTextSlotChange = () => {
    this.hasHelperText = hasSlotContent(this.helperTextElem);
  };

  private setFormValue = (value?: string) => {
    this.internals.setFormValue(!isNil(value) ? `${value}` : undefined);
  };

  private updateFormValidity = () => {
    const { formValidationMessage, internals, required, value, textarea } = this;

    // Clear the validity state
    internals?.states.clear();

    if (required && (!value || value.trim() === '')) {
      // Set validity state to invalid
      internals?.states.add('invalid');
      internals?.setValidity({ valueMissing: true }, formValidationMessage, textarea);
      return;
    }

    // Set validity state to valid if textarea has value or is not required
    internals?.states.add('valid');
    internals?.setValidity({});
  };

  private clearSelection = () => {
    this.value = '';
    this.textarea.value = this.value;
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="bq-textarea flex flex-auto flex-col" part="base">
        <label
          class={{ 'bq-textarea__label': true, '!hidden': !this.hasLabel }}
          htmlFor={this.name ?? this.fallbackId}
          aria-label={this.name ?? this.fallbackId}
          ref={(label: HTMLLabelElement) => (this.labelElem = label)}
          part="label"
        >
          <slot name="label" onSlotchange={this.handleLabelSlotChange} />
        </label>
        <textarea
          id={this.name ?? this.fallbackId}
          class={{
            'bq-textarea__input': true,
            'resize-none': this.disableResize,
            [`validation-${this.validationStatus}`]: true,
          }}
          autocapitalize={this.autocapitalize}
          autocomplete={this.autocomplete}
          autocorrect={this.autocorrect}
          autofocus={this.autofocus}
          disabled={this.disabled}
          form={this.form}
          maxLength={this.maxlength > 0 ? this.maxlength : undefined}
          name={this.name}
          placeholder={this.placeholder}
          readOnly={this.readonly}
          required={this.required}
          rows={this.rows}
          spellcheck={this.spellcheck}
          wrap={this.wrap}
          ref={(elem: HTMLTextAreaElement) => (this.textarea = elem)}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onInput={this.handleInput}
          part="input"
        >
          {this.value}
        </textarea>
        <div
          class={{
            'bq-textarea__helper flex items-center justify-between': true,
            [`validation-${this.validationStatus}`]: true,
            '!hidden': !this.hasHelperText && !this.maxlength,
          }}
          part="helper-info"
        >
          <span
            class="bq-textarea__helper--text"
            ref={(span: HTMLElement) => (this.helperTextElem = span)}
            part="helper-text"
          >
            <slot name="helper-text" onSlotchange={this.handleHelperTextSlotChange} />
          </span>
          <span class={{ 'bq-textarea__helper--counter': true, '!hidden': !this.maxlength }} part="helper-counter">
            {this.numberOfCharacters}/{this.maxlength}
          </span>
        </div>
      </div>
    );
  }
}
