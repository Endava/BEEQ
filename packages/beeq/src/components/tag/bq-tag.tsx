import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';

import { TAG_SIZE, TAG_VARIANT, TTagColor, TTagSize, TTagVariant } from './bq-tag.types';
import { iconSize, textColor } from './helper';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM.
 * @part prefix - The `<span>` tag element that acts as prefix container (when icon exists in front of tag).
 * @part text - The `<div>` element containing the text of the tag component.
 */
@Component({
  tag: 'bq-tag',
  styleUrl: './scss/bq-tag.scss',
  shadow: true,
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

  /** The color style of the Tag */
  @Prop({ reflect: true }) color: TTagColor;

  /** The size of the Tag component */
  @Prop({ reflect: true }) size: TTagSize = 'medium';

  /** If true, the Tag component can be removed */
  @Prop({ reflect: true }) removable: boolean = false;

  /** If true, the Tag component will hidden (only if removable = `true`) */
  @Prop({ reflect: true, mutable: true }) hidden: boolean;

  /** The variant of Tag to apply on top of the variant */
  @Prop({ reflect: true }) variant: TTagVariant = 'filled';

  /** If true, the Tag will be disabled (only if clickable = `true`, no interaction allowed) */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** If true, the Tag can be clickable */
  @Prop({ reflect: true }) clickable: boolean = false;

  /** If true, the Tag is selected (only if clickable = `true`) */
  @Prop({ reflect: true, mutable: true }) selected: boolean = false;

  // Prop lifecycle events
  // =======================

  @Watch('size')
  @Watch('type')
  @Watch('variant')
  checkPropValues() {
    validatePropValue(TAG_SIZE, 'medium', this.el, 'size');
    validatePropValue(TAG_TYPE, 'default', this.el, 'type');
    validatePropValue(TAG_VARIANT, 'default', this.el, 'variant');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the tag is removable  */
  @Event() bqHide: EventEmitter;

  /** Callback handler to be called when the tag is not removable */
  @Event() bqShow: EventEmitter;

  /** Handler to be called when tag is clicked */
  @Event() bqClick: EventEmitter<HTMLBqTagElement>;

  /** Handler to be called when tag is focused */
  @Event() bqFocus: EventEmitter<HTMLBqTagElement>;

  /** Handler to be called when the tag key is pressed */
  @Event() bqKeyDown: EventEmitter<KeyboardEvent>;

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

  /** Method to be called to show the alert component */
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

    const ev = this.bqHide.emit(this.el);
    if (!ev.defaultPrevented) {
      this.hidden = true;
    }
  };

  private handleShow = () => {
    if (!this.isRemovable) return;

    const ev = this.bqShow.emit(this.el);
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

  private handleFocus = () => {
    if (!this.isClickable) return;

    this.bqFocus.emit(this.el);
  };

  private handleSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
  };

  private get isClickable(): boolean {
    return this.clickable && !this.color && !this.removable;
  }

  private get isRemovable(): boolean {
    return this.removable && !this.isClickable;
  }

  private get isHidden(): boolean {
    return this.isRemovable && this.hidden;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host aria-hidden={this.isHidden ? 'true' : 'false'} hidden={this.isHidden ? 'true' : 'false'}>
        <button
          class={{
            'bq-tag gap-xs rounded-s px-s py-xs2 font-medium leading-regular': true,
            [`bq-tag__${this.color || 'default'} bq-tag__${this.variant}`]: true,
            'is-clickable': this.isClickable,
            'is-removable': this.removable,
            // Active/Selected state when clickable
            active: this.isClickable && this.selected,
            // Size
            'gap-xs2 rounded-xs px-xs py-xs3': this.size !== 'medium',
          }}
          disabled={this.disabled}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          tabindex={this.isClickable ? 0 : -1}
          part="wrapper"
        >
          <span
            class={{ 'inline-flex': true, '!hidden': !this.hasPrefix }}
            ref={(spanElem) => (this.prefixElem = spanElem)}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.handleSlotChange} />
          </span>
          <div
            class={{
              'text-xs': this.size === 'extra_small',
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
                color={this.color ? textColor(this.color)[this.variant] : 'text--primary'}
              />
            </bq-button>
          )}
        </button>
      </Host>
    );
  }
}
