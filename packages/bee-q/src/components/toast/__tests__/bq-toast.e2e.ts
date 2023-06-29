import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

describe('bq-toast', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast></bq-toast>');

    const element = await page.find('bq-toast');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast></bq-toast>');

    const element = await page.find('bq-toast');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast>Text</bq-toast>');

    const element = await page.find('bq-toast');

    expect(element).toEqualText('Text');
  });

  it('should display info icon by default', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast>Text</bq-toast>');

    const iconWrapper = await page.find('bq-toast >>> bq-icon');

    expect(iconWrapper).toEqualAttribute('name', 'info');
  });

  it('should display success icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast type="success">Text</bq-toast>');

    const iconWrapper = await page.find('bq-toast >>> bq-icon');

    expect(iconWrapper).toEqualAttribute('name', 'check-circle');
  });

  it('should display custom icon', async () => {
    const page = await newE2EPage();
    await page.setContent(`
    <bq-toast>
      Text
      <bq-icon slot="icon" size="24" weight="bold" name="star"></bq-icon>
    </bq-toast>
    `);

    const iconWrapperName = await page.$eval('bq-toast', (element) => {
      const slotElement = element.shadowRoot.querySelector<HTMLSlotElement>('slot[name="icon"]');

      const assignedElements = slotElement.assignedElements({ flatten: true })[0];

      return assignedElements.getAttribute('name');
    });

    expect(iconWrapperName).toEqualText('star');
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent(`<bq-toast>Text</bq-toast>`);

    const styleProps = ['padding', 'borderRadius', 'gap'] as const;

    const style = await computedStyle(page, 'bq-toast >>> [part="wrapper"]', styleProps);

    expect(style).toEqual({ padding: '12px 16px', borderRadius: '8px', gap: '8px' });
  });

  it('should call methods', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-toast>Test</bq-toast>');

    const element = await page.find('bq-toast');

    await element.callMethod('show');
    await page.waitForChanges();

    expect(element).toEqualAttribute('aria-hidden', 'false');
    expect(element).toEqualAttribute('hidden', 'false');

    await element.callMethod('hide');
    await page.waitForChanges();

    expect(element).toEqualAttribute('aria-hidden', 'true');
    expect(element).toEqualAttribute('hidden', 'true');
  });
});
