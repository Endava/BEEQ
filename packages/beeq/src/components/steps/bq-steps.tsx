import { h, Component, Element, Prop, Watch, Event, EventEmitter, Listen } from '@stencil/core';
import { validatePropValue } from '../../shared/utils';
import { STEPS_SIZE, STEPS_TYPE, TStepsSize, TStepsType } from './bq-steps.types';
// import { BqStepItem } from './step-item/bq-step-item';

@Component({
  // bq-stepper
  tag: 'bq-steps',
  styleUrl: './scss/bq-steps.scss',
  shadow: true,
})
export class BqSteps {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqStepsElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** It defines the type of steps */
  @Prop({ reflect: true }) type: TStepsType = 'numeric';

  @Prop({ reflect: true }) size: TStepsSize = 'medium';

  // Prop lifecycle events
  // =======================
  @Watch('type')
  checkPropValues() {
    validatePropValue(STEPS_TYPE, 'numeric', this.el, 'type');
    validatePropValue(STEPS_SIZE, 'medium', this.el, 'size');
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
    this.bqStepItemElements.forEach((bqStepItem: HTMLBqStepItemElement, index: number) => {
      bqStepItem.type = this.type;
      bqStepItem.number = index + 1;

      bqStepItem.size = this.size;
      bqStepItem.isLast = index === this.bqStepItemElements.length - 1;
    });
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
  private get bqStepItemElements(): HTMLBqStepItemElement[] {
    return Array.from(this.el.querySelectorAll('bq-step-item'));
  }

  // private handleChange = (event) => {
  //   this.bqChange.emit(event);
  // }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="flex w-full items-start justify-between" part="container">
        <slot />
      </div>
    );
  }
}
