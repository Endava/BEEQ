import { newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

describe('bq-checkbox', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-checkbox></bq-checkbox>');

    const element = await page.find('bq-checkbox');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-checkbox></bq-checkbox>');

    const element = await page.find('bq-checkbox');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-checkbox><p>Label</p></bq-checkbox>');

    const labelText = await page.$eval('bq-checkbox', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot');
      const assignedElements = slotElement.assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(labelText).toEqualText('Label');
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-checkbox>Checkbox</bq-checkbox>
      <bq-checkbox>Checkbox 1</bq-checkbox>
    `);

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqChange = await page.spyOnEvent('bqChange');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedTagName = await page.evaluate(() => document.activeElement.tagName.toLocaleLowerCase());

    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(focusedTagName).toEqual('bq-checkbox');
  });

  it('should not be checked by default', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-checkbox>Label</bq-checkbox>');

    const checkmark = await page.find('bq-checkbox >>> [part="checkbox"]');

    expect(checkmark.innerHTML).toBe('');
  });

  it('should render check mark', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-checkbox>Label</bq-checkbox>');

    const bqChange = await page.spyOnEvent('bqChange');

    const element = await page.find('bq-checkbox >>> [part="input"]');

    await element.click();

    const checkmark = await page.find('bq-checkbox >>> [part="checkbox"]');

    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(checkmark.innerHTML).not.toBe('');
  });

  it('should render indeterminate', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-checkbox indeterminate>Label</bq-checkbox>');

    const indeterminateMark = await page.find('bq-checkbox >>> [part="checkbox"]');

    expect(indeterminateMark.innerHTML).not.toBe('');
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-checkbox>Label</bq-checkbox>');

    const baseStyle = await computedStyle(page, 'bq-checkbox >>> [part="base"]');
    const checkboxStyle = await computedStyle(page, 'bq-checkbox >>> [part="checkbox"]');

    expect(baseStyle.height).toBe('24px');
    expect(checkboxStyle.borderWidth).toBe('2px');
    expect(checkboxStyle.borderRadius).toBe('4px');
  });
});
