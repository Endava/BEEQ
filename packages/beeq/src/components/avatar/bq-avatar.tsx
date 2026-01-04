import { Component, Element, Host, Prop, State, Watch } from '@stencil/core';

import { validatePropValue } from '../../shared/utils';
import type { TAvatarShape, TAvatarSize } from './bq-avatar.types';
import { AVATAR_SHAPE, AVATAR_SIZE } from './bq-avatar.types';

/**
 * The Avatar component is a simple and customizable element that displays an image or initials in a circular or square shape.
 * This component is useful for displaying user profile pictures or any other image that represents a person or an entity.
 *
 * @example How to use it
 * ```html
 * <bq-avatar
 *   alt-text="John Doe profile picture"
 *   image="/image/url/photo-1524593689594.jpeg"
 *   label="John Doe profile picture"
 *   shape="circle"
 *   size="medium"
 * >
 *   <bq-badge slot="badge" text-color="#fff">9</bq-badge>
 * </bq-avatar>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/148da7-avatar
 * @status stable
 *
 * @attr {string} alt-text - Alternate text for the avatar image if the image cannot be displayed.
 * @attr {string} image - The image source to load on the avatar (this can be also a base64 encoded image).
 * @attr {string} label - A text to use for describing the avatar on assistive devices.
 * @attr {string} initials - The text to display on avatar.
 * @attr {"circle" | "square"} shape - The shape of the avatar.
 * @attr {"xsmall" | "small" | "medium" | "large"} size - The size of the avatar.
 *
 * @slot badge - The badge slot is used to add a badge to the avatar. The badge is a small circle or square that can be used to display a number or a status.
 *
 * @part base - The component's internal wrapper.
 * @part img - The `<image>` tag element that load the image source.
 * @part text - The `<span>` tag element that rendered the `Initials` text string.
 * @part badge - The container that wraps the badge slot element.
 *
 * @cssprop --bq-avatar--background - Avatar background color
 *
 * @cssprop --bq-avatar--border-color - Avatar border color
 * @cssprop --bq-avatar--border-style - Avatar border style
 * @cssprop --bq-avatar--border-width - Avatar border width
 *
 * @cssprop --bq-avatar--border-radius-circle - Avatar border radius for circle & any size
 * @cssprop --bq-avatar--border-radius-squareXs - Avatar border radius for square & size xsmall
 * @cssprop --bq-avatar--border-radius-squareS - Avatar border radius for square & size small
 * @cssprop --bq-avatar--border-radius-squareM - Avatar border radius for square & size medium/large
 *
 * @cssprop --bq-avatar--size-xsmall - Avatar xsmall size
 * @cssprop --bq-avatar--size-small - Avatar small size
 * @cssprop --bq-avatar--size-medium - Avatar medium size
 * @cssprop --bq-avatar--size-large - Avatar large size
 *
 * @cssprop --bq-avatar--badge-top-square - Badge top position shape square
 * @cssprop --bq-avatar--badge-left-square - Badge left position shape square
 * @cssprop --bq-avatar--badge-top-circle - Badge top position shape circle
 * @cssprop --bq-avatar--badge-left-circle - Badge left position shape circle
 */
@Component({
  tag: 'bq-avatar',
  styleUrl: './scss/bq-avatar.scss',
  shadow: true,
})
export class BqAvatar {
  // Own Properties
  // ====================

  trimmedInitials: string;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAvatarElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasError: boolean;

  // Public Property API
  // ========================

  /** Alternate text for the avatar image if the image cannot be displayed */
  @Prop({ reflect: true }) altText: string;

  /** The image source to load on the avatar (this can be also a base64 encoded image) */
  @Prop({ reflect: true }) image: string;

  /** A text to use for describing the avatar on assistive devices */
  @Prop({ reflect: true }) label: string;

  /** The text to display on avatar */
  @Prop({ reflect: true }) initials: string;

  /** The shape of the avatar */
  @Prop({ reflect: true }) shape: TAvatarShape = 'circle';

  /** The size of the avatar */
  @Prop({ reflect: true, mutable: true }) size: TAvatarSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('image')
  handleImagePropChange() {
    // Reset the error when a new image source is provided
    this.hasError = false;
  }

  @Watch('shape')
  @Watch('size')
  checkPropValues() {
    validatePropValue(AVATAR_SHAPE, 'circle', this.el, 'shape');
    validatePropValue(AVATAR_SIZE, 'medium', this.el, 'size');
  }

  @Watch('initials')
  @Watch('size')
  onInitialsChange() {
    this.trimInitialsBasedOnSize();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.trimInitialsBasedOnSize();
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

  private onImageError = () => {
    this.hasError = true;
  };

  private trimInitialsBasedOnSize = (): void => {
    if (!this.initials) return;

    AVATAR_SIZE.forEach((size: TAvatarSize) => {
      if (this.size === size) {
        this.trimmedInitials = this.initials.substring(0, this.getIndex(size));
      }
    });
  };

  private getIndex = (size: TAvatarSize): number => {
    const sizeIndexMap = {
      xsmall: 1,
      small: 2,
      medium: 3,
      large: 4,
    };
    return sizeIndexMap[size] ?? sizeIndexMap.xsmall;
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <div
          aria-label={this.label}
          class={{
            'bq-avatar': true,
            [`size--${this.size}`]: true,
            'rounded-[--bq-avatar--border-radius-circle]': this.shape === 'circle',
            'rounded-[--bq-avatar--border-radius-squareXs]': this.shape === 'square' && this.size === 'xsmall',
            'rounded-[--bq-avatar--border-radius-squareS]': this.shape === 'square' && this.size === 'small',
            'rounded-[--bq-avatar--border-radius-squareM]':
              this.shape === 'square' && (this.size === 'medium' || this.size === 'large'),
          }}
          part="base"
          role="img"
        >
          {this.initials && (
            <span
              class="bs-full is-full absolute inset-bs-0 start-0 inline-flex items-center justify-center font-bold text-primary"
              part="text"
            >
              {this.trimmedInitials}
            </span>
          )}
          {this.image && !this.hasError && (
            <img
              alt={this.altText ?? undefined}
              class="bs-full is-full absolute inset-bs-0 start-0 object-cover"
              onError={this.onImageError}
              part="img"
              src={this.image}
            />
          )}
        </div>
        <div
          class={{
            'absolute flex items-center justify-center': true,
            'inset-bs-[--bq-avatar--badge-top-square] start-[--bq-avatar--badge-left-square]': this.shape === 'square',
            'inset-bs-[--bq-avatar--badge-top-circle] start-[--bq-avatar--badge-left-circle]': this.shape === 'circle',
          }}
          part="badge"
        >
          <slot name="badge"></slot>
        </div>
      </Host>
    );
  }
}
