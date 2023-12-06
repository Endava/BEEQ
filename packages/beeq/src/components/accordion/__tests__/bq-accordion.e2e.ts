import { newE2EPage } from '@stencil/core/testing';

describe('bq-accordion', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-accordion></bq-accordion>');

    const element = await page.find('bq-accordion');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-accordion></bq-accordion>');

    const element = await page.find('bq-accordion');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-accordion></bq-accordion>');

    const element = await page.find('bq-accordion >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
