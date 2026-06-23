import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-spinner', () => {
  it('should render', async () => {
    const { root } = await render(<bq-spinner />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-spinner />);

    expect(root).toHaveShadowRoot();
  });

  it('should handle `animation` property', async () => {
    const { root, setProps } = await render(<bq-spinner animation />);
    const spinner = root as HTMLBqSpinnerElement;

    const loaderIcon = spinner.shadowRoot?.querySelector<SVGElement>('.bq-spinner__loader > svg');

    expect(spinner).toHaveAttribute('animation');
    expect(loaderIcon).not.toBeNull();
    expect(getComputedStyle(loaderIcon as SVGElement).animationName).toBe('spin');

    await setProps({ animation: false });

    expect(spinner).not.toHaveAttribute('animation');
    expect(getComputedStyle(loaderIcon as SVGElement).animationName).toBe('none');
  });

  it('should handle `size` property', async () => {
    const { root, setProps } = await render(<bq-spinner />);
    const spinner = root as HTMLBqSpinnerElement;

    expect(spinner).toEqualAttribute('size', 'medium');

    await setProps({ size: 'large' });
    expect(spinner).toEqualAttribute('size', 'large');

    await setProps({ size: 'small' });
    expect(spinner).toEqualAttribute('size', 'small');
  });

  it('should handle `text-position` property', async () => {
    const { root, setProps } = await render(<bq-spinner textPosition="above" />);
    const spinner = root as HTMLBqSpinnerElement;

    expect(spinner).toEqualAttribute('text-position', 'above');

    await setProps({ textPosition: 'below' });
    expect(spinner).toEqualAttribute('text-position', 'below');

    await setProps({ textPosition: 'left' });
    expect(spinner).toEqualAttribute('text-position', 'left');

    await setProps({ textPosition: 'right' });
    expect(spinner).toEqualAttribute('text-position', 'right');

    await setProps({ textPosition: 'none' });

    expect(spinner).toEqualAttribute('text-position', 'none');
    expect(computedStyle('bq-spinner >>> .bq-spinner__text', ['display'])).toEqual({ display: 'none' });
  });

  it('should render icon slot element', async () => {
    const { root } = await render(
      <bq-spinner>
        <bq-icon name="spinner-gap" slot="icon" />
      </bq-spinner>,
    );

    await waitForStable(root);

    const spinnerIcon = root.shadowRoot?.querySelector<HTMLSlotElement>('.bq-spinner__icon');
    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="icon"]');
    const iconSlotElements = slotElement.assignedElements({ flatten: true });

    expect(spinnerIcon).not.toHaveClass('is-hidden');
    expect(iconSlotElements).toHaveLength(1);
  });

  it('should handle invalid properties', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-spinner />);
    const spinner = root as HTMLBqSpinnerElement;

    await setProps({ size: 'invalid', textPosition: 'invalid' });

    expect({
      size: spinner.size,
      textPosition: spinner.textPosition,
    }).toEqual({
      size: 'medium',
      textPosition: 'none',
    });

    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledWith('[BQ-SPINNER] Please notice that "size" should be one of small|medium|large');
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-SPINNER] Please notice that "textPosition" should be one of none|left|right|above|below',
    );
  });

  it('should respect design style', async () => {
    await render(
      <div>
        <bq-spinner size="small" textPosition="below" />
        <bq-spinner size="medium" textPosition="below" />
        <bq-spinner size="large" textPosition="below" />
      </div>,
    );

    const getLineHeightValue = (fontSize: string): string => {
      return `${(150 * parseInt(fontSize, 10)) / 100}px`;
    };

    const sizeStyleProps = ['width', 'height'] as const;

    const smallStyle = computedStyle('bq-spinner[size="small"] >>> .bq-spinner__loader', sizeStyleProps);
    const mediumStyle = computedStyle('bq-spinner[size="medium"] >>> .bq-spinner__loader', sizeStyleProps);
    const largeStyle = computedStyle('bq-spinner[size="large"] >>> .bq-spinner__loader', sizeStyleProps);

    const textStyleProps = ['fontSize', 'fontWeight', 'lineHeight'] as const;

    const smallTextStyle = computedStyle('bq-spinner[size="small"] >>> .bq-spinner__text', textStyleProps);
    const mediumTextStyle = computedStyle('bq-spinner[size="medium"] >>> .bq-spinner__text', textStyleProps);
    const largeTextStyle = computedStyle('bq-spinner[size="large"] >>> .bq-spinner__text', textStyleProps);

    expect(smallStyle).toEqual({ width: '32px', height: '32px' });
    expect(mediumStyle).toEqual({ width: '48px', height: '48px' });
    expect(largeStyle).toEqual({ width: '56px', height: '56px' });

    const textStyleExpected = (fontSize: string) => ({
      fontSize,
      fontWeight: '500',
      lineHeight: getLineHeightValue(fontSize),
    });

    expect(smallTextStyle).toEqual(textStyleExpected('12px'));
    expect(mediumTextStyle).toEqual(textStyleExpected('14px'));
    expect(largeTextStyle).toEqual(textStyleExpected('16px'));
  });

  it('should render default slot text content', async () => {
    const { root } = await render(
      <bq-spinner textPosition="below">
        <span>Loading...</span>
      </bq-spinner>,
    );

    await waitForStable(root);

    const textEl = root.shadowRoot?.querySelector<HTMLElement>('[part="text"]');
    const slot = textEl?.querySelector<HTMLSlotElement>('slot');
    const assigned = slot.assignedElements({ flatten: true });

    expect(getComputedStyle(textEl as HTMLElement).display).not.toBe('none');
    expect(assigned).toHaveLength(1);
    expect(getTextContent(slot, { recurse: true })).toBe('Loading...');
  });
});
