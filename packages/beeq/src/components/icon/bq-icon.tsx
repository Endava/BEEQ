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

    const { iconPath } = this.getIconDetails();
    return getBasePath(iconPath);
  };

  private loadIcon = () => {
    const url = this.getIconSource();
    getSvgContent(url, true).then(() => {
      this._svgContent = iconContent.get(url);
      this.svgLoaded.emit(this._svgContent);
    });
  };

  private getIconDetails = (): { iconName: string; iconPath: string } => {
    const REGULAR = 'regular';
    const SVG_EXTENSION = '.svg';
    const LOCAL_SVG_PATH = './svg/';
    const ENV_SVG_PATH = Env.ICONS_SVG_PATH;

    // Check if the icon is weighted. An icon is considered weighted if its weight is not 'regular' and ENV_SVG_PATH is not set.
    // Eg: if the weight is 'bold' and ENV_SVG_PATH is not set, isWeightedIcon will be true.
    const isWeightedIcon = this.weight !== REGULAR && !ENV_SVG_PATH;

    // If the icon is weighted, append the weight to the icon name. Otherwise, append nothing.
    // Eg: if isWeightedIcon is true and the weight is 'bold', weightSuffix will be '-bold'.
    const weightSuffix = isWeightedIcon ? `-${this.weight}` : '';

    // Construct the icon name by appending the weight suffix (if any) and the file extension.
    // Eg: if the name is 'my-icon' and weightSuffix is '-bold', iconName will be 'my-icon-bold.svg'.
    const iconName = `${this.name}${weightSuffix}${SVG_EXTENSION}`;

    // Construct the path to the icon file.
    // Eg: if iconName is 'my-icon-bold.svg', iconPath will be './svg/my-icon-bold.svg'.
    // Eg: if iconName is 'my-icon-bold.svg' and ENV_SVG_PATH is 'https://mycdn.com/icons', iconPath will be 'https://mycdn.com/icons/my-icon-bold.svg'.
    const iconPath = !ENV_SVG_PATH ? `${LOCAL_SVG_PATH}${iconName}` : `${ENV_SVG_PATH}/${iconName}`;

    // Return the icon name and path.
    return { iconName, iconPath };
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
