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
  private repositionId = 0;

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
  }

  /**
   * Merges new options into the current configuration. Active instances
   * reposition without recreating their `autoUpdate` subscription; stopped
   * instances apply the options the next time they start.
   */
  configure(options: Partial<FloatingUIOptions>) {
    this.options = Object.assign(this.options, options);
    if (options.sameWidth === false) {
      this.panel.style.width = '';
    }
    if (!this.cleanUp) return;
    void this.reposition();
  }

  /**
   * Opens the `autoUpdate` subscription so the panel keeps tracking the
   * trigger through scroll, resize, layout and ancestor changes. No-op if
   * the subscription is already running.
   */
  start() {
    if (this.cleanUp) return;
    this.cleanUp = autoUpdate(this.trigger, this.panel, () => void this.reposition());
  }

  /**
   * Tears down the `autoUpdate` subscription. Idempotent — safe to call
   * multiple times, and before the first `start()`.
   */
  stop() {
    this.repositionId += 1;
    if (!this.cleanUp) return;
    this.cleanUp();
    this.cleanUp = undefined;
  }

  /**
   * Runs a single Floating UI `computePosition` pass and applies the
   * resulting styles to the panel (and the arrow, if configured).
   */
  async reposition() {
    const repositionId = ++this.repositionId;
    const { x, y, placement, middlewareData } = await computePosition(this.trigger, this.panel, {
      placement: this.options.placement,
      strategy: this.options.strategy,
      middleware: [
        offset({ mainAxis: this.options.distance, crossAxis: this.options.skidding }),
        flip(),
        shift(),
        size({
          apply: ({ rects, elements }) => {
            elements.floating.style.width = this.options.sameWidth ? `${rects.reference.width}px` : '';
          },
        }),
        arrow({ element: this.options.arrow || null }),
        this.positionChange(),
        hide(),
      ],
      platform: {
        ...platform,
        // The default offsetParent lookup does not cross shadow roots.
        getOffsetParent: (element: Element) => platform.getOffsetParent?.(element, offsetParent) ?? null,
      },
    });

    if (repositionId !== this.repositionId || !this.panel.isConnected) return;

    this.applyPanelPosition(x, y);
    this.applyArrowPosition(placement, middlewareData);
    this.applyVisibility(middlewareData);
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
    if (!this.cleanUp) {
      this.start();
      return;
    }
    void this.reposition();
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
