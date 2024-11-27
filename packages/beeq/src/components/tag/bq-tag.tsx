import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';

import { TAG_COLOR, TAG_SIZE, TAG_VARIANT, TTagBorderRadius, TTagColor, TTagSize, TTagVariant } from './bq-tag.types';
import { iconSize, textColor } from './helper';
import { getColorCSSVariable, hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * The Tag Component is a UI element used to label and categorize content within an application.
 * Tags are commonly used to label items with keywords or categories, making it easier to find and organize content.
 *
 * @example How to use it
 * ```html
 * <bq-tag color="success" size="medium" variant="filled">Success</bq-tag>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/42f8c9-tag
 * @status stable
 *
 * @dependency bq-button
 * @dependency bq-icon
 *
 * @attr {string} border - The corner radius of the Tag (will override size's predefined border)
 * @attr {boolean} clickable - If `true`, the Tag can be clickable
 * @attr {"error" | "gray" | "info" | "success" | "warning"} color - The color style of the Tag
 * @attr {boolean} disabled - If `true`, the Tag will be disabled (only if clickable = `true`, no interaction allowed)
 * @attr {boolean} hidden - If `true`, the Tag component will hidden (only if removable = `true`)
 * @attr {boolean} removable - If `true`, the Tag component can be removed
 * @attr {boolean} selected - If `true`, the Tag is selected (only if clickable = `true`)
 * @attr {"xsmall" | "small" | "medium"} size - The size of the Tag component
 * @attr {"outline" | "filled"} variant - The variant of Tag to apply on top of the variant
 *
 * @method hide - Method to be called to remove the tag component
 * @method show - Method to be called to show the tag component
 *
 * @event bqClose - Callback handler to be called when the tag is close/hidden
 * @event bqOpen - Callback handler to be called when the tag is not open/shown
 * @event bqBlur - Handler to be called when tag loses focus
 * @event bqClick - Handler to be called when tag is clicked
 * @event bqFocus - Handler to be called when tag is focused
 *
 * @slot prefix - The prefix slot to add an icon or any other content before the text
 * @slot - The text content of the tag
 *
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM.
 * @part prefix - The `<span>` tag element that acts as prefix container (when icon exists in front of tag).
 * @part text - The `<div>` element containing the text of the tag component.
 * @part btn-close - The close button element to remove the tag component.
 *
 * @cssprop --bq-tag--background-color - Tag background color
 * @cssprop --bq-tag--border-color - Tag border color
 * @cssprop --bq-tag--border-radius - Tag border radius
 * @cssprop --bq-tag--border-style - Tag border style
 * @cssprop --bq-tag--border-width - Tag border width
 * @cssprop --bq-tag--small-border-radius - Tag small border radius
 * @cssprop --bq-tag--small-gap - Tag small gap between content
 * @cssprop --bq-tag--small-padding-x - Tag small padding horizontal
 * @cssprop --bq-tag--small-padding-y - Tag small padding vertical
 * @cssprop --bq-tag--medium-gap - Tag medium gap between content
 * @cssprop --bq-tag--medium-padding-x - Tag medium padding horizontal
 * @cssprop --bq-tag--medium-padding-y - Tag medium padding vertical
 */
@Component({
  tag: 'bq-tag',
  styleUrl: './scss/bq-tag.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqTag {
  // Own Properties
  // ====================

  private prefixElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqTagElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasPrefix = false;

  // Public Property API
  // ========================

  /** The corner radius of the Tag (will override size's predefined border) */
  @Prop({ reflect: true }) border: TTagBorderRadius;

  /** If true, the Tag can be clickable */
  @Prop({ reflect: true }) clickable: boolean = false;

  /** The color style of the Tag */
  @Prop({ reflect: true }) color: TTagColor;

  /** If true, the Tag will be disabled (only if clickable = `true`, no interaction allowed) */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** If true, the Tag component will hidden (only if removable = `true`) */
  @Prop({ reflect: true, mutable: true }) hidden: boolean;

  /** If true, the Tag component can be removed */
  @Prop({ reflect: true }) removable: boolean = false;

  /** If true, the Tag is selected (only if clickable = `true`) */
  @Prop({ reflect: true, mutable: true }) selected: boolean = false;

  /** The size of the Tag component */
  @Prop({ reflect: true }) size: TTagSize = 'medium';

  /** The variant of Tag to apply on top of the variant */
  @Prop({ reflect: true }) variant: TTagVariant = 'filled';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  @Watch('variant')
  checkPropValues() {
    validatePropValue(TAG_SIZE, 'medium', this.el, 'size');
    validatePropValue(TAG_VARIANT, 'filled', this.el, 'variant');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the tag is close/hidden  */
  @Event() bqClose: EventEmitter;

  /** Callback handler to be called when the tag is not open/shown */
  @Event() bqOpen: EventEmitter;

  /** Handler to be called when tag loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqTagElement>;

  /** Handler to be called when tag is clicked */
  @Event() bqClick: EventEmitter<HTMLBqTagElement>;

  /** Handler to be called when tag is focused */
  @Event() bqFocus: EventEmitter<HTMLBqTagElement>;

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

  /** Method to be called to remove the tag component */
  @Method()
  async hide(): Promise<void> {
    this.handleHide();
  }

  /** Method to be called to show the tag component */
  @Method()
  async show(): Promise<void> {
    this.handleShow();
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleHide = () => {
    if (!this.isRemovable) return;

    const ev = this.bqClose.emit(this.el);
    if (!ev.defaultPrevented) {
      this.hidden = true;
    }
  };

  private handleShow = () => {
    if (!this.isRemovable) return;

    const ev = this.bqOpen.emit(this.el);
    if (!ev.defaultPrevented) {
      this.hidden = false;
    }
  };

  private handleClick = () => {
    // If the tag is not clickable or the tag is disabled, we don't want to handle the click
    if (!this.isClickable || this.disabled) return;

    // Emit a click event on the element
    const ev = this.bqClick.emit(this.el);
    // If the event was not prevented, toggle the clickable state
    if (!ev.defaultPrevented) {
      this.selected = !this.selected;
    }
  };

  private handleBlur = () => {
    if (!this.isClickable) return;

    this.bqBlur.emit(this.el);
  };

  private handleFocus = () => {
    if (!this.isClickable) return;

    this.bqFocus.emit(this.el);
  };

  private handleSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
  };

  private get isClickable(): boolean {
    return this.clickable && !this.color && !this.hasCustomColor && !this.removable;
  }

  private get isRemovable(): boolean {
    return this.removable && !this.isClickable;
  }

  private get isHidden(): boolean {
    return this.isRemovable && this.hidden;
  }

  private get hasCustomColor(): boolean {
    return this.color !== undefined ? !TAG_COLOR.includes(this.color) : false;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const style = {
      '--bq-tag--icon-prefix-size': `${iconSize(this.size)}px`,
      ...(this.border && { '--bq-tag--border-radius': `var(--bq-radius--${this.border})` }),
      ...(this.color && { '--bq-tag--background-color': getColorCSSVariable(this.color) ?? this.color }),
      ...(this.hasCustomColor && { '--bq-text--primary': `var(--bq-text--alt)` }),
    };

    return (
      <Host style={style} aria-hidden={this.isHidden ? 'true' : 'false'} hidden={this.isHidden ? 'true' : 'false'}>
        <button
          class={{
            [`bq-tag bq-tag__${this.size}`]: true,
            [`bq-tag__${this.color || 'default'} bq-tag__${this.variant}`]: !this.hasCustomColor,
            'is-clickable': this.isClickable,
            'is-removable': this.removable,
            // Active/Selected state when clickable
            active: this.isClickable && this.selected,
            // Fixed border radius
            'has-border': !!this.border,
          }}
          disabled={this.disabled}
          onBlur={this.handleBlur}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          tabindex={this.isClickable ? 0 : -1}
          part="wrapper"
        >
          <span
            class={{ 'bq-tag__prefix inline-flex': true, '!hidden': !this.hasPrefix }}
            ref={(spanElem) => (this.prefixElem = spanElem)}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.handleSlotChange} />
          </span>
          <div
            class={{
              'text-xs': this.size === 'xsmall',
              'text-s': this.size === 'small',
              'text-m': this.size === 'medium',
            }}
            part="text"
          >
            <slot />
          </div>
          {this.isRemovable && !this.disabled && (
            <bq-button class="bq-tag__close" appearance="text" size="small" onClick={this.handleHide} part="btn-close">
              <bq-icon
                size={iconSize(this.size)}
                name="x-circle"
                color={this.color && !this.hasCustomColor ? textColor(this.color)[this.variant] : 'text--primary'}
              />
            </bq-button>
          )}
        </button>
      </Host>
    );
  }
}
