import { newE2EPage } from '@stencil/core/testing';

describe('bq-tab-group', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab-group value="1">
          <bq-tab tab-id="1">Tab 1</bq-tab>
          <bq-tab tab-id="2">Tab 2</bq-tab>
        </bq-tab-group>
      `,
    });

    const element = await page.find('bq-tab-group');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab-group value="1">
          <bq-tab tab-id="1">Tab 1</bq-tab>
          <bq-tab tab-id="2">Tab 2</bq-tab>
        </bq-tab-group>
      `,
    });

    const element = await page.find('bq-tab-group');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should change size of all tabs', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab-group value="1" size="medium">
          <bq-tab tab-id="1">Tab 1</bq-tab>
          <bq-tab tab-id="2">Tab 2</bq-tab>
        </bq-tab-group>
      `,
    });

    const element = await page.find('bq-tab');

    expect(await element.getProperty('size')).toBe('medium');
  });

  it('should emit bqChange on tab click', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab-group value="1">
          <bq-tab tab-id="1">Tab 1</bq-tab>
          <bq-tab tab-id="2">Tab 2</bq-tab>
        </bq-tab-group>
      `,
    });

    const bqTabGroupElement = await page.find('bq-tab-group');
    const bqFocus = await bqTabGroupElement.spyOnEvent('bqFocus');
    const bqChange = await bqTabGroupElement.spyOnEvent('bqChange');
    const bqBlur = await bqTabGroupElement.spyOnEvent('bqBlur');

    const element = await page.find('bq-tab[tab-id="2"]');
    await element.click();

    await page.waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should emit bqChange on keyboard navigation', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab-group value="1">
          <bq-tab tab-id="1">Tab 1</bq-tab>
          <bq-tab tab-id="2">Tab 2</bq-tab>
          <bq-tab tab-id="3">Tab 3</bq-tab>
          <bq-tab tab-id="4">Tab 4</bq-tab>
        </bq-tab-group>
      `,
    });
    await page.waitForSelector('.hydrated');

    const bqTabGroupElement = await page.find('bq-tab-group');
    const bqFocus = await bqTabGroupElement.spyOnEvent('bqFocus');
    const bqChange = await bqTabGroupElement.spyOnEvent('bqChange');
    const bqBlur = await bqTabGroupElement.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.waitForChanges();

    await page.keyboard.press('ArrowRight');
    await page.waitForChanges();
    await page.keyboard.press('ArrowRight');
    await page.waitForChanges();
    await page.keyboard.press('ArrowRight');
    await page.waitForChanges();

    await page.keyboard.press('Tab');

    expect(bqFocus).toHaveReceivedEventTimes(4);
    expect(bqChange).toHaveReceivedEventTimes(3);
    expect(bqBlur).toHaveReceivedEventTimes(4);
  });

  it('should change active tab if value is change externally', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab-group value="1">
          <bq-tab tab-id="1">Tab 1</bq-tab>
          <bq-tab tab-id="2">Tab 2</bq-tab>
          <bq-tab tab-id="3">Tab 3</bq-tab>
          <bq-tab tab-id="4">Tab 4</bq-tab>
        </bq-tab-group>
      `,
    });

    const element = await page.find('bq-tab-group');
    element.setAttribute('value', '2');

    await page.waitForChanges();

    const activeElement = await page.find('bq-tab[active]');

    expect(activeElement).toEqualText('Tab 2');
  });
});
