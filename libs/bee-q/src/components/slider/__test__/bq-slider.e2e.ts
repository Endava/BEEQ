import { newE2EPage } from '@stencil/core/testing';
import { computedStyle, sleep } from '../../../shared/test-utils';

describe('bq-slider', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider></bq-slider>');

    const element = await page.find('bq-slider');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider></bq-slider>');

    const element = await page.find('bq-slider');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should handle `disabled` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider type="range" disabled></bq-slider>');

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqChange = await page.spyOnEvent('bqChange');

    const element = await page.find('bq-slider');
    const inputs = await page.findAll('bq-slider >>> .bq-slider__input');

    for (const input of inputs) {
      input.focus();
      await page.waitForChanges();

      element.focus();
      await page.waitForChanges();
    }

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqChange).toHaveReceivedEventTimes(0);
  });

  it('should handle `value-indicator` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider type="range" value="[30, 70]"></bq-slider>');

    await page.$eval('bq-slider', (elem: HTMLBqSliderElement) => {
      elem.valueIndicator = true;
    });
    await page.waitForChanges();

    const leftLabel = await page.find('bq-slider >>> span.bq-slider__label.mr-4');
    const rightLabel = await page.find('bq-slider >>> span.bq-slider__label.ml-4');

    expect(leftLabel).not.toHaveClass('is-hidden');
    expect(rightLabel).not.toHaveClass('is-hidden');
  });

  it('should handle `gap` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider type="range" min="0" max="100" value="[50, 55]" gap="10"></bq-slider>');

    const minRangeInput = await page.find('bq-slider >>> .bq-slider__input[aria-label="Min Range"]');
    const maxRangeInput = await page.find('bq-slider >>> .bq-slider__input[aria-label="Max Range"]');

    const difference = Math.abs(
      parseInt(maxRangeInput.getAttribute('value')) - parseInt(minRangeInput.getAttribute('value')),
    );

    expect(difference).toEqual(10);
  });

  it('should handle `type` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider type="single"></bq-slider>');

    const getInputsLength = (element) => {
      const inputs = element.shadowRoot.querySelectorAll('.bq-slider__input');
      return inputs.length;
    };
    const element = await page.find('bq-slider');

    expect(getInputsLength(element)).toBe(1);

    element.setAttribute('type', 'range');
    await page.waitForChanges();

    expect(getInputsLength(element)).toBe(2);
  });

  it('should handle `value` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider type="single"></bq-slider>');

    const element = await page.find('bq-slider');
    let propValue = await element.getProperty('value');

    expect(typeof propValue).toBe('number');
    expect(propValue).toBe(0);

    element.setAttribute('type', 'range');
    await page.waitForChanges();

    propValue = await element.getProperty('value');

    expect(Array.isArray(propValue)).toBe(true);
    expect(propValue).toHaveLength(2);
  });

  it('should trigger bqChange', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider min="0" max="100" value="30"></bq-slider>');

    const bqChange = await page.spyOnEvent('bqChange');
    const element = await page.find('bq-slider');
    const elementValue = element.getAttribute('value');

    element.setAttribute('value', (elementValue + 1).toString());

    await page.waitForChanges();

    expect(bqChange).not.toHaveReceivedEventTimes(0);
  });

  it('should trigger bqChange with `debounce-time`', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider min="0" max="100" value="30" debounce-time="250"></bq-slider>');

    const bqChange = await page.spyOnEvent('bqChange');
    const element = await page.find('bq-slider');
    const elementValue = element.getAttribute('value');

    element.setAttribute('value', (elementValue + 1).toString());

    await page.waitForChanges();
    await sleep(250);

    expect(bqChange).not.toHaveReceivedEventTimes(0);
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-slider value-indicator></bq-slider>');

    const input = await computedStyle(page, 'bq-slider >>> .bq-slider__input');
    const label = await computedStyle(page, 'bq-slider >>> .bq-slider__label');
    const progress = await computedStyle(page, 'bq-slider >>> .progress');

    expect(input.borderRadius).toBe('4px');
    expect(input.height).toBe('4px');
    expect(label.fontSize).toBe('14px');
    expect(label.fontWeight).toBe('500');
    expect(label.height).toBe('21px');
    expect(progress.borderRadius).toBe('4px');
    expect(progress.height).toBe('4px');
  });
});
