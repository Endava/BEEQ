import { newE2EPage } from '@stencil/core/testing';

describe('bq-option', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option></bq-option>');

    const element = await page.find('bq-option');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option></bq-option>');

    const element = await page.find('bq-option');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option></bq-option>');

    const element = await page.find('bq-option >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
