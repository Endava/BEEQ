import { newE2EPage } from '@stencil/core/testing';

describe('bq-side-menu-item', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-side-menu-item></bq-side-menu-item>',
    });

    const menuItemElem = await page.find('bq-side-menu-item');
    expect(menuItemElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-side-menu-item></bq-side-menu-item>',
    });

    const menuItemElem = await page.find('bq-side-menu-item');
    expect(menuItemElem.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage({
      html: `
        <bq-side-menu-item disabled="true">
          Menu item label
        </bq-side-menu-item>
      `,
    });

    const menuItemElem = await page.find('bq-side-menu-item');
    expect(menuItemElem).toEqualText('Menu item label');
  });

  it('should trigger click', async () => {
    const page = await newE2EPage({
      html: `
        <bq-side-menu-item>
          Menu item label
        </bq-side-menu-item>
      `,
    });
    const bqClick = await page.spyOnEvent('bqClick');

    const menuItemElem = await page.find('bq-side-menu-item');
    await menuItemElem.click();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });
});

it('should be keyboard accessible', async () => {
  const page = await newE2EPage({
    html: `
      <bq-side-menu-item>
        <bq-icon size="18" name="user" slot="prefix"></bq-icon>
        <span>Verified users</span>
      </bq-side-menu-item>
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

it('should handle `active` property', async () => {
  const page = await newE2EPage({
    html: `
      <bq-side-menu-item active="true">
        Menu item label
      </bq-side-menu-item>
    `,
  });

  const menuItemElem = await page.find('bq-side-menu-item >>> .bq-side-menu__item');

  expect(menuItemElem).toHaveClass('active');
});

it('should handle `active` state on Enter key press', async () => {
  const page = await newE2EPage({
    html: `
      <bq-side-menu>
        <bq-side-menu-item>
          Menu item label
        </bq-side-menu-item>
      </bq-side-menu>
    `,
  });

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForChanges();

  const menuItemElem = await page.find('bq-side-menu-item >>> .bq-side-menu__item');
  expect(menuItemElem).toHaveClass('active');
});

it('should handle `active` state on Space key press', async () => {
  const page = await newE2EPage({
    html: `
      <bq-side-menu>
        <bq-side-menu-item>
          Menu item label
        </bq-side-menu-item>
      </bq-side-menu>
    `,
  });

  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await page.waitForChanges();

  const menuItemElem = await page.find('bq-side-menu-item >>> .bq-side-menu__item');
  expect(menuItemElem).toHaveClass('active');
});

it('should handle `disabled` property', async () => {
  const page = await newE2EPage({
    html: `
      <bq-side-menu-item disabled="true">
        Menu item label
      </bq-side-menu-item>
    `,
  });
  const bqFocus = await page.spyOnEvent('bqSideMenuItemFocus');
  const bqBlur = await page.spyOnEvent('bqSideMenuItemBlur');
  const bqClick = await page.spyOnEvent('bqSideMenuItemClick');

  await page.$eval('bq-side-menu-item', async (elem: HTMLBqSideMenuItemElement) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error: Property 'click' does not exist on type 'Element'.
    elem.shadowRoot.querySelector('button[part="base"]').click();
  });
  await page.waitForChanges();

  expect(bqFocus).toHaveReceivedEventTimes(0);
  expect(bqClick).toHaveReceivedEventTimes(0);
  expect(bqBlur).toHaveReceivedEventTimes(0);
});

it('should render prefix element', async () => {
  const page = await newE2EPage({
    html: `
      <bq-side-menu-item>
        <span slot="prefix">Prefix</span>
        Dashboard
      </bq-side-menu-item>
    `,
  });

  const prefixText = await page.$eval('bq-side-menu-item', (element) => {
    const slotElement = element.shadowRoot.querySelector('slot[name="prefix"]');
    const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

    return assignedElements.textContent;
  });

  expect(prefixText).toBe('Prefix');
});

it('should render suffix element', async () => {
  const page = await newE2EPage({
    html: `
      <bq-side-menu-item>
        <span slot="suffix">Suffix</span>
        Dashboard
      </bq-side-menu-item>
    `,
  });

  const suffixText = await page.$eval('bq-side-menu-item', (element) => {
    const slotElement = element.shadowRoot.querySelector('slot[name="suffix"]');
    const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

    return assignedElements.textContent;
  });

  expect(suffixText).toEqualText('Suffix');
});
