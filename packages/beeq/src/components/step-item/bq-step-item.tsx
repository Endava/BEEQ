import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, h, Prop, Watch } from '@stencil/core';

import { isHTMLElement, validatePropValue } from '../../shared/utils';
import type { TStepsSize, TStepsType } from '../steps/bq-steps.types';
import { STEPS_SIZE } from '../steps/bq-steps.types';
import type { TStepItemStatus } from './bq-step-item.types';
import { STEP_ITEM_STATUS } from './bq-step-item.types';

/**
 * The Step Item Component is a UI element used to display a single step or stage in a process or task.
 * It should be used inside the Steps component.
 *
 * @example How to use it
 * ```html
 * <bq-step-item status="completed">
 *   <bq-icon slot="prefix" name="check-circle"></bq-icon>
 *   <span>Title</span>
 *   <span slot="description">Description</span>
 * </bq-step-item>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/896b66-stepper
 * @status stable
 *
 * @attr {string} divider-color - The color of the line that connects the steps. It should be a valid declarative color token.
 * @attr {"small" | "medium"} size - It defines prefix size
 * @attr {"completed" | "current" | "error" | "default" | "disabled"} status - It defines step item appearance based on its status
 * @attr {"numeric" | "icon" | "dot"} type - It defines the step item type used
 *
 * @event bqClick - Callback handler emitted when the step item is clicked
 * @event bqFocus - Callback handler emitted when the step item is focused
 * @event bqBlur - Callback handler emitted when the step item loses focus
 *
 * @slot - The step item content
 * @slot prefix - The step item prefix
 * @slot description - The step item description
 *
 * @part base - The component's base wrapper.
 * @part title - The component's title.
 * @part description - The component's description.
 *
 * @cssprop --bq-step-item--prefix-color - Color of the prefix icon
 * @cssprop --bq-step-item--prefix-color-current - Color of the prefix icon when current
 * @cssprop --bq-step-item--prefix-color-completed - Color of the prefix icon when completed
 * @cssprop --bq-step-item--prefix-color-error - Color of the prefix icon when error
 * @cssprop --bq-step-item--prefix-num-size - Size of the prefix number
 * @cssprop --bq-step-item--prefix-num-bg-color - Background color of the prefix number
 */
@Component({
  tag: 'bq-step-item',
  styleUrl: './scss/bq-step-item.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqStepItem {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqStepItemElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The color of the line that connects the steps. It should be a valid declarative color token. */
  @Prop({ reflect: true }) dividerColor: string = 'stroke--primary';

  /** @internal It defines if the step item is the last one */
  @Prop({ reflect: true }) isLast?: boolean = false;

  /** It defines prefix size */
  @Prop({ reflect: true }) size?: TStepsSize = 'medium';

  /** It defines step item appearance based on its status */
  @Prop({ reflect: true, mutable: true }) status?: TStepItemStatus = 'default';

  /** It defines the step item type used */
  @Prop({ reflect: true }) type?: TStepsType;

  // Prop lifecycle events
  // =======================

  @Watch('size')
  @Watch('status')
  checkPropValues() {
    validatePropValue(STEPS_SIZE, 'medium', this.el, 'size');
    validatePropValue(STEP_ITEM_STATUS, 'default', this.el, 'status');

    this.handleIconPrefix();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler triggered when the step item is clicked */
  @Event() bqClick: EventEmitter<HTMLBqStepItemElement>;

  /** Callback handler triggered when the step item is focused */
  @Event() bqFocus: EventEmitter<HTMLBqStepItemElement>;

  /** Callback handler triggered when the step item loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqStepItemElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  connectedCallback() {
    this.checkPropValues();
  }

  componentWillLoad() {
    this.checkPropValues();
  }

  componentDidLoad() {
    this.handleIconPrefix();
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

  private handleFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handleClick = async () => {
    if (this.isDisabled || this.isCurrent) return;

    const clickEvent = this.bqClick.emit(this.el);
    if (clickEvent.defaultPrevented) return;

    const stepsParent = this.el.closest('bq-steps');
    if (!stepsParent) return;

    await stepsParent.setCurrentStepItem(this.el);
  };

  private handleIconPrefix = () => {
    const iconElem = this.el.querySelector('[slot="prefix"]');
    if (!iconElem || !isHTMLElement(iconElem, 'bq-icon')) return;

    iconElem.size = this.size === 'small' ? 24 : 32;
  };

  private get isDisabled(): boolean {
    return this.status === 'disabled';
  }

  private get isCurrent(): boolean {
    return this.status === 'current';
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="flex" role="listitem">
        <button
          class={{
            'bq-step-item': true,
            [`bq-step-item--${this.status}`]: true,
            'pointer-events-none opacity-60': this.isDisabled,
          }}
          disabled={this.isDisabled}
          onBlur={this.handleBlur}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          aria-current={this.isCurrent ? 'step' : undefined}
          type="button"
          part="base"
        >
          <div class={`bq-step-item__prefix relative ${this.type} ${this.size} ${this.status}`}>
            <slot name="prefix" onSlotchange={this.handleIconPrefix} />
          </div>
          <div class="bq-step-item__content items-start text-start">
            {/* TITLE */}
            <div
              class={{
                'bq-step-item__content--title pe-xs3 text-m text-primary leading-regular': true,
                'pointer-events-none': this.isDisabled,
                'text-brand': this.isCurrent,
              }}
              part="title"
            >
              <slot />
            </div>
            {/* DESCRIPTION */}
            <div
              class={{
                'bq-step-item__content--description text-s text-secondary leading-regular': true,
                'opacity-60': this.isDisabled,
              }}
              part="description"
            >
              <slot name="description" />
            </div>
          </div>
        </button>
        {!this.isLast && (
          // biome-ignore lint/a11y/noAriaHiddenOnFocusable: The <bq-divider> is not focusable and is only decorative
          <bq-divider
            class="[&::part(base)]:m-m"
            exportparts="base:divider-base,dash-start:divider-dash-start,dash-end:divider-dash-end"
            strokeColor={this.dividerColor}
            strokeThickness={2}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
}
