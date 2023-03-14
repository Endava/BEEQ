import { newE2EPage } from '@stencil/core/testing';

describe('bq-dialog', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-dialog></bq-dialog>');

    const element = await page.find('bq-dialog');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-dialog></bq-dialog>');

    const element = await page.find('bq-dialog');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-dialog></bq-dialog>');

    const element = await page.find('bq-dialog >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
