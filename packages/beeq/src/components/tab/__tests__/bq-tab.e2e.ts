import { newE2EPage } from '@stencil/core/testing';

import { computedStyle, waitForSvgLoad } from '../../../shared/test-utils';

describe('bq-tab', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-tab id="1"><p>Tab text</p></bq-tab>',
    });

    const element = await page.find('bq-tab');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-tab id="1"><p>Tab text</p></bq-tab>',
    });

    const element = await page.find('bq-tab');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage({
      html: '<bq-tab id="1"><p>Tab text</p></bq-tab>',
    });

    const slotText = await page.$eval('bq-tab', (element) => {
      const slotElement = element.shadowRoot.querySelector('[part="text"] > slot');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(slotText).toBe('Tab text');
  });

  it('should display icon', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab id="1">
          <bq-icon name="check" slot="icon"></bq-icon>
          <p>Tab text</p>
        </bq-tab>
      `,
    });

    await page.$eval('bq-icon', waitForSvgLoad);

    const slotText = await page.$eval('bq-tab', (element) => {
      const slotElement = element.shadowRoot.querySelector('[part="icon"] > slot');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      const svg = assignedElements.shadowRoot.querySelector('svg');

      return svg.innerHTML;
    });

    expect(slotText).toBe(
      '<path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>',
    );
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab id="1"><p>Tab text</p></bq-tab>
        <bq-tab id="2"><p>Tab text</p></bq-tab>
      `,
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedTagName = await page.evaluate(() => document.activeElement.tagName.toLocaleLowerCase());

    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(focusedTagName).toEqual('bq-tab');
  });

  it('should handle `disabled` property', async () => {
    const page = await newE2EPage({
      html: '<bq-tab id="1" disabled><p>Tab text</p></bq-tab>',
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    const element = await page.find('bq-tab >>> [part="base"]');

    await element.click();

    await page.waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should respect design style', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tab id="1" size="small"><p>Tab text</p></bq-tab>
        <bq-tab id="2" size="medium"><p>Tab text</p></bq-tab>
        <bq-tab id="3" size="large"><p>Tab text</p></bq-tab>
      `,
    });

    const smallStyle = await computedStyle(page, 'bq-tab[size="small"] >>> [part="base"]', ['padding']);
    const mediumStyle = await computedStyle(page, 'bq-tab[size="medium"] >>> [part="base"]', ['padding']);
    const largeStyle = await computedStyle(page, 'bq-tab[size="large"] >>> [part="base"]', ['padding']);

    expect(smallStyle).toEqual({ padding: '4px 16px' });
    expect(mediumStyle).toEqual({ padding: '8px 24px' });
    expect(largeStyle).toEqual({ padding: '12px 24px' });
  });
});
