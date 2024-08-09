import { newE2EPage } from '@stencil/core/testing';

describe('bq-input', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-input></bq-input>',
    });

    const bqInputElem = await page.find('bq-input');
    expect(bqInputElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-input></bq-input>',
    });

    const bqInputElem = await page.find('bq-input');
    expect(bqInputElem.shadowRoot).not.toBeNull();
  });

  it('should render with prefix icon', async () => {
    const page = await newE2EPage({
      html: `
        <bq-input>
          <bq-icon name="user-circle" slot="prefix"></bq-icon>
        </bq-input>
      `,
    });

    const prefixContainerElem = await page.find('bq-input >>> .bq-input--control__prefix');
    expect(prefixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with suffix icon', async () => {
    const page = await newE2EPage({
      html: `
        <bq-input>
          <bq-icon name="gear" slot="suffix"></bq-icon>
        </bq-input>
      `,
    });

    const suffixContainerElem = await page.find('bq-input >>> .bq-input--control__suffix');
    expect(suffixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with label content', async () => {
    const page = await newE2EPage({
      html: `
        <bq-input>
          <label slot="label">Input label</label>
        </bq-input>
      `,
    });

    const labelContainerElem = await page.find('bq-input >>> .bq-input--label');
    expect(labelContainerElem).not.toHaveClass('hidden');
  });

  it('should render with helper content', async () => {
    const page = await newE2EPage({
      html: `
        <bq-input>
          <span slot="helper-text">Helper text</span>
        </bq-input>
      `,
    });

    const helperContainerElem = await page.find('bq-input >>> .bq-input--helper-text');
    expect(helperContainerElem).not.toHaveClass('hidden');
  });

  it('should write and emit change event', async () => {
    const inputValue = 'Hello';
    const page = await newE2EPage({
      html: '<bq-input></bq-input>',
    });

    const bqChange = await page.spyOnEvent('bqChange');

    const bqInputElem = await page.find('bq-input');
    const nativeInputElem = await page.find('bq-input >>> .bq-input--control__input');

    await nativeInputElem.type(inputValue);
    await page.$eval('bq-input >>> .bq-input--control__input', (e) => {
      (e as HTMLInputElement).blur();
    });
    await page.waitForChanges();

    expect(await bqInputElem.getProperty('value')).toBe(inputValue);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should write and emit input event', async () => {
    const inputValue = 'Hello';
    const page = await newE2EPage({
      html: '<bq-input></bq-input>',
    });

    const bqInput = await page.spyOnEvent('bqInput');

    const bqInputElem = await page.find('bq-input');

    await page.focus('bq-input >>> .bq-input--control__input');
    await page.keyboard.type(inputValue);
    await page.waitForChanges();

    expect(await bqInputElem.getProperty('value')).toBe(inputValue);
    expect(bqInput).toHaveReceivedEventTimes(inputValue.length);
  });

  it('should clear the value and emit clear event', async () => {
    const inputValue = 'Hello';
    const page = await newE2EPage({
      html: `
        <bq-input value="${inputValue}"></bq-input>
      `,
    });

    const bqClear = await page.spyOnEvent('bqClear');

    const bqInputElem = await page.find('bq-input');
    const nativeInputElem = await page.find('bq-input >>> .bq-input--control__input');
    expect(await nativeInputElem.getProperty('value')).toBe(inputValue);

    await nativeInputElem.focus();
    await page.waitForChanges();

    const clearBtnElem = await page.find('bq-input >>> .bq-input--control__clear');
    await clearBtnElem.click();

    expect(bqClear).toHaveReceivedEventTimes(1);
    expect(await bqInputElem.getProperty('value')).toEqual('');
  });
});
