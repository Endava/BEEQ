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

    const element = await page.find('bq-drawer');
    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toHaveClass('is-hidden');
  });

  it('should render as hidden with `open="false"`', async () => {
    const page = await newE2EPage({
      html: `<bq-drawer open="false"></bq-drawer>`,
    });

    const element = await page.find('bq-drawer');
    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toHaveClass('is-hidden');
  });

  it('should render as open', async () => {
    const page = await newE2EPage({
      html: `<bq-drawer open></bq-drawer>`,
    });

    const element = await page.find('bq-drawer');
    expect(element).not.toEqualAttribute('aria-hidden', 'true');
    expect(element).not.toHaveClass('is-hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const page = await newE2EPage({
      html: `<bq-drawer open="true"></bq-drawer>`,
    });

    const element = await page.find('bq-drawer');
    expect(element).not.toEqualAttribute('aria-hidden', 'true');
    expect(element).not.toHaveClass('is-hidden');
  });

  it('should display drawer title', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-drawer><div slot="title">Drawer Title</div></bq-drawer>');

    const element = await page.find('bq-drawer');

    expect(element).toEqualText('Drawer Title');
  });

  it('should render basic body drawer slot', async () => {
    const page = await newE2EPage({
      html: `
        <bq-drawer>
          <div slot="body">Slot</div>
        </bq-drawer>
      `,
    });

    const description = await page.find('bq-drawer >>> slot[name="body"]');
    expect(description).not.toBeNull();
  });
});
