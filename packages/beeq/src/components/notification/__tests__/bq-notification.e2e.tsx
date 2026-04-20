import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

describe('bq-notification', () => {
  it('should render', async () => {
    const { root } = await render(<bq-notification />);

    expect(root).not.toBeNull();
  });
});

it('should have shadow root', async () => {
  const { root } = await render(<bq-notification />);

  expect(root.shadowRoot).not.toBeNull();
});

it('should render as hidden', async () => {
  const { root } = await render(<bq-notification />);

  expect(root).toEqualAttribute('aria-hidden', 'true');
  expect(root).toHaveClass('is-hidden');
});

it('should render as hidden with `open="false"`', async () => {
  const { root } = await render(<bq-notification open="false"></bq-notification>);

  expect(root).toEqualAttribute('aria-hidden', 'true');
  expect(root).toHaveClass('is-hidden');
});

it('should render as open', async () => {
  const { root } = await render(<bq-notification open></bq-notification>);

  expect(root).not.toEqualAttribute('aria-hidden', 'true');
  expect(root).not.toHaveClass('is-hidden');
});

it('should render as open with `open="true"`', async () => {
  const { root } = await render(<bq-notification open="true"></bq-notification>);

  expect(root).not.toEqualAttribute('aria-hidden', 'true');
  expect(root).not.toHaveClass('is-hidden');
});

it('should render basic notification', async () => {
  const { root } = await render(
    <bq-notification>
      Notification title
      <span slot="body">You have a new chat message</span>
    </bq-notification>,
  );

  const description = root.shadowRoot?.querySelector('slot[name="body"]');
  expect(description).not.toBeNull();
});

it('should show notification with icon', async () => {
  const { root } = await render(<bq-notification type="info">Notification title</bq-notification>);

  const iconHolder = root.shadowRoot?.querySelector('[part="icon-outline"]');
  expect(iconHolder).not.toBeNull();
});

it('should show notification with close button', async () => {
  const { root } = await render(<bq-notification type="info">Notification title</bq-notification>);

  expect(root).not.toBeNull();
});

it('should show notification with avatar', async () => {
  const { root } = await render(
    <bq-notification has-custom-icon>
      <bq-avatar slot="icon" label="Avatar component label" initials="JS" shape="circle" size="small"></bq-avatar>
      Notification title
    </bq-notification>,
  );

  const avatarSlot = root.shadowRoot?.querySelector('slot[name="icon"]');
  expect(avatarSlot).not.toBeNull();
});

it('should show notification footer', async () => {
  const { root } = await render(
    <bq-notification>
      Notification title
      <div slot="footer">
        <bq-button appearance="primary" type="button" variant="standard">
          Button
        </bq-button>
        <bq-button appearance="secondary" variant="standard">
          Button
        </bq-button>
      </div>
    </bq-notification>,
  );

  const footerSlot = root.shadowRoot?.querySelector('slot[name="footer"]');
  expect(footerSlot).not.toBeNull();
});

it('should call methods', async () => {
  const { root, waitForChanges } = await render(<bq-notification></bq-notification>);

  const notification = root as HTMLElement;

  await notification.show();
  await waitForChanges();

  expect(root).toEqualAttribute('aria-hidden', 'false');
  expect(root).toEqualAttribute('hidden', 'false');

  await notification.hide();
  await waitForChanges();

  expect(root).toEqualAttribute('aria-hidden', 'true');
  expect(root).toEqualAttribute('hidden', 'true');
});
