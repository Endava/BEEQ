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
});
