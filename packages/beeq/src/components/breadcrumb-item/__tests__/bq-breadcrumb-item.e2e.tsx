import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

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
});
