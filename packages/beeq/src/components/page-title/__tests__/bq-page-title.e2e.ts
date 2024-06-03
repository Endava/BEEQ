import { newE2EPage } from '@stencil/core/testing';

describe('bq-page-title', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title></bq-page-title>',
    });
    const element = await page.find('bq-page-title');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title></bq-page-title>',
    });
    const element = await page.find('bq-page-title');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title></bq-page-title>',
    });
    const element = await page.find('bq-page-title >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
