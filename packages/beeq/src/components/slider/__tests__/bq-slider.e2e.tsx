import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { sleep } from '../../../shared/test-utils';
import { computedStyle } from '../../../shared/test-utils/computedStyle';

afterEach(() => {
  vi.restoreAllMocks();
});

const getRangeInputs = (slider: HTMLBqSliderElement) =>
  Array.from(slider.shadowRoot?.querySelectorAll<HTMLInputElement>('input[type="range"]') ?? []);

describe('bq-slider', () => {
  it('should render', async () => {
    const { root } = await render(<bq-slider value={30} />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-slider value={30} />);

    expect(root).toHaveShadowRoot();
  });

  it('should handle disabled property', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-slider disabled type="range" value="[30,70]" />);
    const slider = root as HTMLBqSliderElement;

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqChange = spyOnEvent('bqChange');
    const base = slider.shadowRoot?.querySelector('[part="base"]');
    const inputs = getRangeInputs(slider);

    expect(base).toEqualAttribute('aria-disabled', 'true');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toBeDisabled();
    expect(inputs[1]).toBeDisabled();

    inputs[0].focus();
    inputs[0].blur();
    inputs[0].click();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqChange).toHaveReceivedEventTimes(0);
  });

  it('should handle enableValueIndicator property', async () => {
    const { root, setProps } = await render(<bq-slider type="range" value="[30,70]" />);
    const slider = root as HTMLBqSliderElement;

    await setProps({ enableValueIndicator: true });

    const leftLabel = slider.shadowRoot?.querySelector('[part="label-start"]');
    const rightLabel = slider.shadowRoot?.querySelector('[part="label-end"]');

    expect(leftLabel).not.toHaveClass('hidden');
    expect(rightLabel).not.toHaveClass('hidden');
    expect(leftLabel?.textContent?.trim()).toBe('30');
    expect(rightLabel?.textContent?.trim()).toBe('70');
  });

  it('should keep the configured gap between range values', async () => {
    const { root, setProps } = await render(<bq-slider gap={10} max={100} min={0} type="range" value="[30,70]" />);
    const slider = root as HTMLBqSliderElement;

    await setProps({ value: [55, 60] });

    const [minInput, maxInput] = getRangeInputs(slider);
    const difference = Math.abs(Number(maxInput.getAttribute('value')) - Number(minInput.getAttribute('value')));

    expect(difference).toBe(10);
  });

  it('should switch between single and range types', async () => {
    const { root, setProps } = await render(<bq-slider type="single" value={30} />);
    const slider = root as HTMLBqSliderElement;

    expect(getRangeInputs(slider)).toHaveLength(1);

    await setProps({ type: 'range', value: [30, 70] });

    expect(getRangeInputs(slider)).toHaveLength(2);
  });

  it('should emit bqChange when value changes', async () => {
    const { setProps, spyOnEvent } = await render(<bq-slider value={30} />);
    const bqChange = spyOnEvent('bqChange');

    await setProps({ value: 50 });

    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should emit bqFocus and bqBlur when enabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-slider value={30} />);
    const slider = root as HTMLBqSliderElement;

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const [input] = getRangeInputs(slider);

    input.focus();
    input.blur();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should render tooltips when enabled and keep them visible when configured', async () => {
    const { root } = await render(<bq-slider enableTooltip tooltipAlwaysVisible type="range" value="[30,70]" />);
    const slider = root as HTMLBqSliderElement;

    await waitForStable(root);

    const tooltips = slider.shadowRoot?.querySelectorAll('bq-tooltip') ?? [];

    expect(tooltips).toHaveLength(2);
    expect(tooltips[0]).not.toHaveClass('hidden');
    expect(tooltips[1]).not.toHaveClass('hidden');
  });

  it('should round values to the nearest step', async () => {
    const { root, waitForChanges } = await render(<bq-slider step={5} value={33} />);
    const slider = root as HTMLBqSliderElement;

    await waitForChanges();

    const [input] = getRangeInputs(slider);

    expect(input).toEqualAttribute('value', '35');
  });

  it('should apply min and max boundaries to the range input', async () => {
    const { root } = await render(<bq-slider max={100} min={10} value={30} />);
    const slider = root as HTMLBqSliderElement;

    const [input] = getRangeInputs(slider);
    expect(input).toEqualAttributes({ min: '10', max: '100' });
  });

  it('should participate in forms by setting the form value', async () => {
    await render(
      <form>
        <bq-slider name="volume" value={30} />
      </form>,
    );

    const form = document.querySelector('form') as HTMLFormElement;
    const formData = new FormData(form);

    expect(formData.get('volume')).toBe('30');
  });

  it('should respect debounceTime when emitting bqChange', async () => {
    const { setProps, spyOnEvent } = await render(<bq-slider debounceTime={250} value={30} />);

    const bqChange = spyOnEvent('bqChange');

    await setProps({ value: 50 });
    await sleep(300);

    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should respect the expected design styles', async () => {
    const { root } = await render(<bq-slider value={30} />);

    await waitForStable(root);

    const label = computedStyle('bq-slider >>> span[part="label-start"]', [
      'fontSize',
      'fontWeight',
      'marginInlineEnd',
    ]);
    const track = computedStyle('bq-slider >>> span[part="track-area"]', ['borderRadius', 'height']);
    const progress = computedStyle('bq-slider >>> span[part="progress-area"]', ['borderRadius', 'height']);

    expect(label).toEqual({ fontSize: '14px', fontWeight: '500', marginInlineEnd: '8px' });
    expect(track).toEqual({ borderRadius: '4px', height: '4px' });
    expect(progress).toEqual({ borderRadius: '4px', height: '4px' });
  });
});
