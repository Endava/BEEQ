/* -------------------------------------------------------------------------- */
/*   💡 Credits: https://css-tricks.com/how-to-animate-the-details-element/   */
/* -------------------------------------------------------------------------- */

export class Accordion {
  private el: HTMLDetailsElement;
  private header: HTMLElement;
  private body: HTMLElement;
  private animation: Animation | null;
  private isClosing: boolean;
  private isExpanding: boolean;

  constructor(el: HTMLDetailsElement) {
    this.el = el;
    this.header = el.querySelector('summary');
    this.body = el.querySelector('.bq-accordion__body');

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.header.addEventListener('click', (e) => this.onClick(e));
  }

  destroy(): void {
    this.header.removeEventListener('click', (e) => this.onClick(e));
  }

  private onClick(e: MouseEvent): void {
    e.preventDefault();

    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.collapse();
    }
  }

  private open(): void {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  private expand(): void {
    this.isExpanding = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.header.offsetHeight + this.body.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 300,
        easing: 'ease-in-out',
      },
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  private collapse(): void {
    this.isClosing = true;

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.header.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 300,
        easing: 'ease-out',
      },
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  private onAnimationFinish(open: boolean): void {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = this.el.style.overflow = '';
  }
}
