import { newE2EPage } from '@stencil/core/testing';

describe('bq-select', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `<bq-select></bq-select>`,
    });
    const element = await page.find('bq-select');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-select></bq-select>`,
    });
    const element = await page.find('bq-select');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render with default suffix icon', async () => {
    const page = await newE2EPage({
      html: `<bq-select></bq-select>`,
    });
    const suffixIconElem = await page.find('bq-select >>> bq-icon[name="caret-down"]');

    expect(suffixIconElem).not.toBeNull();
  });

  it('should render with prefix icon', async () => {
    const page = await newE2EPage({
      html: `
        <bq-select>
          <bq-icon name="user-circle" slot="prefix"></bq-icon>
        </bq-select>
      `,
    });
    const prefixContainerElem = await page.find('bq-select >>> .bq-select--control__prefix');
    expect(prefixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with label content', async () => {
    const page = await newE2EPage({
      html: `
        <bq-select>
          <label slot="label">Select label</label>
        </bq-select>
      `,
    });
    const labelContainerElem = await page.find('bq-select >>> .bq-select--label');

    expect(labelContainerElem).not.toHaveClass('hidden');
  });

  it('should render with helper content', async () => {
    const page = await newE2EPage({
      html: `
        <bq-select>
          <span slot="helper-text">Helper text</span>
        </bq-select>
      `,
    });
    const helperContainerElem = await page.find('bq-select >>> .bq-select--helper-text');

    expect(helperContainerElem).not.toHaveClass('hidden');
  });

  it('should render with options', async () => {
    const page = await newE2EPage({
      html: `
        <bq-select>
          <bq-option value="1">Option 1</bq-option>
          <bq-option value="2">Option 2</bq-option>
          <bq-option value="3">Option 3</bq-option>
        </bq-select>
      `,
    });
    const optionElems = await page.findAll('bq-select > bq-option');

    expect(optionElems.length).toEqual(3);
  });

  it('should render with panel options opened', async () => {
    const page = await newE2EPage({
      html: `
        <bq-select open>
          <bq-option value="1">Option 1</bq-option>
          <bq-option value="2">Option 2</bq-option>
          <bq-option value="3">Option 3</bq-option>
        </bq-select>
      `,
    });
    const selectPanelElem = await page.find('bq-select >>> .bq-select__dropdown >>> .bq-dropdown__panel');

    expect(selectPanelElem).toHaveAttribute('open');
  });

  it('should render with selected option', async () => {
    const selectedValue = 1;
    const page = await newE2EPage({
      html: `
        <bq-select value="${selectedValue}">
          <bq-option value="1">Option 1</bq-option>
          <bq-option value="2">Option 2</bq-option>
          <bq-option value="3">Option 3</bq-option>
        </bq-select>
      `,
    });
    const selectValueElem = await page.find(`bq-select bq-option[value="${selectedValue}"]`);

    expect(selectValueElem).toHaveAttribute('selected');
  });

  it('should select an option and emit Select event', async () => {
    const value = 2;
    const page = await newE2EPage({
      html: `
        <bq-select>
          <bq-option value="1">Option 1</bq-option>
          <bq-option value="2">Option 2</bq-option>
          <bq-option value="3">Option 3</bq-option>
        </bq-select>
      `,
    });
    const eventEmitter = await page.spyOnEvent('bqSelect');

    const selectElem = await page.find('bq-select');
    await selectElem.click();
    await page.waitForChanges();

    const selectOptionElem = await page.find(`bq-option[value="${value}"]`);
    expect(selectOptionElem).not.toHaveAttribute('selected');

    await selectOptionElem.click();
    await page.waitForChanges();

    expect(selectOptionElem).toHaveAttribute('selected');
    expect(eventEmitter).toHaveReceivedEventTimes(1);
  });
});
