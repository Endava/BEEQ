import { newE2EPage } from '@stencil/core/testing';

import { setProperties } from '../../../shared/test-utils';

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
    const prefixContainerElem = await page.find('bq-select >>> .bq-select__control--prefix');
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
    const labelContainerElem = await page.find('bq-select >>> .bq-select__label');

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
    const helperContainerElem = await page.find('bq-select >>> .bq-select__helper-text');

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
    const options = await page.findAll('bq-select > bq-option');

    expect(options.length).toEqual(3);
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
    const optionSelector = `bq-select > bq-option[value="${value}"]`;
    const eventEmitter = await page.spyOnEvent('bqSelect');

    const selectElem = await page.find('bq-select');
    await selectElem.click();

    // Make sure the dropdown is open
    expect(await page.find('bq-select >>> bq-dropdown')).toHaveAttribute('open');

    // Make sure the option is not selected
    const optionElem = await page.find(optionSelector);
    expect(optionElem).not.toHaveAttribute('selected');

    await optionElem.click();
    await page.waitForChanges();

    // Make sure the dropdown is close
    expect(await page.find('bq-select >>> bq-dropdown')).not.toHaveAttribute('open');
    // Check that the option is selected
    expect(await page.find(optionSelector)).toHaveAttribute('selected');
    expect(eventEmitter).toHaveReceivedEventTimes(1);
  });

  it('should render with selected options', async () => {
    const page = await newE2EPage({
      html: `
        <bq-select multiple>
          <bq-option value="1">Option 1</bq-option>
          <bq-option value="2">Option 2</bq-option>
          <bq-option value="3">Option 3</bq-option>
        </bq-select>
      `,
    });

    await setProperties(page, 'bq-select', { value: JSON.stringify(['1', '2']) });

    const selectedValueElements = await page.findAll(`bq-select bq-option[selected]`);
    const displayTags = await page.findAll('bq-select >>> bq-tag');

    expect(selectedValueElements).toHaveLength(2);
    expect(displayTags).toHaveLength(2);
    expect(displayTags[0]).toEqualText('Option 1');
    expect(displayTags[1]).toEqualText('Option 2');
  });

  it('should rerender when value is change externally', async () => {
    const page = await newE2EPage({
      html: `
        <bq-select multiple>
          <bq-option value="1">Option 1</bq-option>
          <bq-option value="2">Option 2</bq-option>
          <bq-option value="3">Option 3</bq-option>
        </bq-select>
      `,
    });

    await setProperties(page, 'bq-select', { value: JSON.stringify(['1', '2']) });

    expect(await page.findAll(`bq-select bq-option[selected]`)).toHaveLength(2);

    await setProperties(page, 'bq-select', { value: JSON.stringify(['3']) });

    const displayTags = await page.findAll('bq-select >>> bq-tag');

    expect(await page.findAll(`bq-select bq-option[selected]`)).toHaveLength(1);
    expect(displayTags).toHaveLength(1);
    expect(displayTags[0]).toEqualText('Option 3');
  });
});
