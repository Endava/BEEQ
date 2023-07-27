import { newE2EPage } from '@stencil/core/testing';

describe('bq-textarea', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-textarea></bq-textarea>');

    const element = await page.find('bq-textarea');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-textarea></bq-textarea>');

    const element = await page.find('bq-textarea');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-textarea></bq-textarea>');

    const element = await page.find('bq-textarea >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
