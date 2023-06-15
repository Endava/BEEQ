import { newE2EPage } from '@stencil/core/testing';

describe('bq-side-menu', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu></bq-side-menu>');

    const element = await page.find('bq-side-menu');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu></bq-side-menu>');

    const element = await page.find('bq-side-menu');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu></bq-side-menu>');

    const element = await page.find('bq-side-menu >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
