import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils';

const HEADER_TEXT = 'Test text';

describe('bq-accordion', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `<bq-accordion></bq-accordion>`,
    });

    const element = await page.find('bq-accordion');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-accordion></bq-accordion>`,
    });

    const element = await page.find('bq-accordion');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display header text', async () => {
    const page = await newE2EPage({
      html: `<bq-accordion><span slot="header">${HEADER_TEXT}</span></bq-accordion>`,
    });

    const headerText = await page.$eval('bq-accordion >>> slot[name="header"]', (element) => {
      return element.assignedElements({ flatten: true })[0].textContent;
    });

    expect(headerText).toEqualText(HEADER_TEXT);
    expect(headerText).not.toBeNull();
  });

  it('should render prefix', async () => {
    const page = await newE2EPage({
      html: `<bq-accordion><span slot="header">${HEADER_TEXT}</span> <span slot="prefix">Test prefix</span></bq-accordion>`,
    });

    const headerText = await page.$eval('bq-accordion >>> slot[name="prefix"]', (element) => {
      return element.assignedElements({ flatten: true })[0].textContent;
    });

    expect(headerText).toEqualText('Test prefix');
    expect(headerText).not.toBeNull();
  });

  it('should render suffix', async () => {
    const page = await newE2EPage({
      html: `<bq-accordion><span slot="header">${HEADER_TEXT}</span> <span slot="suffix">Test suffix</span></bq-accordion>`,
    });

    const headerText = await page.$eval('bq-accordion >>> slot[name="suffix"]', (element) => {
      return element.assignedElements({ flatten: true })[0].textContent;
    });

    expect(headerText).toEqualText('Test suffix');
    expect(headerText).not.toBeNull();
  });

  it('should be open if expanded prop is provided', async () => {
    const page = await newE2EPage({
      html: `<bq-accordion expanded><span slot="header">${HEADER_TEXT}</span></bq-accordion>`,
    });

    const details = await page.find('bq-accordion >>> [part="base"]');
    expect(details).toHaveAttribute('open');

    const header = await details.find('.bq-accordion__header');
    expect(header).toHaveAttribute('aria-expanded');
    expect(header.getAttribute('aria-expanded')).toEqual('true');
  });

  it('should be collapsed when disabled', async () => {
    const page = await newE2EPage({
      html: `<bq-accordion expanded><span slot="header">${HEADER_TEXT}</span></bq-accordion>`,
    });

    const accordion = await page.find('bq-accordion');
    accordion.setProperty('disabled', true);
    await page.waitForChanges();

    const summary = await page.find('bq-accordion >>> [part="base"] summary');
    expect(summary.getAttribute('aria-disabled')).toEqual('true');
    expect(summary.getAttribute('aria-expanded')).toEqual('false');
  });

  it('should respect design style', async () => {
    const page = await newE2EPage({
      html: `
        <bq-accordion size="small"><span slot="header">${HEADER_TEXT}</span></bq-accordion>
        <bq-accordion size="medium"><span slot="header">${HEADER_TEXT}</span></bq-accordion>
      `,
    });

    const smallHeaderStyle = await computedStyle(page, 'bq-accordion[size="small"] >>> summary', [
      'borderRadius',
      'padding',
    ]);
    const smallPanelStyle = await computedStyle(page, 'bq-accordion[size="small"] >>> .bq-accordion__content', [
      'borderRadius',
      'padding',
    ]);

    const mediumHeaderStyle = await computedStyle(page, 'bq-accordion[size="medium"] >>> summary', [
      'borderRadius',
      'padding',
    ]);
    const mediumPanelStyle = await computedStyle(page, 'bq-accordion[size="medium"] >>> .bq-accordion__content', [
      'borderRadius',
      'padding',
    ]);

    expect(smallHeaderStyle).toEqual({ borderRadius: '4px', padding: '8px 12px' });
    expect(smallPanelStyle).toEqual({ borderRadius: '0px 0px 4px 4px', padding: '12px' });
    expect(mediumHeaderStyle).toEqual({ borderRadius: '12px', padding: '12px 16px' });
    expect(mediumPanelStyle).toEqual({ borderRadius: '0px 0px 12px 12px', padding: '16px' });
  });
});
