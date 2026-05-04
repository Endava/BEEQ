import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

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

    expect(root).toHaveShadowRoot();
  });

  it('should render label', async () => {
    const { root } = await render(
      <bq-divider>
        <p>Label</p>
      </bq-divider>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot');
    expect(getTextContent(slotElement, { recurse: true })).toBe('Label');
  });

  it('should handle invalid properties', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(
      <bq-divider orientation="vertical" strokeLinecap="square" titleAlignment="start">
        Divider
      </bq-divider>,
    );
    const divider = root as HTMLBqDividerElement;

    await setProps({ orientation: 'invalid', titleAlignment: 'invalid', strokeLinecap: 'invalid' });

    expect({
      orientation: divider.orientation,
      titleAlignment: divider.titleAlignment,
      strokeLinecap: divider.strokeLinecap,
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

  it('should apply the vertical orientation class', async () => {
    const { root } = await render(<bq-divider orientation="vertical" />);
    const base = root.shadowRoot?.querySelector('[part="base"]');

    expect(base).toHaveClass('bq-divider--vertical');
  });

  it('should render title slot content', async () => {
    const { root } = await render(
      <bq-divider>
        <span>Section title</span>
      </bq-divider>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Section title');
  });

  it('should apply a dashed stroke pattern', async () => {
    const { root } = await render(<bq-divider dashed strokeDashGap={3} strokeDashWidth={9} />);

    await waitForStable(root);

    const line = root.shadowRoot?.querySelector('[part="dash-start-line"]');

    expect(line).toEqualAttribute('stroke-dasharray', '9, 3');
  });
});
