import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  hide,
  type MiddlewareData,
  offset,
  type Placement,
  type ReferenceElement,
  shift,
  size,
} from '@floating-ui/dom';

import type { FloatingUIOptions } from '../../interfaces';

const STATIC_SIDE_BY_PLACEMENT = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const;

/**
 * Thin wrapper around Floating UI that owns the shared middleware pipeline
 * and ensures each instance has at most one `autoUpdate` subscription.
 *
 * Lifecycle:
 * - `start()` starts position tracking and performs an initial reposition.
 * - `stop()` stops tracking and invalidates pending positioning results.
 * - `reposition()` computes and applies the position once.
 * - `configure(options)` updates options and repositions only when active.
 */
export class FloatingUI {
  readonly panel: HTMLElement;
  readonly trigger: ReferenceElement;
  readonly options: FloatingUIOptions;
  private cleanup: (() => void) | undefined;
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
  configure(options: Partial<FloatingUIOptions>): void {
    Object.assign(this.options, options);
    this.repositionId += 1;

    if (options.sameWidth === false) {
      this.panel.style.width = '';
    }
    if (!this.cleanup) return;

    void this.reposition();
  }

  /**
   * Opens the `autoUpdate` subscription so the panel keeps tracking the
   * trigger through scroll, resize, layout and ancestor changes. No-op if
   * the subscription is already running.
   */
  start(): void {
    if (this.cleanup) return;

    this.cleanup = autoUpdate(this.trigger, this.panel, () => void this.reposition());
  }

  /**
   * Tears down the `autoUpdate` subscription. Idempotent — safe to call
   * multiple times, and before the first `start()`.
   */
  stop(): void {
    this.repositionId += 1;
    if (!this.cleanup) return;

    this.cleanup();
    this.cleanup = undefined;
  }

  /**
   * Runs a single Floating UI `computePosition` pass and applies the
   * resulting styles to the panel (and the arrow, if configured).
   */
  async reposition(): Promise<void> {
    const repositionId = ++this.repositionId;
    const {
      arrow: arrowElement,
      distance,
      onPositionChange,
      placement: configuredPlacement,
      sameWidth,
      skidding,
      strategy,
    } = this.options;
    const { x, y, placement, middlewareData } = await computePosition(this.trigger, this.panel, {
      placement: configuredPlacement,
      strategy,
      middleware: [
        offset({ mainAxis: distance, crossAxis: skidding }),
        flip(),
        shift(),
        size({
          apply: ({ rects, elements }) => {
            if (repositionId !== this.repositionId || !elements.floating.isConnected) return;
            elements.floating.style.width = sameWidth ? `${rects.reference.width}px` : '';
          },
        }),
        ...(arrowElement ? [arrow({ element: arrowElement })] : []),
        hide(),
      ],
    });

    if (repositionId !== this.repositionId || !this.panel.isConnected) return;

    this.applyPanelPosition(x, y);
    this.applyArrowPosition(arrowElement, placement, middlewareData);
    this.applyVisibility(middlewareData);

    onPositionChange?.(placement);
  }

  private applyPanelPosition(x: number, y: number): void {
    const dpr = window.devicePixelRatio || 1;
    const roundedX = Math.round(x * dpr) / dpr;
    const roundedY = Math.round(y * dpr) / dpr;

    Object.assign(this.panel.style, {
      top: '0',
      left: '0',
      transform: `translate(${roundedX}px, ${roundedY}px)`,
    });
  }

  private applyArrowPosition(
    arrowElement: HTMLElement | null | undefined,
    placement: Placement,
    middlewareData: MiddlewareData,
  ): void {
    if (!arrowElement) return;

    const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};
    const basePlacement = placement.split('-')[0] as keyof typeof STATIC_SIDE_BY_PLACEMENT;
    const staticSide = STATIC_SIDE_BY_PLACEMENT[basePlacement];

    Object.assign(arrowElement.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide]: '-4px',
    });
  }

  private applyVisibility(middlewareData: MiddlewareData): void {
    const referenceHidden = middlewareData.hide?.referenceHidden;
    this.panel.style.visibility = referenceHidden ? 'hidden' : 'visible';
  }
}
