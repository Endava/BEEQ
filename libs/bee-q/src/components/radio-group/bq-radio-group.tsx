import { h, Component, Listen, Element, Event, Prop, EventEmitter, Watch } from '@stencil/core';
import { isNil, validatePropValue } from '../../shared/utils';
import { RADIO_GROUP_ORIENTATION, TRadioGroupOrientation } from './bq-radio-group.types';
/**
 * @part base - The component's internal wrapper of the radio components.
 * @part label - The `<legend>` element that holds the text content.
 * @part group - The `<div>` element that holds the radio inputs.
 */
@Component({
  tag: 'bq-radio-group',
  styleUrl: './scss/bq-radio-group.scss',
  shadow: true,
})
export class BqRadioGroup {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqRadioGroupElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Name of the HTML input form control. Submitted with the form as part of a name/value pair.  */
  @Prop({ reflect: true }) name!: string;

  /** A string representing the value of the radio. */
  @Prop({ reflect: true, mutable: true }) value?: string;

  /** If true radio inputs are disabled */
  @Prop({ reflect: true }) disabled? = false;

  /** If true displays fieldset */
  @Prop({ reflect: true }) fieldset? = false;

  /** The display orientation of the radio inputs */
  @Prop({ reflect: true, mutable: true }) orientation: TRadioGroupOrientation = 'vertical';

  // Prop lifecycle events
  // =======================

  @Watch('orientation')
  checkPropValues() {
    validatePropValue(RADIO_GROUP_ORIENTATION, 'vertical', this.orientation, this.el, 'orientation');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the radio state changes */
  @Event() bqChange: EventEmitter<{ value: string; target: HTMLBqRadioElement }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
  }

  componentDidRender() {
    this.bqRadioElements.forEach((bqRadioElement) => {
      bqRadioElement.name = this.name;
      bqRadioElement.checked = !isNil(this.value) ? bqRadioElement.value === this.value : false;
      bqRadioElement.disabled = this.disabled;
    });
  }

  // Listeners
  // ==============

  @Listen('bqClick') onBqClick(event: UIEvent) {
    const target = event.target as HTMLBqRadioElement;
    this.bqRadioElements.forEach((bqRadioElement) => (bqRadioElement.checked = bqRadioElement === target));
    this.checkRadioInput(target);
  }

  @Listen('bqKeyDown') onBqKeyDown(event: CustomEvent<KeyboardEvent>) {
    const target = event.target as HTMLBqRadioElement;
    switch (event.detail.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        this.focusRadioInputSibbling(target, true);
        break;
      }

      case 'ArrowUp':
      case 'ArrowLeft': {
        this.focusRadioInputSibbling(target, false);
        break;
      }

      default:
    }
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

  private get bqRadioElements(): HTMLBqRadioElement[] {
    return Array.from(this.el.querySelectorAll('bq-radio'));
  }

  private focusRadioInputSibbling(currentTarget: HTMLBqRadioElement, next: boolean): void {
    this.bqRadioElements.forEach((bqRadioElement, index, elements) => {
      if (bqRadioElement === currentTarget) {
        const nextIndex = (elements.length + (next ? index + 1 : index - 1)) % elements.length;

        currentTarget.vBlur();
        currentTarget.checked = false;

        const target = elements[nextIndex];
        target.vFocus();
        this.checkRadioInput(target);
      }
    });
  }

  private checkRadioInput(target: HTMLBqRadioElement): void {
    const { value } = target;
    target.checked = true;
    this.value = value;
    this.bqChange.emit({ value, target });
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <fieldset class={{ 'bq-radio-group': true, 'has-fieldset': this.fieldset }} role="radiogroup" part="base">
        <legend part="label">
          <slot name="label" />
        </legend>
        <div class={`bq-radio-group--${this.orientation}`} part="group">
          <slot />
        </div>
      </fieldset>
    );
  }
}
