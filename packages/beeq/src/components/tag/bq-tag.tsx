import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';

import {
  SIZE_TO_VALUE_MAP,
  TAG_COLORS,
  TAG_SIZE,
  TAG_TYPE,
  TAG_VARIANT,
  TTagSize,
  TTagType,
  TTagVariant,
} from './bq-tag.types';
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

  /** The type of the tag component */
  @Prop({ reflect: true }) size: TTagSize = 'medium';

  /** If true, the tag component has color style */
  @Prop({ reflect: true }) hasColor: boolean;

  /** If true, the tag component can be removed */
  @Prop({ reflect: true }) removable: boolean;

  /** If true, the tag component will be shown */
  @Prop({ reflect: true, mutable: true }) open: boolean;

  /** The default type of the tag component */
  @Prop({ reflect: true }) type: TTagType = 'default';

  /** The variant of tag to apply on top of the variant */
  @Prop({ reflect: true }) variant: TTagVariant = 'default';

  /** If true, the button will be disabled (no interaction allowed) */
  @Prop({ reflect: true }) disabled?: boolean = false;

  /** If true, the option is selected and active */
  @Prop({ reflect: true }) selected: boolean = false;

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
    const ev = this.bqHide.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = false;
    }
  };

  private handleShow = () => {
    const ev = this.bqShow.emit(this.el);
    if (!ev.defaultPrevented) {
      this.open = true;
    }
  };

  private handleClick = () => {
    if (this.removable) return;

    const ev = this.bqClick.emit(this.el);
    if (!ev.defaultPrevented) {
      this.selected = !this.selected;
    }
  };

  private handleFocus = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.bqFocus.emit(this.el);
  };

  private get iconSize(): number {
    return SIZE_TO_VALUE_MAP[this.size] || SIZE_TO_VALUE_MAP.medium;
  }

  private get tagColor(): (type: TTagType, variant: TTagVariant) => string {
    return (type, variant) => TAG_COLORS[type][variant];
  }

  private handleOnKeyDown = (event: KeyboardEvent) => {
    this.bqKeyDown.emit(event);
  };

  private handleSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host
        class={{ 'is-hidden': !this.open }}
        aria-hidden={!this.open ? 'true' : 'false'}
        hidden={!this.open ? 'true' : 'false'}
      >
        <button
          class={{
            'bq-tag gap-xs rounded-s px-s py-xs2 font-medium leading-regular': true,
            active: !this.disabled && this.selected,
            'gap-xs2 rounded-xs px-xs py-xs3': this.size !== 'medium',
            [`bq-tag__${this.type}__${this.variant}`]: this.hasColor,
          }}
          disabled={this.disabled}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onKeyDown={this.handleOnKeyDown}
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
          {this.removable && !this.disabled && (
            <bq-button class="bq-tag__close" appearance="text" size="small" onClick={this.handleHide} part="btn-close">
              <bq-icon
                size={this.iconSize}
                name="x-circle"
                color={this.hasColor ? this.tagColor(this.type, this.variant) : undefined}
              />
            </bq-button>
          )}
        </button>
      </Host>
    );
  }
}
