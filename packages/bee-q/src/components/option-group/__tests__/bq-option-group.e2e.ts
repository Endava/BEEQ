import { newE2EPage } from '@stencil/core/testing';

describe('bq-option-group', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option-group></bq-option-group>');

    const element = await page.find('bq-option-group');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-option-group></bq-option-group>');

    const element = await page.find('bq-option-group');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render prefix element', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-option-group>
        <span slot="header-prefix">Prefix text</span>
        <span slot="header-label">Food</span>
        <bq-option value="pizza">
          <bq-icon name="pizza" size="16" slot="prefix"></bq-icon>
          <span>Pizza</span>
        </bq-option>
      </bq-option-group>
    `);

    const prefixText = await page.$eval('bq-option-group', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="header-prefix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(prefixText).toBe('Prefix text');
  });

  it('should render suffix element', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-option-group>
        <span slot="header-label">Food</span>
        <span slot="header-suffix">Suffix text</span>
        <bq-option value="pizza">
          <bq-icon name="pizza" size="16" slot="prefix"></bq-icon>
          <span>Pizza</span>
        </bq-option>
      </bq-option-group>
    `);

    const suffixText = await page.$eval('bq-option-group', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="header-suffix"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(suffixText).toEqualText('Suffix text');
  });

  it('should render label text', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-option-group>
      <bq-icon name="fork-knife" size="16" slot="header-prefix"></bq-icon>
      <span slot="header-label">Food</span>
        <bq-option value="pizza">
          <bq-icon name="pizza" size="16" slot="prefix"></bq-icon>
          <span>Pizza</span>
        </bq-option>
      </bq-option-group>
    `);

    const suffixText = await page.$eval('bq-option-group', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="header-label"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(suffixText).toEqualText('Food');
  });
});
