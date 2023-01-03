import { newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

describe('bq-avatar', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-avatar></bq-avatar>');

    const element = await page.find('bq-avatar');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-avatar></bq-avatar>');

    const element = await page.find('bq-avatar');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render initials', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-avatar initials="JS"></bq-avatar>');

    const element = await page.find('bq-avatar >>> [part="text"]');

    expect(element).toEqualText('JS');
  });

  it('should render image', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-avatar image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"></bq-avatar>',
    );

    const element = await page.find('bq-avatar >>> [part="img"]');

    expect(element).toBeDefined();
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent(
      `
      <bq-avatar initials="JS" shape="circle" size="xsmall"></bq-avatar>
      <bq-avatar initials="JS" shape="square" size="xsmall"></bq-avatar>
      <bq-avatar initials="JS" shape="square" size="small"></bq-avatar>
      <bq-avatar initials="JS" shape="square" size="medium"></bq-avatar>
      <bq-avatar initials="JS" shape="square" size="large"></bq-avatar>
      `,
    );

    const circleStyle = await computedStyle(page, 'bq-avatar[shape="circle"] >>> [part="base"]');
    const xmallSquareStyle = await computedStyle(page, 'bq-avatar[shape="square"][size="xsmall"] >>> [part="base"]');
    const smallSquareStyle = await computedStyle(page, 'bq-avatar[shape="square"][size="small"] >>> [part="base"]');
    const mediumSquareStyle = await computedStyle(page, 'bq-avatar[shape="square"][size="medium"] >>> [part="base"]');
    const largeSquareStyle = await computedStyle(page, 'bq-avatar[shape="square"][size="large"] >>> [part="base"]');

    expect(circleStyle.borderRadius).toBe('9999px');
    expect(circleStyle.height).toBe('24px');
    expect(circleStyle.width).toBe('24px');

    expect(xmallSquareStyle.borderRadius).toBe('4px');
    expect(xmallSquareStyle.height).toBe('24px');
    expect(xmallSquareStyle.width).toBe('24px');

    expect(smallSquareStyle.borderRadius).toBe('8px');
    expect(smallSquareStyle.height).toBe('32px');
    expect(smallSquareStyle.width).toBe('32px');

    expect(mediumSquareStyle.borderRadius).toBe('12px');
    expect(mediumSquareStyle.height).toBe('48px');
    expect(mediumSquareStyle.width).toBe('48px');

    expect(largeSquareStyle.borderRadius).toBe('12px');
    expect(largeSquareStyle.height).toBe('64px');
    expect(largeSquareStyle.width).toBe('64px');
  });
});
