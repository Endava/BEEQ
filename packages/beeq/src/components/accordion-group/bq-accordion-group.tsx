import { Component, Element, Listen, Prop, Watch } from '@stencil/core';

import { isHTMLElement, isNil } from '../../shared/utils';
import type { TAccordionAppearance, TAccordionSize } from '../accordion/bq-accordion.types';

/**
 * The accordion group component is a container for multiple accordion elements.
 * It allows to manage the appearance and size of all accordions at once.
 *
 * @example How to use it
 * ```html
 * <bq-accordion-group appearance="filled" size="medium">
 *   <bq-accordion> ... </bq-accordion>
 *   <bq-accordion> ... </bq-accordion>
 *   <bq-accordion> ... </bq-accordion>
 * </bq-accordion-group>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/713eae-accordion
 * @status stable
 *
 * @attr {"filled" | "ghost"} [appearance="filled"] - The appearance style of accordion to be applied to all accordions
 * @attr {boolean} [expandAll=false] - If true all accordions are expanded
 * @attr {boolean} [no-animation=false] - Animation is set through JS when the browser does not support CSS calc-size() If true, the accordion animation, will be disabled. No animation will be applied.
 * @attr {boolean} [multiple=false] - If true multiple accordions can be expanded at the same time
 * @attr {"small" | "medium"} [size="medium"] - The size of accordion to be applied to all accordions
 *
 * @slot - The default slot where the bq-accordion elements are placed.
 *
 * @part base - The component's base wrapper.
 *
 * @cssprop --bq-accordion-group--gap - Accordion group distance between elements
 */
@Component({
  tag: 'bq-accordion-group',
  styleUrl: './scss/bq-accordion-group.scss',
  shadow: true,
})
export class BqAccordionGroup {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAccordionGroupElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** The appearance style of accordion to be applied to all accordions */
  @Prop({ reflect: true, mutable: true }) appearance: TAccordionAppearance = 'filled';

  /** If true all accordions are expanded */
  @Prop({ reflect: true }) expandAll: boolean;

  /**
   * Animation is set through JS when the browser does not support CSS calc-size()
   * If true, the accordion animation, will be disabled. No animation will be applied.
   */
  @Prop({ reflect: true }) noAnimation: boolean = false;

  /** If true multiple accordions can be expanded at the same time */
  @Prop({ reflect: true }) multiple: boolean = false;

  /** The size of accordion to be applied to all accordions */
  @Prop({ reflect: true, mutable: true }) size: TAccordionSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('appearance')
  @Watch('expandAll')
  @Watch('noAnimation')
  @Watch('size')
  checkPropValues() {
    this.bqAccordionElements.forEach((bqAccordionElement) => {
      // NOTE: if expandAll is nil we will keep accordion default state
      if (!isNil(this.expandAll)) {
        bqAccordionElement.expanded = this.expandAll;
      }
      bqAccordionElement.appearance = this.appearance;
      bqAccordionElement.noAnimation = this.noAnimation;
      bqAccordionElement.size = this.size;
    });
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  @Listen('bqClick', { passive: true })
  onBqClick(event: CustomEvent<HTMLBqAccordionElement>) {
    const { detail: bqElem } = event;
    // Make sure the event is coming from a bq-accordion element and its a child of the bq-accordion-group
    if (!isHTMLElement(bqElem, 'bq-accordion') || !this.el.contains(bqElem)) return;
    // We keep default behavior if multiple accordion can be expanded
    if (this.multiple) return;

    this.bqAccordionElements.forEach((bqAccordionElement) => {
      if (bqAccordionElement === event.detail) return;

      bqAccordionElement.expanded = false;
    });
  }

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

  private get bqAccordionElements(): HTMLBqAccordionElement[] {
    return Array.from(this.el.querySelectorAll('bq-accordion'));
  }
  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="flex flex-col gap-[--bq-accordion-group--gap]" part="base">
        <slot />
      </div>
    );
  }
}
