import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Listen, Prop, Watch } from '@stencil/core';

import { debounce, getNextElement, isHTMLElement, isNil, type TDebounce, validatePropValue } from '../../shared/utils';
import type { TTabOrientation, TTabPlacement, TTabSize } from '../tab/bq-tab.types';
import { TAB_ORIENTATION, TAB_PLACEMENT, TAB_SIZE } from '../tab/bq-tab.types';

/**
 * The tab group is a user interface element that allows users wrap a set of tab items.
 *
 * @example How to use it
 * ```html
 * <bq-tab-group value="5">
 *   <bq-tab tab-id="1">Tab</bq-tab>
 *   <bq-tab tab-id="2" active>Tab</bq-tab>
 *   <bq-tab tab-id="3">Long Tab name</bq-tab>
 *   <bq-tab tab-id="4" disabled>Tab</bq-tab>
 * </bq-tab-group>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/775321-tabs
 * @status stable
 *
 * @attr {number} debounce-time - A number representing the delay value applied to bqChange event handler
 * @attr {boolean} disable-divider - If true, the underline divider below the tabs won't be shown
 * @attr {string} orientation - The direction that tab should be render
 * @attr {string} placement - The placement that tab should be render
 * @attr {string} size - The size of the tab
 * @attr {string} value - A string representing the id of the selected tab.
 *
 * @event bqChange - Handler to be called when the tab value changes
 *
 * @slot - The bq-tab items
 *
 * @part base - The HTML div wrapper inside the shadow DOM.
 * @part tabs - The HTML div used to hold the tab buttons.
 */
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

  /** A number representing the delay value applied to bqChange event handler */
  @Prop({ reflect: true, mutable: true }) debounceTime = 0;

  /** If true, the underline divider below the tabs won't be shown  */
  @Prop({ reflect: true }) disableDivider = false;

  /** The direction that tab should be render */
  @Prop({ reflect: true }) orientation?: TTabOrientation = 'horizontal';

  /** The placement that tab should be render */
  @Prop({ reflect: true }) placement?: TTabPlacement = 'start';

  /** The size of the tab */
  @Prop({ reflect: true }) size: TTabSize = 'medium';

  /** A string representing the id of the selected tab. */
  @Prop({ reflect: true, mutable: true }) value: string;

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
  @Watch('value')
  @Watch('orientation')
  @Watch('placement')
  checkPropValues() {
    validatePropValue(TAB_SIZE, 'medium', this.el, 'size');
    validatePropValue(TAB_ORIENTATION, 'horizontal', this.el, 'orientation');
    validatePropValue(TAB_PLACEMENT, 'start', this.el, 'placement');

    this.bqTabElements.forEach((bqTabElement) => {
      bqTabElement.size = this.size;
      bqTabElement.orientation = this.orientation;
      bqTabElement.placement = this.placement;
      bqTabElement.active = !isNil(this.value) ? bqTabElement.tabId === this.value : false;
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
    this.checkPropValues();
  }

  // Listeners
  // ==============

  @Listen('keyup', { target: 'body', passive: true, capture: true })
  onKeyUp(event: KeyboardEvent) {
    const { target } = event;
    if (!isHTMLElement(target, 'bq-tab')) return;

    this.makeTabsFocusable();
  }

  @Listen('bqClick', { passive: true })
  onBqClick(event: CustomEvent<HTMLBqTabElement>) {
    const { detail: target } = event;
    this.bqTabElements.forEach((bqTabElement) => {
      bqTabElement.active = bqTabElement === target;
    });
    this.debouncedBqChange({ value: target.tabId, target });
    this.selectTab(target);
  }

  @Listen('bqKeyDown', { passive: true })
  async onBqKeyDown(event: CustomEvent<KeyboardEvent>) {
    const { target } = event;

    // NOTE: ensures the target is an HTML element with the tag name 'bq-tab'
    if (!isHTMLElement(target, 'bq-tab')) return;

    const keyActions: { [key: string]: 'forward' | 'backward' } = {
      ArrowDown: 'forward',
      ArrowRight: 'forward',
      ArrowUp: 'backward',
      ArrowLeft: 'backward',
    };

    // NOTE: gets the direction based on key pressed
    const direction = keyActions[event.detail.key];

    if (!direction) return;

    await this.focusTabSibling(target, direction);
  }

  @Listen('bqBlur', { capture: true, passive: true })
  onBqBlur() {
    this.restoreTabsFocus();
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

  private focusTabSibling = async (
    currentTarget: HTMLBqTabElement,
    direction: 'forward' | 'backward',
  ): Promise<void> => {
    let target: HTMLBqTabElement | null = null;

    this.bqTabElements.forEach((bqTabElement, index, elements) => {
      bqTabElement.active = false;

      if (bqTabElement === currentTarget) {
        target = getNextElement(elements, index, direction);
      }
    });

    if (target) {
      await target.vFocus();
      this.selectTab(target);
    }
  };

  private makeTabsFocusable = (): void => {
    this.bqTabElements.forEach((bqTabElement) => {
      if (bqTabElement.disabled) return;

      /**
       * This is a "fire and forget" operation. The callback itself doesn't do anything special
       * with the asynchronous code (doesn't await it or do anything with the result)
       * Details: https://stackoverflow.com/a/63488201
       */
      (async () => {
        await bqTabElement.enableFocus(true);
      })();
    });
  };

  private restoreTabsFocus = (): void => {
    this.bqTabElements.forEach((bqTabElement) => {
      if (bqTabElement.disabled || bqTabElement.active) return;

      /** @See line #173 */
      (async () => {
        await bqTabElement.enableFocus(false);
      })();
    });
  };

  private get bqTabElements(): HTMLBqTabElement[] {
    return Array.from(this.el.querySelectorAll('bq-tab'));
  }

  private selectTab = (target: HTMLBqTabElement): void => {
    const { tabId } = target;
    target.active = true;
    this.value = tabId;
    this.debouncedBqChange({ value: tabId, target });
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host class={{ 'inline-block': this.orientation === 'vertical' }}>
        <div
          class={{
            [`bq-tab-group bq-tab-group--${this.orientation}-${this.placement} is-full flex`]: true,
            'no-divider': this.disableDivider,
          }}
          part="base"
        >
          <div
            class={{
              'bq-tab-group--container flex overflow-x-auto': true,
              'flex-col': this.orientation !== 'horizontal',
            }}
            part="tabs"
            role="tablist"
          >
            <slot />
          </div>
        </div>
      </Host>
    );
  }
}
