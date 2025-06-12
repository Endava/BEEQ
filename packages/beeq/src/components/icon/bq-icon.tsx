import { Component, Event, h, Host, Prop, State, Watch } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';

import type { TIconWeight } from './bq-icon.types';
import { getSvgContent } from './helper/request';
import { getBasePath, getColorCSSVariable, isNil } from '../../shared/utils';

/**
 * The Icon component is an image that provides a visual representation of an object, action, or concept displayed on the screen.
 * It is a small graphical element that is used to enhance the user interface and improve user experience.
 *
 * @example How to use it
 * ```html
 * <bq-icon color="text--brand" name="bell-ringing" size="24"></bq-icon>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/675fad-icon
 * @status stable
 *
 * @attr {string} color - Set the stroke color of the SVG. The value should be a valid value of the palette color.
 * @attr {string} label - Label for the icon, used for accessibility.
 * @attr {string} name - Icon name to load. Please check all available icons [here](https://phosphoricons.com/).
 * @attr {string | number} size - Set the size of the SVG.
 * @attr {string} src - Set the source of the SVG. If the source is set, the name property will be ignored.
 *
 * @event svgLoaded - Callback handler to be called when the SVG has loaded.
 *
 * @part base - The component's internal wrapper that holds the icon SVG content.
 * @part svg - The `<svg>` tag element inside the component.
 *
 * @cssprop --bq-icon--color - The stroke color of the SVG.
 * @cssprop --bq-icon--size - The size of the SVG.
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
  @Prop({ reflect: true }) name?: string;

  /** Set the size of the SVG */
  @Prop({ reflect: true }) size?: string | number = 24;

  /** Set the source of the SVG. If the source is set, the name property will be ignored */
  @Prop({ reflect: true }) src?: string;

  /** @deprecated It set the icon weight/style */
  @Prop({ reflect: true }) weight?: TIconWeight = undefined;

  // Prop lifecycle events
  // =======================

  @Watch('color')
  @Watch('name')
  @Watch('size')
  handlePropsChange() {
    this.loadIcon(this.name);
  }

  /**
   * !TO BE REMOVED: Delete this `@Watch()` once the deprecated `weight` property is removed
   * We need to maintain retro-compatibility until the next major release
   */
  @Watch('weight')
  handleWeightChange() {
    if (this.name.includes(this.weight)) return;

    console.warn(
      `❗️ [bq-icon]: the 'weight' property is deprecated, you should add the weight to the icon name.\n
       For example, '<bq-icon name="bell-fill"></bq-icon>' instead of '<bq-icon name="bell" weight="fill"></bq-icon>'`,
    );
    // Check if the icon is weighted. An icon is considered weighted if its weight is not 'regular' and ENV_SVG_PATH is not set.
    // Eg: if the weight is 'bold' and ENV_SVG_PATH is not set, isWeightedIcon will be true.
    const REGULAR = 'regular';
    const isWeightedIcon = !isNil(this.weight) && this.weight !== REGULAR;
    // If the icon is weighted, append the weight to the icon name. Otherwise, append nothing.
    // Eg: if isWeightedIcon is true and the weight is 'bold', weightSuffix will be '-bold'.
    const weightSuffix = isWeightedIcon ? `-${this.weight}` : '';
    // Construct the icon name by appending the weight suffix (if any) and the file extension.
    // Eg: if the name is 'my-icon' and weightSuffix is '-bold', iconName will be 'my-icon-bold.svg'.
    const iconName = `${this.name}${weightSuffix}`;
    this.loadIcon(iconName);
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler to be called when the SVG has loaded */
  @Event() svgLoaded: EventEmitter;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  connectedCallback() {
    this.setupIconComponent();
  }

  componentWillLoad() {
    this.setupIconComponent();
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

  private setupIconComponent = () => {
    this.loadIcon(this.name);
    // !TO BE REMOVED: Delete this once the deprecated `weight` property is removed
    if (!isNil(this.weight)) this.handleWeightChange();
  };

  private getIconSource = (name: string) => {
    if (!this.name && !this.src) return undefined;
    // Return the src if it is set
    if (this.src) return this.src;

    const SVG_EXTENSION = '.svg';
    const iconFileName = `${name}${SVG_EXTENSION}`;

    return getBasePath(iconFileName);
  };

  private loadIcon = async (name: string) => {
    const url = this.getIconSource(name);
    if (!url) return;

    const content = await getSvgContent(url, true);
    if (!content) return;

    this._svgContent = content;
    this.svgLoaded.emit(this._svgContent);
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
          class="flex text-[color:--bq-icon--color] bs-[--bq-icon--size] is-[--bq-icon--size]"
          innerHTML={this._svgContent}
          part="base"
          role="img"
        />
      </Host>
    );
  }
}
