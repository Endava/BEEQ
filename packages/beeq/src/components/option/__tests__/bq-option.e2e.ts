import { newE2EPage } from '@stencil/core/testing';

describe('bq-option', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-option>Option label</bq-option>',
    });
    const element = await page.find('bq-option');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-option>Option label</bq-option>',
    });
    const element = await page.find('bq-option');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const text = 'Option label';
    const page = await newE2EPage({
      html: `<bq-option>${text}</bq-option>`,
    });
    const element = await page.find('bq-option');

    expect(element).toEqualText(text);
  });

  it('should trigger bqClick', async () => {
    const page = await newE2EPage({
      html: '<bq-option>Option label</bq-option>',
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqClick = await page.spyOnEvent('bqClick');

    const element = await page.find('bq-option');
    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage({
      html: '<bq-option>Option label</bq-option>',
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqClick = await page.spyOnEvent('bqClick');
    await page.keyboard.press('Tab');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should handle Enter', async () => {
    const page = await newE2EPage({
      html: '<bq-option>Option label</bq-option>',
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqEnter = await page.spyOnEvent('bqEnter');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqEnter).toHaveReceivedEventTimes(1);
  });

  it('should handle `disabled` property', async () => {
    const page = await newE2EPage({
      html: '<bq-option disabled="true">Option label</bq-option>',
    });
    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqClick = await page.spyOnEvent('bqClick');

    await page.$eval('bq-option', async (elem: HTMLBqOptionElement) => {
      const button = elem.shadowRoot?.querySelector('button[part="base"]');
      if (button instanceof HTMLButtonElement) {
        button.click();
      }
    });
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
    const page = await newE2EPage({
      html: `
        <bq-option value="option1">
          <span>Option label</span>
          <span slot="suffix">Suffix</span>
        </bq-option>
      `,
    });

    const suffixText = await page.$eval('bq-option', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="suffix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(suffixText).toEqualText('Suffix');
  });

  it('should handle `selected` property', async () => {
    const page = await newE2EPage({
      html: '<bq-option selected="true">Option 1</bq-option>',
    });

    const bqOption = await page.find('bq-option >>> button[part="base"]');

    expect(bqOption).toHaveClass('active');
  });
});
