import { newE2EPage } from '@stencil/core/testing';

describe('bq-accordion-group', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-accordion-group></bq-accordion-group>');

    const element = await page.find('bq-accordion-group');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-accordion-group></bq-accordion-group>');

    const element = await page.find('bq-accordion-group');

    expect(element.shadowRoot).not.toBeNull();
  });
});
