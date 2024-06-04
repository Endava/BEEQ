import { newE2EPage } from '@stencil/core/testing';

describe('bq-page-title', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title>Title</bq-page-title>',
    });
    const element = await page.find('bq-page-title');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title>Title</bq-page-title>',
    });
    const element = await page.find('bq-page-title');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render title + back navigation button', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title haveBackNavigation="true">Title</bq-page-title>',
    });
    const backIcon = await page.find('bq-page-title >>> slot[name="back"]');
    expect(backIcon).not.toBeNull();
  });

  it('should render prefix', async () => {
    const page = await newE2EPage({
      html: `
        <bq-page-title>
          <div slot="prefix">
            <bq-icon name="start"></bq-icon>
          </div>
          Title
        </bq-page-title>`,
    });
    const prefixSlot = await page.find('bq-page-title >>> slot[name="prefix"]');
    expect(prefixSlot).not.toBeNull();
  });

  it('should render title + action icons - suffix', async () => {
    const page = await newE2EPage({
      html: `
        <bq-page-title>
          Title
          <div slot="suffix">
            <bq-icon name="start"></bq-icon>
          </div>
        </bq-page-title>`,
    });
    const suffixSlot = await page.find('bq-page-title >>> slot[name="suffix"]');
    expect(suffixSlot).not.toBeNull();
  });

  it('should render title + sub-title', async () => {
    const page = await newE2EPage({
      html: `
        <bq-page-title>
          Title
          <div slot="sub-title">
            Sub-title
          </div>
        </bq-page-title>`,
    });
    const subTitleSlot = await page.find('bq-page-title >>> slot[name="sub-title"]');
    expect(subTitleSlot).not.toBeNull();
  });
});
