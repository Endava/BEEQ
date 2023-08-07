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
      </bq-dropdown>`,
    });

    const button = await page.find('bq-button');
    await button.click();

    const dropdown = await page.find('bq-dropdown');
    const panel = dropdown.shadowRoot.querySelector('bq-panel');

    expect(panel).not.toHaveAttribute('aria-hidden');
  });

  it('should open based on `open` prop', async () => {
    const page = await newE2EPage({
      html: `
      <bq-dropdown open="true">
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>`,
    });

    const dropdown = await page.find('bq-dropdown');
    const panel = dropdown.shadowRoot.querySelector('bq-panel');

    expect(panel).not.toHaveAttribute('aria-hidden');
  });

  it('should close on "Escape"', async () => {
    // default value is "bottom-start"
    const page = await newE2EPage({
      html: `
      <bq-dropdown placement="bottom">
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>`,
    });

    await page.keyboard.press('Escape');

    const dropdown = await page.find('bq-dropdown');
    const panel = dropdown.shadowRoot.querySelector('bq-panel');
    expect(panel).not.toHaveAttribute('aria-hidden');
  });

  it('should change placement value', async () => {
    // default value is "bottom-start"
    const page = await newE2EPage({
      html: `
      <bq-dropdown placement="bottom">
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>`,
    });

    const dropdown = await page.find('bq-dropdown');
    expect(dropdown).toEqualAttribute('placement', 'bottom');
  });
});
