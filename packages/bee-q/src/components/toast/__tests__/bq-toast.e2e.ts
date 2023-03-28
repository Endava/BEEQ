import { newE2EPage } from '@stencil/core/testing';

describe('bq-toast', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast></bq-toast>');

    const element = await page.find('bq-toast');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast></bq-toast>');

    const element = await page.find('bq-toast');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should be visible on button click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-button appearance="primary" size="small" target="" type="button" variant="standard">
        Show Toast!
      </bq-button>
      <bq-toast>
        <bq-icon slot="icon" name="info" color="ui--brand" size="24" weight="bold"></bq-icon>
        <span slot="text">This is some toast text message! </span></bq-toast
      >
    `);

    const element = await page.find('bq-toast >>> [part="panel"]');
    expect(element).not.toBeDefined;

    const button = await page.find('bq-button');
    await button.click();
    expect(element).toBeDefined;
  });

  it('should render basic toast', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast>New Toast<span slot="text">This is some toast text message!</span></bq-toast>');

    const text = await page.find('bq-toast >>> slot[name="text"]');

    expect(text).not.toBeNull();
  });

  it('should show toast with icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast type="info" show-icon="true">New Toast Message!</bq-toast>');

    const iconHolder = await page.find('bq-toast >>> [part="icon"]');

    expect(iconHolder).not.toBeNull();
  });
});
