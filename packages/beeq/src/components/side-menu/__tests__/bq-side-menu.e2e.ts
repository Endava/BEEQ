import { newE2EPage } from '@stencil/core/testing';

describe('bq-side-menu', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-side-menu></bq-side-menu>',
    });

    const sideMenuElem = await page.find('bq-side-menu');

    expect(sideMenuElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-side-menu></bq-side-menu>',
    });

    const sideMenuElem = await page.find('bq-side-menu');

    expect(sideMenuElem.shadowRoot).not.toBeNull();
  });

  it('should render with default values', async () => {
    const page = await newE2EPage({
      html: '<bq-side-menu></bq-side-menu>',
    });

    const sideMenuElem = await page.find('bq-side-menu');
    expect(sideMenuElem).toEqualAttribute('appearance', 'default');
    expect(sideMenuElem).toEqualAttribute('size', 'medium');
  });

  it('should collapse and expand', async () => {
    const sideMenuSelector = 'bq-side-menu';
    const page = await newE2EPage({
      html: '<bq-side-menu></bq-side-menu>',
    });

    const sideMenuElem = await page.find('bq-side-menu');
    await sideMenuElem.callMethod('toggleCollapse');
    await page.waitForChanges();

    expect(await page.find(sideMenuSelector)).toHaveAttribute('collapse');

    await sideMenuElem.callMethod('toggleCollapse');
    await page.waitForChanges();

    expect(await page.find(sideMenuSelector)).not.toHaveAttribute('collapse');
  });

  it('should render navigation menu items', async () => {
    const page = await newE2EPage({
      html: `
        <bq-side-menu>
          <bq-side-menu-item active>
            <bq-icon name="diamonds-four" slot="prefix"></bq-icon>
            Dashboard
          </bq-side-menu-item>
          <bq-side-menu-item>
            <bq-icon name="package" slot="prefix"></bq-icon>
            Products
            <bq-badge slot="suffix"> 5 </bq-badge>
          </bq-side-menu-item>
        </bq-side-menu>
      `,
    });

    const sideMenuElem = await page.find('bq-side-menu');
    const sideMenuItems = await sideMenuElem.findAll('bq-side-menu-item');
    expect(sideMenuItems).toHaveLength(2);
  });

  it('should display a tooltip on the navigation item when collapsed', async () => {
    const page = await newE2EPage({
      html: `
        <bq-side-menu collapse>
          <bq-side-menu-item>
            <bq-icon name="diamonds-four" slot="prefix"></bq-icon>
            Dashboard
          </bq-side-menu-item>
        </bq-side-menu>
      `,
    });

    const sideMenuItemTooltip = await page.find('bq-side-menu-item >>> bq-tooltip');
    expect(sideMenuItemTooltip).not.toBeNull();
    expect(sideMenuItemTooltip).toEqualText('Dashboard');
  });
});
