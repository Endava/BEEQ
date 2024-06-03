import { Component, h, Prop } from '@stencil/core';

/**
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM
 * @part back - The container `<div>` that wraps the page title back icon
 * @part title - The container `<div>` that wraps the pate title content
 * @part icon - The `<bq-icon>` element used to render a predefined icon size based on the page title (back, edit, download icon)
 * @part actions - The container `<div>` element used to render a edit and download icons for page title
 * @part sub-title - The container `<div>` that wraps the sub-title element
 */
@Component({
  tag: 'bq-page-title',
  styleUrl: './scss/bq-page-title.scss',
  shadow: true,
})
export class BqPageTitle {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  /** If true, the page title back icon will be shown */
  @Prop({ reflect: true }) showBackIcon: boolean;

  /** If true, the page title back icon will be shown */
  @Prop({ reflect: true }) showActionIcons: boolean;

  /** If true, the sub title of page title will be shown */
  @Prop({ reflect: true }) showSubTitle: boolean;

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="flex gap-xs px-xxl4 py-xl" part="wrapper">
        {/* BACK ICON */}
        <div class={{ 'flex p-s': true, hidden: !this.showBackIcon }} part="back">
          <slot name="back">
            <bq-icon
              color="text--primary"
              name="arrow-left"
              size="24"
              weight="bold"
              part="icon"
              exportparts="base,svg"
            />
          </slot>
        </div>
        <div class="flex flex-col gap-xs">
          <div class="flex items-center gap-xs">
            <div class="title-font text-xxl font-bold leading-regular text-text-primary" part="title">
              <slot />
            </div>
            {/* ACTION ICONS */}
            <div class={{ 'flex gap-xs p-xs2': true, hidden: !this.showActionIcons }} part="actions">
              <slot name="actions">
                <bq-icon
                  color="text--brand"
                  name="pencil-simple"
                  size="24"
                  weight="bold"
                  part="icon"
                  exportparts="base,svg"
                />
                <bq-icon
                  color="text--brand"
                  name="download-simple"
                  size="24"
                  weight="bold"
                  part="icon"
                  exportparts="base,svg"
                />
              </slot>
            </div>
          </div>
          {/* SUB-TITLE */}
          <div
            class={{
              'title-font text-l font-medium leading-regular text-text-secondary': true,
              hidden: !this.showSubTitle,
            }}
            part="sub-title"
          >
            <slot name="sub-title" />
          </div>
        </div>
      </div>
    );
  }
}
