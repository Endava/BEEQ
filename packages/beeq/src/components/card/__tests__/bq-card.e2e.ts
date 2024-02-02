import { newE2EPage } from '@stencil/core/testing';

describe('bq-card', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-card></bq-card>',
    });
    const element = await page.find('bq-card');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-card></bq-card>',
    });
    const element = await page.find('bq-card');

    expect(element.shadowRoot).not.toBeNull();
  });
});
