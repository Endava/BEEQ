import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

describe('bq-icon', () => {
  it('should render', async () => {
    const { root } = await render(<bq-icon />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-icon />);
    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display icon', async () => {
    const { root } = await render(<bq-icon name="pulse" />);

    const element = root.shadowRoot?.querySelector<Element>('[part="svg"]');
    expect(element?.innerHTML).toBeDefined();
    expect(element?.innerHTML).toEqualHtml(`
      <path d="M240,128a8,8,0,0,1-8,8H204.94l-37.78,75.58A8,8,0,0,1,160,216h-.4a8,8,0,0,1-7.08-5.14L95.35,60.76,63.28,131.31A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.85L88.72,36.69a8,8,0,0,1,14.76.46l57.51,151,31.85-63.71A8,8,0,0,1,200,120h32A8,8,0,0,1,240,128Z"></path>
    `);
  });

  it('should handle `name` property change', async () => {
    const { root, waitForChanges } = await render(<bq-icon name="pulse" />);

    await waitForStable(root);
    root.setAttribute('name', 'check');
    await waitForChanges();

    const element = root.shadowRoot?.querySelector<Element>('[part="svg"]');

    expect(element?.innerHTML).toBeDefined();
    expect(element?.innerHTML).toEqualHtml(`
          <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
        `);
  });

  it('should respect design style', async () => {
    const { root } = await render(<bq-icon name="pulse"></bq-icon>);

    await waitForStable(root);

    const style = computedStyle('bq-icon >>> [part="base"]', ['height']);
    expect(style).toEqual({ height: '24px' });
  });

  it('should change size', async () => {
    await render(<bq-icon name="pulse" size="30"></bq-icon>);

    const style = computedStyle('bq-icon >>> [part="base"]', ['height']);
    expect(style).toEqual({ height: '30px' });
  });

  it('should set `aria-label` from the `label` prop', async () => {
    const label = 'Pulse waveform icon';
    const { root } = await render(<bq-icon name="pulse" label={label} />);

    await waitForStable(root);

    const base = root.shadowRoot?.querySelector<HTMLDivElement>('[part="base"]');
    expect(base).toEqualAttribute('aria-label', label);
  });

  it('should use `"[name] icon"` as default `aria-label` when no `label` is provided', async () => {
    const { root } = await render(<bq-icon name="pulse" />);

    await waitForStable(root);

    const base = root.shadowRoot?.querySelector<HTMLDivElement>('[part="base"]');
    expect(base).toEqualAttribute('aria-label', 'pulse icon');
  });

  it('should reflect the `color` attribute', async () => {
    const { root } = await render(<bq-icon name="pulse" color="text--brand" />);

    expect(root).toEqualAttribute('color', 'text--brand');
  });

  it('should emit `svgLoaded` event when the SVG content is loaded', async () => {
    // Render without a name so no SVG is fetched yet, then spy before triggering load
    const { root, spyOnEvent, waitForChanges } = await render(<bq-icon />);
    const svgLoaded = spyOnEvent('svgLoaded');

    root.setAttribute('name', 'pulse');
    await waitForChanges();
    await waitForStable(root);

    expect(svgLoaded).toHaveReceivedEvent();
  });
});
