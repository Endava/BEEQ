import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils';

const tooltipPanelSelector = 'bq-tooltip >>> [part="panel"]';
const buttonSelector = 'bq-button >>> button';
const html = `
  <bq-tooltip>
    Yuhu! A tooltip!
    <bq-button slot="trigger"> Hover me! </bq-button>
  </bq-tooltip>
`;

describe('bq-tooltip', () => {
  it('should render', async () => {
    const page = await newE2EPage({ html });

    const tooltipElem = await page.find('bq-tooltip');
    expect(tooltipElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({ html });

    const tooltipElem = await page.find('bq-tooltip');
    expect(tooltipElem.shadowRoot).not.toBeNull();
  });

  it('should be visible on hover', async () => {
    const page = await newE2EPage({ html });

    await page.waitForChanges();

    // Ensure no element is initially focused (headless Linux can auto-focus the first tabbable element)
    await page.click('body');
    await page.waitForChanges();

    const initialPanel = await page.find(tooltipPanelSelector);
    expect(initialPanel).toHaveAttribute('hidden');

    const button = await page.find(buttonSelector);
    await button.hover();

    await page.waitForChanges();

    const visiblePanel = await page.find(tooltipPanelSelector);
    expect(visiblePanel).not.toHaveAttribute('hidden');
  });

  it('should not be visible on hover if defaultPrevented', async () => {
    const page = await newE2EPage({ html });
    const bqTooltipPanel = await page.find(tooltipPanelSelector);
    const bqHoverInSpy = await page.spyOnEvent('bqHoverIn');

    await page.waitForChanges();

    // Ensure no element is initially focused (headless Linux can auto-focus the first tabbable element)
    await page.click('body');
    await page.waitForChanges();

    await page.$eval('bq-tooltip', (el: HTMLElement) => {
      el.addEventListener('bqHoverIn', (e: Event) => e.preventDefault(), { once: true });
    });

    const button = await page.find(buttonSelector);
    await button.hover();

    await page.waitForChanges();

    expect(bqTooltipPanel).toHaveAttribute('hidden');
    expect(bqHoverInSpy).toHaveReceivedEventTimes(1);
  });

  it('should hide on mouse out', async () => {
    const page = await newE2EPage({ html });

    (await page.find('bq-tooltip')).setProperty('visible', 'true');
    await page.waitForChanges();

    const initialPanel = await page.find(tooltipPanelSelector);
    expect(initialPanel).not.toHaveAttribute('hidden');

    await page.click('body');
    await page.waitForChanges();

    const hiddenPanel = await page.find(tooltipPanelSelector);
    expect(hiddenPanel).toHaveAttribute('hidden');
  });

  it('should be visible only on click if specified', async () => {
    const page = await newE2EPage({ html });

    (await page.find('bq-tooltip')).setProperty('displayOn', 'click');
    await page.waitForChanges();

    // Ensure no element is initially focused (headless Linux can auto-focus the first tabbable element)
    await page.click('body');
    await page.waitForChanges();

    const initialPanel = await page.find(tooltipPanelSelector);
    expect(initialPanel).toHaveAttribute('hidden');

    const button = await page.find(buttonSelector);
    await button.hover();

    const hoveredPanel = await page.find(tooltipPanelSelector);
    expect(hoveredPanel).toHaveAttribute('hidden');

    await button.click();

    const clickedPanel = await page.find(tooltipPanelSelector);
    expect(clickedPanel).not.toHaveAttribute('hidden');
  });

  it('should not be visible on click if defaultPrevented', async () => {
    const page = await newE2EPage({ html });

    (await page.find('bq-tooltip')).setProperty('displayOn', 'click');
    await page.waitForChanges();

    // Ensure no element is initially focused (headless Linux can auto-focus the first tabbable element)
    await page.click('body');
    await page.waitForChanges();

    const initialPanel = await page.find(tooltipPanelSelector);
    expect(initialPanel).toHaveAttribute('hidden');

    await page.$eval('bq-tooltip', (el: HTMLElement) => {
      el.addEventListener('bqClick', (e: Event) => e.preventDefault(), { once: true });
    });

    const button = await page.find(buttonSelector);
    await button.click();

    const clickedPanel = await page.find(tooltipPanelSelector);
    expect(clickedPanel).toHaveAttribute('hidden');
  });

  it('should show in specified position', async () => {
    const page = await newE2EPage({ html });

    await page.waitForChanges();

    const button = await page.find(buttonSelector);
    await button.hover();

    const tooltipStyle = await computedStyle(page, tooltipPanelSelector);
    const sign = tooltipStyle.left.slice(-1);
    // left position should be positive if tooltip is placed to the left
    expect(sign).not.toEqual('-');
  });
});
