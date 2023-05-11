import { newE2EPage } from '@stencil/core/testing';

describe('bq-option-group', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option-group></bq-option-group>');

    const element = await page.find('bq-option-group');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option-group></bq-option-group>');

    const element = await page.find('bq-option-group');

    expect(element.shadowRoot).not.toBeNull();
  });
});
