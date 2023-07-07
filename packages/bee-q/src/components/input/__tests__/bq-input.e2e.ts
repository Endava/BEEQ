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

    const prefixContainerElem = await page.find('bq-input >>> .bq-input--prefix');
    expect(prefixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with suffix icon', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-input>
        <bq-icon name="gear" slot="suffix"></bq-icon>
      </bq-input>
    `);

    const suffixContainerElem = await page.find('bq-input >>> .bq-input--suffix');
    expect(suffixContainerElem).not.toHaveClass('hidden');
  });
});
