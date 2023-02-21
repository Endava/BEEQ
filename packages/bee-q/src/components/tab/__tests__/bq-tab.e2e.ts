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

describe('bq-tab', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tab id="1"><p>Tab text</p></bq-tab>');

    const element = await page.find('bq-tab');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tab id="1"><p>Tab text</p></bq-tab>');

    const element = await page.find('bq-tab');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tab id="1"><p>Tab text</p></bq-tab>');

    const slotText = await page.$eval('bq-tab', (element) => {
      const slotElement = element.shadowRoot.querySelector('[part="text"] > slot');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(slotText).toBe('Tab text');
  });

  it('should display icon', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tab id="1"><bq-icon name="check" slot="icon"></bq-icon><p>Tab text</p></bq-tab>');

    await page.$eval('bq-icon', waitForSvgLoad);

    const slotText = await page.$eval('bq-tab', (element) => {
      const slotElement = element.shadowRoot.querySelector('[part="icon"] > slot');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true })[0];

      const svg = assignedElements.shadowRoot.querySelector('svg');

      return svg.innerHTML;
    });

    expect(slotText).toBe(
      '<path d="M104,192a8.5,8.5,0,0,1-5.7-2.3l-56-56a8.1,8.1,0,0,1,11.4-11.4L104,172.7,210.3,66.3a8.1,8.1,0,0,1,11.4,11.4l-112,112A8.5,8.5,0,0,1,104,192Z"></path>',
    );
  });

  it('should be keyboard accessible', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-tab id="1"><p>Tab text</p></bq-tab>
      <bq-tab id="2"><p>Tab text</p></bq-tab>
    `);

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedTagName = await page.evaluate(() => document.activeElement.tagName.toLocaleLowerCase());

    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(focusedTagName).toEqual('bq-tab');
  });

  it('should handle `disabled` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-tab id="1" disabled><p>Tab text</p></bq-tab>');

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqClick = await page.spyOnEvent('bqClick');
    const bqBlur = await page.spyOnEvent('bqBlur');

    const element = await page.find('bq-tab >>> [part="base"]');

    element.click();

    await page.waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-tab id="1" size="small"><p>Tab text</p></bq-tab>
      <bq-tab id="2" size="medium"><p>Tab text</p></bq-tab>
      <bq-tab id="3" size="large"><p>Tab text</p></bq-tab>
    `);

    const smallStyle = await computedStyle(page, 'bq-tab[size="small"] >>> [part="base"]', ['padding']);
    const mediumStyle = await computedStyle(page, 'bq-tab[size="medium"] >>> [part="base"]', ['padding']);
    const largeStyle = await computedStyle(page, 'bq-tab[size="large"] >>> [part="base"]', ['padding']);

    expect(smallStyle).toEqual({ padding: '4px 16px' });
    expect(mediumStyle).toEqual({ padding: '8px 20px' });
    expect(largeStyle).toEqual({ padding: '12px 24px' });
  });
});
