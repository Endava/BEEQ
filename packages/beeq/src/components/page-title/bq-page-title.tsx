import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

/**
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM.
 * @part base - The inner container `<div>`of element that contains the base page title component.
 * @part content - Defines the main container of the page title component, which includes the title and subtitle elements.
 * @part title-suffix - Defines the container that holds the title and any suffix content.
 * @part divider - The inner container `<div>` of element that acts as divider slot container.
 * @part back - The container `<div>` that wraps the page title back icon button.
 * @part btn-back - The back navigation button.
 * @part title - The container `<div>` that wraps the page title content.
 * @part icon - The `<bq-icon>` element used to render a predefined back navigation icon for page title.
 * @part suffix - The `<div>` page title element that acts as suffix slot container.
 * @part sub-title - The `<div>` page title element that acts as sub-title slot container.
 */
@Component({
  tag: 'bq-page-title',
  styleUrl: './scss/bq-page-title.scss',
  shadow: true,
})
export class BqPageTitle {
  // Own Properties
  // ====================

  private suffixElem: HTMLElement;
  private subTitleElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqPageTitleElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasSuffix = false;
  @State() private hasSubTitle = false;

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  /** If true, the page title back button will be shown */
  @Prop({ reflect: true }) haveBackNavigation: boolean;

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when page title navigation button loses focus */
  @Event() bqBackBlur: EventEmitter<HTMLBqPageTitleElement>;

  /** Handler to be called when page title navigation button is clicked */
  @Event() bqBackClick: EventEmitter<HTMLBqPageTitleElement>;

  /** Handler to be called when page title navigation button is focused */
  @Event() bqBackFocus: EventEmitter<HTMLBqPageTitleElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

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

  private handleClick = (ev: Event) => {
    ev.stopPropagation();
    this.bqBackClick.emit(this.el);
  };

  private handleBlur = (ev: Event) => {
    ev.stopPropagation();
    this.bqBackBlur.emit(this.el);
  };

  private handleFocus = (ev: Event) => {
    ev.stopPropagation();
    this.bqBackFocus.emit(this.el);
  };

  private handleSlotChange = () => {
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
    this.hasSubTitle = hasSlotContent(this.subTitleElem, 'sub-title');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="flex flex-col" part="wrapper">
        <div class="flex gap-xs" part="base">
          {/* Back navigation button */}
          <div class={{ flex: true, '!hidden': !this.haveBackNavigation }} part="back">
            <slot name="back">
              <bq-button
                appearance="link"
                part="btn-back"
                exportparts="button"
                onBqBlur={this.handleBlur}
                onBqClick={this.handleClick}
                onBqFocus={this.handleFocus}
              >
                <bq-icon
                  color="text--primary"
                  name="arrow-left"
                  size="24"
                  weight="bold"
                  part="icon"
                  exportparts="base,svg"
                />
              </bq-button>
            </slot>
          </div>
          <div class="flex flex-grow flex-col gap-xs" part="content">
            <div class="flex items-center gap-xs" part="title-suffix">
              {/* Title */}
              <div
                class="title-font text-[length:--bq-page-title--text-size-title] font-[--bq-page-title--font-weight-title] leading-[--bq-page-title--text-lineHeight] text-[color:--bq-page-title--text-title-color]"
                part="title"
              >
                <slot />
              </div>
              {/* Suffix */}
              <div
                class={{ 'flex flex-grow gap-xs p-xs2': true, '!hidden': !this.hasSuffix }}
                ref={(divElem) => (this.suffixElem = divElem)}
                part="suffix"
              >
                <slot name="suffix" onSlotchange={this.handleSlotChange} />
              </div>
            </div>
            {/* Sub-title */}
            <div
              class={{
                'title-font text-[length:--bq-page-title--text-size-subtitle] font-[--bq-page-title--font-weight-subtitle] leading-[--bq-page-title--text-lineHeight] text-[color:--bq-page-title--text-sub-title-color]':
                  true,
                hidden: !this.hasSubTitle,
              }}
              ref={(divElem) => (this.subTitleElem = divElem)}
              part="sub-title"
            >
              <slot name="sub-title" onSlotchange={this.handleSlotChange} />
            </div>
          </div>
        </div>
        {/* Divider */}
        <div part="divider">
          <slot name="divider">
            <bq-divider class="mb-m block" stroke-color="ui--secondary" stroke-thickness="1" />
          </slot>
        </div>
      </div>
    );
  }
}
