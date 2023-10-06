import { Component, Element, Event, EventEmitter, h, Listen, Prop, Watch } from '@stencil/core';

import { STEPS_SIZE, STEPS_TYPE, TStepsSize, TStepsType } from './bq-steps.types';
import { validatePropValue } from '../../shared/utils';

/**
 * @part container - The container wrapper of the Steps component
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
  @Prop({ reflect: true }) dividerColor: string = 'ui--secondary';

  /** The size of the steps */
  @Prop({ reflect: true }) size: TStepsSize = 'medium';

  /** The type of prefix element to use on the step items */
  @Prop({ reflect: true }) type: TStepsType;

  // Prop lifecycle events
  // =======================

  @Watch('type')
  @Watch('size')
  checkPropValues() {
    validatePropValue(STEPS_SIZE, 'medium', this.el, 'size');
    validatePropValue(STEPS_TYPE, 'numeric', this.el, 'type');

    this.setStepItemProps();
  }
  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the tab value changes */
  @Event() bqChange: EventEmitter<{ target: HTMLBqStepItemElement; value: string }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentDidLoad() {
    this.setStepItemProps();
  }

  // Listeners
  // ==============

  @Listen('bqClick')
  onBqStepItemChange(event: CustomEvent<{ target: HTMLBqStepItemElement; value: string }>) {
    this.bqChange.emit(event.detail);
  }

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

  private get bqSteps(): HTMLBqStepItemElement[] {
    if (!this.stepElem) return [];

    const slot = this.stepElem.querySelector('slot');
    return [...slot.assignedElements({ flatten: true })].filter(
      (el: HTMLBqSideMenuItemElement) => el.tagName.toLowerCase() === 'bq-step-item',
    ) as [HTMLBqSideMenuItemElement];
  }

  private setStepItemProps = () => {
    this.bqSteps.forEach((bqStepElem: HTMLBqStepItemElement) => {
      bqStepElem.size = this.size;
      bqStepElem.type = this.type;
    });
  };

  // private handleChange = (event) => {
  //   this.bqChange.emit(event);
  // }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const dividerPaddingTop = this.size === 'small' ? 'pt-s' : 'pt-m';

    return (
      <div
        class="relative flex w-full items-start justify-between"
        ref={(div) => (this.stepElem = div)}
        part="container"
      >
        <slot />
        <bq-divider
          class={`absolute left-0 right-0 -z-10 px-s ${dividerPaddingTop}`}
          stroke-color={this.dividerColor}
        />
      </div>
    );
  }
}
