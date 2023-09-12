import { h, Component, Prop, Watch, Element, Event, EventEmitter } from '@stencil/core';

import { TStepItemStatus } from './bq-step-item.types';
import { validatePropValue } from '../../shared/utils';
import { STEPS_SIZE, STEPS_TYPE, TStepsSize, TStepsType } from '../steps/bq-steps.types';

@Component({
  tag: 'bq-step-item',
  styleUrl: './scss/bq-step-item.scss',
  shadow: true,
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
  /** It defines the type of steps */
  @Prop({ reflect: true }) type: TStepsType = 'numeric';

  /** Step number */
  @Prop({ reflect: true }) number?: number;

  /** It defines step item appearance based on its status */
  @Prop({ reflect: true }) status?: TStepItemStatus = 'default';

  /** It defines prefix size */
  @Prop({ reflect: true }) size?: TStepsSize = 'medium';

  /** It defines whether this step item is last in stepper */
  @Prop({ reflect: true }) isLast?: boolean = false;

  /** Step value */
  @Prop({ reflect: true }) value?: string = '';

  // Prop lifecycle events
  // =======================
  @Watch('type')
  @Watch('size')
  checkPropValues() {
    validatePropValue(STEPS_TYPE, 'numeric', this.el, 'type');
    validatePropValue(STEPS_SIZE, 'medium', this.el, 'size');
  }
  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================
  @Event() bqClick: EventEmitter<{ target: HTMLBqStepItemElement; value: string }>;

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

  handleClick = () => this.bqClick.emit({ target: this.el, value: this.value.toString() });

  getIconName = () => {
    if (this.status === 'completed') {
      return 'check-circle';
    }
    if (this.status === 'error') {
      return 'x-circle';
    }
    return 'circle';
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const avatarSize = this.size === 'medium' ? 'small' : 'xsmall';
    const iconSize = this.size === 'medium' ? 27 : 24;
    const isDisabled = this.status === 'disabled';
    const isCurrent = this.status === 'current';

    return (
      <div
        class={{
          flex: true,
          'bq-step-item': true,
          [`bq-step-item--${this.status}`]: true,
          'pointer-events-none': isDisabled,
        }}
        part="base"
        onClick={this.handleClick}
      >
        {this.type === 'numeric' ? (
          <bq-avatar class="px-2" shape="circle" size={avatarSize} initials={this.number?.toString()}></bq-avatar>
        ) : this.type === 'dot' ? (
          <bq-icon
            class="px-2"
            name={this.getIconName()}
            weight={this.status === 'current' ? 'fill' : 'regular'}
            size={iconSize}
          />
        ) : (
          <slot name="prefix"></slot>
        )}
        <div>
          <div
            part="title"
            class={{
              'pr-xs3 text-m': true,
              'pointer-events-none text-text-secondary-disabled': isDisabled,
              'text-text-brand': isCurrent,
            }}
          >
            <slot />
          </div>

          <div
            part="description"
            class={{
              'mt-1 text-s': true,
              'text-text-secondary': !isDisabled,
              'text-text-secondary-disabled': isDisabled,
            }}
          >
            <slot name="description" />
          </div>
        </div>
      </div>
    );
  }
}
