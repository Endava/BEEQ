import { h, Component, Listen, Element, Event, Prop, EventEmitter, Watch } from '@stencil/core';
import { debounce, isHTMLElement, isNil, TDebounce, validatePropValue } from '../../shared/utils';
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

  private focusedBqRadio: HTMLBqRadioElement | null = null;

  private debouncedBqChange: TDebounce<{ value: string; target: HTMLBqRadioElement }>;

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

  /** A number representing the delay time (in milliseconds) that `bqChange` event handler gets triggered once the value change */
  @Prop({ reflect: true, mutable: true }) debounceTime = 0;

  // Prop lifecycle events
  // =======================

  @Watch('orientation')
  checkPropValues() {
    validatePropValue(RADIO_GROUP_ORIENTATION, 'vertical', this.orientation, this.el, 'orientation');
  }

  @Watch('debounceTime')
  checkDebounceChange() {
    if (this.debounceTime < 0) {
      this.debounceTime = Math.max(0, this.debounceTime);
    }

    if (this.debouncedBqChange) {
      this.debouncedBqChange.cancel();
    }

    this.debouncedBqChange = debounce((event: Parameters<typeof this.debouncedBqChange>[0]) => {
      this.bqChange.emit(event);
    }, this.debounceTime);
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
    this.checkDebounceChange();
  }

  componentDidLoad() {
    this.bqRadioElements.forEach((bqRadioElement) => {
      bqRadioElement.name = this.name;
      bqRadioElement.checked = !isNil(this.value) ? bqRadioElement.value === this.value : false;
      bqRadioElement.disabled = bqRadioElement.disabled || this.disabled;
    });
  }

  // Listeners
  // ==============

  @Listen('mousedown', { target: 'body', passive: true })
  onMouseDown(event: MouseEvent) {
    if (!isNil(this.focusedBqRadio) && isHTMLElement(event.target, 'bq-radio') && this.el.contains(event.target)) {
      this.focusedBqRadio = event.target;
    }
  }

  @Listen('bqClick')
  onBqClick(event: CustomEvent<HTMLBqRadioElement>) {
    if (isNil(this.focusedBqRadio)) {
      this.focusedBqRadio = event.detail;
    }

    if (event.detail.value === this.value) return;

    const target = event.detail;
    this.bqRadioElements.forEach((bqRadioElement) => (bqRadioElement.checked = bqRadioElement === target));
    this.checkRadioInput(event.detail);
  }

  @Listen('bqKeyDown')
  onBqKeyDown(event: CustomEvent<KeyboardEvent>) {
    const { target } = event;

    if (!isHTMLElement(target, 'bq-radio')) return;

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

  @Listen('bqFocus', { capture: true })
  onBqFocus(event: CustomEvent<HTMLBqRadioElement>) {
    if (event.detail !== this.focusedBqRadio) return;

    event.stopPropagation();
  }

  @Listen('bqBlur', { capture: true })
  onBqBlur(event: CustomEvent<HTMLBqRadioElement>) {
    if (!isNil(this.focusedBqRadio) && event.detail !== this.focusedBqRadio) {
      event.stopPropagation();
    } else {
      this.focusedBqRadio = null;
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
        const target = this.getNextRadioElement(elements, index, next);

        currentTarget.checked = false;

        target.vFocus();
        this.checkRadioInput(target);
      }
    });
  }

  private getNextRadioElement(elements: HTMLBqRadioElement[], index: number, forward = true): HTMLBqRadioElement {
    let element = null;
    let elementIndex = index;

    do {
      elementIndex = (elements.length + (elementIndex + (forward ? 1 : -1))) % elements.length;
      element = elements[elementIndex];
    } while (element.disabled);

    return element;
  }

  private checkRadioInput(target: HTMLBqRadioElement): void {
    const { value } = target;
    target.checked = true;
    this.value = value;
    this.focusedBqRadio = target;
    this.debouncedBqChange({ value, target });
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
