import { newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

const waitForSvgLoad = async (
  elem: HTMLBqIconElement,
  props?: Partial<Record<keyof HTMLBqIconElement, HTMLBqIconElement[keyof HTMLBqIconElement]>>,
) => {
  if (props) {
    Object.keys(props).forEach((attr) => (elem[attr] = props[attr]));
  }
  const partSVG = elem.shadowRoot.querySelector('[part="svg"]');
  if (!partSVG) {
    return new Promise((resolve) => elem.addEventListener('svgLoaded', resolve));
  }
  return Promise.resolve();
};

describe('bq-icon', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon></bq-icon>');

    const element = await page.find('bq-icon');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon></bq-icon>');

    const element = await page.find('bq-icon');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon name="activity"></bq-icon>');

    await page.$eval('bq-icon', waitForSvgLoad);

    const element = await page.find('bq-icon >>> [part="svg"]');
    expect(element.innerHTML).toBeDefined();
    expect(element.innerHTML).toEqualHtml(`
      <path d="M160,216h-.4a8.1,8.1,0,0,1-7.1-5.2L95.3,60.8l-32,70.5A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.8L88.7,36.7A8.2,8.2,0,0,1,96.3,32a8,8,0,0,1,7.2,5.2L161,188.1l31.8-63.7A8.2,8.2,0,0,1,200,120h32a8,8,0,0,1,0,16H204.9l-37.7,75.6A8.2,8.2,0,0,1,160,216Z"></path>
    `);
  });

  it('should handle `name` property change', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon name="activity"></bq-icon>');

    await page.$eval('bq-icon', waitForSvgLoad, { name: 'check' });
    await page.waitForChanges();

    const element = await page.find('bq-icon >>> [part="svg"]');
    expect(element.innerHTML).toBeDefined();
    expect(element.innerHTML).toEqualHtml(`
      <path d="M104,192a8.5,8.5,0,0,1-5.7-2.3l-56-56a8.1,8.1,0,0,1,11.4-11.4L104,172.7,210.3,66.3a8.1,8.1,0,0,1,11.4,11.4l-112,112A8.5,8.5,0,0,1,104,192Z"></path>
    `);
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon name="activity"></bq-icon>');

    const style = await computedStyle(page, 'bq-icon >>> [part="base"]');

    expect(style.height).toBe('24px');
  });

  it('should change size', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-icon size="30"></bq-icon>');

    const style = await computedStyle(page, 'bq-icon >>> [part="base"]');

    expect(style.height).toBe('30px');
  });
});
