import { newE2EPage } from '@stencil/core/testing';

describe('bq-date-picker', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-date-picker></bq-date-picker>',
    });
    const element = await page.find('bq-date-picker');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-date-picker></bq-date-picker>',
    });
    const element = await page.find('bq-date-picker');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage({
      html: '<bq-date-picker></bq-date-picker>',
    });
    const element = await page.find('bq-date-picker >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
