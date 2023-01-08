import { newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

describe('bq-button', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button>Button</bq-button>');

    const element = await page.find('bq-button');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button>Button</bq-button>');

    const element = await page.find('bq-button');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render <a> tag', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button href="https://www.example.com">Button</bq-button>');

    const element = await page.find('bq-button >>> [part="button"]');

    expect(element.tagName.toLocaleLowerCase()).toBe('a');
  });

  it('should trigger bqClick', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button>Button</bq-button>');

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    const element = await page.find('bq-button >>> [part="button"]');

    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button>Button<bq-button><bq-button>Button</bq-button>');

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedTagName = await page.evaluate(() => document.activeElement.tagName.toLocaleLowerCase());

    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(focusedTagName).toEqual('bq-button');
  });

  it('should handle `disabled` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button disabled>Button</bq-button>');

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    const element = await page.find('bq-button >>> [part="button"]');

    element.click();

    await page.waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should render prefix element', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button><span slot="prefix">Prefix text</span>Button</bq-button>');

    const prefixText = await page.$eval('bq-button', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="prefix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(prefixText).toBe('Prefix text');
  });

  it('should render suffix element', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button><span slot="suffix">Suffix text</span>Button</bq-button>');

    const suffixText = await page.$eval('bq-button', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="suffix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(suffixText).toEqualText('Suffix text');
  });

  it('should render loading indicator', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-button loading>Button</bq-button>');

    const spinnerIcon = await page.find('bq-button >>> bq-icon[name="spinner-gap"]');

    expect(spinnerIcon).toBeDefined();
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-button size="small">Button</bq-button>
      <bq-button size="medium">Button</bq-button>
      <bq-button size="large">Button</bq-button>
    `);

    const smallStyle = await computedStyle(page, 'bq-button[size="small"] >>> [part="button"]');
    const mediumStyle = await computedStyle(page, 'bq-button[size="medium"] >>> [part="button"]');
    const largeStyle = await computedStyle(page, 'bq-button[size="large"] >>> [part="button"]');

    expect(smallStyle.height).toBe('32px');
    expect(smallStyle.padding).toBe('4px 8px');
    expect(mediumStyle.height).toBe('48px');
    expect(mediumStyle.padding).toBe('12px 16px');
    expect(largeStyle.height).toBe('56px');
    expect(largeStyle.padding).toBe('16px 24px');
  });

  it('should handle invalid properties', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-button size="small" appearance="secondary" type="submit" variant="ghost">Button</bq-button>',
    );

    const console: jest.Mock<void, string[]> = jest.fn();
    page.on('console', (message) => console(message.type(), message.text()));

    const element = await page.find('bq-button');

    element.setProperty('type', 'invalid');
    element.setProperty('size', 'invalid');
    element.setProperty('variant', 'invalid');
    element.setProperty('appearance', 'invalid');

    await page.waitForChanges();

    expect(console).toHaveBeenCalledTimes(4);
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-BUTTON] Please notice that "appearance" should be one of primary|secondary|link|text',
    );
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-BUTTON] Please notice that "type" should be one of button|submit|reset',
    );
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-BUTTON] Please notice that "size" should be one of small|medium|large',
    );
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-BUTTON] Please notice that "variant" should be one of standard|ghost|danger',
    );

    expect(element.getAttribute('appearance')).toBe('primary');
    expect(element.getAttribute('type')).toBe('button');
    expect(element.getAttribute('size')).toBe('medium');
    expect(element.getAttribute('variant')).toBe('standard');
  });

  it('should behave as submit button', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <form id="formId">
        <input type="text" name="test" value="test-value" />
        <bq-button type="submit" form-id="formId">Button</bq-button>
      </form>
    `);

    const form = await page.find('form');
    const spy = await form.spyOnEvent('submit');

    await (await page.find('bq-button')).click();

    expect(spy).toHaveReceivedEvent();
  });

  it('should behave as reset button', async () => {
    const page = await newE2EPage();

    function getInputValue() {
      return page.$eval('input', (input) => input.value);
    }

    await page.setContent(`
      <form id="formId">
        <input type="text" name="test" value="test" />
        <bq-button type="reset" form-id="formId">Button</bq-button>
      </form>
    `);

    await page.type('input', 'value ');

    const inputValue = await getInputValue();

    await (await page.find('bq-button')).click();

    expect(inputValue).toBe('value test');
    expect(await getInputValue()).toBe('test');
  });
});
