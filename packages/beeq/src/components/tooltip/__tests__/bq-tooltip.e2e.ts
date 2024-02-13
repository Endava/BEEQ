import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils';

describe('bq-tooltip', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tooltip></bq-tooltip>');

    const tooltipElem = await page.find('bq-tooltip');
    expect(tooltipElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tooltip></bq-tooltip>');

    const tooltipElem = await page.find('bq-tooltip');
    expect(tooltipElem.shadowRoot).not.toBeNull();
  });

  it('should be visible on hover', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-tooltip>
        Yuhu! A tooltip!
        <bq-button slot="trigger"> Hover me! </bq-button>
      </bq-tooltip>
    `);

    const tooltipPanelSelector = 'bq-tooltip >>> [part="panel"]';
    expect(await page.find(tooltipPanelSelector)).toHaveAttribute('aria-hidden');

    const button = await page.find('bq-button');
    await button.hover();

    expect(await page.find(tooltipPanelSelector)).not.toHaveAttribute('aria-hidden');
  });

  it('should hide on mouse out', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-tooltip visible>
        Yuhu! A tooltip!
        <bq-button bq-button slot="trigger"> Hover me! </bq-button>
      </bq-tooltip>
    `);

    const tooltipPanelSelector = 'bq-tooltip >>> [part="panel"]';
    expect(await page.find(tooltipPanelSelector)).not.toHaveAttribute('aria-hidden');

    await page.click('body');
    await page.waitForChanges();

    expect(await page.find(tooltipPanelSelector)).toHaveAttribute('aria-hidden');
  });

  it('should be visible only on click if specified', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-tooltip display-on="click">
        Yuhu! A tooltip!
        <bq-button slot="trigger"> Hover me! </bq-button>
      </bq-tooltip>
    `);

    const tooltipPanelSelector = 'bq-tooltip >>> [part="panel"]';
    expect(await page.find(tooltipPanelSelector)).toHaveAttribute('aria-hidden');

    const button = await page.find('bq-button');
    await button.hover();
    expect(await page.find(tooltipPanelSelector)).toHaveAttribute('aria-hidden');

    await button.click();
    expect(await page.find(tooltipPanelSelector)).not.toHaveAttribute('aria-hidden');
  });

  it('should show in specified position', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-tooltip placement="left">
        Yuhu! A tooltip!
        <bq-button slot="trigger"> Hover me! </bq-button>
      </bq-tooltip>
    `);

    const button = await page.find('bq-button');
    await button.hover();
    const tooltipStyle = await computedStyle(page, 'bq-tooltip >>> [part="panel"]');
    const sign = tooltipStyle.left.slice(-1);
    // left position should be positive if tooltip is placed to the left
    expect(sign).not.toEqual('-');
  });
});
