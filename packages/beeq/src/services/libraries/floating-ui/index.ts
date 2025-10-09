import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  type ReferenceElement,
  shift,
  size,
} from '@floating-ui/dom';

import type { FloatingUIOptions } from '../../interfaces';

export class FloatingUI {
  panel: HTMLElement;
  trigger: ReferenceElement;
  options: FloatingUIOptions;
  cleanUp: () => void;

  constructor(trigger: ReferenceElement, panel: HTMLElement, options?: FloatingUIOptions) {
    this.trigger = trigger;
    this.panel = panel;
    this.options = {
      distance: 20,
      placement: 'bottom',
      strategy: 'fixed',
      sameWidth: false,
      ...options,
    };
    this.init(options);
  }

  init(options: FloatingUIOptions) {
    this.options = Object.assign(this.options, options);
    this.update();
  }

  update() {
    this.cleanUp = autoUpdate(this.trigger, this.panel, () => {
      (async () => {
        const { x, y, placement, middlewareData } = await computePosition(this.trigger, this.panel, {
          placement: this.options.placement,
          strategy: this.options.strategy,
          middleware: [
            offset({ mainAxis: this.options.distance, crossAxis: this.options.skidding }),
            flip(),
            shift(),
            size(
              this.options.sameWidth && {
                apply({ rects, elements }) {
                  Object.assign(elements.floating.style, {
                    width: `${rects.reference.width}px`,
                  });
                },
              },
            ),
            arrow({ element: this.options.arrow || null }),
            this.positionChange(),
            hide(),
          ],
        });

        Object.assign(this.panel.style, {
          top: '0',
          left: '0',
          transform: `translate(${this.roundByDPR(x)}px,${this.roundByDPR(y)}px)`,
        });

        if (this.options.arrow) {
          const { x: arrowX, y: arrowY } = middlewareData.arrow;
          const staticSide = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right',
          }[placement.split('-')[0]];

          Object.assign(this.options.arrow.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [staticSide]: '-4px',
          });
        }

        const { referenceHidden } = middlewareData.hide;
        Object.assign(this.panel.style, {
          visibility: referenceHidden ? 'hidden' : 'visible',
        });
      })();
    });
  }

  destroy() {
    if (!this.cleanUp) return;
    this.cleanUp();
  }

  positionChange() {
    return {
      name: 'positionChange',
      fn: ({ placement: position }) => {
        if (typeof this.options.onPositionChange !== 'function') return {};
        this.options.onPositionChange(position);
        return {};
      },
    };
  }

  private roundByDPR(value: number) {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(value * dpr) / dpr;
  }
}
