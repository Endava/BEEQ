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

    const iconHolder = await page.find('bq-notification >>> [id="notification-icon-holder"]');

    expect(iconHolder).not.toBeNull();
  });

  it('should show notification button(s)', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-notification>New Message<bq-button appearance="primary" href="" size="small" target="" type="button" variant="standard">Button</bq-button><bq-button name="second-button" appearance="secondary" href="" size="small" target="" type="button" variant="standard">Button</bq-button></bq-notification>',
    );

    const button = await page.find('bq-button');

    expect(button).not.toBeNull();
  });

  it('should show notification with avatar', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-notification>New Message <bq-avatar slot="avatar" alt-text="" image="" label="Avatar component label" initials="JS" shape="circle" size="small"></bq-avatar></bq-notification>',
    );

    const avatarHolder = await page.find('bq-notification >>> [id="notification-avatar-holder"]');
    const avatarSlot = await page.find('bq-notification >>> slot[name="avatar"]');

    expect(avatarHolder).not.toBeNull();
    expect(avatarSlot).not.toBeNull();
  });

  it('should hide notification on click of close icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification show-close="true">New Message</bq-notification>');

    const notificationHolder = await page.find('bq-notification');
    const closeIcon = await page.find('bq-notification >>> [id="close-notification"]');

    await closeIcon.click();

    expect(notificationHolder).toHaveAttribute('aria-hidden');
  });
});
