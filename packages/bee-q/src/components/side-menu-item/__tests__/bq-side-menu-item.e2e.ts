import { newE2EPage } from '@stencil/core/testing';

describe('bq-side-menu-item', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu-item></bq-side-menu-item>');

    const element = await page.find('bq-side-menu-item');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu-item></bq-side-menu-item>');

    const element = await page.find('bq-side-menu-item');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu-item></bq-side-menu-item>');

    const element = await page.find('bq-side-menu-item >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
