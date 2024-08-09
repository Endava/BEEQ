import { newE2EPage } from '@stencil/core/testing';

describe('bq-step-item', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `<bq-step-item></bq-step-item>`,
    });

    const element = await page.find('bq-step-item');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-step-item></bq-step-item>`,
    });

    const element = await page.find('bq-step-item');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text title', async () => {
    const title = 'Title';
    const description = 'Description for step item';

    const page = await newE2EPage({
      html: `
        <bq-step-item type="numeric" status="default">
          <span>${title}</span>
          <span slot="description">${description}</span>
        </bq-step-item>
      `,
    });

    const text = await page.$eval('bq-step-item', (element) => {
      const slotElement = element.shadowRoot!.querySelector('.bq-step-item__content--title')!.querySelector('slot');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });
    expect(text).toEqualText(title);
  });

  it('should display description', async () => {
    const title = 'Title';
    const description = 'Description for step item';

    const page = await newE2EPage({
      html: `
        <bq-step-item type="numeric" status="default">
          <span>${title}</span>
          <span slot="description">${description}</span>
        </bq-step-item>
      `,
    });

    const text = await page.$eval('bq-step-item', (element) => {
      const slotElement = element.shadowRoot!.querySelector('slot[name="description"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });
    expect(text).toEqualText(description);
  });

  it('should display icon prefix', async () => {
    const page = await newE2EPage({
      html: `
        <bq-step-item status="default">
          <bq-icon slot="prefix" name="circle"></bq-icon>
          <span>Title</span>
          <span slot="description">Description</span>
        </bq-step-item>
      `,
    });

    const prefix = await page.$eval('bq-step-item', (element) => {
      const slotElement = element.shadowRoot!.querySelector('slot[name="prefix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.tagName;
    });
    expect(prefix).toMatch(/bq-icon/i);
  });
});
