import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils';

describe('bq-panel', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-panel></bq-panel>');

    const element = await page.find('bq-panel');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-panel></bq-panel>');

    const element = await page.find('bq-panel');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should be visible on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>

        <div>Some content in panel</div>
      </bq-dropdown>
    `);

    const button = await page.find('bq-button');
    await button.click();

    const dropdown = await page.find('bq-dropdown');
    const panel = dropdown.shadowRoot.querySelector('bq-panel');

    expect(panel).not.toHaveAttribute('aria-hidden');
  });

  it('should show in specified position', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-panel placement="left">Some content</bq-panel>
    `);

    const tooltipStyle = await computedStyle(page, 'bq-panel');
    const sign = tooltipStyle.left.slice(-1);
    expect(sign).not.toEqual('-');
  });

  it('should respect the design', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-panel placement="bottom">Some content in the panel</bq-panel>
    `);

    const styleProps = ['width', 'boxShadow'] as const;
    const panelStyle = await computedStyle(page, 'bq-panel >>> [part="base"]', styleProps);

    expect(panelStyle).toEqual({
      width: '320px',
      boxShadow:
        'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.12) 0px 10px 48px -16px',
    });
  });
});
