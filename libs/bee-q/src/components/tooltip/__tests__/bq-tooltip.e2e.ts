import { newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

describe('bq-tooltip', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tooltip></bq-tooltip>');

    const element = await page.find('bq-tooltip');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tooltip></bq-tooltip>');

    const element = await page.find('bq-tooltip');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should be visible on hover', async () => {
    const page = await newE2EPage();

    await page.setContent(`<bq-tooltip>
        Yuhu! A tooltip!
        <bq-button slot="trigger">
            Hover me!
        </bq-button>
    </bq-tooltip>`);

    const element = await page.find('bq-tooltip >>> [part="panel"]');

    expect(element).toHaveAttribute('aria-hidden');

    const button = await page.find('bq-button');
    await button.hover();

    expect(element).not.toHaveAttribute('aria-hidden');
  });

  it('should be visible only on click if specified', async () => {
    const page = await newE2EPage();

    await page.setContent(`<bq-tooltip display-on="click">
        Yuhu! A tooltip!
        <bq-button slot="trigger">
            Hover me!
        </bq-button>
    </bq-tooltip>`);

    const element = await page.find('bq-tooltip >>> [part="panel"]');

    expect(element).toHaveAttribute('aria-hidden');

    const button = await page.find('bq-button');

    await button.hover();
    expect(element).toHaveAttribute('aria-hidden');

    await button.click();
    expect(element).not.toHaveAttribute('aria-hidden');
  });

  it('should show in specified position', async () => {
    const page = await newE2EPage();

    await page.setContent(`<bq-tooltip placement="left">
        Yuhu! A tooltip!
        <bq-button slot="trigger">
            Hover me!
        </bq-button>
    </bq-tooltip>`);

    const button = await page.find('bq-button');
    await button.hover();

    const tooltipStyle = await computedStyle(page, 'bq-tooltip >>> [part="panel"]');
    const sign = tooltipStyle.left.slice(-1);

    // left position should be positive if tooltip is placed to the left
    expect(sign).not.toEqual('-');
  });
});
