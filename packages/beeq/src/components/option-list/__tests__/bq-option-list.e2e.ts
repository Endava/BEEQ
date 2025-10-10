import { newE2EPage } from '@stencil/core/testing';

describe('bq-option-list', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `<bq-option-list></bq-option-list>`,
    });

    const element = await page.find('bq-option-list');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-option-list></bq-option-list>`,
    });

    const element = await page.find('bq-option-list');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-option-list></bq-option-list>`,
    });

    const element = await page.find('bq-option-list');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should trigger bqSelect on click', async () => {
    const page = await newE2EPage({
      html: `
        <bq-option-list>
          <bq-option></bq-option>
        </bq-option-list>
      `,
    });

    const bqSelect = await page.spyOnEvent('bqSelect');
    const element = await page.find('bq-option');

    await element.click();

    expect(bqSelect).toHaveReceivedEventTimes(1);
  });

  it('should trigger bqSelect on Enter', async () => {
    const page = await newE2EPage({
      html: `
        <bq-option-list>
          <bq-option>Option</bq-option>
        </bq-option-list>
      `,
    });

    const bqSelect = await page.spyOnEvent('bqSelect');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    expect(bqSelect).toHaveReceivedEventTimes(1);
  });
});
