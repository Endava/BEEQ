import { newE2EPage } from '@stencil/core/testing';

describe('bq-input', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-input></bq-input>');

    const element = await page.find('bq-input');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-input></bq-input>');

    const element = await page.find('bq-input');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-input></bq-input>');

    const element = await page.find('bq-input >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
