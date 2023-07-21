import { newE2EPage } from '@stencil/core/testing';

describe('bq-option-list', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option-list></bq-option-list>');

    const element = await page.find('bq-option-list');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option-list></bq-option-list>');

    const element = await page.find('bq-option-list');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option-list></bq-option-list>');

    const element = await page.find('bq-option-list >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
