import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-divider', () => {
  it('should render', async () => {
    const { root } = await render(<bq-divider />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-divider />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render label', async () => {
    const { root } = await render(
      <bq-divider>
        <p>Label</p>
      </bq-divider>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    const assignedElement = slotElement.assignedElements({ flatten: true })[0];

    expect(assignedElement.textContent?.trim()).toBe('Label');
  });

  it('should handle invalid properties', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(
      <bq-divider orientation="vertical" strokeLinecap="square" titleAlignment="start">
        Divider
      </bq-divider>,
    );

    root.orientation = 'invalid' as HTMLBqDividerElement['orientation'];
    root.titleAlignment = 'invalid' as HTMLBqDividerElement['titleAlignment'];
    root.strokeLinecap = 'invalid' as HTMLBqDividerElement['strokeLinecap'];

    await waitForChanges();

    expect({
      orientation: root.orientation,
      titleAlignment: root.titleAlignment,
      strokeLinecap: root.strokeLinecap,
    }).toEqual({
      orientation: 'horizontal',
      titleAlignment: 'middle',
      strokeLinecap: 'butt',
    });

    expect(warnSpy).toHaveBeenCalledTimes(3);
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-DIVIDER] Please notice that "orientation" should be one of horizontal|vertical',
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-DIVIDER] Please notice that "titleAlignment" should be one of start|middle|end',
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-DIVIDER] Please notice that "strokeLinecap" should be one of square|round|butt',
    );
  });

  it('should respect design style', async () => {
    const { root } = await render(<bq-divider />);

    await waitForStable(root);

    const style = computedStyle('bq-divider >>> [part="base"]', ['height']);

    expect(style).toEqual({ height: '1px' });
  });
});
