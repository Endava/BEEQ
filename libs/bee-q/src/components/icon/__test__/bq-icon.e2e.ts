import { newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

describe('bq-icon', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon/>');

    const element = await page.find('bq-icon');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon/>');

    const element = await page.find('bq-icon');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon name="activity"/>');

    const element = await page.find('bq-icon >>> [part="svg"]');

    expect(element.innerHTML).toBeDefined();
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon name="activity"/>');

    const style = await computedStyle(page, 'bq-icon >>> [part="base"]');

    expect(style.height).toBe('24px');
  });

  it('should change size', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon size="30"/>');

    const style = await computedStyle(page, 'bq-icon >>> [part="base"]');

    expect(style.height).toBe('30px');
  });
});
