import { newE2EPage } from '@stencil/core/testing';

describe('bq-drawer', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-drawer></bq-drawer>',
    });
    const element = await page.find('bq-drawer');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-drawer></bq-drawer>',
    });
    const element = await page.find('bq-drawer');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render as hidden', async () => {
    const page = await newE2EPage({
      html: `<bq-drawer></bq-drawer>`,
    });

    const element = await page.find('bq-drawer >>> [part="panel"]');
    expect(element).toEqualAttribute('aria-hidden', 'true');
  });

  it('should render as hidden with `open="false"`', async () => {
    const page = await newE2EPage({
      html: `<bq-drawer open="false"></bq-drawer>`,
    });

    const element = await page.find('bq-drawer >>> [part="panel"]');
    expect(element).toEqualAttribute('aria-hidden', 'true');
  });

  it('should render as open', async () => {
    const page = await newE2EPage({
      html: `<bq-drawer open></bq-drawer>`,
    });

    const element = await page.find('bq-drawer >>> [part="panel"]');
    expect(element).toEqualAttribute('aria-hidden', 'false');
    expect(element).not.toHaveClass('hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const page = await newE2EPage({
      html: `<bq-drawer open="true"></bq-drawer>`,
    });

    const element = await page.find('bq-drawer >>> [part="panel"]');
    expect(element).toEqualAttribute('aria-hidden', 'false');
    expect(element).not.toHaveClass('hidden');
  });

  it('should display drawer title', async () => {
    const page = await newE2EPage({
      html: `
        <bq-drawer>
          <div slot="title">Drawer Title</div>
        </bq-drawer>
      `,
    });

    const element = await page.find('bq-drawer');
    expect(element).toEqualText('Drawer Title');
  });

  it('should render basic body drawer slot', async () => {
    const page = await newE2EPage({
      html: `
        <bq-drawer>
          <div slot>Slot</div>
        </bq-drawer>
      `,
    });

    const description = await page.find('bq-drawer >>> slot');
    expect(description).not.toBeNull();
  });

  it('should render footer drawer slot', async () => {
    const page = await newE2EPage({
      html: `
        <bq-drawer>
          <div slot="footer">Footer slot</div>
        </bq-drawer>
      `,
    });

    const description = await page.find('bq-drawer >>> slot[name="footer"]');
    expect(description).not.toBeNull();
  });

  it('should call `show` method', async () => {
    const page = await newE2EPage({
      html: `
        <bq-drawer>
          <div slot="title">Drawer Title</div>
        </bq-drawer>
      `,
    });

    const closedDrawer = await page.find('bq-drawer >>> [part="panel"]');
    expect(closedDrawer.getAttribute('aria-hidden')).toBe('true');
    expect(closedDrawer).toHaveAttribute('hidden');

    await page.$eval('bq-drawer', async (elem: HTMLBqDrawerElement) => {
      await elem.show();
    });
    await page.waitForChanges();

    const openDrawer = await page.find('bq-drawer >>> [part="panel"]');
    expect(openDrawer.getAttribute('aria-hidden')).toBe('false');
    expect(openDrawer).not.toHaveAttribute('hidden');
  });

  it('should call `hide` method', async () => {
    const page = await newE2EPage({
      html: `
        <bq-drawer open>
          <div slot="title">Drawer Title</div>
        </bq-drawer>
      `,
    });

    const openDrawer = await page.find('bq-drawer >>> [part="panel"]');
    expect(openDrawer.getAttribute('aria-hidden')).toBe('false');
    expect(openDrawer).not.toHaveAttribute('hidden');

    await page.$eval('bq-drawer', async (elem: HTMLBqDrawerElement) => {
      await elem.hide();
    });
    await page.waitForChanges();

    const closedDrawer = await page.find('bq-drawer >>> [part="panel"]');
    expect(closedDrawer.getAttribute('aria-hidden')).toBe('true');
    expect(closedDrawer).toHaveAttribute('hidden');
  });
});
