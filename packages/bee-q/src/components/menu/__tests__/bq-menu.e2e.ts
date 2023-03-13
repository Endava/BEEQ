import { newE2EPage } from '@stencil/core/testing';

describe('bq-menu', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-menu></bq-menu>');

    const element = await page.find('bq-menu');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-menu></bq-menu>');

    const element = await page.find('bq-menu');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-menu></bq-menu>');

    const element = await page.find('bq-menu >>> p');

    expect(element).toEqualText('This is a Menu');
  });
});
