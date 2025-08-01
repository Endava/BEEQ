import { newE2EPage } from '@stencil/core/testing';

import { computedStyle, setProperties } from '../../../shared/test-utils';

describe('bq-radio', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-radio></bq-radio>',
    });

    const element = await page.find('bq-radio');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-radio></bq-radio>',
    });

    const element = await page.find('bq-radio');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display label', async () => {
    const page = await newE2EPage({
      html: '<bq-radio><p>Label</p></bq-radio>',
    });

    const labelText = await page.$eval('bq-radio', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot');
      const assignedElements = slotElement.assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });
    expect(labelText).toEqualText('Label');
  });

  it('should handle checked state correctly', async () => {
    const page = await newE2EPage({
      html: '<bq-radio value="test-value" name="test-option">Test Label</bq-radio>',
    });

    const bqRadio = await page.find('bq-radio');
    const input = await page.find('bq-radio >>> input');

    expect(bqRadio).not.toHaveAttribute('checked');
    expect(await input.getProperty('checked')).toBe(false);

    await setProperties(page, 'bq-radio', { checked: true });

    expect(bqRadio).toHaveAttribute('checked');
    expect(await input.getProperty('checked')).toBe(true);

    await setProperties(page, 'bq-radio', { checked: false });

    expect(bqRadio).not.toHaveAttribute('checked');
    expect(await input.getProperty('checked')).toBe(false);
  });

  it('should emit bqClick event when clicked', async () => {
    const page = await newE2EPage({
      html: '<bq-radio value="test-value" name="test-option">Test Label</bq-radio>',
    });

    const bqClick = await page.spyOnEvent('bqClick');
    const bqRadio = await page.find('bq-radio');

    await bqRadio.click();
    await page.waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should not emit bqClick event when clicked and disabled', async () => {
    const page = await newE2EPage({
      html: '<bq-radio value="test-value" name="test-option" disabled>Test Label</bq-radio>',
    });

    const bqClick = await page.spyOnEvent('bqClick');
    const bqRadio = await page.find('bq-radio');

    await bqRadio.click();
    await page.waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(0);
  });

  it('should emit bqFocus event when focused', async () => {
    const page = await newE2EPage({
      html: '<bq-radio value="test-value" name="test-option">Test Label</bq-radio>',
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqRadio = await page.find('bq-radio');

    await bqRadio.focus();
    await page.waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
  });

  it('should not emit bqFocus event when focused and disabled', async () => {
    const page = await newE2EPage({
      html: '<bq-radio value="test-value" name="test-option" disabled>Test Label</bq-radio>',
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqRadio = await page.find('bq-radio');

    await bqRadio.focus();
    await page.waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
  });

  it('should handle keydown', async () => {
    const page = await newE2EPage({
      html: '<bq-radio value="test-value" name="test-option">Test Label</bq-radio>',
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqKeyDown = await page.spyOnEvent('bqKeyDown');

    const radio = await page.find('bq-radio');
    await radio.focus();
    await page.waitForChanges();

    await page.keyboard.press('0');
    await page.waitForChanges();

    const focusedTagName = await page.evaluate(() => document?.activeElement?.tagName.toLowerCase());

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqKeyDown).toHaveReceivedEventTimes(1);
    expect(focusedTagName).toEqual('bq-radio');
  });

  it('should respect design style', async () => {
    const page = await newE2EPage({
      html: '<bq-radio name="option" value="1">option 1</bq-radio>',
    });

    const style = await computedStyle(page, 'bq-radio >>> [part="base"]', ['height', 'gap', 'borderRadius']);
    expect(style).toEqual({ height: '40px', gap: '8px', borderRadius: '8px' });
  });
});
