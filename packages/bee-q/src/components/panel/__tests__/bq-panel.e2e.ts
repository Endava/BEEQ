import { newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

describe('bq-panel', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-panel></bq-panel>');

    const element = await page.find('bq-panel');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-panel></bq-panel>');

    const element = await page.find('bq-panel');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should be visible on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>

        <bq-panel>Some content in panel</bq-panel>
      </bq-dropdown>
    `);

    const element = await page.find('bq-panel');
    expect(element).toHaveAttribute('aria-hidden');

    const button = await page.find('bq-button');
    await button.click();
    expect(element).not.toHaveAttribute('aria-hidden');
  });

  it('should show in specified position', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>

        <bq-panel placement="left">Some content in panel</bq-panel>
      </bq-dropdown>
    `);

    const button = await page.find('bq-button');
    await button.click();
    const tooltipStyle = await computedStyle(page, 'bq-panel');
    const sign = tooltipStyle.left.slice(-1);
    expect(sign).not.toEqual('-');
  });
});
