import { Component, Element, Method, Prop, Watch } from '@stencil/core';

import { validatePropValue } from '../../shared/utils';
import type { TStepsOrientation, TStepsSize, TStepsType } from './bq-steps.types';
import { STEPS_ORIENTATION, STEPS_SIZE, STEPS_TYPE } from './bq-steps.types';

/**
 * The Steps Component is a UI element used to display a series of steps or stages in a process or task.
 * It is used to guide users through a process or task and to indicate their progress.
 *
 * @example How to use it
 * ```html
 * <bq-steps divider-color="stroke--primary" type="dot" size="medium">
 *   <bq-step-item status="completed"> ... </bq-step-item>
 *   <bq-step-item status="error"> ... </bq-step-item>
 *   <bq-step-item status="current"> ... </bq-step-item>
 *   <bq-step-item status="default"> ... </bq-step-item>
 * </bq-steps>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/896b66-stepper
 * @status stable
 *
 * @dependency bq-divider
 *
 * @attr {string} divider-color - The color of the line that connects the steps. It should be a valid declarative color token.
 * @attr {"horizontal" | "vertical"} orientation - The orientation of the steps
 * @attr {"medium" | "small"} size - The size of the steps
 * @attr {"numeric" | "icon" | "dot"} type - The type of prefix element to use on the step items
 *
 * @slot - The step items
 *
 * @part container - The container wrapper of the Steps component
 * @part divider-base - The base wrapper of the divider component
 * @part divider-dash-start - The dash start wrapper of the divider component
 * @part divider-dash-end - The dash end wrapper of the divider component
 *
 * @cssprop --bq-steps--divider-color - Divider color
 * @cssprop --bq-steps--gap - Gap between steps
 */
@Component({
  tag: 'bq-steps',
  styleUrl: './scss/bq-steps.scss',
  shadow: true,
})
export class BqSteps {
  // Own Properties
  // ====================

  private stepElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqStepsElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The color of the line that connects the steps. It should be a valid declarative color token. */
  @Prop({ reflect: true }) dividerColor: string = 'stroke--primary';

  /** The orientation of the steps */
  @Prop({ reflect: true }) orientation: TStepsOrientation = 'horizontal';

  /** The size of the steps */
  @Prop({ reflect: true }) size: TStepsSize = 'medium';

  /** The type of prefix element to use on the step items */
  @Prop({ reflect: true }) type: TStepsType;

  // Prop lifecycle events
  // =======================

  @Watch('dividerColor')
  @Watch('orientation')
  @Watch('type')
  @Watch('size')
  checkPropValues() {
    validatePropValue(STEPS_ORIENTATION, 'horizontal', this.el, 'orientation');
    validatePropValue(STEPS_SIZE, 'medium', this.el, 'size');
    validatePropValue(STEPS_TYPE, 'numeric', this.el, 'type');

    this.setStepItemProps();
  }
  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.setStepItemProps();
  }

  // Listeners
  // ==============

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /**
   * Set the current step item.
   * @param newCurrentStep - The step item to set as current.
   */
  @Method()
  async setCurrentStepItem(newCurrentStep: HTMLBqStepItemElement): Promise<void> {
    // Ideally, only one step item should be current.
    // So we change the status of the current step item to default.
    const currentStep = this.bqSteps.find((step: HTMLBqStepItemElement) => step.status === 'current');
    if (currentStep) currentStep.status = 'default';
    // And then we set the status of the new current step item to current.
    newCurrentStep.status = 'current';
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private get bqSteps(): HTMLBqStepItemElement[] {
    if (!this.stepElem) return [];

    const slot = this.stepElem.querySelector('slot');
    return [...slot.assignedElements({ flatten: true })].filter(
      (el: HTMLBqStepItemElement) => el.tagName.toLowerCase() === 'bq-step-item',
    ) as [HTMLBqStepItemElement];
  }

  private setStepItemProps = () => {
    this.bqSteps.forEach((bqStepElem: HTMLBqStepItemElement) => {
      bqStepElem.isLast = bqStepElem === this.lastStepItem;
      bqStepElem.dividerColor = this.dividerColor;
      bqStepElem.orientation = this.orientation;
      bqStepElem.size = this.size;
      bqStepElem.type = this.type;
    });
  };

  private get lastStepItem(): HTMLBqStepItemElement | undefined {
    return this.bqSteps.at(-1);
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        class={{
          'relative inline-flex items-start justify-between': true,
          'is-full flex-row': this.orientation === 'horizontal',
          'bs-full flex-col': this.orientation === 'vertical',
        }}
        part="container"
        role="list"
        ref={(div) => {
          this.stepElem = div;
        }}
      >
        <slot />
      </div>
    );
  }
}
