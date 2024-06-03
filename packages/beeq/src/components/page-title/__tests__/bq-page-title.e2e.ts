import { newE2EPage } from '@stencil/core/testing';

describe('bq-page-title', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title></bq-page-title>',
    });
    const element = await page.find('bq-page-title');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title></bq-page-title>',
    });
    const element = await page.find('bq-page-title');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render title + back icon', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title showBackIcon="true"></bq-page-title>',
    });
    const backIcon = await page.find('bq-page-title >>> slot[name="back"]');
    expect(backIcon).not.toBeNull();
  });
});
