import { newE2EPage } from '@stencil/core/testing';

describe('bq-alert', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `<bq-alert></bq-alert>`,
    });

    const element = await page.find('bq-alert');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-alert></bq-alert>`,
    });

    const element = await page.find('bq-alert');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render as hidden', async () => {
    const page = await newE2EPage({
      html: `<bq-alert></bq-alert>`,
    });

    const element = await page.find('bq-alert');
    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toHaveClass('is-hidden');
  });

  it('should render as hidden with `open="false"`', async () => {
    const page = await newE2EPage({
      html: `<bq-alert open="false"></bq-alert>`,
    });

    const element = await page.find('bq-alert');
    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toHaveClass('is-hidden');
  });

  it('should render as open', async () => {
    const page = await newE2EPage({
      html: `<bq-alert open></bq-alert>`,
    });

    const element = await page.find('bq-alert');
    expect(element).not.toEqualAttribute('aria-hidden', 'true');
    expect(element).not.toHaveClass('is-hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const page = await newE2EPage({
      html: `<bq-alert open="true"></bq-alert>`,
    });

    const element = await page.find('bq-alert');
    expect(element).not.toEqualAttribute('aria-hidden', 'true');
    expect(element).not.toHaveClass('is-hidden');
  });

  it('should render basic alert', async () => {
    const page = await newE2EPage({
      html: `
        <bq-alert>
          Alert title
          <span slot="body">You have a new alert message</span>
        </bq-alert>
      `,
    });

    const description = await page.find('bq-alert >>> slot[name="body"]');
    expect(description).not.toBeNull();
  });

  it('should show alert with icon', async () => {
    const page = await newE2EPage({
      html: `<bq-alert type="info">Alert title</bq-alert>`,
    });

    const iconHolder = await page.find('bq-alert >>> [part="icon-outline"]');
    expect(iconHolder).not.toBeNull();
  });

  it('should show alert with close button', async () => {
    const page = await newE2EPage({
      html: `<bq-alert type="info">Alert title</bq-alert>`,
    });

    const iconHolder = await page.find('bq-alert >>> [part="btn-close"]');
    expect(iconHolder).not.toBeNull();
  });

  it('should show alert footer', async () => {
    const page = await newE2EPage({
      html: `
        <bq-alert>
          Alert title
          <div slot="footer">
            <bq-button appearance="primary" type="button" variant="standard">Button</bq-button>
            <bq-button appearance="secondary" variant="standard">Button</bq-button>
          </div>
        </bq-alert>
     `,
    });

    const footerSlot = await page.find('bq-alert >>> slot[name="footer"]');
    expect(footerSlot).not.toBeNull();
  });

  it('should call show() method', async () => {
    const page = await newE2EPage({
      html: `
        <bq-alert>
          Alert title
          <span slot="body">You have a new alert message</span>
        </bq-alert>
      `,
    });

    const alertElem = await page.find('bq-alert');
    await alertElem.callMethod('show');
    await page.waitForChanges();

    const visibleAlertElem = await page.find('bq-alert');
    expect(visibleAlertElem).toEqualAttribute('aria-hidden', 'false');
    expect(visibleAlertElem).toEqualAttribute('hidden', 'false');
  });

  it('should call hide() method', async () => {
    const page = await newE2EPage({
      html: `
        <bq-alert open>
          Alert title
          <span slot="body">You have a new alert message</span>
        </bq-alert>
      `,
    });

    const alertElem = await page.find('bq-alert');
    expect(alertElem).not.toEqualAttribute('aria-hidden', 'true');
    expect(alertElem).not.toHaveClass('is-hidden');

    await alertElem.callMethod('hide');
    await page.waitForChanges();

    const hiddenAlertElem = await page.find('bq-alert');
    expect(hiddenAlertElem).toEqualAttribute('aria-hidden', 'true');
    expect(hiddenAlertElem).toEqualAttribute('hidden', 'true');
  });
});
