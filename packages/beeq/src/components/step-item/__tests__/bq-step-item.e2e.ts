import { newE2EPage } from '@stencil/core/testing';

describe('bq-step-item', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `<bq-steps>
      <bq-step-item></bq-step-item>
      </bq-steps>`,
    });

    const element = await page.find('bq-step-item');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-steps>
      <bq-step-item></bq-step-item>
      </bq-steps>`,
    });

    const element = await page.find('bq-step-item');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage({
      html: ` <bq-steps type="numeric" size="medium">
      <bq-step-item status="default" value="x">
        <span>step item 1</span>
        <span slot="description">Description for step 1</span>
      </bq-step-item>
    </bq-steps>`,
    });

    const text = await page.$eval('bq-step-item', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(text).toEqualText('step item 1');
  });

  it('should display description', async () => {
    const page = await newE2EPage({
      html: `
      <bq-steps>
        <bq-step-item>
          <span>step item</span>
          <span slot="description">Description for step item</span>
        </bq-step-item>
      </bq-steps>`,
    });

    const description = await page.find('bq-step-item >>> slot[name="description"]');
    expect(description).not.toBeNull();
  });

  it('should display icon prefix', async () => {
    const page = await newE2EPage({
      html: `<bq-steps type="icon" size="medium">
      <bq-step-item status="default" value="x">
        <bq-icon slot="prefix" name="bell-ringing" size="24" weight="regular"></bq-icon>
        <span>step item 1</span>
        <span slot="description">Description for step 1</span>
      </bq-step-item>
      </bq-steps>`,
    });

    const prefix = await page.$eval('bq-step-item', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="prefix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.tagName;
    });

    expect(prefix).toMatch(/bq-icon/i);
  });
});
