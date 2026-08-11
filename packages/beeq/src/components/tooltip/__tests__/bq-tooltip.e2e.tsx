import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

const mkTooltip = () => (
  <div style={{ display: 'grid', placeItems: 'center', height: '100vh', width: '100vw' }}>
    <bq-tooltip>
      Yuhu! A tooltip!
      <bq-button slot="trigger">Hover me!</bq-button>
    </bq-tooltip>
  </div>
);

// userEvent.hover() physically moves the Playwright cursor to the element center via CDP.
// That position persists after unmount(), causing the next test's element (rendered at the
// same viewport center) to receive an automatic mouseenter before the test body runs.
// userEvent.unhover() doesn't help — it targets document.body center, same coordinates.
// Vitest exposes no API to move the cursor to arbitrary coords, so we use CDP directly.
const moveOff = () => cdp().send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
const expectPanelVisibility = (panel: Element, visible: boolean) => {
  expect(panel).toHaveAttribute('aria-hidden', String(!visible));
  expect(panel.matches(':popover-open')).toBe(visible);
};
const getArrowOffset = (arrow: HTMLElement) =>
  [arrow.style.top, arrow.style.right, arrow.style.bottom, arrow.style.left].find((value) => value === '-4px');
let unmountFn: (() => void) | undefined;

afterEach(async () => {
  await moveOff();
  unmountFn?.();
  unmountFn = undefined;
});

describe('bq-tooltip', () => {
  it('should render', async () => {
    const { root, unmount } = await render(mkTooltip());
    unmountFn = unmount;

    expect(root.querySelector('bq-tooltip')).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root, unmount } = await render(mkTooltip());
    unmountFn = unmount;

    expect(root.querySelector('bq-tooltip')).toHaveShadowRoot();
  });

  it('should be hidden by default', async () => {
    const { root, unmount } = await render(mkTooltip());
    unmountFn = unmount;

    const panel = root.querySelector('bq-tooltip').shadowRoot.querySelector('[part="panel"]');
    expectPanelVisibility(panel, false);
  });

  it('should be visible on hover', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip');
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    expectPanelVisibility(panel, false);
    await userEvent.hover(trigger);
    await waitForChanges();

    expectPanelVisibility(panel, true);
  });

  it('should not be visible on hover if defaultPrevented', async () => {
    const { root, unmount, spyOnEvent, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip');
    const bqHoverIn = spyOnEvent('bqHoverIn');
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    tooltip.addEventListener('bqHoverIn', (e: Event) => e.preventDefault(), { once: true });
    await userEvent.hover(trigger);
    await waitForChanges();

    expectPanelVisibility(panel, false);
    expect(bqHoverIn).toHaveReceivedEventTimes(1);
  });

  it('should hide on mouse out', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip');
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    await userEvent.hover(trigger);
    await waitForChanges();

    expectPanelVisibility(panel, true);

    await moveOff();
    await waitForChanges();

    expectPanelVisibility(panel, false);
  });

  it('should emit bqHoverIn and bqHoverOut events', async () => {
    const { root, unmount, spyOnEvent, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip');
    const bqHoverIn = spyOnEvent('bqHoverIn');
    const bqHoverOut = spyOnEvent('bqHoverOut');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    await userEvent.hover(trigger);
    await waitForChanges();
    await moveOff();
    await waitForChanges();

    expect(bqHoverIn).toHaveReceivedEventTimes(1);
    expect(bqHoverOut).toHaveReceivedEventTimes(1);
  });

  it('should be visible only on click if specified', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    tooltip.displayOn = 'click';
    await waitForChanges();
    expectPanelVisibility(panel, false);

    // Hover should NOT show it
    await userEvent.hover(trigger);
    await waitForChanges();
    expectPanelVisibility(panel, false);

    // Click should show it
    await userEvent.click(trigger);
    await waitForChanges();
    expectPanelVisibility(panel, true);
  });

  it('should not be visible on click if defaultPrevented', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    tooltip.displayOn = 'click';
    await waitForChanges();
    expectPanelVisibility(panel, false);

    tooltip.addEventListener('bqClick', (e: Event) => e.preventDefault(), { once: true });
    await userEvent.click(trigger);
    await waitForChanges();

    expectPanelVisibility(panel, false);
  });

  it('should toggle visibility on repeated clicks when displayOn is click', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    tooltip.displayOn = 'click';
    await waitForChanges();

    await userEvent.click(trigger);
    await waitForChanges();
    expectPanelVisibility(panel, true);

    await userEvent.click(trigger);
    await waitForChanges();
    expectPanelVisibility(panel, false);
  });

  it('should hide when Escape key is pressed when displayOn is click', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;
    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    tooltip.displayOn = 'click';
    await waitForChanges();

    await userEvent.click(trigger);
    await waitForChanges();
    expectPanelVisibility(panel, true);

    await userEvent.keyboard('{Escape}');
    await waitForChanges();
    expectPanelVisibility(panel, false);
  });

  it('should show and hide via public methods', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;
    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');

    expectPanelVisibility(panel, false);

    await tooltip.show();
    await waitForChanges();
    expectPanelVisibility(panel, true);

    await tooltip.hide();
    await waitForChanges();
    expectPanelVisibility(panel, false);
  });

  it('should show in specified position', async () => {
    const { root, unmount } = await render(
      <div style={{ padding: '200px' }}>
        <bq-tooltip>
          Yuhu! A tooltip!
          <bq-button slot="trigger">Hover me!</bq-button>
        </bq-tooltip>
      </div>,
    );
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    await userEvent.hover(trigger);
    await waitForStable(tooltip);

    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const leftValue = parseFloat(getComputedStyle(panel).left);
    expect(leftValue).toBeGreaterThanOrEqual(0);
  });

  it('should be visible when `visible` prop is set on initial render', async () => {
    const { root, unmount } = await render(
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', width: '100vw' }}>
        <bq-tooltip visible>
          Yuhu! A tooltip!
          <bq-button slot="trigger">Hover me!</bq-button>
        </bq-tooltip>
      </div>,
    );
    unmountFn = unmount;

    const panel = root.querySelector('bq-tooltip').shadowRoot.querySelector('[part="panel"]');
    expectPanelVisibility(panel, true);
    expect(panel).toHaveAttribute('popover', 'manual');
    expect(getComputedStyle(panel).position).toBe('absolute');
  });

  it('should retain the fixed-position fallback without the Popover API', async () => {
    const prototype = HTMLElement.prototype;
    const showPopover = Object.getOwnPropertyDescriptor(prototype, 'showPopover');
    const hidePopover = Object.getOwnPropertyDescriptor(prototype, 'hidePopover');
    let unmount: (() => void) | undefined;

    Object.defineProperty(prototype, 'showPopover', { configurable: true, value: undefined });
    Object.defineProperty(prototype, 'hidePopover', { configurable: true, value: undefined });

    try {
      const result = await render(mkTooltip());
      unmount = result.unmount;

      const tooltip = result.root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
      const panel = tooltip.shadowRoot.querySelector('[part="panel"]');

      expect(panel).not.toHaveAttribute('popover');
      expect(panel).toHaveAttribute('hidden');
      expect(getComputedStyle(panel).position).toBe('fixed');

      await tooltip.show();
      await result.waitForChanges();
      expect(panel).not.toHaveAttribute('hidden');
      expect(panel).toHaveAttribute('aria-hidden', 'false');
    } finally {
      unmount?.();
      if (showPopover) Object.defineProperty(prototype, 'showPopover', showPopover);
      if (hidePopover) Object.defineProperty(prototype, 'hidePopover', hidePopover);
    }
  });

  it('should stay visible when `always-visible` is set and hide() is called', async () => {
    const { root, unmount, waitForChanges } = await render(
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', width: '100vw' }}>
        <bq-tooltip always-visible>
          Yuhu! A tooltip!
          <bq-button slot="trigger">Hover me!</bq-button>
        </bq-tooltip>
      </div>,
    );
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');

    expectPanelVisibility(panel, true);

    await tooltip.hide();
    await waitForChanges();
    expectPanelVisibility(panel, true);
  });

  it('should react to `always-visible` changes', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');

    tooltip.alwaysVisible = true;
    await waitForChanges();
    expectPanelVisibility(panel, true);

    tooltip.alwaysVisible = false;
    await waitForChanges();
    expectPanelVisibility(panel, false);
  });

  it('should not render the arrow when `hide-arrow` is set', async () => {
    const { root, unmount } = await render(
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', width: '100vw' }}>
        <bq-tooltip hide-arrow>
          Yuhu! A tooltip!
          <bq-button slot="trigger">Hover me!</bq-button>
        </bq-tooltip>
      </div>,
    );
    unmountFn = unmount;
    const arrow = root.querySelector('bq-tooltip').shadowRoot.querySelector('.bq-tooltip--arrow');
    expect(arrow).toBeNull();
  });

  it('should replace the arrow reference when `hide-arrow` changes', async () => {
    const { root, unmount, waitForChanges } = await render(
      <div>
        <bq-tooltip always-visible>
          Yuhu! A tooltip!
          <bq-button slot="trigger">Hover me!</bq-button>
        </bq-tooltip>
      </div>,
    );
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const initialArrow = tooltip.shadowRoot.querySelector<HTMLElement>('.bq-tooltip--arrow');
    await expect.poll(() => getArrowOffset(initialArrow)).toBe('-4px');

    tooltip.hideArrow = true;
    await waitForChanges();
    expect(tooltip.shadowRoot.querySelector('.bq-tooltip--arrow')).toBeNull();

    tooltip.hideArrow = false;
    await waitForChanges();
    await waitForStable(tooltip);

    const replacementArrow = tooltip.shadowRoot.querySelector<HTMLElement>('.bq-tooltip--arrow');
    expect(replacementArrow).not.toBe(initialArrow);
    await expect.poll(() => getArrowOffset(replacementArrow)).toBe('-4px');
  });

  it('should clear the inline width when `same-width` is disabled', async () => {
    const { root, unmount, waitForChanges } = await render(
      <div>
        <bq-tooltip always-visible>
          Yuhu! A tooltip!
          <bq-button slot="trigger">A wider trigger label</bq-button>
        </bq-tooltip>
      </div>,
    );
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector<HTMLElement>('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector<HTMLElement>('[part="trigger"]');

    tooltip.sameWidth = true;
    await waitForChanges();
    await waitForStable(tooltip);
    expect(parseFloat(panel.style.width)).toBeCloseTo(trigger.getBoundingClientRect().width, 0);

    tooltip.sameWidth = false;
    await waitForChanges();
    expect(panel.style.width).toBe('');
  });

  it('should retain its trigger offset while a transformed ancestor scrolls', async () => {
    const { root, unmount } = await render(
      <div data-scroll-container style={{ height: '160px', overflow: 'auto', transform: 'translateZ(0)' }}>
        <div style={{ height: '700px', paddingTop: '350px' }}>
          <bq-tooltip always-visible placement="top">
            Yuhu! A tooltip!
            <bq-button slot="trigger">Hover me!</bq-button>
          </bq-tooltip>
        </div>
      </div>,
    );
    unmountFn = unmount;

    const scrollContainer = root as HTMLElement;
    const tooltip = root.querySelector('bq-tooltip');
    const panel = tooltip.shadowRoot.querySelector<HTMLElement>('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector<HTMLElement>('[part="trigger"]');

    await waitForStable(tooltip);
    const initialOffset = trigger.getBoundingClientRect().top - panel.getBoundingClientRect().bottom;

    scrollContainer.scrollTop = 200;
    scrollContainer.dispatchEvent(new Event('scroll'));
    await expect
      .poll(() => trigger.getBoundingClientRect().top - panel.getBoundingClientRect().bottom)
      .toBeCloseTo(initialOffset, 0);
  });

  it('should resume positioning after reconnection', async () => {
    const { root, unmount } = await render(
      <div data-parent>
        <bq-tooltip visible>
          Yuhu! A tooltip!
          <bq-button slot="trigger">Hover me!</bq-button>
        </bq-tooltip>
      </div>,
    );
    unmountFn = unmount;

    const parent = root as HTMLElement;
    const tooltip = root.querySelector('bq-tooltip');
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');

    await waitForStable(tooltip);
    expectPanelVisibility(panel, true);

    tooltip.remove();
    parent.append(tooltip);
    await waitForStable(tooltip);

    expectPanelVisibility(panel, true);
  });

  it('should emit bqFocusIn and bqFocusOut events on focus/blur', async () => {
    const { root, unmount, spyOnEvent, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const bqFocusIn = spyOnEvent('bqFocusIn');
    const bqFocusOut = spyOnEvent('bqFocusOut');

    const tooltip = root.querySelector('bq-tooltip');
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    // Use .focus()/.blur() instead of userEvent.click() to avoid triggering mouseenter
    // first — userEvent.click physically moves the Playwright cursor, which fires
    // handleTriggerMouseOver (sets visible=true) before focusin arrives, causing
    // handleTriggerFocusin to bail out on its `if (this.visible) return` guard.
    const button = tooltip.querySelector<HTMLElement>('bq-button');

    button.focus();
    await waitForChanges();
    expectPanelVisibility(panel, true);
    expect(bqFocusIn).toHaveReceivedEventTimes(1);

    button.blur();
    await waitForChanges();
    expectPanelVisibility(panel, false);
    expect(bqFocusOut).toHaveReceivedEventTimes(1);
  });

  it('should hide when clicking outside in click mode', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;
    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    tooltip.displayOn = 'click';
    await waitForChanges();

    await userEvent.click(trigger);
    await waitForChanges();
    expectPanelVisibility(panel, true);

    // Click outside the tooltip
    await userEvent.click(document.body);
    await waitForChanges();
    expectPanelVisibility(panel, false);
  });

  it('should respect design style', async () => {
    await render(mkTooltip());

    const styleProps = ['borderRadius', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] as const;
    const style = computedStyle('bq-tooltip >>> [part="panel"]', styleProps);

    expect(style.borderRadius).toBeTruthy();
    expect(style.paddingTop).toBeTruthy();
  });
});
