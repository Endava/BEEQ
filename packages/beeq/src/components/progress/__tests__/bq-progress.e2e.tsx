import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';

// This host has no slot, so colour probes must use a rendered shadow-DOM scope.
const getWrapper = (element: HTMLBqProgressElement) =>
  element.shadowRoot.querySelector<HTMLDivElement>('[part="wrapper"]');
const getLabel = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector<HTMLDivElement>('[part="label"]');
const getProgressBar = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector<HTMLProgressElement>('[part="progress-bar"]');
const getTooltip = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector<HTMLBqTooltipElement>('bq-tooltip');
const getIndeterminate = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector<HTMLDivElement>('[part="indeterminate"]');
const getAlignmentError = (element: HTMLBqProgressElement) => {
  const bar = getProgressBar(element).getBoundingClientRect();
  const panel = getTooltip(element).shadowRoot.querySelector<HTMLElement>('[part="panel"]').getBoundingClientRect();
  return Math.abs(panel.left + panel.width / 2 - (bar.left + (bar.width * element.value) / 100));
};

describe('bq-progress', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render', async () => {
    const { root } = await render(<bq-progress />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-progress />);
    expect(root).toHaveShadowRoot();
  });

  it('should render the progress bar with label', async () => {
    const value = 60;
    const { root } = await render(<bq-progress label value={value} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    const label = getLabel(bqProgress);

    expect(label).not.toBeNull();
    expect(label).toEqualAttribute('aria-hidden', 'false');
    expect(label.textContent?.trim()).toBe(`${value}%`);
  });

  it('should render the progress bar without label', async () => {
    const { root } = await render(<bq-progress value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    const label = getLabel(bqProgress);

    expect(label).toEqualAttribute('aria-hidden', 'true');
    expect(getComputedStyle(label).visibility).toBe('hidden');
    expect(getComputedStyle(label).inlineSize).toBe('0px');
  });

  it('should render the progress bar with tooltip', async () => {
    const value = 60;
    const { root } = await render(<bq-progress enableTooltip value={value} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    const tooltip = getTooltip(bqProgress);

    expect(tooltip).not.toBeNull();
    expect(tooltip.textContent?.trim()).toBe(`${value}`);
  });

  it('should render the progress bar without tooltip', async () => {
    const { root } = await render(<bq-progress value={60} />);
    const tooltip = root as HTMLBqProgressElement;

    expect(getTooltip(tooltip)).toBeNull();
  });

  it('should follow the progress endpoint after value and width changes', async () => {
    const { root, setProps } = await render(
      <bq-progress enableTooltip value={20} style={{ width: '60vw', margin: '100px auto', display: 'block' }} />,
    );
    const progress = root as HTMLBqProgressElement;

    for (const value of [20, 50, 80, 30]) {
      await setProps({ value });
      await expect.poll(() => getAlignmentError(progress)).toBeLessThanOrEqual(2);
      const tooltip = getTooltip(progress);
      const panel = tooltip.shadowRoot.querySelector<HTMLElement>('[part="panel"]');
      expect(panel).toEqualAttribute('aria-hidden', 'false');
      expect(getComputedStyle(panel).visibility).toBe('visible');
      expect(tooltip.textContent.trim()).toBe(String(value));
    }
    progress.style.width = '40vw';
    await expect.poll(() => getAlignmentError(progress)).toBeLessThanOrEqual(2);

    const tooltip = getTooltip(progress);
    await setProps({ indeterminate: true });
    expect(getTooltip(progress)).toBeNull();
    expect(tooltip.isConnected).toBe(false);
    await setProps({ indeterminate: false });
    await expect.poll(() => getAlignmentError(progress)).toBeLessThanOrEqual(2);
    await setProps({ enableTooltip: false });
    expect(getTooltip(progress)).toBeNull();
  });

  it('should render the error type styles', async () => {
    const { root } = await render(<bq-progress label type="error" value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(bqProgress).toEqualAttribute('type', 'error');
    // Native progress pseudo-element colour queries are unreliable in Chromium.
    // Check the resolved value feeding the native indicator, plus the visible indeterminate indicator below.
    expect(resolveColorToken('--_progress-bar-indicator-color', getWrapper(bqProgress))).toBe(
      resolveColorToken('--bq-progress-bar--indicatorColor-error', getWrapper(bqProgress)),
    );
    expect(getComputedStyle(getLabel(bqProgress)).color).toBe(
      resolveColorToken('--bq-progress-bar--label-color-error', getWrapper(bqProgress)),
    );
    // The public indicator colour must not be mutated by the error type
    expect(bqProgress.style.getPropertyValue('--bq-progress-bar--indicatorColor')).toBe('');
  });

  it('should use the default label and indicator colours', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-progress label value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(getComputedStyle(getLabel(bqProgress)).color).toBe(
      resolveColorToken('--bq-progress-bar--label-color', getWrapper(bqProgress)),
    );
    expect(getComputedStyle(getLabel(bqProgress)).visibility).toBe('visible');
    await setProps({ indeterminate: true });
    await waitForChanges();
    await waitForStable(bqProgress);
    expect(getComputedStyle(getIndeterminate(bqProgress)).backgroundColor).toBe(
      resolveColorToken('--bq-progress-bar--indicatorColor', getWrapper(bqProgress)),
    );
  });

  it('should use the error indicator colour for the indeterminate error state', async () => {
    const { root } = await render(<bq-progress indeterminate type="error" />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(getComputedStyle(getIndeterminate(bqProgress)).backgroundColor).toBe(
      resolveColorToken('--bq-progress-bar--indicatorColor-error', getWrapper(bqProgress)),
    );
  });

  it('should apply custom error colour overrides', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-progress
        label
        value={60}
        style={{
          '--bq-progress-bar--indicatorColor-error': 'rgb(255, 0, 0)',
          '--bq-progress-bar--label-color-error': 'rgb(0, 0, 255)',
        }}
        type="error"
      />,
    );
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(getComputedStyle(getLabel(bqProgress)).visibility).toBe('visible');
    expect(getComputedStyle(getLabel(bqProgress)).color).toBe(
      resolveColorToken('--bq-progress-bar--label-color-error', getWrapper(bqProgress)),
    );
    await setProps({ indeterminate: true });
    await waitForChanges();
    await waitForStable(bqProgress);
    expect(getComputedStyle(getIndeterminate(bqProgress)).backgroundColor).toBe(
      resolveColorToken('--bq-progress-bar--indicatorColor-error', getWrapper(bqProgress)),
    );
  });

  it('should render the large thickness styles', async () => {
    const { root } = await render(<bq-progress thickness="large" value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(getComputedStyle(getProgressBar(bqProgress)).blockSize).toBe('8px');
  });

  it('should clamp the value to the supported range', async () => {
    const { root, setProps } = await render(<bq-progress value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await setProps({ value: 120 });
    expect(bqProgress.value).toBe(100);

    await setProps({ value: -5 });
    expect(bqProgress.value).toBe(0);
  });

  it('should render the indeterminate state', async () => {
    const { root } = await render(<bq-progress indeterminate value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(getProgressBar(bqProgress)).not.toHaveAttribute('value');
    expect(getIndeterminate(bqProgress)).not.toBeNull();
    expect(getLabel(bqProgress).getAttribute('aria-hidden')).toBe('true');
  });

  it('should render the rounded border shape', async () => {
    const { root } = await render(<bq-progress borderShape="rounded" value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    expect(getComputedStyle(getProgressBar(bqProgress)).borderRadius).toBe('9999px');
  });

  it('should render the square border shape without rounded styles', async () => {
    const { root } = await render(<bq-progress borderShape="square" value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    expect(getComputedStyle(getProgressBar(bqProgress)).borderRadius).toBe('0px');
  });

  it('should not render tooltip content for indeterminate progress', async () => {
    const { root } = await render(<bq-progress enableTooltip indeterminate value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    expect(getTooltip(bqProgress)).toBeNull();
  });

  it('should update the label text when the value changes', async () => {
    const { root, setProps } = await render(<bq-progress label value={10} />);
    const bqProgress = root as HTMLBqProgressElement;

    await setProps({ value: 75 });

    expect(getLabel(bqProgress).textContent?.trim()).toBe('75%');
  });

  it('should fallback invalid prop values to defaults', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-progress />);
    const bqProgress = root as HTMLBqProgressElement;

    await setProps({ borderShape: 'invalid', thickness: 'invalid', type: 'invalid' });

    expect(bqProgress.borderShape).toBe('rounded');
    expect(bqProgress.thickness).toBe('medium');
    expect(bqProgress.type).toBe('default');
    expect(warn).toHaveBeenCalledTimes(3);

    warn.mockRestore();
  });

  it('should restore default colours after changing from error', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-progress label value={60} />);
    const progress = root as HTMLBqProgressElement;
    const label = getLabel(progress);
    const checkColours = (indicatorToken: string, labelToken: string) => {
      expect(resolveColorToken('--_progress-bar-indicator-color', getWrapper(progress))).toBe(
        resolveColorToken(indicatorToken, getWrapper(progress)),
      );
      expect(getComputedStyle(label).color).toBe(resolveColorToken(labelToken, getWrapper(progress)));
      expect(getComputedStyle(label).visibility).toBe('visible');
    };
    checkColours('--bq-progress-bar--indicatorColor', '--bq-progress-bar--label-color');
    await setProps({ type: 'error' });
    await waitForChanges();
    await waitForStable(progress);
    checkColours('--bq-progress-bar--indicatorColor-error', '--bq-progress-bar--label-color-error');
    await setProps({ type: 'default' });
    await waitForChanges();
    await waitForStable(progress);
    checkColours('--bq-progress-bar--indicatorColor', '--bq-progress-bar--label-color');
  });

  it('should preserve public height overrides when returning from large to medium', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-progress value={60} style={{ '--bq-progress-bar--height': '6px' }} />,
    );
    const progress = root as HTMLBqProgressElement;
    const bar = getProgressBar(progress);
    expect(getComputedStyle(bar).blockSize).toBe('6px');
    await setProps({ thickness: 'large' });
    await waitForChanges();
    await waitForStable(progress);
    expect(getComputedStyle(bar).blockSize).toBe('8px');
    expect(progress.style.getPropertyValue('--bq-progress-bar--height')).toBe('6px');
    await setProps({ thickness: 'medium' });
    await waitForChanges();
    await waitForStable(progress);
    expect(getComputedStyle(bar).blockSize).toBe('6px');
  });
});
