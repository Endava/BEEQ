import { newE2EPage } from '@stencil/core/testing';

describe('bq-breadcrumb-item', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb-item></bq-breadcrumb-item>');

    const element = await page.find('bq-breadcrumb-item');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb-item></bq-breadcrumb-item>');

    const element = await page.find('bq-breadcrumb-item');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb-item></bq-breadcrumb-item>');

    // const element = await page.find('bq-breadcrumb-item >>> p');

    // expect(element).toEqualText('My name is Stencil');
  });
});
