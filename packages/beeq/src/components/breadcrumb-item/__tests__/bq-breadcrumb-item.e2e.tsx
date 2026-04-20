import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-breadcrumb-item', () => {
  it('should render', async () => {
    const { root } = await render(<bq-breadcrumb-item />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-breadcrumb-item />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const { root } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);

    await waitForStable(root);

    expect(root.textContent?.trim()).toBe('Home');
  });

  it('should render `button` tag', async () => {
    const { root } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);

    const element = root.shadowRoot.querySelector('.breadcrumb-item');

    expect(element?.tagName.toLowerCase()).toBe('button');
  });

  it('should render `a` tag', async () => {
    const { root } = await render(<bq-breadcrumb-item href="https://example.com/">Home</bq-breadcrumb-item>);

    const element = root.shadowRoot.querySelector('.breadcrumb-item');

    expect(element?.tagName.toLowerCase()).toBe('a');
  });

  it('should apply `target` and `rel` to anchor items', async () => {
    const { root } = await render(
      <bq-breadcrumb-item href="https://example.com/" rel="external" target="_blank">
        Home
      </bq-breadcrumb-item>,
    );

    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('.breadcrumb-item');

    expect(element.target).toBe('_blank');
    expect(element.rel).toBe('noreferrer noopener');
  });

  it('should emit focus, click, and blur events', async () => {
    const { root, spyOnEvent } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);
    const element = root.shadowRoot?.querySelector<HTMLButtonElement>('.breadcrumb-item');

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.click(element);
    await userEvent.tab();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });
});
