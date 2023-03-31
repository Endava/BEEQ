import { newE2EPage } from '@stencil/core/testing';

describe('bq-dialog', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-dialog></bq-dialog>');

    const element = await page.find('bq-dialog');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-dialog></bq-dialog>');

    const element = await page.find('bq-dialog');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display title', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-dialog><h3 slot="title">Dialog Title</h3></bq-dialog>');

    const element = await page.find('bq-dialog');

    expect(element).toEqualText('Dialog Title');
  });

  it('should display content', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-dialog><p slot="content">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p></bq-dialog>',
    );

    const element = await page.find('bq-dialog');

    expect(element).toEqualText('Lorem Ipsum is simply dummy text of the printing and typesetting industry.');
  });

  // it('closes dialog when clicking on the close button', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent('<bq-dialog></bq-dialog>');

  //   const dialogClosedEvent = await page.spyOnEvent('bqClick');

  //   const element = await page.find('bq-dialog >>> [part="button-close"]');

  //   await element.click();

  //   expect(dialogClosedEvent).toHaveReceivedEventTimes(1);
  // });

  // it('should render footer with at least one button', async () => {
  //   const page = await newE2EPage();
  //   await page.setContent(`
  //   <bq-dialog><footer slot="buttons">
  //       <bq-button appearance="primary" size="small" type="button" variant="ghost" class="hydrated">
  //         Primary button
  //       </bq-button>
  //       <bq-button appearance="primary" size="small" type="button" variant="standard"> Primary button </bq-button>
  //     </footer>
  //   </bq-dialog>
  // `);

  //   const element = await page.find('bq-dialog');

  //   expect(element).toContain('bq-button');
  // });
});
