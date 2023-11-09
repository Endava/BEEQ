import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils';

describe('bq-badge', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-badge></bq-badge>',
    });
    const element = await page.find('bq-badge');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-badge></bq-badge>',
    });
    const element = await page.find('bq-badge');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should have small size', async () => {
    const page = await newE2EPage({
      html: '<bq-badge></bq-badge>',
    });
    const styleProps = ['height', 'width'] as const;
    const badge = await computedStyle(page, 'bq-badge >>> .bq-badge', styleProps);
    const shadowDOMElem = await page.find('bq-badge >>> .bq-badge');

    expect(shadowDOMElem).toHaveClass('size--small');
    expect(badge).toEqual({ height: '8px', width: '8px' });
  });

  it('should have medium size', async () => {
    const page = await newE2EPage({
      html: '<bq-badge size="medium"></bq-badge>',
    });
    const styleProps = ['height', 'width'] as const;
    const badge = await computedStyle(page, 'bq-badge >>> .bq-badge', styleProps);
    const shadowDOMElem = await page.find('bq-badge >>> .bq-badge');

    expect(shadowDOMElem).toHaveClass('size--medium');
    expect(badge).toEqual({ height: '12px', width: '12px' });
  });

  it('should render a number', async () => {
    const page = await newE2EPage({
      html: '<bq-badge>2</bq-badge>',
    });
    const element = await page.find('bq-badge >>> .bq-badge');
    const shadowDOMElem = await element.find('span');

    expect(element).toHaveClass('digit');
    expect(shadowDOMElem).not.toBeNull();
  });
});
