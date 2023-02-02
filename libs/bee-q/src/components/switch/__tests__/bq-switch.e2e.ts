import { newE2EPage } from '@stencil/core/testing';

describe('bq-switch', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-switch></bq-switch>');

    const element = await page.find('bq-switch');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-switch></bq-switch>');

    const element = await page.find('bq-switch');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should load checked', async () => {
    const page = await newE2EPage();
    await page.setContent(`<bq-switch checked></bq-switch>`);

    const input = await page.find('bq-switch >>> input.bq-switch--input');
    expect(input.getAttribute('aria-checked')).toEqual('true');
  });

  it('should display label text', async () => {
    const label = 'Toogle me!';
    const page = await newE2EPage();
    await page.setContent(`<bq-switch>${label}</bq-switch>`);

    const element = await page.waitForSelector('bq-switch');
    const labelText = await element.evaluate((el) => el.textContent);

    expect(labelText).toEqualText(label);
  });

  it('should toggle on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`<bq-switch></bq-switch>`);

    const bqChange = await page.spyOnEvent('bqChange');

    const element = await page.find('bq-switch');
    expect(element).not.toHaveAttribute('checked');

    await element.click();
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(element).toHaveAttribute('checked');
  });

  it('should do nothing if disabled', async () => {
    const page = await newE2EPage();
    await page.setContent(`<bq-switch disabled></bq-switch>`);

    const bqChange = await page.spyOnEvent('bqChange');

    const element = await page.find('bq-switch');
    await element.click();

    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(element).not.toHaveAttribute('checked');
  });

  it('should render inner icon labels', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-switch inner-label="icon">Toggle me!</bq-switch>
    `);
    // await page.waitForChanges();

    const switchControl = await page.find('bq-switch >>> .bq-switch--control');
    expect(switchControl).not.toBe(undefined);

    const pkIcons = await switchControl.findAll('bq-icon.bq-switch--control__icon');
    expect(pkIcons).toHaveLength(2);
  });

  it('should change the content order', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-switch reverse-order>Toggle me!</bq-switch>
    `);

    const elementBase = await page.find('bq-switch >>> label.bq-switch');
    expect(elementBase).toHaveClass('flex-row-reverse');
  });
});
