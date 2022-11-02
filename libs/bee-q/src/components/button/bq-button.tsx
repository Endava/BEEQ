import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { hasSlotContent, isDefined, validatePropValue } from '../../shared/utils';
import {
  BUTTON_APPEARANCE,
  BUTTON_SIZE,
  BUTTON_TYPE,
  BUTTON_VARIANT,
  TButtonAppearance,
  TButtonSize,
  TButtonType,
  TButtonVariant,
} from './bq-button.types';

/**
 * Buttons are designed for users to take action on a page or a screen.
 *
 * @part button - The HTML button used under the hood.
 * @part prefix - The `<span>` tag element that acts as prefix container.
 * @part label - The `<span>` tag element that renderd the text of the button.
 * @part suffix - The `<span>` tag element that acts as suffix container.
 */
@Component({
  tag: 'bq-button',
  styleUrl: './scss/bq-button.scss',
  shadow: true,
})
export class BqButton {
  // Own Properties
  // ====================

  private prefixElem: HTMLElement;
  private suffixElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqButtonElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasPrefix = false;
  @State() private hasSuffix = false;

  // Public Property API
  // ========================

  /** The appearance style to apply to the button */
  @Prop({ reflect: true }) appearance: TButtonAppearance = 'primary';

  /** If true, the button will be disabled (no interaction allowed) */
  @Prop() disabled = false;

  /**
   * Tells the browser to treat the linked URL as a download. Only used when `href` is set.
   * Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download
   */
  @Prop() download?: string;

  /** When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>` */
  @Prop({ reflect: true }) href: string;

  /** If `true` it will display the button in a loading state */
  @Prop() loading = false;

  /** The size of the button */
  @Prop({ reflect: true }) size: TButtonSize = 'medium';

  /**
   * Where to display the linked URL, as the name for a browsing context (a `tab`, `window`, or `<iframe>`)
   * Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
   */
  @Prop({ reflect: true }) target: '_blank' | '_parent' | '_self' | '_top';

  /** The default behavior of the button */
  @Prop({ reflect: true }) type: TButtonType = 'button';

  /** The variant of button to apply on top of the appearance */
  @Prop({ reflect: true }) variant: TButtonVariant = 'standard';

  // Prop lifecycle events
  // =======================

  @Watch('appearance')
  @Watch('type')
  @Watch('size')
  @Watch('variant')
  checkPropValues() {
    validatePropValue(BUTTON_APPEARANCE, 'primary', this.appearance, this.el, 'appearance');
    validatePropValue(BUTTON_TYPE, 'button', this.type, this.el, 'type');
    validatePropValue(BUTTON_SIZE, 'medium', this.size, this.el, 'size');
    validatePropValue(BUTTON_VARIANT, 'standard', this.variant, this.el, 'variant');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the button loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqButtonElement>;

  /** Handler to be called when the button is clicked */
  @Event() bqFocus: EventEmitter<HTMLBqButtonElement>;

  /** Handler to be called when button gets focus */
  @Event() bqClick: EventEmitter<HTMLBqButtonElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

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

  private handleBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handleFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleClick = (ev: Event) => {
    if (this.disabled || this.loading) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    this.bqClick.emit(this.el);
  };

  private handleSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const isLink = isDefined(this.href);
    const TagElem = isLink ? 'a' : 'button';

    return (
      <TagElem
        class={{
          'bq-button': true,
          [`bq-button--${this.appearance}`]: true,
          [`${this.variant}`]: true,
          [`${this.size}`]: true,
          disabled: this.disabled,
          'has-prefix': this.hasPrefix,
          'has-suffix': this.hasSuffix,
          loading: this.loading,
        }}
        aria-disabled={this.disabled ? 'true' : 'false'}
        disabled={this.disabled}
        download={isLink ? this.download : undefined}
        href={isLink ? this.href : undefined}
        part="button"
        rel={isLink && this.target ? 'noreferrer noopener' : undefined}
        target={isLink ? this.target : undefined}
        type={this.type}
        tabIndex={0}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onClick={this.handleClick}
      >
        <span class="bq-button__prefix" ref={(spanElem) => (this.prefixElem = spanElem)} part="prefix">
          <slot name="prefix" onSlotchange={this.handleSlotChange} />
        </span>
        <span class="bq-button__label" part="label">
          <slot />
        </span>
        <span class="bq-button__suffix" ref={(spanElem) => (this.suffixElem = spanElem)} part="suffix">
          <slot name="suffix" onSlotchange={this.handleSlotChange} />
        </span>
        {this.loading && (
          <bq-icon class="bq-button__loader" name="spinner-gap" role="img" title={`${this.appearance} button loader`} />
        )}
      </TagElem>
    );
  }
}
