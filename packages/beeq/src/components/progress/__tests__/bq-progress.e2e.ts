import { newE2EPage } from '@stencil/core/testing';

describe('bq-progress', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-progress></bq-progress>',
    });
    const element = await page.find('bq-progress');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-progress></bq-progress>',
    });
    const element = await page.find('bq-progress');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage({
      html: '<bq-progress></bq-progress>',
    });
    const element = await page.find('bq-progress >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
