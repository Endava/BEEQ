import { newE2EPage } from '@stencil/core/testing';

describe('bq-accordion-group', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    const element = await page.find('bq-accordion-group');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    const element = await page.find('bq-accordion-group');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should expand all accordions', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group expand-all>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    const elements = await page.findAll('bq-accordion[expanded]');

    expect(elements).toHaveLength(3);
  });

  it('should colapse all accordions', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group expand-all>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    const element = await page.find('bq-accordion-group');
    element.setProperty('expandAll', false);
    await page.waitForChanges();

    const elements = await page.findAll('bq-accordion[expanded]');

    expect(elements).toHaveLength(0);
  });

  it('should change appearance to all accordions', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    expect(await page.findAll('bq-accordion[appearance="ghost"]')).toHaveLength(0);

    const element = await page.find('bq-accordion-group');
    element.setProperty('appearance', 'ghost');
    await page.waitForChanges();

    expect(await page.findAll('bq-accordion[appearance="ghost"]')).toHaveLength(3);
  });

  it('should change size to all accordions', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    expect(await page.findAll('bq-accordion[size="small"]')).toHaveLength(0);

    const element = await page.find('bq-accordion-group');
    element.setProperty('size', 'small');
    await page.waitForChanges();

    expect(await page.findAll('bq-accordion[size="small"]')).toHaveLength(3);
  });

  it('should emit bqClick on accordion click', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    const element = await page.find('bq-accordion');
    await element.click();

    expect(await element.getProperty('expanded')).toBe(true);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should have only one accordion expanded', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group expand-all>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.click('bq-accordion', { count: 2 });
    await page.waitForChanges();

    const elements = await page.findAll('bq-accordion[expanded]');

    expect(elements).toHaveLength(1);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(2);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should be keyboard navigable', async () => {
    const page = await newE2EPage({
      html: `
      <bq-accordion-group expand-all>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
        <bq-accordion></bq-accordion>
      </bq-accordion-group>
      `,
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedTagName = await page.evaluate(() => document.activeElement.tagName.toLocaleLowerCase());

    expect(bqFocus).toHaveReceivedEventTimes(3);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(2);
    expect(focusedTagName).toEqual('bq-accordion');
  });
});
