import { newE2EPage } from '@stencil/core/testing';
import { sleep } from '../../../shared/test-utils';

describe('bq-tab-group', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <bq-tab-group value="1">
      <bq-tab tab-id="1">Tab 1</bq-tab>
      <bq-tab tab-id="2">Tab 2</bq-tab>
    </bq-tab-group>
    `);

    const element = await page.find('bq-tab-group');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <bq-tab-group value="1">
      <bq-tab tab-id="1">Tab 1</bq-tab>
      <bq-tab tab-id="2">Tab 2</bq-tab>
    </bq-tab-group>
    `);

    const element = await page.find('bq-tab-group');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should disable all tabs', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <bq-tab-group value="1" disabled>
      <bq-tab tab-id="1">Tab 1</bq-tab>
      <bq-tab tab-id="2">Tab 2</bq-tab>
    </bq-tab-group>
    `);

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqChange = await page.spyOnEvent('bqChange');
    const bqBlur = await page.spyOnEvent('bqBlur');

    const element = await page.find('bq-tab');
    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(await element.getProperty('disabled')).toBe(true);
  });

  it('should emit bqChange on tab click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <bq-tab-group value="1">
      <bq-tab tab-id="1">Tab 1</bq-tab>
      <bq-tab tab-id="2">Tab 2</bq-tab>
    </bq-tab-group>
    `);

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqChange = await page.spyOnEvent('bqChange');
    const bqBlur = await page.spyOnEvent('bqBlur');

    const element = await page.find('bq-tab');
    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should emit bqChange on keyboard navigation', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <bq-tab-group value="1">
      <bq-tab tab-id="1">Tab 1</bq-tab>
      <bq-tab tab-id="2">Tab 2</bq-tab>
      <bq-tab tab-id="3">Tab 3</bq-tab>
      <bq-tab tab-id="4">Tab 4</bq-tab>
      <bq-tab tab-id="5">Tab 5</bq-tab>
    </bq-tab-group>
    `);

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqChange = await page.spyOnEvent('bqChange');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Tab');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventTimes(3);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });
});
