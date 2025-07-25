import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils';

describe('bq-tooltip', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-tooltip></bq-tooltip>',
    });

    const tooltipElem = await page.find('bq-tooltip');
    expect(tooltipElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-tooltip></bq-tooltip>',
    });

    const tooltipElem = await page.find('bq-tooltip');
    expect(tooltipElem.shadowRoot).not.toBeNull();
  });

  it('should be visible on hover', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tooltip>
          Yuhu! A tooltip!
          <bq-button slot="trigger"> Hover me! </bq-button>
        </bq-tooltip>
      `,
    });

    const tooltipPanelSelector = 'bq-tooltip >>> [part="panel"]';

    const initialPanel = await page.find(tooltipPanelSelector);
    expect(initialPanel).toHaveAttribute('aria-hidden');

    const button = await page.find('bq-button');
    await button.hover();

    const visiblePanel = await page.find(tooltipPanelSelector);
    expect(visiblePanel).not.toHaveAttribute('aria-hidden');
  });

  it('should hide on mouse out', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tooltip visible>
          Yuhu! A tooltip!
          <bq-button slot="trigger"> Hover me! </bq-button>
        </bq-tooltip>
      `,
    });

    const tooltipPanelSelector = 'bq-tooltip >>> [part="panel"]';

    const initialPanel = await page.find(tooltipPanelSelector);
    expect(initialPanel).not.toHaveAttribute('aria-hidden');

    await page.click('body');
    await page.waitForChanges();

    const hiddenPanel = await page.find(tooltipPanelSelector);
    expect(hiddenPanel).toHaveAttribute('aria-hidden');
  });

  it('should be visible only on click if specified', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tooltip display-on="click">
          Yuhu! A tooltip!
          <bq-button slot="trigger"> Hover me! </bq-button>
        </bq-tooltip>
      `,
    });

    const tooltipPanelSelector = 'bq-tooltip >>> [part="panel"]';

    const initialPanel = await page.find(tooltipPanelSelector);
    expect(initialPanel).toHaveAttribute('aria-hidden');

    const button = await page.find('bq-button');
    await button.hover();

    const hoveredPanel = await page.find(tooltipPanelSelector);
    expect(hoveredPanel).toHaveAttribute('aria-hidden');

    await button.click();

    const clickedPanel = await page.find(tooltipPanelSelector);
    expect(clickedPanel).not.toHaveAttribute('aria-hidden');
  });

  it('should show in specified position', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tooltip placement="left">
          Yuhu! A tooltip!
          <bq-button slot="trigger"> Hover me! </bq-button>
        </bq-tooltip>
      `,
    });

    const button = await page.find('bq-button');
    await button.hover();

    const tooltipStyle = await computedStyle(page, 'bq-tooltip >>> [part="panel"]');
    const sign = tooltipStyle.left.slice(-1);
    // left position should be positive if tooltip is placed to the left
    expect(sign).not.toEqual('-');
  });
});
