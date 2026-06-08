import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

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
    expect(root).toHaveClass('is-hidden');
  });

  it('should render as hidden with `open="false"`', async () => {
    const { root } = await render(<bq-notification open={'false' as never}></bq-notification>);

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveClass('is-hidden');
  });

  it('should render as open with `open`', async () => {
    const { root } = await render(<bq-notification open></bq-notification>);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveClass('is-hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const { root } = await render(<bq-notification open={'true' as never}></bq-notification>);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveClass('is-hidden');
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
    expect(iconOutline).not.toHaveClass('!hidden');
  });

  it('should hide the icon when `hide-icon` is set', async () => {
    const { root } = await render(
      <bq-notification type="info" hide-icon>
        Notification title
      </bq-notification>,
    );

    const iconOutline = root.shadowRoot?.querySelector('[part="icon-outline"]');
    expect(iconOutline).toHaveClass('!hidden');
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

  it('should keep the default close button padding', async () => {
    const { root } = await render(<bq-notification open>Notification title</bq-notification>);

    const closeBtn = root.shadowRoot?.querySelector('[part="btn-close"]');
    expect(closeBtn).not.toBeNull();
    expect(closeBtn).not.toHaveClass('[&::part(button)]:p-0');
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
    expect(root).not.toHaveClass('is-hidden');

    await notification.hide();
    await waitForChanges();
    await waitForStable(root);

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveClass('is-hidden');
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
    expect(root).toHaveClass('is-hidden');
  });
});
