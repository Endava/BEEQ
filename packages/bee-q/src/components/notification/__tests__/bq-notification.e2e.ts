import { newE2EPage } from '@stencil/core/testing';

describe('bq-notification', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification></bq-notification>');

    const element = await page.find('bq-notification');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification></bq-notification>');

    const element = await page.find('bq-notification');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render basic notification', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-notification>New Message<span slot="description">You have a new chat message</span></bq-notification>',
    );

    const description = await page.find('bq-notification >>> slot[name="description"]');

    expect(description).not.toBeNull();
  });

  it('should show notification with icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification type="info" show-icon="true">New Message</bq-notification>');

    const iconHolder = await page.find('bq-notification >>> [part="icon"]');

    expect(iconHolder).not.toBeNull();
  });

  it('should show notification with close icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification type="info" show-close="true">New Message</bq-notification>');

    const iconHolder = await page.find('bq-notification >>> [part="close-icon"]');

    expect(iconHolder).not.toBeNull();
  });

  it('should show notification with avatar', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-notification>New Message <bq-avatar slot="avatar" alt-text="" image="" label="Avatar component label" initials="JS" shape="circle" size="small"></bq-avatar></bq-notification>',
    );

    const avatarSlot = await page.find('bq-notification >>> slot[name="avatar"]');

    expect(avatarSlot).not.toBeNull();
  });

  it('should show notification footer', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-notification>New Message<div slot="footer"><bq-button appearance="primary" href="" size="small" target="" type="button" variant="standard">Button</bq-button><bq-button appearance="secondary" href="" size="small" target="" type="button" variant="standard">Button</bq-button></div></bq-notification>',
    );

    const footerSlot = await page.find('bq-notification >>> slot[name="notification-footer"]');

    expect(footerSlot).not.toBeNull();
  });

  it('should call methods', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification></bq-notification>');

    const element = await page.find('bq-notification');

    await element.callMethod('show');
    await page.waitForChanges();

    expect(element).not.toHaveAttribute('aria-hidden');

    await element.callMethod('hide');
    await page.waitForChanges();

    expect(element).toHaveAttribute('aria-hidden');
  });
});
