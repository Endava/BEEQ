import { newE2EPage } from '@stencil/core/testing';

describe('bq-textarea', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `<bq-textarea></bq-textarea>`,
    });
    const textareaElem = await page.find('bq-textarea');

    expect(textareaElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-textarea></bq-textarea>`,
    });
    const textareaElem = await page.find('bq-textarea');

    expect(textareaElem.shadowRoot).not.toBeNull();
  });

  it('should display value', async () => {
    const textValue = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';
    const page = await newE2EPage({
      html: `<bq-textarea value="${textValue}"></bq-textarea>`,
    });
    const textareaElem = await page.find('bq-textarea >>> .bq-textarea__input');

    expect(await textareaElem.getProperty('value')).toBe(textValue);
  });

  it('should render with label content', async () => {
    const page = await newE2EPage({
      html: `
        <bq-textarea>
          <label slot="label">Input label</label>
        </bq-textarea>
      `,
    });
    const labelContainerElem = await page.find('bq-textarea >>> .bq-textarea__label');

    expect(labelContainerElem).not.toHaveClass('hidden');
  });

  it('should render with helper text', async () => {
    const page = await newE2EPage({
      html: `
        <bq-textarea>
          <span slot="helper-text">Helper text</span>
        </bq-textarea>
      `,
    });
    const helperContainerElem = await page.find('bq-textarea >>> .bq-textarea__helper');

    expect(helperContainerElem).not.toHaveClass('hidden');
  });

  it('should render with maxlength counter', async () => {
    const page = await newE2EPage({
      html: `<bq-textarea maxlength="100"></bq-textarea>`,
    });
    const helperContainerElem = await page.find('bq-textarea >>> .bq-textarea__helper--counter');

    expect(helperContainerElem).not.toHaveClass('!hidden');
  });

  it('should hide helper content if no helper text and maxlength counter', async () => {
    const page = await newE2EPage({
      html: `<bq-textarea></bq-textarea>`,
    });
    const helperContainerElem = await page.find('bq-textarea >>> .bq-textarea__helper');

    expect(helperContainerElem).toHaveClass('!hidden');
  });

  it('should write and emit change event', async () => {
    const value = 'Hello';
    const page = await newE2EPage({
      html: `<bq-textarea></bq-textarea>`,
    });
    const bqTextareaElem = await page.find('bq-textarea');
    const bqChange = await bqTextareaElem.spyOnEvent('bqChange');

    await page.type('bq-textarea >>> .bq-textarea__input', value, { delay: 100 });
    await page.$eval('bq-textarea >>> .bq-textarea__input', (e: HTMLInputElement) => {
      e.blur();
    });
    await page.waitForChanges();

    expect(await bqTextareaElem.getProperty('value')).toBe(value);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should write and emit input event', async () => {
    const value = 'Hello';
    const page = await newE2EPage({
      html: `<bq-textarea></bq-textarea>`,
    });

    const bqTextareaElem = await page.find('bq-textarea');
    const bqInput = await bqTextareaElem.spyOnEvent('bqInput');

    await page.type('bq-textarea >>> .bq-textarea__input', value, { delay: 100 });
    await page.waitForChanges();

    expect(await bqTextareaElem.getProperty('value')).toBe(value);
    expect(bqInput).toHaveReceivedEventTimes(value.length);
  });

  it('should show and count all characters', async () => {
    const value = 'Hello';
    const maxlenght = 100;
    const page = await newE2EPage({
      html: `<bq-textarea maxlength="${maxlenght}"></bq-textarea>`,
    });
    const bqTextareaElem = await page.find('bq-textarea');
    const counterElem = await page.find('bq-textarea >>> .bq-textarea__helper--counter');

    bqTextareaElem.setProperty('value', value);
    await page.waitForChanges();

    expect(await counterElem.getProperty('innerText')).toBe(`${value.length}/${maxlenght}`);
  });

  it('should truncate text bigger than maxlenght', async () => {
    const value = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';
    const page = await newE2EPage({
      html: `<bq-textarea maxlength="10"></bq-textarea>`,
    });
    const bqTextareaElem = await page.find('bq-textarea');
    const nativeTextareaElem = await page.find('bq-textarea >>> .bq-textarea__input');

    bqTextareaElem.setProperty('value', value);
    await page.waitForChanges();

    expect(await nativeTextareaElem.getProperty('value')).toBe(value.substring(0, 10));
  });
});
