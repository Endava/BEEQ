import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { getTextContent } from '../../../shared/utils/slot';

describe('bq-empty-state', () => {
  it('should render', async () => {
    const { root } = await render(<bq-empty-state />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-empty-state />);
    expect(root).toHaveShadowRoot();
  });

  it('should render body slot content', async () => {
    const bodyText = 'You have a basic empty state';
    const { root } = await render(
      <bq-empty-state>
        <span slot="body">{bodyText}</span>
      </bq-empty-state>,
    );

    const slot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="body"]');

    expect(getTextContent(slot, { recurse: true })).toBe(bodyText);
  });

  it('should render footer slot content', async () => {
    const footerText = 'Footer action';
    const { root } = await render(
      <bq-empty-state>
        <span slot="footer">{footerText}</span>
      </bq-empty-state>,
    );

    const slot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer"]');

    expect(getTextContent(slot, { recurse: true })).toBe(footerText);
  });

  it('should render a custom thumbnail via thumbnail slot', async () => {
    const { root } = await render(
      <bq-empty-state>
        <img slot="thumbnail" src="custom.png" alt="Custom thumbnail" />
      </bq-empty-state>,
    );

    const slot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="thumbnail"]');
    const assigned = slot?.assignedElements({ flatten: true })[0];

    expect(assigned?.tagName.toLowerCase()).toBe('img');
  });

  it('should use default `medium` size', async () => {
    const { root } = await render(<bq-empty-state />);

    expect(root).toEqualAttribute('size', 'medium');

    const icon = root.shadowRoot?.querySelector<HTMLBqIconElement>('[part="icon"]');
    expect(icon?.size).toBe(80);
  });

  it('should render with `size="small"` and apply icon size 40', async () => {
    const { root } = await render(<bq-empty-state size="small" />);

    expect(root).toEqualAttribute('size', 'small');

    const icon = root.shadowRoot?.querySelector<HTMLBqIconElement>('[part="icon"]');
    expect(icon?.size).toBe(40);
  });

  it('should render with `size="large"` and apply icon size 180', async () => {
    const { root } = await render(<bq-empty-state size="large" />);

    expect(root).toEqualAttribute('size', 'large');

    const icon = root.shadowRoot?.querySelector<HTMLBqIconElement>('[part="icon"]');
    expect(icon?.size).toBe(180);
  });

  it('should fall back to `medium` size for invalid value and emit a console warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { root, waitForChanges } = await render(<bq-empty-state size={'invalid' as never} />);
    await waitForChanges();

    expect(root).toEqualAttribute('size', 'medium');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('"size" should be one of small|medium|large'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render default `bq-icon` in thumbnail when no thumbnail slot is provided', async () => {
    const { root } = await render(<bq-empty-state />);

    await waitForStable(root);

    const icon = root.shadowRoot?.querySelector<HTMLBqIconElement>('[part="icon"]');
    expect(icon).not.toBeNull();
    expect(icon?.name).toBe('database');
  });
});
