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

  it('should render title + back icon', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title showBackIcon="true">Title</bq-page-title>',
    });
    const backIcon = await page.find('bq-page-title >>> slot[name="back"]');
    expect(backIcon).not.toBeNull();
  });

  it('should render title + action icons', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title showActionIcons="true">Title</bq-page-title>',
    });
    const actionIcons = await page.find('bq-page-title >>> slot[name="actions"]');
    expect(actionIcons).not.toBeNull();
  });

  it('should render title + sub-title', async () => {
    const page = await newE2EPage({
      html: '<bq-page-title showSubTitle="true">Title</bq-page-title>',
    });
    const actionIcons = await page.find('bq-page-title >>> slot[name="sub-title"]');
    expect(actionIcons).not.toBeNull();
  });
});
