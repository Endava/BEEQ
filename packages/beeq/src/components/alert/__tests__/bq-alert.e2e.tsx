import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

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
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.classList.contains('is-hidden')).toBe(true);
  });

  it('should render as hidden with `open="false"`', async () => {
    const { root } = await render(<bq-alert open={false} />);
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.classList.contains('is-hidden')).toBe(true);
  });

  it('should render as open', async () => {
    const { root } = await render(<bq-alert open />);
    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.classList.contains('is-hidden')).toBe(false);
  });

  it('should render as open with `open="true"`', async () => {
    const { root } = await render(<bq-alert open={true} />);
    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.classList.contains('is-hidden')).toBe(false);
  });

  it('should render basic alert', async () => {
    const { root } = await render(
      <bq-alert>
        Alert title
        <span slot="body">You have a new alert message</span>
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
        Alert title
        <span slot="body">You have a new alert message</span>
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
    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.getAttribute('hidden')).toBe('false');
  });

  it('should call hide() method', async () => {
    const { root } = await render(
      <bq-alert open>
        Alert title
        <span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root).not.toHaveClass('is-hidden');

    // Register listener before calling hide() to capture the bqAfterHide event
    const afterHide = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterHide', () => resolve(), { once: true }),
    );

    await (root as HTMLBqAlertElement).hide();
    // Wait for the CSS leave() transition to complete before asserting
    await afterHide;

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.getAttribute('hidden')).toBe('true');
    expect(root).toHaveClass('is-hidden');
  });

  it('should emit bqShow and bqAfterShow events in order when show() is called', async () => {
    const { root, spyOnEvent } = await render(
      <bq-alert>
        Alert title
        <span slot="body">You have a new alert message</span>
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
        Alert title
        <span slot="body">You have a new alert message</span>
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
        Alert title
        <span slot="body">You have a new alert message</span>
      </bq-alert>,
    );

    root.addEventListener('bqShow', (event) => event.preventDefault(), { once: true });

    await (root as HTMLBqAlertElement).show();

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root).toHaveClass('is-hidden');
  });

  it('should not hide the alert when bqHide event is prevented', async () => {
    const { root } = await render(
      <bq-alert open>
        Alert title
        <span slot="body">You have a new alert message</span>
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
      <bq-alert type="info" hide-icon>
        Alert title
      </bq-alert>,
    );

    const iconOutline = root.shadowRoot.querySelector('[part="icon-outline"]');
    expect(iconOutline).not.toBeNull();
    expect(iconOutline).toHaveClass('!hidden');
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

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root).toHaveClass('is-hidden');
  });
});
