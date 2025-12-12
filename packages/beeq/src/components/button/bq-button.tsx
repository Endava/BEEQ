import type { EventEmitter } from '@stencil/core';
import { AttachInternals, Component, Element, Event, Host, h, Prop, State, Watch } from '@stencil/core';

import { hasSlotContent, isClient, isDefined, isNil, validatePropValue } from '../../shared/utils';
import type {
  TButtonAppearance,
  TButtonBorderRadius,
  TButtonSize,
  TButtonType,
  TButtonVariant,
} from './bq-button.types';
import { BUTTON_APPEARANCE, BUTTON_SIZE, BUTTON_TYPE, BUTTON_VARIANT } from './bq-button.types';

/**
 * Buttons are designed for users to take action on a page or a screen.
 *
 * @example How to use it
 * ```html
 * <bq-button appearance="primary" border="m" size="medium">
 *   <bq-icon name="arrow-circle-left" slot="prefix"></bq-icon>
 *   Go back
 * </bq-button>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/286b43-buttons
 * @status stable
 *
 * @dependency bq-icon
 *
 * @attr {"primary" | "secondary" | "link" | "text"} appearance - The appearance style to apply to the button
 * @attr {boolean} block - If `true`, it will make the button fit to its parent width.
 * @attr {string} border - The corner radius of the button
 * @attr {boolean} disabled - If `true`, the button will be disabled (no interaction allowed)
 * @attr {string} download - Tells the browser to treat the linked URL as a download. Only used when `href` is set.
 * @attr {string} href - When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`
 * @attr {"left" | "center" | "right"} justify-content - It determinate how the content should be aligned
 * @attr {boolean} loading - If `true` it will display the button in a loading state
 * @attr {boolean} only-icon - If `true` it will display the button as an icon-only button with aspect ratio 1:1 (square dimensions)
 * @attr {"small" | "medium" | "large"} size - The size of the button
 * @attr {"_blank" | "_parent" | "_self" | "_top"} target - Where to display the linked URL, as the name for a browsing context (a `tab`, `window`, or `<iframe>`)
 * @attr {"button" | "submit" | "reset"} type - The default behavior of the button
 * @attr {"standard" | "ghost" | "danger"} variant - The variant of button to apply on top of the appearance (applicable only to `appearance="primary"`)
 *
 * @event bqBlur - Handler to be called when the button loses focus
 * @event bqFocus - Handler to be called when button gets focus
 * @event bqClick - Handler to be called when the button is clicked
 *
 * @slot prefix - The prefix content to be displayed before the button label
 * @slot - The button label content
 * @slot suffix - The suffix content to be displayed after the button label
 *
 * @part button - The `<a>` or `<button>` HTML element used under the hood.
 * @part prefix - The `<span>` tag element that acts as prefix container.
 * @part label - The `<span>` tag element that renders the text of the button.
 * @part suffix - The `<span>` tag element that acts as suffix container.
 *
 * @cssprop --bq-button--border-color - Button border color
 * @cssprop --bq-button--border-radius - Button border radius
 * @cssprop --bq-button--border-style - Button border style
 * @cssprop --bq-button--border-width - Button border width
 * @cssprop --bq-button--small-paddingX - Button small padding block (top and bottom)
 * @cssprop --bq-button--small-paddingY - Button small padding inline (left and right)
 * @cssprop --bq-button--small-font-size - Button small font size
 * @cssprop --bq-button--medium-paddingX - Button medium padding block (top and bottom)
 * @cssprop --bq-button--medium-paddingY - Button medium padding inline (left and right)
 * @cssprop --bq-button--medium-font-size - Button medium font size
 * @cssprop --bq-button--large-paddingX - Button large padding block (top and bottom)
 * @cssprop --bq-button--large-paddingY - Button large padding inline (left and right)
 * @cssprop --bq-button--large-font-size - Button large font size
 */
@Component({
  tag: 'bq-button',
  styleUrl: './scss/bq-button.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqButton {
  // Own Properties
  // ====================

  private prefixElem: HTMLElement;
  private suffixElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqButtonElement;
  @AttachInternals() internals!: ElementInternals;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasPrefix = false;
  @State() private hasSuffix = false;

  // Public Property API
  // ========================

  /** The appearance style to apply to the button */
  @Prop({ reflect: true }) appearance?: TButtonAppearance = 'primary';

  /** If `true`, it will make the button fit to its parent width. */
  @Prop({ reflect: true }) block?: boolean = false;

  /** The corner radius of the button */
  @Prop({ reflect: true }) border?: TButtonBorderRadius = 'm';

  /** If true, the button will be disabled (no interaction allowed) */
  @Prop() disabled?: boolean = false;

  /**
   * Tells the browser to treat the linked URL as a download. Only used when `href` is set.
   * Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download
   */
  @Prop() download?: string;

  /** When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>` */
  @Prop({ reflect: true }) href?: string;

  /** It determinate how the content should be aligned */
  @Prop({ reflect: true }) justifyContent?: 'left' | 'center' | 'right' = 'center';

  /** If `true` it will display the button in a loading state */
  @Prop() loading?: boolean = false;

  /** If `true` it will display the button as an icon-only button with aspect ratio 1:1 (square dimensions) */
  @Prop() onlyIcon?: boolean = false;

  /** The size of the button */
  @Prop({ reflect: true }) size?: TButtonSize = 'medium';

  /**
   * Where to display the linked URL, as the name for a browsing context (a `tab`, `window`, or `<iframe>`)
   * Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
   */
  @Prop({ reflect: true }) target?: '_blank' | '_parent' | '_self' | '_top';

  /** The default behavior of the button */
  @Prop({ reflect: true }) type?: TButtonType = 'button';

  /** The variant of button to apply on top of the appearance (applicable only to `appearance="primary"`) */
  @Prop({ reflect: true }) variant?: TButtonVariant = 'standard';

  // Prop lifecycle events
  // =======================

  @Watch('appearance')
  @Watch('type')
  @Watch('size')
  @Watch('variant')
  checkPropValues() {
    validatePropValue(BUTTON_APPEARANCE, 'primary', this.el, 'appearance');
    validatePropValue(BUTTON_TYPE, 'button', this.el, 'type');
    validatePropValue(BUTTON_SIZE, 'medium', this.el, 'size');
    validatePropValue(BUTTON_VARIANT, 'standard', this.el, 'variant');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the button loses focus. */
  @Event() bqBlur: EventEmitter<HTMLBqButtonElement>;

  /** Handler to be called when the button gets focus. */
  @Event() bqFocus: EventEmitter<HTMLBqButtonElement>;

  /** Handler to be called when the button is clicked. */
  @Event() bqClick: EventEmitter<HTMLBqButtonElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
  }

  componentDidLoad() {
    this.handleSlotChange();
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
    const { disabled, loading, bqClick, el } = this;

    if (disabled || loading) {
      this.preventEvent(ev);
      return;
    }

    const bqClickEvent = bqClick.emit(el);
    if (bqClickEvent.defaultPrevented) {
      this.preventEvent(ev);
      return;
    }

    this.handleFormAction();
  };

  private handleFormAction() {
    const {
      type,
      internals: { form },
    } = this;
    if (isNil(form)) return;

    const formAction = this.formActions(form)[type];
    if (isNil(formAction)) return;

    formAction();
  }

  private formActions = (form: HTMLFormElement) => ({
    submit: () => this.submitAssociatedForm(form),
    reset: () => form.reset(),
  });

  private submitAssociatedForm = (form: HTMLFormElement) => {
    if (!isClient() || isNil(form)) return;

    const btn = document.createElement('button');
    btn.type = this.type;
    btn.hidden = true;
    form.append(btn);

    btn.click();
    btn.remove();
  };

  private handleSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
  };

  private preventEvent(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const isLink = isDefined(this.href);
    const TagElem = isLink ? 'a' : 'button';
    const style = {
      ...(this.border && { '--bq-button--border-radius': `var(--bq-radius--${this.border})` }),
    };

    return (
      <Host style={style}>
        <TagElem
          aria-disabled={this.disabled ? 'true' : 'false'}
          class={{
            'bq-button': true,
            [`bq-button--${this.appearance}`]: true,
            [`content-${this.justifyContent}`]: true,
            [`${this.variant}`]: true,
            [`${this.size}`]: true,
            block: this.block,
            disabled: this.disabled,
            'has-prefix': this.hasPrefix,
            'has-suffix': this.hasSuffix,
            loading: this.loading,
            'only-icon': this.onlyIcon,
          }}
          disabled={this.disabled}
          download={isLink ? this.download : undefined}
          href={isLink ? this.href : undefined}
          onBlur={this.handleBlur}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          part="button"
          rel={isLink && this.target ? 'noreferrer noopener' : undefined}
          tabIndex={this.disabled ? -1 : 0}
          target={isLink ? this.target : undefined}
          type={this.type}
        >
          <span
            class="bq-button__prefix"
            part="prefix"
            ref={(spanElem) => {
              this.prefixElem = spanElem;
            }}
          >
            <slot name="prefix" onSlotchange={this.handleSlotChange} />
          </span>
          <span class="bq-button__label" part="label">
            <slot />
          </span>
          <span
            class="bq-button__suffix"
            part="suffix"
            ref={(spanElem) => {
              this.suffixElem = spanElem;
            }}
          >
            <slot name="suffix" onSlotchange={this.handleSlotChange} />
          </span>
          {this.loading && <bq-icon class="bq-button__loader" name="spinner-gap" />}
        </TagElem>
      </Host>
    );
  }
}
