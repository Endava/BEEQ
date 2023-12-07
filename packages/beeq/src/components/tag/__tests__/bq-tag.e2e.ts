import { newE2EPage } from '@stencil/core/testing';

describe('bq-tag', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-tag></bq-tag>',
    });
    const element = await page.find('bq-tag');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-tag></bq-tag>',
    });
    const element = await page.find('bq-tag');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage({
      html: '<bq-tag></bq-tag>',
    });
    const element = await page.find('bq-tag >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});
