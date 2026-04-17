import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

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

describe('bq-tooltip', () => {
  let unmountFn: (() => void) | undefined;

  afterEach(async () => {
    await moveOff();
    unmountFn?.();
    unmountFn = undefined;
  });

  it('should render', async () => {
    const { root, unmount } = await render(mkTooltip());
    unmountFn = unmount;
    expect(root.querySelector('bq-tooltip')).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root, unmount } = await render(mkTooltip());
    unmountFn = unmount;
    expect(root.querySelector('bq-tooltip').shadowRoot).not.toBeNull();
  });

  it('should be hidden by default', async () => {
    const { root, unmount } = await render(mkTooltip());
    unmountFn = unmount;
    const panel = root.querySelector('bq-tooltip').shadowRoot.querySelector('[part="panel"]');
    expect(panel).toHaveAttribute('hidden');
  });

  it('should be visible on hover', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;

    const tooltip = root.querySelector('bq-tooltip');
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    expect(panel).toHaveAttribute('hidden');
    await userEvent.hover(trigger);
    await waitForChanges();

    expect(panel).not.toHaveAttribute('hidden');
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

    expect(panel).toHaveAttribute('hidden');
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

    expect(panel).not.toHaveAttribute('hidden');

    await moveOff();
    await waitForChanges();

    expect(panel).toHaveAttribute('hidden');
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
    expect(panel).toHaveAttribute('hidden');

    // Hover should NOT show it
    await userEvent.hover(trigger);
    await waitForChanges();
    expect(panel).toHaveAttribute('hidden');

    // Click should show it
    await userEvent.click(trigger);
    await waitForChanges();
    expect(panel).not.toHaveAttribute('hidden');
  });

  it('should not be visible on click if defaultPrevented', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;
    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector('[part="trigger"]');

    tooltip.displayOn = 'click';
    await waitForChanges();
    expect(panel).toHaveAttribute('hidden');

    tooltip.addEventListener('bqClick', (e: Event) => e.preventDefault(), { once: true });
    await userEvent.click(trigger);
    await waitForChanges();

    expect(panel).toHaveAttribute('hidden');
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
    expect(panel).not.toHaveAttribute('hidden');

    await userEvent.click(trigger);
    await waitForChanges();
    expect(panel).toHaveAttribute('hidden');
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
    expect(panel).not.toHaveAttribute('hidden');

    await userEvent.keyboard('{Escape}');
    await waitForChanges();
    expect(panel).toHaveAttribute('hidden');
  });

  it('should show and hide via public methods', async () => {
    const { root, unmount, waitForChanges } = await render(mkTooltip());
    unmountFn = unmount;
    const tooltip = root.querySelector('bq-tooltip') as HTMLBqTooltipElement;
    const panel = tooltip.shadowRoot.querySelector('[part="panel"]');

    expect(panel).toHaveAttribute('hidden');

    await tooltip.show();
    await waitForChanges();
    expect(panel).not.toHaveAttribute('hidden');

    await tooltip.hide();
    await waitForChanges();
    expect(panel).toHaveAttribute('hidden');
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
});
