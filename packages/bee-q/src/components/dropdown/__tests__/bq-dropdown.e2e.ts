import { newE2EPage } from '@stencil/core/testing';

describe('bq-dropdown', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `<bq-dropdown></bq-dropdown>`,
    });
    const element = await page.find('bq-dropdown');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-dropdown></bq-dropdown>`,
    });
    const element = await page.find('bq-dropdown');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should be visible on click', async () => {
    const page = await newE2EPage({
      html: `
        <bq-dropdown>
          <bq-button slot="trigger">Open</bq-button>
          <div>Some content in panel</div>
        </bq-dropdown>
      `,
    });
    const button = await page.find('bq-button');

    await button.click();

    const dropdownPanel = await page.find('bq-dropdown >>> .bq-dropdown__panel');
    expect(dropdownPanel).toHaveAttribute('open');
  });

  it('should open based on `open` prop', async () => {
    const page = await newE2EPage({
      html: `
        <bq-dropdown open="true">
          <bq-button slot="trigger">Open</bq-button>
          <div>Some content in panel</div>
        </bq-dropdown>
      `,
    });
    const dropdownPanel = await page.find('bq-dropdown >>> .bq-dropdown__panel');

    expect(dropdownPanel).toHaveAttribute('open');
  });

  it('should close on "Escape"', async () => {
    const page = await newE2EPage({
      html: `
        <bq-dropdown open>
          <bq-button slot="trigger">Open</bq-button>
          <div>Some content in panel</div>
        </bq-dropdown>
      `,
    });
    const dropdownPanel = await page.find('bq-dropdown >>> .bq-dropdown__panel');

    expect(dropdownPanel).toHaveAttribute('open');

    await page.keyboard.press('Escape');
    await page.waitForChanges();

    expect(dropdownPanel).not.toHaveAttribute('open');
  });

  it('should change placement value', async () => {
    const page = await newE2EPage({
      html: `
        <bq-dropdown>
          <bq-button slot="trigger">Open</bq-button>
          <div>Some content in panel</div>
        </bq-dropdown>
      `,
    });
    const dropdown = await page.find('bq-dropdown');
    dropdown.setProperty('placement', 'bottom');

    await page.waitForChanges();

    const dropdownPanel = await page.find('bq-dropdown >>> .bq-dropdown__panel');
    expect(dropdownPanel).toEqualAttribute('placement', 'bottom');
  });
});
