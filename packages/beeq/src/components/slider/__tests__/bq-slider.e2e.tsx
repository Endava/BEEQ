import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import { sleep } from '../../../shared/test-utils';
import { computedStyle } from '../../../shared/test-utils/computedStyle';

afterEach(async () => {
  vi.restoreAllMocks();
  window.scrollTo({ top: 0 });
  await cdp().send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
});

const renderWithSpace = (template: Parameters<typeof render>[0]) =>
  render(template, {
    clearStage: true,
    stageAttrs: { style: 'padding: 100px 40px; min-height: 100vh; box-sizing: border-box;' },
  });

const getRangeInputs = (slider: HTMLBqSliderElement) =>
  Array.from(slider.shadowRoot?.querySelectorAll<HTMLInputElement>('input[type="range"]') ?? []);

const getTooltips = (slider: HTMLBqSliderElement) =>
  Array.from(slider.shadowRoot.querySelectorAll<HTMLBqTooltipElement>('bq-tooltip'));
const getPanel = (tooltip: HTMLBqTooltipElement) => tooltip.shadowRoot.querySelector<HTMLElement>('[part="panel"]');
const getThumbCenter = (slider: HTMLBqSliderElement, index: number) => {
  const input = getRangeInputs(slider)[index];
  const rect = input.getBoundingClientRect();
  const thumb = parseFloat(getComputedStyle(slider).getPropertyValue('--bq-slider--thumb-size')) + 4;
  const range = Number(input.max) - Number(input.min);
  const fraction = range === 0 ? 0 : (Number(input.value) - Number(input.min)) / range;
  const offset = thumb / 2 + fraction * (rect.width - thumb);
  return getComputedStyle(input).direction === 'rtl' ? rect.right - offset : rect.left + offset;
};
const getAlignmentError = (slider: HTMLBqSliderElement, index: number) => {
  const rect = getPanel(getTooltips(slider)[index]).getBoundingClientRect();
  return Math.abs(rect.left + rect.width / 2 - getThumbCenter(slider, index));
};
const expectAligned = async (slider: HTMLBqSliderElement) => {
  for (const [index, tooltip] of getTooltips(slider).entries()) {
    await expect.poll(() => getAlignmentError(slider, index)).toBeLessThanOrEqual(2);
    expect(getPanel(tooltip)).toEqualAttribute('aria-hidden', 'false');
    expect(getComputedStyle(getPanel(tooltip)).visibility).toBe('visible');
  }
};
const getBrowserPoint = async (x: number, y: number) => {
  // The Vitest iframe can be scaled independently of the CDP page viewport.
  const { result } = await cdp().send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const frame = document.querySelector('[data-vitest="true"]');
      const rect = frame.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    })())`,
    returnByValue: true,
  });
  const frame: { x: number; y: number; width: number; height: number } = JSON.parse(result.value);
  return {
    x: frame.x + (x * frame.width) / window.innerWidth,
    y: frame.y + (y * frame.height) / window.innerHeight,
  };
};

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

  it('should follow both thumbs after programmatic and keyboard changes', async () => {
    const { root, setProps, waitForChanges } = await renderWithSpace(
      <bq-slider
        enableTooltip
        tooltipAlwaysVisible
        type="range"
        value="[20,70]"
        style={{ width: '60vw', margin: '100px auto' }}
      />,
    );
    const slider = root as HTMLBqSliderElement;
    await expectAligned(slider);

    await setProps({ value: [50, 90] });
    await expectAligned(slider);
    const [minInput, maxInput] = getRangeInputs(slider);
    minInput.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await waitForChanges();
    expect(Number(minInput.value)).toBe(53);
    await expectAligned(slider);
    maxInput.focus();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await waitForChanges();
    expect(Number(maxInput.value)).toBe(88);
    await expectAligned(slider);

    const rect = minInput.getBoundingClientRect();
    const start = await getBrowserPoint(getThumbCenter(slider, 0), rect.top + rect.height / 2);
    const end = await getBrowserPoint(rect.left + rect.width * 0.6, rect.top + rect.height / 2);
    await cdp().send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...start });
    await cdp().send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      button: 'left',
      buttons: 1,
      clickCount: 1,
      ...start,
    });
    try {
      await cdp().send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        button: 'left',
        buttons: 1,
        ...end,
      });
      await waitForChanges();
      expect(Number(minInput.value)).toBeGreaterThan(53);
      await expectAligned(slider);
    } finally {
      await cdp().send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        button: 'left',
        buttons: 0,
        clickCount: 1,
        ...end,
      });
    }
  });

  it('should remain aligned after container resize without changing value or form data', async () => {
    const { root, spyOnEvent } = await renderWithSpace(
      <form style={{ width: '60vw', margin: '100px auto' }}>
        <bq-slider name="range" enableTooltip tooltipAlwaysVisible type="range" value="[20,70]" />
      </form>,
    );
    const slider = root.querySelector('bq-slider');
    const bqChange = spyOnEvent('bqChange');
    await expectAligned(slider);
    const formValue = new FormData(root as HTMLFormElement).get('range');

    for (const width of ['40vw', '70vw']) {
      root.style.width = width;
      await expectAligned(slider);
      expect(new FormData(root as HTMLFormElement).get('range')).toBe(formValue);
    }
    expect(bqChange).toHaveReceivedEventTimes(0);
  });

  it('should align a single tooltip at custom bounds with fractional steps and thumb size', async () => {
    const { root, setProps } = await renderWithSpace(
      <bq-slider
        enableTooltip
        tooltipAlwaysVisible
        min={10}
        max={20}
        step={0.5}
        value={10}
        style={{ width: '60vw', margin: '100px auto', '--bq-slider--thumb-size': '21px' }}
      />,
    );
    const slider = root as HTMLBqSliderElement;
    for (const value of [10, 12.5, 20]) {
      await setProps({ value });
      await expectAligned(slider);
    }
    slider.style.width = '40vw';
    await expectAligned(slider);
  });

  it('should retain logical tooltip alignment in RTL layouts', async () => {
    const { root, setProps } = await renderWithSpace(
      <bq-slider
        enableTooltip
        tooltipAlwaysVisible
        type="range"
        value="[20,70]"
        style={{ width: '60vw', margin: '100px auto', direction: 'rtl' }}
      />,
    );
    const slider = root as HTMLBqSliderElement;
    await expectAligned(slider);
    await setProps({ value: [30, 80] });
    await expectAligned(slider);
    slider.style.width = '40vw';
    await expectAligned(slider);
  });

  it('should retain a valid tooltip offset when min and max are equal', async () => {
    const { root } = await renderWithSpace(
      <bq-slider
        enableTooltip
        tooltipAlwaysVisible
        min={10}
        max={10}
        value={10}
        style={{ width: '60vw', margin: '100px auto' }}
      />,
    );
    const slider = root as HTMLBqSliderElement;
    const tooltip = getTooltips(slider)[0];

    expect(tooltip.style.insetInlineStart).not.toBe('');
    expect(Number.isFinite(parseFloat(getComputedStyle(tooltip).insetInlineStart))).toBe(true);
    await expectAligned(slider);
  });

  it('should follow a viewport resize with unchanged values', async () => {
    const { root } = await renderWithSpace(
      <bq-slider
        enableTooltip
        tooltipAlwaysVisible
        type="range"
        value="[20,70]"
        style={{ width: '60vw', margin: '100px auto' }}
      />,
    );
    const slider = root as HTMLBqSliderElement;
    await expectAligned(slider);
    const width = slider.getBoundingClientRect().width;
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    try {
      await page.viewport(Math.round(viewport.width * 0.7), viewport.height);
      await expect.poll(() => slider.getBoundingClientRect().width).not.toBe(width);
      await expectAligned(slider);
    } finally {
      await page.viewport(viewport.width, viewport.height);
    }
    await expectAligned(slider);
  });

  it('should follow a transient tooltip during pointer drag and close it on release', async () => {
    const { root, waitForChanges } = await renderWithSpace(
      <bq-slider enableTooltip value={20} style={{ width: '60vw', margin: '100px auto' }} />,
    );
    const slider = root as HTMLBqSliderElement;
    const input = getRangeInputs(slider)[0];
    const rect = input.getBoundingClientRect();
    const start = await getBrowserPoint(getThumbCenter(slider, 0), rect.top + rect.height / 2);
    const end = await getBrowserPoint(rect.left + rect.width * 0.6, rect.top + rect.height / 2);
    const panel = getPanel(getTooltips(slider)[0]);
    expect(panel).toEqualAttribute('aria-hidden', 'true');

    await cdp().send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...start });
    await cdp().send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      button: 'left',
      buttons: 1,
      clickCount: 1,
      ...start,
    });
    try {
      await cdp().send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        button: 'left',
        buttons: 1,
        ...end,
      });
      await waitForChanges();
      expect(Number(input.value)).toBeGreaterThan(20);
      await expectAligned(slider);
    } finally {
      await cdp().send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        button: 'left',
        buttons: 0,
        clickCount: 1,
        ...end,
      });
    }
    await waitForChanges();
    expect(panel).toEqualAttribute('aria-hidden', 'true');
    expect(getTooltips(slider)[0]).toHaveClass('hidden');
  });

  it('should close idle tooltips when persistent mode is disabled and reopen them on press', async () => {
    const { root, setProps, waitForChanges } = await renderWithSpace(
      <bq-slider
        enableTooltip
        tooltipAlwaysVisible
        type="range"
        value="[20,70]"
        style={{ width: '60vw', margin: '100px auto' }}
      />,
    );
    const slider = root as HTMLBqSliderElement;
    await expectAligned(slider);
    await setProps({ tooltipAlwaysVisible: false });
    for (const tooltip of getTooltips(slider)) {
      expect(getPanel(tooltip)).toEqualAttribute('aria-hidden', 'true');
      expect(tooltip).toHaveClass('hidden');
    }

    const input = getRangeInputs(slider)[1];
    input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
    await waitForChanges();
    await expect.poll(() => getAlignmentError(slider, 1)).toBeLessThanOrEqual(2);
    expect(getPanel(getTooltips(slider)[1])).toEqualAttribute('aria-hidden', 'false');
    expect(getPanel(getTooltips(slider)[0])).toEqualAttribute('aria-hidden', 'true');
    await setProps({ tooltipAlwaysVisible: true });
    await expectAligned(slider);
    await setProps({ tooltipAlwaysVisible: false });
    expect(getPanel(getTooltips(slider)[1])).toEqualAttribute('aria-hidden', 'false');
    input.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, composed: true }));
    await waitForChanges();
    expect(getPanel(getTooltips(slider)[1])).toEqualAttribute('aria-hidden', 'true');
  });

  it('should stop tracking idle transient slider tooltips on a multi-slider page', async () => {
    const { root } = await render(
      <div>
        {Array.from({ length: 100 }, () => (
          <bq-slider enableTooltip value={30} />
        ))}
      </div>,
    );
    await waitForStable(root);
    const reads = Array.from(root.querySelectorAll('bq-slider'), (slider) => {
      const tooltip = getTooltips(slider)[0];
      expect(getPanel(tooltip)).toEqualAttribute('aria-hidden', 'true');
      return vi.spyOn(tooltip.shadowRoot.querySelector<HTMLElement>('[part="trigger"]'), 'getBoundingClientRect');
    });

    for (let frame = 0; frame < 5; frame++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
    for (const read of reads) expect(read).not.toHaveBeenCalled();
  });

  it('should not reopen stale pressed tooltips after disabling and reenabling them', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-slider enableTooltip value={30} />);
    const slider = root as HTMLBqSliderElement;
    const input = getRangeInputs(slider)[0];
    input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
    await waitForChanges();
    expect(getPanel(getTooltips(slider)[0])).toEqualAttribute('aria-hidden', 'false');

    await setProps({ enableTooltip: false });
    expect(getTooltips(slider)).toHaveLength(0);
    await setProps({ enableTooltip: true });
    expect(getPanel(getTooltips(slider)[0])).toEqualAttribute('aria-hidden', 'true');
  });

  it('should stop a transient tooltip when the press is released outside the input', async () => {
    const { root, waitForChanges } = await render(<bq-slider enableTooltip value={30} />);
    const slider = root as HTMLBqSliderElement;
    const input = getRangeInputs(slider)[0];
    input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
    await waitForChanges();
    expect(getPanel(getTooltips(slider)[0])).toEqualAttribute('aria-hidden', 'false');

    document.body.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await waitForChanges();
    expect(getPanel(getTooltips(slider)[0])).toEqualAttribute('aria-hidden', 'true');
    expect(getTooltips(slider)[0]).toHaveClass('hidden');
  });

  it('should clear pressed tooltip state when disabled or disconnected', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <bq-slider enableTooltip value={30} />
      </div>,
    );
    const slider = root.querySelector('bq-slider');
    const press = async () => {
      getRangeInputs(slider)[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
      await waitForChanges();
      expect(getPanel(getTooltips(slider)[0])).toEqualAttribute('aria-hidden', 'false');
    };
    await press();
    slider.disabled = true;
    await waitForChanges();
    expect(getPanel(getTooltips(slider)[0])).toEqualAttribute('aria-hidden', 'true');
    slider.disabled = false;
    await waitForChanges();
    await press();
    slider.remove();
    root.append(slider);
    await waitForChanges();
    await waitForStable(slider);
    expect(getPanel(getTooltips(slider)[0])).toEqualAttribute('aria-hidden', 'true');
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
