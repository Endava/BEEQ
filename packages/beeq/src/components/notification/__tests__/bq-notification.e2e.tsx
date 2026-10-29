import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { page } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';

const resolveBoxShadowToken = (name: string) => {
  const probe = document.createElement('span');
  probe.style.boxShadow = `var(${name})`;
  document.body.appendChild(probe);
  const { boxShadow } = getComputedStyle(probe);
  probe.remove();
  return boxShadow;
};

describe('bq-notification', () => {
  it('should render', async () => {
    const { root } = await render(<bq-notification />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-notification />);

    expect(root).toHaveShadowRoot();
  });

  it('should render as hidden by default', async () => {
    const { root } = await render(<bq-notification />);

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('hidden');
  });

  it('should render as hidden with `open="false"`', async () => {
    const { root } = await render(<bq-notification open={'false' as never}></bq-notification>);

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('hidden');
  });

  it('should render as open with `open`', async () => {
    const { root } = await render(<bq-notification open></bq-notification>);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveAttribute('hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const { root } = await render(<bq-notification open={'true' as never}></bq-notification>);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveAttribute('hidden');
  });

  it('should render body slot content', async () => {
    const { root } = await render(
      <bq-notification>
        {'Notification title'}
        <span slot="body">You have a new chat message</span>
      </bq-notification>,
    );

    const bodySlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="body"]');
    expect(bodySlot).not.toBeNull();
  });

  it('should render footer slot content', async () => {
    const { root } = await render(
      <bq-notification>
        Notification title
        <div slot="footer">
          <bq-button>Button</bq-button>
        </div>
      </bq-notification>,
    );

    const footerSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer"]');
    expect(footerSlot).not.toBeNull();
  });

  it('should show the icon for `type="info"` by default', async () => {
    const { root } = await render(<bq-notification type="info">Notification title</bq-notification>);

    const iconOutline = root.shadowRoot?.querySelector('[part="icon-outline"]');
    expect(iconOutline).not.toBeNull();
    expect(iconOutline).not.toHaveAttribute('hidden');
  });

  it('should hide the icon when `hide-icon` is set', async () => {
    const { root } = await render(
      <bq-notification type="info" hide-icon>
        Notification title
      </bq-notification>,
    );

    const iconOutline = root.shadowRoot?.querySelector('[part="icon-outline"]');
    expect(iconOutline).toHaveAttribute('hidden');
  });

  it('should render custom icon via `icon` slot when `has-custom-icon` is set', async () => {
    const { root } = await render(
      <bq-notification has-custom-icon>
        <bq-avatar slot="icon" label="Avatar component label" initials="JS" shape="circle" size="small"></bq-avatar>
        Notification title
      </bq-notification>,
    );

    const iconSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="icon"]');
    expect(iconSlot).not.toBeNull();
  });

  it('should show the close button by default', async () => {
    const { root } = await render(<bq-notification open>Notification title</bq-notification>);

    const closeBtn = root.shadowRoot?.querySelector('[part="btn-close"]');
    expect(closeBtn).not.toBeNull();
  });

  it('should hide the close button when `disable-close` is set', async () => {
    const { root } = await render(
      <bq-notification open disable-close>
        Notification title
      </bq-notification>,
    );

    const closeBtn = root.shadowRoot?.querySelector('[part="btn-close"]');
    expect(closeBtn).toBeNull();
  });

  it('should show and hide via `show()` and `hide()` public methods', async () => {
    const { root, waitForChanges } = await render(<bq-notification>Notification title</bq-notification>);

    const notification = root as HTMLBqNotificationElement;

    await notification.show();
    await waitForChanges();
    await waitForStable(root);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveAttribute('hidden');

    await notification.hide();
    await waitForChanges();
    await waitForStable(root);

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('hidden');
  });

  it('should emit `bqShow` and `bqAfterOpen` when shown', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-notification>Notification title</bq-notification>);

    const bqShow = spyOnEvent('bqShow');
    const bqAfterOpen = spyOnEvent('bqAfterOpen');

    await (root as HTMLBqNotificationElement).show();
    await waitForChanges();
    await waitForStable(root);

    expect(bqShow).toHaveReceivedEventTimes(1);
    expect(bqAfterOpen).toHaveReceivedEventTimes(1);
  });

  it('should emit `bqHide` and `bqAfterClose` when hidden', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-notification open>Notification title</bq-notification>,
    );

    const bqHide = spyOnEvent('bqHide');
    const bqAfterClose = spyOnEvent('bqAfterClose');

    await (root as HTMLBqNotificationElement).hide();
    await waitForChanges();
    await waitForStable(root);

    expect(bqHide).toHaveReceivedEventTimes(1);
    expect(bqAfterClose).toHaveReceivedEventTimes(1);
  });

  it('should reflect the `border` prop', async () => {
    const { root } = await render(<bq-notification border="m">Notification title</bq-notification>);

    expect(root).toEqualAttribute('border', 'm');
  });

  it('should reflect all `type` values', async () => {
    for (const type of ['error', 'info', 'neutral', 'success', 'warning'] as const) {
      const { root } = await render(<bq-notification type={type}>Notification title</bq-notification>);
      expect(root).toEqualAttribute('type', type);
    }
  });

  it('should auto-dismiss after `time` when `auto-dismiss` is set', async () => {
    const TIME = 50;
    const { root, waitForChanges } = await render(
      <bq-notification open auto-dismiss time={TIME}>
        Notification title
      </bq-notification>,
    );

    expect(root).toEqualAttribute('aria-hidden', 'false');

    // Wait for debounce (TIME) + leave transition (100ms) + buffer
    await new Promise((resolve) => setTimeout(resolve, TIME + 300));
    await waitForChanges();
    await waitForStable(root);

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('hidden');
  });

  it('should map the icon color variables to the icon role tokens', async () => {
    const { root } = await render(<bq-notification open>Notification title</bq-notification>);

    const hostStyle = getComputedStyle(root);
    const roles = {
      error: 'danger',
      info: 'info',
      neutral: 'primary',
      success: 'success',
      warning: 'warning',
    };

    Object.entries(roles).forEach(([type, role]) => {
      expect(hostStyle.getPropertyValue(`--bq-notification--icon-color-${type}`).trim()).toBe(
        hostStyle.getPropertyValue(`--bq-icon--${role}`).trim(),
      );
    });
  });

  it('should use the info icon token (not brand) for `type="info"`', async () => {
    await render(
      <bq-notification open type="info">
        Notification title
      </bq-notification>,
    );

    const { color } = computedStyle('bq-notification >>> [part="icon-outline"]', ['color']);

    expect(color).toBe(resolveColorToken('--bq-icon--info'));
    expect(color).not.toBe(resolveColorToken('--bq-icon--brand'));
  });

  it('should preserve native layout, spacing, typography and transition styles', async () => {
    const { root } = await render(
      <bq-notification open>
        Notification title
        <span slot="body">Body content</span>
        <div slot="footer">Footer content</div>
      </bq-notification>,
    );

    await waitForStable(root);

    const wrapper = root.shadowRoot?.querySelector<HTMLElement>('[part="wrapper"]');
    const close = root.shadowRoot?.querySelector<HTMLElement>('[part="btn-close"]');
    const icon = root.shadowRoot?.querySelector<HTMLElement>('[part="icon-outline"]');
    const main = root.shadowRoot?.querySelector<HTMLElement>('[part="main"]');
    const content = root.shadowRoot?.querySelector<HTMLElement>('[part="content"]');
    const title = root.shadowRoot?.querySelector<HTMLElement>('[part="title"]');
    const body = root.shadowRoot?.querySelector<HTMLElement>('[part="body"]');
    const footer = root.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');
    const bodyContent = root.querySelector<HTMLElement>('[slot="body"]');
    const footerContent = root.querySelector<HTMLElement>('[slot="footer"]');
    const wrapperStyle = getComputedStyle(wrapper);

    expect(getComputedStyle(root).display).toBe('block');
    expect(wrapperStyle.position).toBe('relative');
    expect(wrapperStyle.display).toBe('flex');
    expect(wrapperStyle.minInlineSize).toBe('320px');
    expect(wrapperStyle.padding).toBe('16px');
    expect(wrapperStyle.borderRadius).toBe('8px');
    expect(wrapperStyle.boxShadow).toBe(resolveBoxShadowToken('--bq-box-shadow--l'));
    expect(getComputedStyle(close).position).toBe('absolute');
    expect(getComputedStyle(close).insetInlineEnd).toBe('16px');
    expect(getComputedStyle(icon).display).toBe('flex');
    expect(getComputedStyle(icon).marginInlineEnd).toBe('8px');
    expect(getComputedStyle(main).display).toBe('flex');
    expect(getComputedStyle(main).rowGap).toBe('16px');
    expect(getComputedStyle(content).rowGap).toBe('12px');
    expect(getComputedStyle(title).fontWeight).toBe('600');
    expect(getComputedStyle(title).lineHeight).toBe('24px');
    expect(getComputedStyle(body).fontSize).toBe('14px');
    expect(getComputedStyle(footer).columnGap).toBe('8px');
    expect(getComputedStyle(bodyContent).marginBlockStart).toBe('0px');
    expect(getComputedStyle(footerContent).display).toBe('block');
    expect(getComputedStyle(footerContent).marginBlockStart).toBe('0px');

    wrapper.classList.add('is-entering', 'is-enter-start');
    const transitionStyle = getComputedStyle(wrapper);
    expect(transitionStyle.transitionProperty.split(', ')).toEqual(expect.arrayContaining(['opacity', 'transform']));
    expect(transitionStyle.transitionDuration).toBe('0.3s');
    expect(transitionStyle.transitionTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)');
    await expect.poll(() => getComputedStyle(wrapper).opacity).toBe('0');
    expect(getComputedStyle(wrapper).transform).not.toBe('none');
    wrapper.classList.remove('is-entering', 'is-enter-start');

    wrapper.classList.add('is-leaving', 'is-leave-end');
    expect(getComputedStyle(wrapper).transitionDuration).toBe('0.1s');
    expect(getComputedStyle(wrapper).transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 1, 1)');
    await expect.poll(() => getComputedStyle(wrapper).opacity).toBe('0');
    expect(getComputedStyle(wrapper).transform).not.toBe('none');
    wrapper.classList.remove('is-leaving', 'is-leave-end');
  });

  it('should preserve desktop inline-axis transition geometry', async () => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    try {
      await page.viewport(800, viewport.height);
      const { root } = await render(<bq-notification open>Notification title</bq-notification>);
      const wrapper = root.shadowRoot?.querySelector<HTMLElement>('[part="wrapper"]');

      wrapper.classList.add('is-entering', 'is-enter-start');
      await expect.poll(() => getComputedStyle(wrapper).transform).toBe('matrix(1, 0, 0, 1, 12, 0)');
    } finally {
      await page.viewport(viewport.width, viewport.height);
    }
  });

  it('should preserve public layout overrides', async () => {
    const { root } = await render(
      <bq-notification
        open
        style={{
          '--bq-notification--content-footer-gap': '10px',
          '--bq-notification--min-width': '360px',
          '--bq-notification--padding': '20px',
          '--bq-notification--title-body-gap': '6px',
        }}
      >
        Notification title
        <span slot="body">Body content</span>
        <div slot="footer">Footer content</div>
      </bq-notification>,
    );

    await waitForStable(root);

    const wrapper = root.shadowRoot?.querySelector<HTMLElement>('[part="wrapper"]');
    const main = root.shadowRoot?.querySelector<HTMLElement>('[part="main"]');
    const content = root.shadowRoot?.querySelector<HTMLElement>('[part="content"]');

    expect(getComputedStyle(wrapper).minInlineSize).toBe('360px');
    expect(getComputedStyle(wrapper).padding).toBe('20px');
    expect(getComputedStyle(main).rowGap).toBe('10px');
    expect(getComputedStyle(content).rowGap).toBe('6px');
  });

  it('should hide optional icon, body and footer with native hidden state', async () => {
    const { root } = await render(
      <bq-notification hideIcon open>
        Notification title
      </bq-notification>,
    );

    await waitForStable(root);

    const icon = root.shadowRoot?.querySelector<HTMLElement>('[part="icon-outline"]');
    const body = root.shadowRoot?.querySelector<HTMLElement>('[part="body"]');
    const footer = root.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');

    expect(icon).toHaveAttribute('hidden');
    expect(body).toHaveAttribute('hidden');
    expect(footer).toHaveAttribute('hidden');
    expect(getComputedStyle(icon).display).toBe('none');
    expect(getComputedStyle(body).display).toBe('none');
    expect(getComputedStyle(footer).display).toBe('none');
  });
});
