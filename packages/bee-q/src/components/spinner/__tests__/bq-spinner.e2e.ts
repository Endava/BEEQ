import { E2EElement, newE2EPage } from '@stencil/core/testing';
import { computedStyle, setProperties } from '../../../shared/test-utils';

describe('bq-spinner', () => {
  const checkSpinnerHasClass = (element: E2EElement, className: string) => {
    const spinner = element.shadowRoot.querySelector('.bq-spinner');
    return spinner.classList.contains(className);
  };

  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner></bq-spinner>');

    const element = await page.find('bq-spinner');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner></bq-spinner>');

    const element = await page.find('bq-spinner');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should handle `animation` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner animation></bq-spinner>');

    const element = await page.find('bq-spinner >>> .bq-spinner');

    expect(element.classList.contains('is-animated')).toBe(true);
  });

  it('should handle `size` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner size="large"></bq-spinner>');

    const element = await page.find('bq-spinner');

    expect(checkSpinnerHasClass(element, 'large')).toBe(true);

    await setProperties(page, 'bq-spinner', { size: 'medium' });

    expect(checkSpinnerHasClass(element, 'medium')).toBe(true);

    await setProperties(page, 'bq-spinner', { size: 'small' });

    expect(checkSpinnerHasClass(element, 'small')).toBe(true);
  });

  it('should handle `text-position` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner text-position="above"></bq-spinner>');

    const element = await page.find('bq-spinner');

    expect(checkSpinnerHasClass(element, 'text-above')).toBe(true);

    await setProperties(page, 'bq-spinner', { textPosition: 'bellow' });

    expect(checkSpinnerHasClass(element, 'text-bellow')).toBe(true);

    await setProperties(page, 'bq-spinner', { textPosition: 'left' });

    expect(checkSpinnerHasClass(element, 'text-left')).toBe(true);

    await setProperties(page, 'bq-spinner', { textPosition: 'right' });

    expect(checkSpinnerHasClass(element, 'text-right')).toBe(true);

    await setProperties(page, 'bq-spinner', { textPosition: 'none' });
    const spinnerText = await page.find('bq-spinner >>> .bq-spinner--text');

    expect(checkSpinnerHasClass(element, 'text-none')).toBe(true);
    expect(spinnerText).toBeNull();
  });

  it('should render icon slot element', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner><bq-icon name="spinner-gap" slot="icon"></bq-icon></bq-spinner>');
    const spinnerIcon = await page.find('bq-spinner >>> .bq-spinner--icon');

    const iconSlotElements = await page.$eval('bq-spinner', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="icon"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true });

      return assignedElements;
    });

    expect(spinnerIcon.classList.contains('hidden')).toBe(false);
    expect(iconSlotElements.length).toBe(1);
  });

  it('should handle invalid properties', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner></bq-spinner>');

    const console: jest.Mock<void, string[]> = jest.fn();
    page.on('console', (message) => console(message.type(), message.text()));

    // @ts-expect-error we're testing that component is handling invalid properties
    expect(await setProperties(page, 'bq-spinner', { size: 'invalid', textPosition: 'invalid' })).toEqual({
      size: 'medium',
      textPosition: 'none',
    });

    expect(console).toHaveBeenCalledTimes(2);
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-SPINNER] Please notice that "size" should be one of small|medium|large',
    );
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-SPINNER] Please notice that "textPosition" should be one of none|left|right|above|bellow',
    );
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-spinner size="small" text-position="bellow"></bq-spinner>
      <bq-spinner size="medium" text-position="bellow"></bq-spinner>
      <bq-spinner size="large" text-position="bellow"></bq-spinner>
    `);

    const getLineHeightValue = (fontSize: string): string => {
      return `${(150 * parseInt(fontSize)) / 100}px`;
    };

    const sizeStyleProps = ['width', 'height'] as const;

    const smallStyle = await computedStyle(page, 'bq-spinner[size="small"] >>> .bq-spinner--loader', sizeStyleProps);
    const mediumStyle = await computedStyle(page, 'bq-spinner[size="medium"] >>> .bq-spinner--loader', sizeStyleProps);
    const largeStyle = await computedStyle(page, 'bq-spinner[size="large"] >>> .bq-spinner--loader', sizeStyleProps);

    const textStyleProps = ['fontSize', 'fontWeight', 'lineHeight'] as const;

    const smallTextStyle = await computedStyle(page, 'bq-spinner[size="small"] >>> .bq-spinner--text', textStyleProps);
    const mediumTextStyle = await computedStyle(
      page,
      'bq-spinner[size="medium"] >>> .bq-spinner--text',
      textStyleProps,
    );
    const largeTextStyle = await computedStyle(page, 'bq-spinner[size="large"] >>> .bq-spinner--text', textStyleProps);

    expect(smallStyle).toEqual({ width: '32px', height: '32px' });
    expect(mediumStyle).toEqual({ width: '48px', height: '48px' });
    expect(largeStyle).toEqual({ width: '56px', height: '56px' });

    const textStyleExpected = {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: getLineHeightValue(smallTextStyle.fontSize),
    };

    expect(smallTextStyle).toEqual(textStyleExpected);
    expect(mediumTextStyle).toEqual(textStyleExpected);
    expect(largeTextStyle).toEqual(textStyleExpected);
  });
});
