import { newE2EPage } from '@stencil/core/testing';

describe('bq-menu-item', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-menu-item></bq-menu-item>');

    const element = await page.find('bq-menu-item');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-menu-item></bq-menu-item>');

    const element = await page.find('bq-menu-item');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-menu-item></bq-menu-item>');

    const element = await page.find('bq-menu-item >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
