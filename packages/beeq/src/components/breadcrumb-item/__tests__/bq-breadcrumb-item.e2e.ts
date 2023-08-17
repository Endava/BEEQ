import { newE2EPage } from '@stencil/core/testing';

describe('bq-breadcrumb-item', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb-item></bq-breadcrumb-item>');

    const element = await page.find('bq-breadcrumb-item');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb-item></bq-breadcrumb-item>');

    const element = await page.find('bq-breadcrumb-item');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb-item>Home</bq-breadcrumb-item>');

    const element = await page.find('bq-breadcrumb-item');

    expect(element).toEqualText('Home');
  });

  it('should render `button` tag', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb-item>Home</bq-breadcrumb-item>');

    const element = await page.find('bq-breadcrumb-item >>> .breadcrumb-item');

    expect(element.tagName.toLocaleLowerCase()).toBe('button');
  });

  it('should render `a` tag', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb-item href="https://example.com/">Home</bq-breadcrumb-item>');

    const element = await page.find('bq-breadcrumb-item >>> .breadcrumb-item');

    expect(element.tagName.toLocaleLowerCase()).toBe('a');
  });
});
