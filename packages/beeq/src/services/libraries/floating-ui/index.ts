import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  hide,
  type MiddlewareData,
  offset,
  platform,
  type ReferenceElement,
  shift,
  size,
} from '@floating-ui/dom';
import { offsetParent } from 'composed-offset-position';

import type { FloatingUIOptions } from '../../interfaces';

/**
 * Thin wrapper around Floating UI that owns:
 * - the middleware pipeline used by BEEQ floating components (offset, flip,
 *   shift, size, arrow, hide),
 * - a single `autoUpdate` subscription per instance, so scroll/resize
 *   listeners cannot silently stack when consumers reconfigure at runtime.
 *
 * Lifecycle:
 * - `start()`   opens (or reuses) the `autoUpdate` subscription and runs a
 *                first `reposition()` pass.
 * - `stop()`    tears the subscription down; idempotent.
 * - `reposition()` computes the current position once; safe to call whether
 *                or not the subscription is running.
 * - `configure(options)` merges new options and re-runs `reposition()`,
 *                without touching the subscription.
 *
 * The legacy `init` / `update` / `destroy` methods are preserved as
 * aliases so existing consumers keep working while we migrate them.
 */
export class FloatingUI {
  panel: HTMLElement;
  trigger: ReferenceElement;
  options: FloatingUIOptions;
  private cleanUp: (() => void) | undefined;

  constructor(trigger: ReferenceElement, panel: HTMLElement, options?: FloatingUIOptions) {
    this.trigger = trigger;
    this.panel = panel;
    this.options = {
      distance: 20,
      placement: 'bottom',
      strategy: 'absolute',
      sameWidth: false,
      ...options,
    };
    this.start();
  }

  /**
   * Merges new options into the current configuration and repositions the
   * panel once, without recreating the `autoUpdate` subscription. Use this
   * when only Floating UI middleware inputs change (placement, distance,
   * arrow, etc.).
   */
  configure(options: FloatingUIOptions) {
    this.options = Object.assign(this.options, options);
    this.reposition();
  }

  /**
   * Opens the `autoUpdate` subscription so the panel keeps tracking the
   * trigger through scroll, resize, layout and ancestor changes. No-op if
   * the subscription is already running.
   */
  start() {
    if (this.cleanUp) return;
    this.cleanUp = autoUpdate(this.trigger, this.panel, () => this.reposition());
  }

  /**
   * Tears down the `autoUpdate` subscription. Idempotent — safe to call
   * multiple times, and before the first `start()`.
   */
  stop() {
    if (!this.cleanUp) return;
    this.cleanUp();
    this.cleanUp = undefined;
  }

  /**
   * Runs a single Floating UI `computePosition` pass and applies the
   * resulting styles to the panel (and the arrow, if configured).
   */
  reposition() {
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
        platform: {
          ...platform,
          // Floating UI's default `getOffsetParent` walks the ancestor tree
          // with the current `offsetParent` spec, which does not cross shadow
          // roots. `composed-offset-position` provides a ponyfill that walks
          // the composed tree, giving correct results when the trigger and
          // panel live in different shadow roots (or when either is a
          // descendant of a shadow root).
          //
          // Floating UI only calls `getOffsetParent` for `strategy: 'absolute'`;
          // it is a no-op for `strategy: 'fixed'`.
          getOffsetParent: (element: Element) => platform.getOffsetParent!(element, offsetParent),
        },
      });

      this.applyPanelPosition(x, y);
      this.applyArrowPosition(placement, middlewareData);
      this.applyVisibility(middlewareData);
    })();
  }

  /**
   * @deprecated Prefer `configure()` when only options change or `start()`
   * to (re)open the subscription. Kept for backward compatibility: reruns
   * the subscription with the merged options.
   */
  init(options: FloatingUIOptions) {
    this.options = Object.assign(this.options, options);
    this.stop();
    this.start();
  }

  /**
   * @deprecated Prefer `reposition()` for a one-off recompute or `start()`
   * to open the subscription. Kept for backward compatibility: ensures the
   * subscription is running and then repositions.
   */
  update() {
    this.start();
    this.reposition();
  }

  /**
   * @deprecated Alias for `stop()`. Kept for backward compatibility.
   */
  destroy() {
    this.stop();
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

  private applyPanelPosition(x: number, y: number) {
    Object.assign(this.panel.style, {
      top: '0',
      left: '0',
      transform: `translate(${this.roundByDPR(x)}px,${this.roundByDPR(y)}px)`,
    });
  }

  private applyArrowPosition(placement: string, middlewareData: MiddlewareData) {
    if (!this.options.arrow) return;

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

  private applyVisibility(middlewareData: MiddlewareData) {
    const { referenceHidden } = middlewareData.hide;
    Object.assign(this.panel.style, {
      visibility: referenceHidden ? 'hidden' : 'visible',
    });
  }

  private roundByDPR(value: number) {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(value * dpr) / dpr;
  }
}
