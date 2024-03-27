import { newE2EPage } from '@stencil/core/testing';

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
    const value = 60;
    const page = await newE2EPage({
      html: `<bq-progress value="${value}" label></progress>`,
    });

    const element = await page.find('bq-progress >>> [part="label"] span');
    expect(element).not.toBeNull();
    expect(element.textContent).toEqual(`${value}%`);
  });

  it('should render the progress bar without label', async () => {
    const page = await newE2EPage({
      html: '<bq-progress label="false"></progress>',
    });

    const element = await page.find('bq-progress >>> [part="label"]');
    expect(element).toHaveClass('hidden');
  });

  it('should render the progress bar with tooltip', async () => {
    const value = 60;
    const page = await newE2EPage({
      html: `<bq-progress value="${value}" enable-tooltip></progress>`,
    });

    const element = await page.find('bq-progress >>> bq-tooltip');
    expect(element).not.toBeNull();
    expect(element.innerText).toEqual(`${value}`);
  });

  it('should render the progress bar without tooltip', async () => {
    const page = await newE2EPage({
      html: '<bq-progress enable-tooltip="false"></progress>',
    });

    const element = await page.find('bq-progress >>> bq-tooltip');
    expect(element).toBeNull();
  });

  it('should render the progress bar with error type', async () => {
    const page = await newE2EPage({
      html: '<bq-progress value="60" type="error"></progress>',
    });

    const progressElem = await page.find('bq-progress >>> [part="progress"]');
    expect(progressElem).toHaveClass('progress-bar__error');

    const uiErrorColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bq-ui--danger'),
    );
    const indicatorColor = await page.$eval('bq-progress', (elm: any) =>
      getComputedStyle(elm.shadowRoot.querySelector('[part="progress"]')).getPropertyValue(
        '--bq-progress-bar--indicatorColor',
      ),
    );
    expect(indicatorColor).toEqual(uiErrorColor);
  });
});
