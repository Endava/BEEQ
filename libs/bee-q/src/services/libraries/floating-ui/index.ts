import { arrow, flip, hide, offset, shift, size } from '@floating-ui/core';
import { autoUpdate, computePosition } from '@floating-ui/dom';
import { FloatingUIOptions } from '../../interfaces';

export class FloatingUI {
  panel: HTMLElement;
  trigger: HTMLElement;
  options: FloatingUIOptions;
  cleanUp: () => void;

  constructor(trigger: HTMLElement, panel: HTMLElement, options?: FloatingUIOptions) {
    this.trigger = trigger;
    this.panel = panel;
    this.options = Object.assign(
      {
        distance: 20,
        placement: 'bottom',
        strategy: 'fixed',
        sameWidth: false,
      },
      options,
    );
    this.init(options);
  }

  init(options: FloatingUIOptions) {
    this.options = Object.assign(this.options, options);
    this.update();
  }

  update() {
    this.cleanUp = autoUpdate(this.trigger, this.panel, async () => {
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
        top: `${y}px`,
        left: `${x}px`,
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
}
