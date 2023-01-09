import { h, Component, Element, Prop, Listen, EventEmitter, Event, Watch } from '@stencil/core';
import { debounce, getNextElement, isHTMLElement, isNil, TDebounce } from '../../shared/utils';

@Component({
  tag: 'bq-tab-group',
  styleUrl: './scss/bq-tab-group.scss',
  shadow: true,
})
export class BqTabGroup {
  // Own Properties
  // ====================

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

  /** If true tabs are disabled */
  @Prop({ reflect: true }) disabled = false;

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
  }

  componentDidLoad() {
    this.bqTabElements.forEach((bqTabElement) => {
      bqTabElement.active = !isNil(this.value) ? bqTabElement.tabId === this.value : false;
      bqTabElement.disabled = bqTabElement.disabled || this.disabled;
    });
  }

  // Listeners
  // ==============

  @Listen('bqClick')
  onBqClick(event: CustomEvent<HTMLBqTabElement>) {
    const { detail: target } = event;
    this.bqTabElements.forEach((bqTabElement) => (bqTabElement.active = bqTabElement === target));
    this.debouncedBqChange({ value: target.tabId, target });
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
      target.active = true;
    }
  }

  private get bqTabElements(): HTMLBqTabElement[] {
    return Array.from(this.el.querySelectorAll('bq-tab'));
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="relative flex gap-2" role="tablist" part="base">
        <slot />
        <div class="absolute bottom-0 h-[1px] w-full bg-text-secondary opacity-40" />
      </div>
    );
  }
}
