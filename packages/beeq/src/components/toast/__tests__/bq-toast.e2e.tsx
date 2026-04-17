import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

describe('bq-toast', () => {
  it('should render', async () => {
    const { root } = await render(<bq-toast />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-toast />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render as hidden', async () => {
    const { root } = await render(<bq-toast />);

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.classList.contains('is-hidden')).toBe(true);
  });

  it('should render as hidden with `open="false"`', async () => {
    const { root } = await render(<bq-toast open={false} />);

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.classList.contains('is-hidden')).toBe(true);
  });

  it('should render as open', async () => {
    const { root } = await render(<bq-toast open />);

    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.classList.contains('is-hidden')).toBe(false);
  });

  it('should render as open with `open="true"`', async () => {
    const { root } = await render(<bq-toast open={true} />);

    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.classList.contains('is-hidden')).toBe(false);
  });

  it('should display text', async () => {
    const { root } = await render(<bq-toast>Text</bq-toast>);

    expect(root.textContent.trim()).toBe('Text');
  });

  it('should display info icon by default', async () => {
    const { root } = await render(<bq-toast>Text</bq-toast>);

    const icon = root.shadowRoot.querySelector('bq-icon');
    expect(icon.getAttribute('name')).toBe('info-bold');
  });

  it('should display success icon', async () => {
    const { root } = await render(<bq-toast type="success">Text</bq-toast>);

    const icon = root.shadowRoot.querySelector('bq-icon');
    expect(icon.getAttribute('name')).toBe('check-circle-bold');
  });

  it('should display error icon', async () => {
    const { root } = await render(<bq-toast type="error">Text</bq-toast>);

    const icon = root.shadowRoot.querySelector('bq-icon');
    expect(icon.getAttribute('name')).toBe('x-circle-bold');
  });

  it('should display alert icon', async () => {
    const { root } = await render(<bq-toast type="alert">Text</bq-toast>);

    const icon = root.shadowRoot.querySelector('bq-icon');
    expect(icon.getAttribute('name')).toBe('warning-bold');
  });

  it('should display custom icon', async () => {
    const { root } = await render(
      <bq-toast>
        Text
        <bq-icon slot="icon" size="24" name="star-bold" />
      </bq-toast>,
    );

    const slot = root.shadowRoot.querySelector<HTMLSlotElement>('slot[name="icon"]');
    const assignedElement = slot.assignedElements({ flatten: true })[0];

    expect(assignedElement.getAttribute('name')).toBe('star-bold');
  });

  it('should hide the icon when `hide-icon` is set', async () => {
    const { root } = await render(<bq-toast hide-icon>Text</bq-toast>);

    const iconHolder = root.shadowRoot.querySelector('[part="icon"]');
    expect(iconHolder.classList.contains('!hidden')).toBe(true);
  });

  it('should emit bqShow event when shown', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-toast />);
    const bqShow = spyOnEvent('bqShow');

    await (root as HTMLBqToastElement).show();
    await waitForChanges();

    expect(bqShow).toHaveReceivedEventTimes(1);
  });

  it('should emit bqHide event when hidden', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-toast open />);
    const bqHide = spyOnEvent('bqHide');

    await (root as HTMLBqToastElement).hide();
    await waitForChanges();

    expect(bqHide).toHaveReceivedEventTimes(1);
  });

  it('should not show if bqShow is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-toast />);
    root.addEventListener('bqShow', (e: Event) => e.preventDefault(), { once: true });

    await (root as HTMLBqToastElement).show();
    await waitForChanges();

    expect(root.getAttribute('aria-hidden')).toBe('true');
  });

  it('should not hide if bqHide is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-toast open />);
    root.addEventListener('bqHide', (e: Event) => e.preventDefault(), { once: true });

    await (root as HTMLBqToastElement).hide();
    await waitForChanges();

    expect(root.getAttribute('aria-hidden')).toBe('false');
  });

  it('should respect design style', async () => {
    await render(<bq-toast>Text</bq-toast>);

    const styleProps = ['padding', 'borderRadius', 'gap'] as const;
    const style = computedStyle('bq-toast >>> [part="wrapper"]', styleProps);

    expect(style).toEqual({ padding: '12px 16px', borderRadius: '8px', gap: '8px' });
  });

  it('should show and hide via public methods', async () => {
    const { root, waitForChanges } = await render(<bq-toast />);
    const toast = root as HTMLBqToastElement;

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.getAttribute('hidden')).toBe('true');

    await toast.show();
    await waitForChanges();
    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.getAttribute('hidden')).toBe('false');

    await toast.hide();
    await waitForChanges();
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.getAttribute('hidden')).toBe('true');
  });
});
