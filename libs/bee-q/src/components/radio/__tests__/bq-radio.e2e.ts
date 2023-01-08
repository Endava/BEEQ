import { newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

describe('bq-radio', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-radio></<bq-radio>');

    const element = await page.find('bq-radio');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-radio></<bq-radio>');

    const element = await page.find('bq-radio');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display label', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-radio><p>Label</p></<bq-radio>');

    const labelText = await page.$eval('bq-radio', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(labelText).toEqualText('Label');
  });

  it('should check', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-radio value="value" name="option">Label</<bq-radio>');

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    const element = await page.find('bq-radio');

    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);

    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(2);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(await page.$eval('bq-radio', (bqRadio) => bqRadio.checked)).toBe(true);
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage();
    await page.setContent(`
        <bq-radio name="option" value="1">option 1</bq-radio>
        <bq-radio name="option" value="2">option 2</bq-radio>
        <bq-radio name="option" value="3">option 3</bq-radio>
        `);

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedTagName = await page.evaluate(() => document.activeElement.tagName.toLocaleLowerCase());

    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(focusedTagName).toEqual('bq-radio');
  });

  it('should handle keydown', async () => {
    const page = await newE2EPage();
    await page.setContent(`<bq-radio name="option" value="1">option 1</bq-radio>`);

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqKeyDown = await page.spyOnEvent('bqKeyDown');

    await page.keyboard.press('Tab');
    await page.keyboard.press('0');

    const focusedTagName = await page.evaluate(() => document.activeElement.tagName.toLocaleLowerCase());

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqKeyDown).toHaveReceivedEventTimes(1);
    expect(focusedTagName).toEqual('bq-radio');
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent(`<bq-radio name="option" value="1">option 1</bq-radio>`);

    const style = await computedStyle(page, 'bq-radio >>> [part="base"]');

    expect(style.height).toBe('24px');
    expect(style.gap).toBe('8px');
    expect(style.borderRadius).toBe('8px');
  });
});
