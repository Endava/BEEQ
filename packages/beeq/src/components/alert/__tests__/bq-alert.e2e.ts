import { newE2EPage } from '@stencil/core/testing';

describe('bq-alert', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-alert></bq-alert>',
    });
    const element = await page.find('bq-alert');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-alert></bq-alert>',
    });
    const element = await page.find('bq-alert');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage({
      html: '<bq-alert></bq-alert>',
    });
    const element = await page.find('bq-alert >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
