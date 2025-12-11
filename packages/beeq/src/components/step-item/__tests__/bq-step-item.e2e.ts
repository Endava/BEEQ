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
      const slotElement = element.shadowRoot.querySelector('.bq-step-item__content--title').querySelector('slot');
      const assignedElements = slotElement.assignedElements({ flatten: true })[0];

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
      const slotElement = element.shadowRoot.querySelector('slot[name="description"]');
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
      const slotElement = element.shadowRoot.querySelector('slot[name="prefix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.tagName;
    });
    expect(prefix).toMatch(/bq-icon/i);
  });

  it('should emit bqFocus and bqBlur events when focused and blurred', async () => {
    const page = await newE2EPage({
      html: `
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      `,
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should emit bqClick event when clicked', async () => {
    const page = await newE2EPage({
      html: `
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      `,
    });

    const bqClick = await page.spyOnEvent('bqClick');

    const element = await page.find('bq-step-item >>> [part="base"]');
    await element.click();
    await page.waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should emit bqClick event on Space key press', async () => {
    const page = await newE2EPage({
      html: `
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      `,
    });

    const event = await page.spyOnEvent('bqClick');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();

    expect(event).toHaveReceivedEventTimes(1);
  });

  it('should emit bqClick event on Enter key press', async () => {
    const page = await newE2EPage({
      html: `
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      `,
    });

    const event = await page.spyOnEvent('bqClick');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(event).toHaveReceivedEventTimes(1);
  });

  it('should not emit bqClick event when disabled', async () => {
    const page = await newE2EPage({
      html: `
        <bq-step-item status="disabled">
          <span>Title</span>
        </bq-step-item>
      `,
    });

    const element = await page.find('bq-step-item >>> [part="base"]');
    const event = await page.spyOnEvent('bqClick');

    await element.click();
    await page.waitForChanges();

    expect(event).not.toHaveReceivedEvent();
  });
});
