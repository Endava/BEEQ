import { newE2EPage } from '@stencil/core/testing';

describe('bq-breadcrumb', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-breadcrumb></bq-breadcrumb>',
    });

    const element = await page.find('bq-breadcrumb');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-breadcrumb></bq-breadcrumb>',
    });

    const element = await page.find('bq-breadcrumb');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should trigger bqBreadcrumbClick', async () => {
    const page = await newE2EPage({
      html: `
        <bq-breadcrumb>
          <bq-breadcrumb-item>Home</bq-breadcrumb-item>
        </bq-breadcrumb>
      `,
    });

    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const element = await page.find('bq-breadcrumb-item');

    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage({
      html: `
        <bq-breadcrumb>
          <bq-breadcrumb-item>Home</bq-breadcrumb-item>
        </bq-breadcrumb>
      `,
    });

    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');

    await page.keyboard.press('Tab');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should trigger bqBreadcrumbClick on Enter', async () => {
    const page = await newE2EPage({
      html: `
        <bq-breadcrumb>
          <bq-breadcrumb-item>Home</bq-breadcrumb-item>
        </bq-breadcrumb>
      `,
    });

    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should render custom separator ', async () => {
    const page = await newE2EPage({
      html: `
        <bq-breadcrumb>
          <bq-icon name="caret-right" slot="separator" size="12"></bq-icon>
          <bq-breadcrumb-item>
            <bq-icon name="house-line" size="16"></bq-icon>
            <span>Home</span>
          </bq-breadcrumb-item>
          <bq-breadcrumb-item>Application Center</bq-breadcrumb-item>
        </bq-breadcrumb>
      `,
    });

    const separator = await page.find('bq-breadcrumb bq-icon[slot="separator"]');
    expect(separator).toBeDefined();
  });
});
