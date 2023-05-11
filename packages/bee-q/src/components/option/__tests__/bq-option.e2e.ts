import { newE2EPage } from '@stencil/core/testing';

describe('bq-option', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option></bq-option>');

    const element = await page.find('bq-option');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option></bq-option>');

    const element = await page.find('bq-option');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option>Option 1</bq-option>');

    const element = await page.find('bq-option');

    expect(element).toEqualText('Option 1');
  });

  it('should trigger bqClick', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option>Menu item label</bq-option>');

    const bqFocus = await page.spyOnEvent('bqOptionFocus');
    const bqBlur = await page.spyOnEvent('bqOptionBlur');
    const bqClick = await page.spyOnEvent('bqOptionClick');

    const element = await page.find('bq-option');

    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-option value="option1">
        <bq-icon name="user" size="16" slot="prefix"></bq-icon>
        <span>Option 1</span>
        <bq-icon name="gear" size="16" slot="suffix"></bq-icon>
      </bq-option>
    `);

    const bqFocus = await page.spyOnEvent('bqOptionFocus');
    const bqBlur = await page.spyOnEvent('bqOptionBlur');
    const bqClick = await page.spyOnEvent('bqOptionClick');
    await page.keyboard.press('Tab');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should handle Enter', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option>Option 1</bq-option>');

    const bqFocus = await page.spyOnEvent('bqOptionFocus');
    const bqBlur = await page.spyOnEvent('bqOptionBlur');
    const bqClick = await page.spyOnEvent('bqOptionClick');
    const bqKeyEnter = await page.spyOnEvent('bqOptionOnEnter');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqKeyEnter).toHaveReceivedEventTimes(1);
  });

  it('should handle `disabled` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option disabled="true">Option 1</bq-option>');

    const bqFocus = await page.spyOnEvent('bqOptionFocus');
    const bqBlur = await page.spyOnEvent('bqOptionBlur');
    const bqClick = await page.spyOnEvent('bqOptionClick');

    const element = await page.find('bq-option');

    element.click();

    await page.waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should render prefix element', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-option value="option1">
        <span slot="prefix">Prefix</span>
        <span>Option label</span>
      </bq-option>
    `);

    const prefixText = await page.$eval('bq-option', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="prefix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(prefixText).toBe('Prefix');
  });

  it('should render suffix element', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-option value="option1">
        <span>Option label</span>
        <span slot="suffix">Suffix</span> 
      </bq-option>
    `);

    const suffixText = await page.$eval('bq-option', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="suffix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(suffixText).toEqualText('Suffix');
  });

  it('should handle `selected` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option selected="true">Option 1</bq-option>');

    const bqOption = await page.find('bq-option >>> div');

    expect(bqOption).toHaveClass('active');
  });
});
