import { newE2EPage } from '@stencil/core/testing';
// import { computedStyle } from '../../../shared/test-utils';

describe('bq-progress', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-progress></bq-progress>',
    });
    const element = await page.find('bq-progress');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-progress></bq-progress>',
    });
    const element = await page.find('bq-progress');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render the progress bar with label', async () => {
    const page = await newE2EPage({
      html: '<bq-progress label></progress>',
    });

    const element = await page.find('bq-progress >>> span');
    expect(element).not.toBeNull();
  });

  it('should render the progress bar without label', async () => {
    const page = await newE2EPage({
      html: '<bq-progress label="false"></progress>',
    });

    const element = await page.find('bq-progress >>> span');
    expect(element).toBeNull();
  });

  it('should render the progress bar with tooltip', async () => {
    const page = await newE2EPage({
      html: '<bq-progress enable-tooltip></progress>',
    });

    const element = await page.find('bq-progress >>> bq-tooltip');
    expect(element).not.toBeNull();
  });

  it('should render the progress bar without tooltip', async () => {
    const page = await newE2EPage({
      html: '<bq-progress enable-tooltip="false"></progress>',
    });

    const element = await page.find('bq-progress >>> bq-tooltip');
    expect(element).toBeNull();
  });
});
