import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';

describe('bq-alert', () => {
  it('should render', async () => {
    const { root } = await render(<bq-alert />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-alert />);
    expect(root).toHaveShadowRoot();
  });

  it('should render as hidden', async () => {
    const { root } = await render(<bq-alert />);
    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveClass('is-hidden');
  });

  it('should render as hidden with `open="false"`', async () => {
    const { root } = await render(<bq-alert open={false} />);
    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveClass('is-hidden');
  });

  it('should render as open', async () => {
    const { root } = await render(<bq-alert open />);
    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveClass('is-hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const { root } = await render(<bq-alert open={true} />);
    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveClass('is-hidden');
  });

  it('should render basic alert', async () => {
    const { root } = await render(
      <bq-alert>
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    const slot = root.shadowRoot.querySelector('slot[name="body"]');
    expect(slot).not.toBeNull();
  });

  it('should show alert with icon', async () => {
    const { root } = await render(<bq-alert type="info">Alert title</bq-alert>);

    const iconHolder = root.shadowRoot.querySelector('[part="icon-outline"]');
    expect(iconHolder).not.toBeNull();
  });

  it('should show alert with close button', async () => {
    const { root } = await render(<bq-alert type="info">Alert title</bq-alert>);

    const closeButton = root.shadowRoot.querySelector('bq-button');
    expect(closeButton).not.toBeNull();
  });

  it('should show alert footer', async () => {
    const { root } = await render(
      <bq-alert>
        Alert title
        <div slot="footer">
          <bq-button appearance="primary" type="button" variant="standard">
            Button
          </bq-button>
          <bq-button appearance="secondary" variant="standard">
            Button
          </bq-button>
        </div>
      </bq-alert>,
    );

    const footerSlot = root.shadowRoot.querySelector('slot[name="footer"]');
    expect(footerSlot).not.toBeNull();
  });

  it('should call show() method', async () => {
    const { root } = await render(
      <bq-alert>
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    // Register listener before calling show() to capture the bqAfterShow event
    const afterShow = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterShow', () => resolve(), { once: true }),
    );

    await (root as HTMLBqAlertElement).show();
    // Wait for the CSS enter() transition to complete before asserting
    await afterShow;

    expect(root).not.toHaveClass('is-hidden');
    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveAttribute('hidden');
  });

  it('should call hide() method', async () => {
    const { root } = await render(
      <bq-alert open>
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveClass('is-hidden');

    // Register listener before calling hide() to capture the bqAfterHide event
    const afterHide = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterHide', () => resolve(), { once: true }),
    );

    await (root as HTMLBqAlertElement).hide();
    // Wait for the CSS leave() transition to complete before asserting
    await afterHide;

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root).not.toHaveAttribute('hidden');
    expect(root).toHaveClass('is-hidden');
  });

  it('should emit bqShow and bqAfterShow events in order when show() is called', async () => {
    const { root, spyOnEvent } = await render(
      <bq-alert>
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    const bqShow = spyOnEvent('bqShow');
    const bqAfterShow = spyOnEvent('bqAfterShow');
    const order: string[] = [];

    root.addEventListener('bqShow', () => order.push('bqShow'), { once: true });
    root.addEventListener('bqAfterShow', () => order.push('bqAfterShow'), { once: true });

    const afterShow = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterShow', () => resolve(), { once: true }),
    );
    await (root as HTMLBqAlertElement).show();
    await afterShow;

    expect(bqShow).toHaveReceivedEventTimes(1);
    expect(bqAfterShow).toHaveReceivedEventTimes(1);
    expect(order).toEqual(['bqShow', 'bqAfterShow']);
  });

  it('should emit bqHide and bqAfterHide events in order when hide() is called', async () => {
    const { root, spyOnEvent } = await render(
      <bq-alert open>
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    const bqHide = spyOnEvent('bqHide');
    const bqAfterHide = spyOnEvent('bqAfterHide');
    const order: string[] = [];

    root.addEventListener('bqHide', () => order.push('bqHide'), { once: true });
    root.addEventListener('bqAfterHide', () => order.push('bqAfterHide'), { once: true });

    const afterHide = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterHide', () => resolve(), { once: true }),
    );
    await (root as HTMLBqAlertElement).hide();
    await afterHide;

    expect(bqHide).toHaveReceivedEventTimes(1);
    expect(bqAfterHide).toHaveReceivedEventTimes(1);
    expect(order).toEqual(['bqHide', 'bqAfterHide']);
  });

  it('should not show the alert when bqShow event is prevented', async () => {
    const { root } = await render(
      <bq-alert>
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    root.addEventListener('bqShow', (event) => event.preventDefault(), { once: true });

    await (root as HTMLBqAlertElement).show();

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveClass('is-hidden');
  });

  it('should not hide the alert when bqHide event is prevented', async () => {
    const { root } = await render(
      <bq-alert open>
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    root.addEventListener('bqHide', (event) => event.preventDefault(), { once: true });

    await (root as HTMLBqAlertElement).hide();

    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root).not.toHaveClass('is-hidden');
  });

  it('should hide the close button when disableClose is true', async () => {
    const { root } = await render(
      <bq-alert open disable-close>
        Alert title
      </bq-alert>,
    );

    const closeButton = root.shadowRoot.querySelector('bq-button');
    expect(closeButton).toBeNull();
  });

  it('should hide the icon when hideIcon is true', async () => {
    const { root } = await render(
      <bq-alert open type="info" hide-icon>
        Alert title
      </bq-alert>,
    );

    const iconOutline = root.shadowRoot.querySelector<HTMLElement>('[part="icon-outline"]');
    expect(iconOutline).not.toBeNull();
    expect(iconOutline).toHaveAttribute('hidden');
    expect(getComputedStyle(iconOutline).display).toBe('none');
  });

  it('should close when the close button is clicked', async () => {
    const { root } = await render(
      <bq-alert open type="info">
        Alert title
      </bq-alert>,
    );

    expect(root.getAttribute('aria-hidden')).toBe('false');

    const afterHide = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterHide', () => resolve(), { once: true }),
    );

    const closeButton = root.shadowRoot.querySelector('bq-button');
    await userEvent.click(closeButton);
    await afterHide;

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveClass('is-hidden');
  });

  it('should use the info role tokens (not brand) for the info type', async () => {
    const { root } = await render(
      <bq-alert open type="info">
        Alert title
      </bq-alert>,
    );

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-alert--background-info').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--info-alt').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-alert--border-info').trim()).toBe(
      hostStyle.getPropertyValue('--bq-stroke--info').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-alert--icon-color-info').trim()).toBe(
      hostStyle.getPropertyValue('--bq-icon--info').trim(),
    );

    const wrapperStyle = computedStyle('bq-alert >>> [part="wrapper"]', ['backgroundColor', 'borderTopColor']);
    const iconStyle = computedStyle('bq-alert >>> [part="icon-outline"]', ['color']);

    expect(wrapperStyle).toEqual({
      backgroundColor: resolveColorToken('--bq-ui--info-alt', root),
      borderTopColor: resolveColorToken('--bq-stroke--info', root),
    });
    expect(iconStyle.color).toBe(resolveColorToken('--bq-icon--info', root));
    expect(iconStyle.color).not.toBe(resolveColorToken('--bq-icon--brand', root));
  });

  it('should use the text color variable for the title and body', async () => {
    const { root } = await render(
      <bq-alert open type="success">
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    expect(getComputedStyle(root).getPropertyValue('--bq-alert--text-color').trim()).toBe(
      getComputedStyle(root).getPropertyValue('--bq-text--primary').trim(),
    );
    expect(computedStyle('bq-alert >>> [part="title"]', ['color']).color).toBe(
      resolveColorToken('--bq-text--primary', root),
    );
  });

  it('should allow overriding the text color variable', async () => {
    await render(
      <bq-alert open style={{ '--bq-alert--text-color': 'rgb(1, 2, 3)' }} type="success">
        Alert title<span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    expect(computedStyle('bq-alert >>> [part="title"]', ['color']).color).toBe('rgb(1, 2, 3)');
    expect(computedStyle('bq-alert >>> [part="body"]', ['color']).color).toBe('rgb(1, 2, 3)');
  });

  it('should preserve native geometry, typography and transitions', async () => {
    const { root } = await render(
      <bq-alert open type="success">
        Alert title
        <span slot="body">Body content</span>
        <div slot="footer">Footer content</div>
      </bq-alert>,
    );

    await waitForStable(root);

    const wrapper = root.shadowRoot.querySelector<HTMLElement>('[part="wrapper"]');
    const close = root.shadowRoot.querySelector<HTMLElement>('bq-button');
    const icon = root.shadowRoot.querySelector<HTMLElement>('[part="icon-outline"]');
    const main = root.shadowRoot.querySelector<HTMLElement>('[part="main"]');
    const content = root.shadowRoot.querySelector<HTMLElement>('[part="content"]');
    const title = root.shadowRoot.querySelector<HTMLElement>('[part="title"]');
    const body = root.shadowRoot.querySelector<HTMLElement>('[part="body"]');
    const footer = root.shadowRoot.querySelector<HTMLElement>('[part="footer"]');
    const wrapperStyle = getComputedStyle(wrapper);

    expect(getComputedStyle(root).display).toBe('block');
    expect(wrapperStyle.position).toBe('relative');
    expect(wrapperStyle.display).toBe('flex');
    expect(wrapperStyle.minInlineSize).toBe('320px');
    expect(wrapperStyle.padding).toBe('12px');
    expect(wrapperStyle.borderRadius).toBe('8px');
    expect(wrapperStyle.borderWidth).toBe('1px');
    expect(wrapperStyle.color).toBe(resolveColorToken('--bq-text--primary', root));
    expect(getComputedStyle(close).position).toBe('absolute');
    expect(getComputedStyle(close).insetInlineEnd).toBe('12px');
    expect(getComputedStyle(icon).display).toBe('flex');
    expect(getComputedStyle(icon).marginInlineEnd).toBe('12px');
    expect(getComputedStyle(main).display).toBe('flex');
    expect(getComputedStyle(main).rowGap).toBe('12px');
    expect(getComputedStyle(content).rowGap).toBe('12px');
    expect(getComputedStyle(title).fontWeight).toBe('600');
    expect(getComputedStyle(title).lineHeight).toBe('24px');
    expect(getComputedStyle(body).fontSize).toBe('14px');
    expect(getComputedStyle(body).lineHeight).toBe('21px');
    expect(getComputedStyle(footer).columnGap).toBe('8px');

    wrapper.classList.add('is-entering', 'is-enter-start');
    expect(getComputedStyle(wrapper).transitionProperty).toBe('opacity');
    expect(getComputedStyle(wrapper).transitionDuration).toBe('0.3s');
    expect(getComputedStyle(wrapper).transitionTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)');
    await expect.poll(() => getComputedStyle(wrapper).opacity).toBe('0');
    wrapper.classList.remove('is-entering', 'is-enter-start');

    wrapper.classList.add('is-leaving', 'is-leave-end');
    expect(getComputedStyle(wrapper).transitionDuration).toBe('0.2s');
    expect(getComputedStyle(wrapper).transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 1, 1)');
    await expect.poll(() => getComputedStyle(wrapper).opacity).toBe('0');
    wrapper.classList.remove('is-leaving', 'is-leave-end');
  });

  it('should preserve sticky geometry and logical RTL positioning', async () => {
    const { root } = await render(
      <bq-alert dir="rtl" open sticky type="error">
        Alert title
      </bq-alert>,
    );

    const wrapper = root.shadowRoot.querySelector<HTMLElement>('[part="wrapper"]');
    const close = root.shadowRoot.querySelector<HTMLElement>('bq-button');
    const icon = root.shadowRoot.querySelector<HTMLElement>('[part="icon-outline"]');
    const hostStyle = getComputedStyle(root);
    const wrapperStyle = getComputedStyle(wrapper);

    expect(hostStyle.position).toBe('fixed');
    expect(hostStyle.insetBlockStart).toBe('0px');
    expect(hostStyle.insetInlineStart).toBe('0px');
    expect(wrapperStyle.alignItems).toBe('center');
    expect(wrapperStyle.justifyContent).toBe('center');
    expect(wrapperStyle.borderRadius).toBe('0px');
    expect(getComputedStyle(close).insetInlineEnd).toBe('12px');
    expect(getComputedStyle(close).left).toBe('12px');
    expect(getComputedStyle(icon).marginInlineEnd).toBe('12px');
  });

  it('should preserve public layout overrides', async () => {
    const { root } = await render(
      <bq-alert
        open
        style={{
          '--bq-alert--content-footer-gap': '10px',
          '--bq-alert--min-width': '360px',
          '--bq-alert--padding': '20px',
          '--bq-alert--title-body-gap': '6px',
        }}
      >
        Alert title
        <span slot="body">Body content</span>
        <div slot="footer">Footer content</div>
      </bq-alert>,
    );

    await waitForStable(root);

    const wrapper = root.shadowRoot.querySelector<HTMLElement>('[part="wrapper"]');
    const main = root.shadowRoot.querySelector<HTMLElement>('[part="main"]');
    const content = root.shadowRoot.querySelector<HTMLElement>('[part="content"]');

    expect(getComputedStyle(wrapper).minInlineSize).toBe('360px');
    expect(getComputedStyle(wrapper).padding).toBe('20px');
    expect(getComputedStyle(main).rowGap).toBe('10px');
    expect(getComputedStyle(content).rowGap).toBe('6px');
  });

  it('should hide optional body and footer with native hidden state', async () => {
    const { root } = await render(<bq-alert open>Alert title</bq-alert>);

    await waitForStable(root);

    const body = root.shadowRoot.querySelector<HTMLElement>('[part="body"]');
    const footer = root.shadowRoot.querySelector<HTMLElement>('[part="footer"]');

    expect(body).toHaveAttribute('hidden');
    expect(footer).toHaveAttribute('hidden');
    expect(getComputedStyle(body).display).toBe('none');
    expect(getComputedStyle(footer).display).toBe('none');
  });
});
