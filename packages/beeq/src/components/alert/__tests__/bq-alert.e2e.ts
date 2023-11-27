import { newE2EPage } from '@stencil/core/testing';

describe('bq-alert', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-alert></bq-alert>');

    const element = await page.find('bq-alert');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-alert></bq-alert>');

    const element = await page.find('bq-alert');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render as hidden', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-alert></bq-alert>');

    const element = await page.find('bq-alert');
    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toHaveClass('is-hidden');
  });
});
