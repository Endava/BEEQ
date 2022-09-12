import { h, Component, Prop, Watch, State } from '@stencil/core';

const AVATAR_SIZE = ['xsmall', 'small', 'medium', 'large'] as const;
type TAvatarSize = typeof AVATAR_SIZE[number];

const AVATAR_SHAPE = ['circle', 'square'] as const;
type TAvatarShape = typeof AVATAR_SHAPE[number];

/**
 * An avatar represents an object made of different pieces of information, in a way that is understandable at a glance.
 *
 * @part base - The component's internal wrapper.
 * @part img - The `<image>` tag element that load the image source.
 * @part text - The `<span>` tag element that renderd the `Initials` text string.
 */
@Component({
  tag: 'bq-avatar',
  styleUrl: './scss/bq-avatar.scss',
  shadow: true,
})
export class BqAvatar {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasError: boolean;

  // Public Property API
  // ========================

  /** The image source to load on the avatar (this can be also a base64 encoded image) */
  @Prop() image: string;

  /** A text to use for describing the avatar on assistive devices */
  @Prop({ reflect: true }) label: string;

  /** The text to display on avatar */
  @Prop() initials: string;

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
  handleShapePropChange() {
    if (AVATAR_SHAPE.includes(this.shape)) return;
    // Shape value fallback
    this.shape = 'circle';
    console.warn(`[Bq-Avatar] Please notice that "shape" should be one of ${AVATAR_SHAPE.join('|')}`);
  }

  @Watch('size')
  handleSizePropChange() {
    if (AVATAR_SIZE.includes(this.size)) return;
    // Size value fallback
    this.size = 'medium';
    console.warn(`[Bq-Avatar] Please notice that "size" should be one of ${AVATAR_SIZE.join('|')}`);
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.handleShapePropChange();
    this.handleSizePropChange();
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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        class={{
          'bq-avatar bg-ui-secondary': true,
          [`size--${this.size}`]: true,
          'rounded-full': this.shape === 'circle',
          'rounded-xs': this.shape === 'square' && this.size === 'xsmall',
          'rounded-s': this.shape === 'square' && this.size === 'small',
          'rounded-m': this.shape === 'square' && (this.size === 'medium' || this.size === 'large'),
        }}
        aria-label={this.label}
        role="img"
        part="base"
      >
        {this.initials && (
          <span class="bq-avatar__initials" part="text">
            {this.initials}
          </span>
        )}
        {this.image && !this.hasError && (
          <img class="bq-avatar__image" alt="" part="img" src={this.image} onError={this.onImageError} />
        )}
      </div>
    );
  }
}
