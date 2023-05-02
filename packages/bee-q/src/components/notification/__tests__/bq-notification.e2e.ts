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
    const page = await newE2EPage();
    await page.setContent('<bq-notification></bq-notification>');

    const element = await page.find('bq-notification');

    await element.callMethod('show');
    await page.waitForChanges();

    expect(element).toEqualAttribute('aria-hidden', 'false');
    expect(element).toEqualAttribute('hidden', 'false');

    await element.callMethod('hide');
    await page.waitForChanges();

    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toEqualAttribute('hidden', 'true');
  });
});
