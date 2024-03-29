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

  it('should render as hidden', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification></bq-notification>');

    const element = await page.find('bq-notification');
    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toHaveClass('is-hidden');
  });

  it('should render as hidden with `open="false"`', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification open="false"></bq-notification>');

    const element = await page.find('bq-notification');
    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toHaveClass('is-hidden');
  });

  it('should render as open', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification open></bq-notification>');

    const element = await page.find('bq-notification');
    expect(element).not.toEqualAttribute('aria-hidden', 'true');
    expect(element).not.toHaveClass('is-hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-notification open="true"></bq-notification>');

    const element = await page.find('bq-notification');
    expect(element).not.toEqualAttribute('aria-hidden', 'true');
    expect(element).not.toHaveClass('is-hidden');
  });

  it('should render basic notification', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-notification>
        Notification title
        <span slot="body">You have a new chat message</span>
      </bq-notification>
    `);

    const description = await page.find('bq-notification >>> slot[name="body"]');
    expect(description).not.toBeNull();
  });

  it('should show notification with icon', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-notification type="info">Notification title</bq-notification>
    `);

    const iconHolder = await page.find('bq-notification >>> [part="icon-outline"]');
    expect(iconHolder).not.toBeNull();
  });

  it('should show notification with close button', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-notification type="info">Notification title</bq-notification>
    `);

    const iconHolder = await page.find('bq-notification >>> [part="btn-close"]');
    expect(iconHolder).not.toBeNull();
  });

  it('should show notification with avatar', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-notification has-custom-icon>
        <bq-avatar slot="icon" label="Avatar component label" initials="JS" shape="circle" size="small"></bq-avatar>
        Notification title
      </bq-notification>
    `);

    const avatarSlot = await page.find('bq-notification >>> slot[name="icon"]');
    expect(avatarSlot).not.toBeNull();
  });

  it('should show notification footer', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-notification>
        Notification title
        <div slot="footer">
          <bq-button appearance="primary" type="button" variant="standard">Button</bq-button>
          <bq-button appearance="secondary" variant="standard">Button</bq-button>
        </div>
      </bq-notification>',
    `);

    const footerSlot = await page.find('bq-notification >>> slot[name="footer"]');
    expect(footerSlot).not.toBeNull();
  });

  it('should call methods', async () => {
    const page = await newE2EPage({
      html: '<bq-notification></bq-notification>',
    });

    await page.$eval('bq-notification', async (elem: HTMLBqNotificationElement) => {
      await elem.show();
    });
    await page.waitForChanges();

    const visibleNotification = await page.find('bq-notification');
    expect(visibleNotification).toEqualAttribute('aria-hidden', 'false');
    expect(visibleNotification).toEqualAttribute('hidden', 'false');

    await page.$eval('bq-notification', async (elem: HTMLBqNotificationElement) => {
      await elem.hide();
    });
    await page.waitForChanges();

    const hiddenNotification = await page.find('bq-notification');
    expect(hiddenNotification).toEqualAttribute('aria-hidden', 'true');
    expect(hiddenNotification).toEqualAttribute('hidden', 'true');
  });
});
