import { h, Component, Element, Prop, Listen, EventEmitter, Event, Watch } from '@stencil/core';
import { debounce, getNextElement, isHTMLElement, isNil, TDebounce, validatePropValue } from '../../shared/utils';
import { TAB_SIZE, TTabSize } from '../tab/bq-tab.types';

/**
 * @part base - The HTML div used to hold <bq-tab> elements.
 */
@Component({
  tag: 'bq-tab-group',
  styleUrl: './scss/bq-tab-group.scss',
  shadow: true,
})
export class BqTabGroup {
  // Own Properties
  // ====================

  private focusedBqTab: HTMLBqTabElement | null = null;

  private debouncedBqChange: TDebounce<{ value: string; target: HTMLBqTabElement }>;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqTabGroupElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** A string representing the id of the selected tab. */
  @Prop({ reflect: true, mutable: true }) value: string;

  /** The size of the tab */
  @Prop({ reflect: true }) size: TTabSize = 'small';

  /** A number representing the delay value applied to bqChange event handler */
  @Prop({ reflect: true, mutable: true }) debounceTime = 0;

  // Prop lifecycle events
  // =======================

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

  @Watch('size')
  checkPropValues() {
    validatePropValue(TAB_SIZE, 'small', this.el, 'size');

    this.bqTabElements.forEach((bqTabElement) => {
      bqTabElement.size = this.size;
      bqTabElement.divider = true;
    });
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the tab value changes */
  @Event() bqChange: EventEmitter<{ target: HTMLBqTabElement; value: string }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkDebounceChange();
    this.checkPropValues();
  }

  componentDidLoad() {
    this.bqTabElements.forEach((bqTabElement) => {
      bqTabElement.active = !isNil(this.value) ? bqTabElement.tabId === this.value : false;
      bqTabElement.size = this.size;
    });
  }

  // Listeners
  // ==============

  @Listen('mousedown', { target: 'body', passive: true })
  onMouseDown(event: MouseEvent) {
    if (!isNil(this.focusedBqTab) && isHTMLElement(event.target, 'bq-tab') && this.el.contains(event.target)) {
      this.focusedBqTab = event.target;
    }
  }

  @Listen('bqClick')
  onBqClick(event: CustomEvent<HTMLBqTabElement>) {
    const { detail: target } = event;
    this.bqTabElements.forEach((bqTabElement) => (bqTabElement.active = bqTabElement === target));
    this.debouncedBqChange({ value: target.tabId, target });
    this.selectTab(target);
  }

  @Listen('bqKeyDown')
  onBqKeyDown(event: CustomEvent<KeyboardEvent>) {
    const { target } = event;

    if (!isHTMLElement(target, 'bq-tab')) return;

    switch (event.detail.key) {
      case 'ArrowRight': {
        this.focusTabSibbling(target, 'forward');
        break;
      }
      case 'ArrowLeft': {
        this.focusTabSibbling(target, 'backward');
        break;
      }
      default:
    }
  }

  @Listen('bqFocus', { capture: true })
  onBqFocus(event: CustomEvent<HTMLBqTabElement>) {
    if (event.detail !== this.focusedBqTab) return;

    event.stopPropagation();
  }

  @Listen('bqBlur', { capture: true })
  onBqBlur(event: CustomEvent<HTMLBqTabElement>) {
    if (!isNil(this.focusedBqTab) && event.detail !== this.focusedBqTab) {
      event.stopPropagation();
    } else {
      this.focusedBqTab = null;
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

  private focusTabSibbling(currentTarget: HTMLBqTabElement, direction: 'forward' | 'backward'): void {
    let target: HTMLBqTabElement | null = null;

    this.bqTabElements.forEach((bqTabElement, index, elements) => {
      bqTabElement.active = false;

      if (bqTabElement === currentTarget) {
        target = getNextElement(elements, index, direction);
      }
    });

    if (target) {
      target.vFocus();
      this.selectTab(target);
    }
  }

  private get bqTabElements(): HTMLBqTabElement[] {
    return Array.from(this.el.querySelectorAll('bq-tab'));
  }

  private selectTab(target: HTMLBqTabElement): void {
    const { tabId } = target;
    target.active = true;
    this.value = tabId;
    this.focusedBqTab = target;
    this.debouncedBqChange({ value: tabId, target });
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="relative flex" role="tablist" part="base">
        <slot />
      </div>
    );
  }
}
