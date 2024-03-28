import { Component, Env, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';

import { TIconWeight } from './bq-icon.types';
import { getSvgContent, iconContent } from './helper/request';
import { getBasePath, getColorCSSVariable } from '../../shared/utils';

/**
 * Icons are simplified images that graphically explain the meaning of an object on the screen.
 *
 * @part base - The component's internal wrapper that holds the icon SVG content.
 * @part svg - The `<svg>` tag element inside the component.
 */
@Component({
  assetsDirs: ['svg'],
  tag: 'bq-icon',
  styleUrl: './scss/bq-icon.scss',
  shadow: true,
})
export class BqIcon {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private _svgContent: string;

  // Public Property API
  // ========================

  /** Label for the icon, used for accessibility */
  @Prop({ reflect: true }) label?: string;

  /** Set the stroke color of the SVG. The value should be a valid value of the palette color */
  @Prop({ reflect: true }) color?: string;

  /** Icon name to load. Please check all available icons [here](https://phosphoricons.com/) */
  @Prop({ reflect: true }) name!: string;

  /** Set the size of the SVG */
  @Prop({ reflect: true }) size?: string | number = 24;

  /** Set the source of the SVG. If the source is set, the name property will be ignored */
  @Prop({ reflect: true }) src?: string;

  /** It set the icon weight/style */
  @Prop({ reflect: true }) weight?: TIconWeight = 'regular';

  // Prop lifecycle events
  // =======================

  @Watch('color')
  @Watch('name')
  @Watch('size')
  @Watch('weight')
  handlePropsChange() {
    this.loadIcon();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the SVG has loaded */
  @Event() svgLoaded: EventEmitter;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.handlePropsChange();
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

  private getIconSource = () => {
    if (!this.name && !this.src) return;
    // Return the src if it is set
    if (this.src) return this.src;

    const svgPath = Env.ICONS_SVG_PATH;
    let iconName = this.weight !== 'regular' ? `${this.name}-${this.weight}.svg` : `${this.name}.svg`;
    let path = `./svg/${this.weight}/${iconName}`;

    if (svgPath) {
      iconName = `${this.name}.svg`;
      path = `${svgPath}/${iconName}`;
    }

    return getBasePath(path);
  };

  private loadIcon = () => {
    const url = this.getIconSource();
    getSvgContent(url, true).then(() => {
      this._svgContent = iconContent.get(url);
      this.svgLoaded.emit(this._svgContent);
    });
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const styles = {
      ...(this.color && { '--bq-icon--color': getColorCSSVariable(this.color) }),
      ...(this.size && { '--bq-icon--size': `${this.size}px` }),
    };

    return (
      <Host style={styles}>
        <div
          aria-label={this.label ?? `${this.name} icon`}
          class="flex h-[var(--bq-icon--size)] w-[var(--bq-icon--size)] text-[color:var(--bq-icon--color)]"
          innerHTML={this._svgContent}
          part="base"
          role="img"
        />
      </Host>
    );
  }
}
