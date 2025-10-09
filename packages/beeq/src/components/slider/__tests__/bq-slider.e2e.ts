import { newE2EPage } from '@stencil/core/testing';

import { computedStyle, setProperties, sleep } from '../../../shared/test-utils';

describe('bq-slider', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-slider value="30"></bq-slider>',
    });

    const element = await page.find('bq-slider');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-slider value="30"></bq-slider>',
    });

    const element = await page.find('bq-slider');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should handle `disabled` property', async () => {
    const page = await newE2EPage({
      html: '<bq-slider type="range" value="[30,70]" disabled></bq-slider>',
    });

    const bqFocus = await page.spyOnEvent('bqFocus');
    const bqBlur = await page.spyOnEvent('bqBlur');
    const bqChange = await page.spyOnEvent('bqChange');

    const element = await page.find('bq-slider');
    const inputs = await page.findAll('bq-slider >>> input[type="range"]');

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
    const page = await newE2EPage({
      html: '<bq-slider type="range" value="[30,70]"></bq-slider>',
    });

    await page.$eval('bq-slider', (elem: HTMLBqSliderElement) => {
      elem.enableValueIndicator = true;
    });
    await page.waitForChanges();

    const leftLabel = await page.find('bq-slider >>> span[part="label-start"]');
    const rightLabel = await page.find('bq-slider >>> span[part="label-end"]');

    expect(leftLabel).not.toHaveClass('hidden');
    expect(rightLabel).not.toHaveClass('hidden');
  });

  it('should handle `gap` property', async () => {
    const gap = 10;
    const page = await newE2EPage({
      html: `<bq-slider type="range" min="0" max="100" value="[30, 70]" gap="${gap}"></bq-slider>`,
    });

    await setProperties(page, 'bq-slider', { value: [55, 60] });

    const minRangeInput = await page.find('bq-slider >>> input[part="input-min"]');
    const maxRangeInput = await page.find('bq-slider >>> input[part="input-max"]');

    const difference = Math.abs(
      parseInt(maxRangeInput.getAttribute('value'), 10) - parseInt(minRangeInput.getAttribute('value'), 10),
    );

    expect(difference).toEqual(gap);
  });

  it('should handle `type` property', async () => {
    const page = await newE2EPage({
      html: '<bq-slider type="single" value="30"></bq-slider>',
    });

    const element = await page.find('bq-slider');
    expect(element.shadowRoot.querySelectorAll('input').length).toBe(1);

    await setProperties(page, 'bq-slider', { type: 'range' });
    await page.waitForChanges();

    const inputs = (await page.find('bq-slider')).shadowRoot.querySelectorAll('input');
    expect(inputs.length).toBe(2);
  });

  it('should trigger bqChange', async () => {
    const value = 30;
    const page = await newE2EPage({
      html: `<bq-slider value="${value}"></bq-slider>`,
    });

    const bqChange = await page.spyOnEvent('bqChange');

    await setProperties(page, 'bq-slider', { value: value + 20 });
    await page.waitForChanges();

    expect(bqChange).toHaveReceivedEvent();
  });

  it('should trigger bqChange with `debounce-time`', async () => {
    const value = 30;
    const page = await newE2EPage({
      html: `<bq-slider value="${value}" debounce-time="250"></bq-slider>`,
    });

    const bqChange = await page.spyOnEvent('bqChange');

    await setProperties(page, 'bq-slider', { value: value + 20 });
    await page.waitForChanges();
    await sleep(250);

    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should respect design style', async () => {
    const page = await newE2EPage({
      html: '<bq-slider value="30"></bq-slider>',
    });

    const label = await computedStyle(page, 'bq-slider >>> span[part="label-start"]', [
      'fontSize',
      'fontWeight',
      'marginInlineEnd',
    ]);
    const track = await computedStyle(page, 'bq-slider >>> span[part="track-area"]', ['borderRadius', 'height']);
    const progress = await computedStyle(page, 'bq-slider >>> span[part="progress-area"]', ['borderRadius', 'height']);

    expect(label).toEqual({ fontSize: '14px', fontWeight: '500', marginInlineEnd: '8px' });
    expect(track).toEqual({ borderRadius: '4px', height: '4px' });
    expect(progress).toEqual({ borderRadius: '4px', height: '4px' });
  });
});
