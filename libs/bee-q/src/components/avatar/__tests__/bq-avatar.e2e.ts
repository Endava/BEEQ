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

    const styleProps = ['width', 'borderRadius', 'height'] as const;

    const circleStyle = await computedStyle(page, 'bq-avatar[shape="circle"] >>> [part="base"]', styleProps);
    const xmallSquareStyle = await computedStyle(
      page,
      'bq-avatar[shape="square"][size="xsmall"] >>> [part="base"]',
      styleProps,
    );
    const smallSquareStyle = await computedStyle(
      page,
      'bq-avatar[shape="square"][size="small"] >>> [part="base"]',
      styleProps,
    );
    const mediumSquareStyle = await computedStyle(
      page,
      'bq-avatar[shape="square"][size="medium"] >>> [part="base"]',
      styleProps,
    );
    const largeSquareStyle = await computedStyle(
      page,
      'bq-avatar[shape="square"][size="large"] >>> [part="base"]',
      styleProps,
    );

    expect(circleStyle).toEqual({ borderRadius: '9999px', height: '24px', width: '24px' });
    expect(xmallSquareStyle).toEqual({ borderRadius: '4px', height: '24px', width: '24px' });
    expect(smallSquareStyle).toEqual({ borderRadius: '8px', height: '32px', width: '32px' });
    expect(mediumSquareStyle).toEqual({ borderRadius: '12px', height: '48px', width: '48px' });
    expect(largeSquareStyle).toEqual({ borderRadius: '12px', height: '64px', width: '64px' });
  });
});
