import { newE2EPage } from '@stencil/core/testing';

describe('bq-dropdown', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-dropdown></bq-dropdown>');

    const element = await page.find('bq-dropdown');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-dropdown></bq-dropdown>');

    const element = await page.find('bq-dropdown');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should trigger bqPanelOpen on trigger click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>
        <div></div>
      </bq-dropdown>
    `);

    const bqPanelOpen = await page.spyOnEvent('bqPanelOpen');

    const button = await page.find('bq-button >>> [part="button"]');
    await button.click();

    expect(bqPanelOpen).toHaveReceivedEventTimes(1);
  });
});
