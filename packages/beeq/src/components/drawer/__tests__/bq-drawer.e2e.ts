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
});
