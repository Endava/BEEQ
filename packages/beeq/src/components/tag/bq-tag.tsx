import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, Watch } from '@stencil/core';

import { SIZE_TO_VALUE_MAP, TAG_SIZE, TAG_TYPE, TAG_VARIANT, TTagSize, TTagType, TTagVariant } from './bq-tag.types';
import { validatePropValue } from '../../shared/utils';
@Component({
  tag: 'bq-tag',
  styleUrl: './scss/bq-tag.scss',
  shadow: true,
})
export class BqTag {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqTagElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The type of the tag component */
  @Prop({ reflect: true }) size: TTagSize = 'medium';

  /** If true, the tag component has an icon */
  @Prop({ reflect: true }) hasIcon: boolean;

  /** If true, the tag component has color style */
  @Prop({ reflect: true }) hasColor: boolean;

  /** If true, the tag component can be removed */
  @Prop({ reflect: true }) isRemovable: boolean;

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

  private handleClick = (event: Event) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

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

  private handleOnKeyDown = (event: KeyboardEvent) => {
    this.bqKeyDown.emit(event);
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
        <div
          class={{
            'bq-tag': true,
            disabled: this.disabled,
            active: !this.disabled && this.selected,
            [`bq-tag__wrapper--${this.size} font-medium leading-regular`]: true,
            [`bq-tag__${this.type}__${this.variant}`]: this.hasColor,
          }}
          aria-selected={this.selected}
          aria-disabled={this.disabled}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onKeyDown={this.handleOnKeyDown}
          role="tab"
          part="wrapper"
          tabindex={this.disabled ? '-1' : '0'}
        >
          <div class={{ 'bq-tag__icon': true, '!hidden': !this.hasIcon }}>
            <slot name="icon">
              <bq-icon size={this.iconSize} name="star" part="icon" exportparts="base,svg" />
            </slot>
          </div>
          <div
            class={{
              'text-xs': this.size === 'extra_small',
              'text-s': this.size === 'small',
              'text-m': this.size === 'medium',
            }}
          >
            <slot name="tag" />
          </div>
          {this.isRemovable && !this.hasColor && !this.disabled && (
            <bq-button
              class="bq-tag__close"
              appearance="text"
              size="small"
              onClick={() => this.hide()}
              part="btn-close"
            >
              <bq-icon size={this.iconSize} name="x-circle" />
            </bq-button>
          )}
        </div>
      </Host>
    );
  }
}
