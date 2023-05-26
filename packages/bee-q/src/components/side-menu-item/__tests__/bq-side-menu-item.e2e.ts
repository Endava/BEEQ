import { newE2EPage } from '@stencil/core/testing';

describe('bq-side-menu-item', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu-item></bq-side-menu-item>');

    const element = await page.find('bq-side-menu-item');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu-item></bq-side-menu-item>');

    const element = await page.find('bq-side-menu-item');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu-item> <span>Menu label</span> </bq-side-menu-item>');

    const element = await page.find('bq-side-menu-item > span');

    expect(element).toEqualText('Menu label');
  });

  it('should trigger click', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-side-menu-item>Menu item label</bq-side-menu-item>');

    const bqFocus = await page.spyOnEvent('bqSideMenuItemFocus');
    const bqBlur = await page.spyOnEvent('bqSideMenuItemBlur');
    const bqClick = await page.spyOnEvent('bqSideMenuItemClick');

    const element = await page.find('bq-side-menu-item');

    await element.click();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(1);
  });
});

it('should be keyboard accessible', async () => {
  const page = await newE2EPage();
  await page.setContent(`
      <bq-side-menu-item>
        <bq-icon size="18" name="user" slot="prefix"></bq-icon>
        <span>Verified users</span>
      </bq-side-menu-item>
    `);

  const bqFocus = await page.spyOnEvent('bqSideMenuItemFocus');
  const bqBlur = await page.spyOnEvent('bqSideMenuItemBlur');
  const bqClick = await page.spyOnEvent('bqSideMenuItemClick');

  await page.keyboard.press('Tab');

  expect(bqFocus).toHaveReceivedEventTimes(1);
  expect(bqClick).toHaveReceivedEventTimes(0);
  expect(bqBlur).toHaveReceivedEventTimes(0);
});

it('should handle Enter', async () => {
  const page = await newE2EPage();
  await page.setContent('<bq-side-menu-item><span>Menu item label</span></bq-side-menu-item>');

  const bqFocus = await page.spyOnEvent('bqSideMenuItemFocus');
  const bqBlur = await page.spyOnEvent('bqSideMenuItemBlur');
  const bqClick = await page.spyOnEvent('bqSideMenuItemClick');
  const bqKeyEnter = await page.spyOnEvent('bqSideMenuItemOnEnter');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  expect(bqFocus).toHaveReceivedEventTimes(1);
  expect(bqClick).toHaveReceivedEventTimes(0);
  expect(bqBlur).toHaveReceivedEventTimes(0);
  expect(bqKeyEnter).toHaveReceivedEventTimes(1);
});

it('should handle `disabled` property', async () => {
  const page = await newE2EPage();
  await page.setContent('<bq-side-menu-item disabled="true"><span>Menu item label</span></bq-side-menu-item>');

  const bqFocus = await page.spyOnEvent('bqSideMenuItemFocus');
  const bqBlur = await page.spyOnEvent('bqSideMenuItemBlur');
  const bqClick = await page.spyOnEvent('bqSideMenuItemClick');

  const element = await page.find('bq-side-menu-item');

  element.click();

  await page.waitForChanges();

  expect(bqFocus).toHaveReceivedEventTimes(0);
  expect(bqClick).toHaveReceivedEventTimes(0);
  expect(bqBlur).toHaveReceivedEventTimes(0);
});

it('should render prefix element', async () => {
  const page = await newE2EPage();
  await page.setContent('<bq-side-menu-item><span slot="prefix">Prefix</span></bq-side-menu-item>');

  const prefixText = await page.$eval('bq-side-menu-item', (element) => {
    const slotElement = element.shadowRoot.querySelector('slot[name="prefix"]');
    const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

    return assignedElements.textContent;
  });

  expect(prefixText).toBe('Prefix');
});

it('should render suffix element', async () => {
  const page = await newE2EPage();
  await page.setContent('<bq-side-menu-item><span slot="suffix">Suffix</span></bq-side-menu-item>');

  const suffixText = await page.$eval('bq-side-menu-item', (element) => {
    const slotElement = element.shadowRoot.querySelector('slot[name="suffix"]');
    const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

    return assignedElements.textContent;
  });

  expect(suffixText).toEqualText('Suffix');
});
