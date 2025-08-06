import { newE2EPage } from '@stencil/core/testing';
import { sleep } from '../../../shared/test-utils';

describe('bq-radio-group', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-radio-group></bq-radio-group>',
    });

    const element = await page.find('bq-radio-group');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-radio-group></bq-radio-group>',
    });

    const element = await page.find('bq-radio-group');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should set value attribute when a radio is clicked', async () => {
    const page = await newE2EPage({
      html: `
        <bq-radio-group name="test-option">
          <bq-radio value="option1">Option 1</bq-radio>
          <bq-radio value="option2">Option 2</bq-radio>
        </bq-radio-group>
      `,
    });

    const bqRadioGroup = await page.find('bq-radio-group');
    const option2 = await page.find('bq-radio[value="option2"]');

    await option2.click();
    await page.waitForChanges();

    expect(bqRadioGroup).toHaveAttribute('value');
    expect(bqRadioGroup).toEqualAttribute('value', 'option2');
  });

  it('should submit the form, if required, only if a radio is checked', async () => {
    const page = await newE2EPage({
      html: `
      <form>
        <bq-radio-group name="test-option" required>
          <bq-radio value="option1">Option 1</bq-radio>
          <bq-radio value="option2">Option 2</bq-radio>
          <bq-radio value="option3">Option 3</bq-radio>
        </bq-radio-group>
        <bq-button type="submit">Submit</bq-button>
      </form>
    `,
    });
    await page.waitForChanges();

    const form = await page.find('form');
    const radioGroup = await page.find('bq-radio-group');
    const submitButton = await page.find('bq-button[type="submit"]');
    const submitSpy = await form.spyOnEvent('submit');

    await submitButton.click();
    await page.waitForChanges();

    expect(submitSpy).toHaveReceivedEventTimes(0);
    expect(radioGroup).not.toHaveAttribute('value');

    const option1 = await page.find('bq-radio[value="option2"]');
    await option1.click();
    await page.waitForChanges();

    await submitButton.click();
    await page.waitForChanges();

    expect(submitSpy).toHaveReceivedEventTimes(1);
    expect(radioGroup).toEqualAttribute('value', 'option2');
  });

  it('should check a radio when the value attribute is set', async () => {
    const page = await newE2EPage({
      html: `
        <bq-radio-group name="test-option" value="option2">
          <bq-radio value="option1">Option 1</bq-radio>
          <bq-radio value="option2">Option 2</bq-radio>
          <bq-radio value="option3">Option 3</bq-radio>
        </bq-radio-group>
      `,
    });

    await page.waitForChanges();

    const option1 = await page.find('bq-radio[value="option1"]');
    const option2 = await page.find('bq-radio[value="option2"]');
    const option3 = await page.find('bq-radio[value="option3"]');

    expect(await option1.getProperty('checked')).toBe(false);
    expect(await option2.getProperty('checked')).toBe(true);
    expect(await option3.getProperty('checked')).toBe(false);
  });

  it('should handle the checked state correctly', async () => {
    const page = await newE2EPage({
      html: `
        <bq-radio-group name="test-option">
          <bq-radio value="option1">Option 1</bq-radio>
          <bq-radio value="option2">Option 2</bq-radio>
          <bq-radio value="option3">Option 3</bq-radio>
        </bq-radio-group>
      `,
    });

    const bqRadioGroup = await page.find('bq-radio-group');
    const option1 = await page.find('bq-radio[value="option1"]');
    const option2 = await page.find('bq-radio[value="option2"]');
    const option3 = await page.find('bq-radio[value="option3"]');

    await option1.click();
    await page.waitForChanges();

    expect(bqRadioGroup).toEqualAttribute('value', 'option1');
    expect(await option1.getProperty('checked')).toBe(true);
    expect(await option2.getProperty('checked')).toBe(false);
    expect(await option3.getProperty('checked')).toBe(false);

    await option2.click();
    await page.waitForChanges();

    expect(bqRadioGroup).toEqualAttribute('value', 'option2');
    expect(await option1.getProperty('checked')).toBe(false);
    expect(await option2.getProperty('checked')).toBe(true);
    expect(await option3.getProperty('checked')).toBe(false);

    await option3.click();
    await page.waitForChanges();

    expect(bqRadioGroup).toEqualAttribute('value', 'option3');
    expect(await option1.getProperty('checked')).toBe(false);
    expect(await option2.getProperty('checked')).toBe(false);
    expect(await option3.getProperty('checked')).toBe(true);
  });

  it('should emit the bqChange event when a radio is clicked', async () => {
    const page = await newE2EPage({
      html: `
        <bq-radio-group name="test-option">
          <bq-radio value="option1">Option 1</bq-radio>
          <bq-radio value="option2">Option 2</bq-radio>
          <bq-radio value="option3">Option 3</bq-radio>
        </bq-radio-group>
      `,
    });

    const bqChange = await page.spyOnEvent('bqChange');
    const option1 = await page.find('bq-radio[value="option1"]');

    await option1.click();
    await page.waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should debounce the bqChange event and emit only the final value', async () => {
    const page = await newE2EPage({
      html: `
      <bq-radio-group name="test-option" debounce-time="150">
        <bq-radio value="option1">Option 1</bq-radio>
        <bq-radio value="option2">Option 2</bq-radio>
        <bq-radio value="option3">Option 3</bq-radio>
      </bq-radio-group>
    `,
    });
    await page.waitForChanges();

    const bqChange = await page.spyOnEvent('bqChange');
    const radioGroup = await page.find('bq-radio-group');

    await (await page.find('bq-radio[value="option1"]')).click();
    await (await page.find('bq-radio[value="option2"]')).click();
    await (await page.find('bq-radio[value="option3"]')).click();

    await page.waitForChanges();
    await sleep(150);

    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(await radioGroup.getProperty('value')).toBe('option3');
    expect(radioGroup).toEqualAttribute('value', 'option3');
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage({
      html: `
        <bq-radio-group name="test-option">
          <bq-radio value="option1">Option 1</bq-radio>
          <bq-radio value="option2">Option 2</bq-radio>
          <bq-radio value="option3">Option 3</bq-radio>
        </bq-radio-group>
      `,
    });

    await page.waitForChanges();

    await page.keyboard.press('Tab');
    await page.waitForChanges();

    const bqRadioGroup = await page.find('bq-radio-group');
    expect(await bqRadioGroup.getProperty('value')).toBeUndefined();

    await bqRadioGroup.press('ArrowRight');
    await page.waitForChanges();

    expect(await bqRadioGroup.getProperty('value')).toBe('option2');
    expect(await page.find('bq-radio[value="option2"]')).toHaveAttribute('checked');

    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();

    expect(await bqRadioGroup.getProperty('value')).toBe('option3');
    expect(await page.find('bq-radio[value="option3"]')).toHaveAttribute('checked');

    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();

    expect(await bqRadioGroup.getProperty('value')).toBe('option1');
    expect(await page.find('bq-radio[value="option1"]')).toHaveAttribute('checked');
  });
});
