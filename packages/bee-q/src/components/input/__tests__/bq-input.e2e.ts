import { newE2EPage } from '@stencil/core/testing';

describe('bq-input', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-input></bq-input>');

    const bqInputElem = await page.find('bq-input');
    expect(bqInputElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-input></bq-input>');

    const bqInputElem = await page.find('bq-input');
    expect(bqInputElem.shadowRoot).not.toBeNull();
  });

  it('should render with prefix icon', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-input>
        <bq-icon name="user-circle" slot="prefix"></bq-icon>
      </bq-input>
    `);

    const prefixContainerElem = await page.find('bq-input >>> .bq-input--control__prefix');
    expect(prefixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with suffix icon', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-input>
        <bq-icon name="gear" slot="suffix"></bq-icon>
      </bq-input>
    `);

    const suffixContainerElem = await page.find('bq-input >>> .bq-input--control__suffix');
    expect(suffixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with label content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-input>
        <label slot="label">Input label</label>
      </bq-input>
    `);

    const labelContainerElem = await page.find('bq-input >>> .bq-input--label');
    expect(labelContainerElem).not.toHaveClass('hidden');
  });

  it('should render with helper content', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-input>
        <span slot="helper-text">Helper text</span>
      </bq-input>
    `);

    const helperContainerElem = await page.find('bq-input >>> .bq-input--helper-text');
    expect(helperContainerElem).not.toHaveClass('hidden');
  });

  it('should write and emit change event', async () => {
    const inputValue = 'Hello World!';
    const page = await newE2EPage();
    await page.setContent(`
      <bq-input></bq-input>
    `);

    const bqChange = await page.spyOnEvent('bqChange');

    const bqInputElem = await page.find('bq-input');
    const nativeInputElem = await page.find('bq-input >>> .bq-input--control__input');

    await nativeInputElem.type(inputValue);
    await page.waitForChanges();

    expect(await bqInputElem.getProperty('value')).toBe('Hello World!');
    expect(bqChange).toHaveReceivedEventTimes(inputValue.length);
  });

  it('should clear the value and emit clear event', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-input value="Hello World!"></bq-input>
    `);

    const bqClear = await page.spyOnEvent('bqClear');

    const bqInputElem = await page.find('bq-input');
    const nativeInputElem = await page.find('bq-input >>> .bq-input--control__input');
    expect(await nativeInputElem.getProperty('value')).toBe('Hello World!');

    await nativeInputElem.focus();
    await page.waitForChanges();

    const clearBtnElem = await page.find('bq-input >>> .bq-input--control__clear');
    await clearBtnElem.click();

    expect(bqClear).toHaveReceivedEventTimes(1);
    expect(await bqInputElem.getProperty('value')).toEqual('');
  });
});
