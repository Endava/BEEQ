import { newE2EPage } from '@stencil/core/testing';

describe('bq-step-item', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-step-item></bq-step-item>');

    const element = await page.find('bq-step-item');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-step-item></bq-step-item>');

    const element = await page.find('bq-step-item');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-step-item><p>step item 1</p></bq-step-item>');

    // const element = await page.find('bq-step-item >>> p');
    const text = await page.$eval('bq-step-item', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(text).toEqualText('step item 1');
  });

  it('should display icon prefix', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-step-item type="icon"> <bq-icon slot="prefix" name="bell-ringing" size="24" weight="regular"></bq-icon>  <span>step item 1</span><span slot="description">description for step</span></bq-step-item>',
    );

    const prefix = await page.$eval('bq-step-item', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="prefix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.tagName;
    });

    expect(prefix).toMatch(/bq-icon/i);
  });
});
