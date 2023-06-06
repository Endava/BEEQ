import { newE2EPage } from '@stencil/core/testing';

describe('bq-breadcrumb', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb></bq-breadcrumb>');

    const element = await page.find('bq-breadcrumb');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-breadcrumb></bq-breadcrumb>');

    const element = await page.find('bq-breadcrumb');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should trigger bqBreadcrumbClick', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
      </bq-breadcrumb>
    `);

    const bqBlur = await page.spyOnEvent('bqBreadcrumbBlur');
    const bqFocus = await page.spyOnEvent('bqBreadcrumbFocus');
    const bqClick = await page.spyOnEvent('bqBreadcrumbClick');

    const element = await page.find('bq-breadcrumb-item');

    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
      </bq-breadcrumb>
    `);

    const bqBlur = await page.spyOnEvent('bqBreadcrumbBlur');
    const bqFocus = await page.spyOnEvent('bqBreadcrumbFocus');
    const bqClick = await page.spyOnEvent('bqBreadcrumbClick');

    await page.keyboard.press('Tab');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should trigger bqBreadcrumbClick on Enter', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
      </bq-breadcrumb>
    `);

    const bqBlur = await page.spyOnEvent('bqBreadcrumbBlur');
    const bqFocus = await page.spyOnEvent('bqBreadcrumbFocus');
    const bqClick = await page.spyOnEvent('bqBreadcrumbClick');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should display bq-icon', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-breadcrumb separator-icon="caret-right">
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
      </bq-breadcrumb>
    `);

    const element = await page.find('bq-breadcrumb-item >>> bq-icon');

    expect(element.tagName.toLocaleLowerCase()).toBe('bq-icon');
  });
});
