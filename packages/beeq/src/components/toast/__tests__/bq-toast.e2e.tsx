import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';

const getWrapper = (el: HTMLBqToastElement) => el.shadowRoot?.querySelector<HTMLOutputElement>('[part="wrapper"]');
const getIcon = (el: HTMLBqToastElement) => el.shadowRoot?.querySelector<HTMLElement>('[part="icon"]');

const resolveBoxShadowToken = (name: string) => {
  const probe = document.createElement('span');
  probe.style.boxShadow = `var(${name})`;
  document.body.appendChild(probe);
  const { boxShadow } = getComputedStyle(probe);
  probe.remove();
  return boxShadow;
};

describe('bq-toast', () => {
  it('should render', async () => {
    const { root } = await render(<bq-toast />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-toast />);

    expect(root).toHaveShadowRoot();
  });

  it('should render as hidden', async () => {
    const { root } = await render(<bq-toast />);

    expect(root).toHaveAttribute('aria-hidden');
    expect(root).toHaveAttribute('hidden');
  });

  it('should render as hidden with `open="false"`', async () => {
    const { root } = await render(<bq-toast open={false} />);

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('hidden');
  });

  it('should render as open', async () => {
    const { root } = await render(<bq-toast open />);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveAttribute('hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const { root } = await render(<bq-toast open={true} />);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveAttribute('hidden');
  });

  it('should display text', async () => {
    const { root } = await render(<bq-toast>Text</bq-toast>);

    expect(root.textContent.trim()).toBe('Text');
  });

  it('should display info icon by default', async () => {
    const { root } = await render(<bq-toast>Text</bq-toast>);

    const icon = root.shadowRoot.querySelector('bq-icon');
    expect(icon).toEqualAttribute('name', 'info-bold');
  });

  it('should display success icon', async () => {
    const { root } = await render(<bq-toast type="success">Text</bq-toast>);

    const icon = root.shadowRoot.querySelector('bq-icon');
    expect(icon).toEqualAttribute('name', 'check-circle-bold');
  });

  it('should display error icon', async () => {
    const { root } = await render(<bq-toast type="error">Text</bq-toast>);

    const icon = root.shadowRoot.querySelector('bq-icon');
    expect(icon).toEqualAttribute('name', 'x-circle-bold');
  });

  it('should display alert icon', async () => {
    const { root } = await render(<bq-toast type="alert">Text</bq-toast>);

    const icon = root.shadowRoot.querySelector('bq-icon');
    expect(icon).toEqualAttribute('name', 'warning-bold');
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

    expect(assignedElement).toEqualAttribute('name', 'star-bold');
  });

  it('should hide the icon when `hide-icon` is set', async () => {
    const { root } = await render(
      <bq-toast hide-icon open>
        Text
      </bq-toast>,
    );

    expect(getIcon(root as HTMLBqToastElement)).toHaveAttribute('hidden');

    const style = computedStyle('bq-toast >>> [part="icon"]', ['display']);
    expect(style).toEqual({ display: 'none' });
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

    expect(root).toEqualAttribute('aria-hidden', 'true');
  });

  it('should not hide if bqHide is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-toast open />);
    root.addEventListener('bqHide', (e: Event) => e.preventDefault(), { once: true });

    await (root as HTMLBqToastElement).hide();
    await waitForChanges();

    expect(root).toEqualAttribute('aria-hidden', 'false');
  });

  it('should respect design style', async () => {
    const { root } = await render(<bq-toast open>Text</bq-toast>);
    const toast = root as HTMLBqToastElement;
    const wrapper = getWrapper(toast);

    await waitForStable(root);

    const wrapperStyle = getComputedStyle(wrapper);

    expect(getComputedStyle(root).display).toBe('inline-block');
    expect(wrapperStyle.display).toBe('flex');
    expect(wrapperStyle.alignItems).toBe('center');
    expect(wrapperStyle.padding).toBe('12px 16px');
    expect(wrapperStyle.borderRadius).toBe('8px');
    expect(wrapperStyle.gap).toBe('8px');
    expect(wrapperStyle.backgroundColor).toBe(resolveColorToken('--bq-ui--primary', root));
    expect(wrapperStyle.borderStyle).toBe('none');
    expect(wrapperStyle.boxShadow).toBe(resolveBoxShadowToken('--bq-box-shadow--l'));
    expect(wrapperStyle.animationName.split(', ')).toEqual(['fade-in', 'slide-in']);
    expect(wrapperStyle.animationDuration.split(', ')).toEqual(['0.3s', '0.3s']);
    expect(wrapperStyle.animationTimingFunction.split(', ')).toEqual(['ease', 'ease']);
  });

  it('should preserve every border radius variant', async () => {
    const radii = {
      none: '0px',
      xs2: '2px',
      xs: '4px',
      s: '8px',
      m: '12px',
      l: '24px',
      full: '9999px',
    } as const;

    for (const [border, radius] of Object.entries(radii)) {
      const { root } = await render(
        <bq-toast border={border as keyof typeof radii} open>
          Text
        </bq-toast>,
      );

      expect(root).toEqualAttribute('border', border);
      expect(getComputedStyle(getWrapper(root as HTMLBqToastElement)).borderRadius).toBe(radius);
    }
  });

  it('should preserve public CSS variable overrides', async () => {
    const { root } = await render(
      <bq-toast
        open
        style={{
          '--bq-toast--background': 'rgb(1, 2, 3)',
          '--bq-toast--border-color': 'rgb(4, 5, 6)',
          '--bq-toast--border-radius': '20px',
          '--bq-toast--border-style': 'solid',
          '--bq-toast--border-width': '2px',
          '--bq-toast--gap': '6px',
          '--bq-toast--padding-x': '18px',
          '--bq-toast--padding-y': '10px',
        }}
      >
        Text
      </bq-toast>,
    );

    const style = getComputedStyle(getWrapper(root as HTMLBqToastElement));

    expect(style.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(style.borderColor).toBe('rgb(4, 5, 6)');
    expect(style.borderRadius).toBe('20px');
    expect(style.borderStyle).toBe('solid');
    expect(style.borderWidth).toBe('2px');
    expect(style.gap).toBe('6px');
    expect(style.padding).toBe('10px 18px');
  });

  it('should show and hide via public methods', async () => {
    const { root, waitForChanges } = await render(<bq-toast />);
    const toast = root as HTMLBqToastElement;

    expect(toast).toEqualAttribute('aria-hidden', 'true');
    expect(toast).toHaveAttribute('hidden');

    await toast.show();
    await waitForChanges();

    expect(toast).toEqualAttribute('aria-hidden', 'false');
    expect(toast).not.toHaveAttribute('hidden');

    await toast.hide();
    await waitForChanges();

    expect(toast).toEqualAttribute('aria-hidden', 'true');
    expect(toast).toHaveAttribute('hidden');
  });

  it('should map the icon color variables to the icon role tokens', async () => {
    const { root } = await render(<bq-toast>Text</bq-toast>);

    const hostStyle = getComputedStyle(root);
    const roles = {
      alert: 'warning',
      custom: 'primary',
      error: 'danger',
      info: 'info',
      loading: 'brand',
      success: 'success',
    };

    Object.entries(roles).forEach(([type, role]) => {
      expect(hostStyle.getPropertyValue(`--bq-toast--icon-color-${type}`).trim()).toBe(
        hostStyle.getPropertyValue(`--bq-icon--${role}`).trim(),
      );
    });
  });

  it('should use the info icon token (not brand) for `type="info"`', async () => {
    await render(<bq-toast type="info">Text</bq-toast>);

    const { color } = computedStyle('bq-toast >>> [part="icon"]', ['color']);

    expect(color).toBe(resolveColorToken('--bq-icon--info'));
    expect(color).not.toBe(resolveColorToken('--bq-icon--brand'));
  });

  it('should use the brand icon token for `type="loading"`', async () => {
    const { root } = await render(
      <bq-toast open type="loading">
        Text
      </bq-toast>,
    );

    const { color } = computedStyle('bq-toast >>> [part="icon"]', ['color']);
    const iconStyle = getComputedStyle(getIcon(root as HTMLBqToastElement));

    expect(color).toBe(resolveColorToken('--bq-icon--brand'));
    expect(iconStyle.animationName).toBe('spin');
    expect(iconStyle.animationDuration).toBe('1s');
    expect(iconStyle.animationIterationCount).toBe('infinite');
    expect(iconStyle.animationTimingFunction).toBe('linear');
  });
});
