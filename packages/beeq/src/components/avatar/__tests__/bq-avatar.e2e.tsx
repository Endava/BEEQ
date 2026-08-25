import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

describe('bq-avatar', () => {
  it('should render', async () => {
    const { root } = await render(<bq-avatar />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-avatar />);
    expect(root).toHaveShadowRoot();
  });

  it('should render initials', async () => {
    const { root } = await render(<bq-avatar initials="JS" />);

    const textPart = root.shadowRoot?.querySelector('[part="text"]');
    expect(textPart).not.toBeNull();
    expect(textPart?.textContent.trim()).toBe('JS');
  });

  it('should trim initials based on size', async () => {
    const { root } = await render(<bq-avatar initials="JOHN" size="xsmall" />);

    const textPart = root.shadowRoot?.querySelector('[part="text"]');
    // xsmall trims to 1 character
    expect(textPart?.textContent.trim()).toBe('J');
  });

  it('should render image', async () => {
    const { root } = await render(
      <bq-avatar image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?auto=format&fit=crop&w=100&q=80" />,
    );

    const imgPart = root.shadowRoot?.querySelector('[part="img"]');
    expect(imgPart).not.toBeNull();
  });

  it('should fall back to initials when image fails to load', async () => {
    const { root, waitForChanges } = await render(<bq-avatar image="invalid-url.jpg" initials="JS" />);

    const img = root.shadowRoot?.querySelector<HTMLImageElement>('[part="img"]');

    if (img) {
      // Image hasn't failed yet — wait for the error event then let Stencil re-render
      await new Promise<void>((resolve) => img.addEventListener('error', () => resolve(), { once: true }));
      await waitForChanges();
    }
    // else: error already fired during render(), component already re-rendered

    expect(root.shadowRoot?.querySelector('[part="img"]')).toBeNull();
    expect(root.shadowRoot?.querySelector('[part="text"]')).not.toBeNull();
  });

  it('should render with badge slot', async () => {
    const { root } = await render(
      <bq-avatar initials="JS" shape="circle" size="medium">
        <bq-badge slot="badge" text-color="#fff">
          9
        </bq-badge>
      </bq-avatar>,
    );

    const badge = root.querySelector('bq-badge');
    expect(badge).not.toBeNull();
  });

  it('should set aria-label from label prop', async () => {
    const { root } = await render(<bq-avatar initials="JS" label="John Doe profile picture" />);

    const base = root.shadowRoot?.querySelector('[part="base"]');
    expect(base).toEqualAttribute('aria-label', 'John Doe profile picture');
  });

  it('should respect design style', async () => {
    const { root } = await render(
      <div>
        <bq-avatar initials="JS" shape="circle" size="xsmall" />
        <bq-avatar initials="JS" shape="square" size="xsmall" />
        <bq-avatar initials="JS" shape="square" size="small" />
        <bq-avatar initials="JS" shape="square" size="medium" />
        <bq-avatar initials="JS" shape="square" size="large" />
      </div>,
    );

    await waitForStable(root);

    const styleProps = ['width', 'borderRadius', 'height'] as const;

    const circleStyle = computedStyle('bq-avatar[shape="circle"] >>> [part="base"]', styleProps);
    const xsmallSquareStyle = computedStyle('bq-avatar[shape="square"][size="xsmall"] >>> [part="base"]', styleProps);
    const smallSquareStyle = computedStyle('bq-avatar[shape="square"][size="small"] >>> [part="base"]', styleProps);
    const mediumSquareStyle = computedStyle('bq-avatar[shape="square"][size="medium"] >>> [part="base"]', styleProps);
    const largeSquareStyle = computedStyle('bq-avatar[shape="square"][size="large"] >>> [part="base"]', styleProps);

    expect(circleStyle).toEqual({ borderRadius: '9999px', height: '24px', width: '24px' });
    expect(xsmallSquareStyle).toEqual({ borderRadius: '4px', height: '24px', width: '24px' });
    expect(smallSquareStyle).toEqual({ borderRadius: '8px', height: '32px', width: '32px' });
    expect(mediumSquareStyle).toEqual({ borderRadius: '12px', height: '48px', width: '48px' });
    expect(largeSquareStyle).toEqual({ borderRadius: '12px', height: '64px', width: '64px' });
  });
});
