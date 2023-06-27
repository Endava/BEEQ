import { newE2EPage } from '@stencil/core/testing';

describe('bq-toast', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast></bq-toast>');

    const element = await page.find('bq-toast');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast></bq-toast>');

    const element = await page.find('bq-toast');

    expect(element.shadowRoot).not.toBeNull();
  });

  it.skip('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast></bq-toast>');

    const element = await page.find('bq-toast >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
