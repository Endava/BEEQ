import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils';

describe('bq-tag', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-tag></bq-tag>',
    });
    const element = await page.find('bq-tag');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-tag></bq-tag>',
    });
    const element = await page.find('bq-tag');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render as hidden', async () => {
    const page = await newE2EPage({
      html: `<bq-tag removable hidden></bq-tag>`,
    });

    const element = await page.find('bq-tag');
    expect(element).toEqualAttribute('aria-hidden', 'true');
  });

  it('should render as hidden with `hidden="true"`', async () => {
    const page = await newE2EPage({
      html: `<bq-tag removable hidden="true"></bq-tag>`,
    });

    const element = await page.find('bq-tag');
    expect(element).toEqualAttribute('aria-hidden', 'true');
  });

  it('should render as open', async () => {
    const page = await newE2EPage({
      html: `<bq-tag></bq-tag>`,
    });

    const element = await page.find('bq-tag');
    expect(element).toEqualAttribute('aria-hidden', 'false');
    expect(element).not.toHaveClass('is-hidden');
  });

  it('should render as open with `hidden="false"`', async () => {
    const page = await newE2EPage({
      html: `<bq-tag hidden="false"></bq-tag>`,
    });

    const element = await page.find('bq-tag');
    expect(element).toEqualAttribute('aria-hidden', 'false');
    expect(element).not.toHaveClass('is-hidden');
  });

  it('should render a removable tag component', async () => {
    const page = await newE2EPage({
      html: `<bq-tag removable>Tag</bq-tag>`,
    });

    const element = await page.find('bq-tag >>> bq-icon[name="x-circle"]');
    expect(element).not.toBeNull();
  });

  it('should render a basic tag without icon', async () => {
    const page = await newE2EPage({
      html: `<bq-tag>Tag</bq-tag>`,
    });

    const element = await page.find('bq-tag >>> slot');

    expect(element).not.toBeNull();
  });

  it('should render a tag with a prefix (icon)', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tag>
          <span slot="prefix">
            <bq-icon name="star"></bq-icon>
          </span>
          Tag
        </bq-tag>
      `,
    });

    const prefixSlot = await page.find('bq-tag >>> slot[name="prefix"]');
    expect(prefixSlot).not.toBeNull();
  });

  it('should respect design style', async () => {
    const page = await newE2EPage({
      html: `
        <bq-tag size="xsmall">Tag</tag>
        <bq-tag size="small">Tag</tag>
        <bq-tag size="medium">Tag</tag>
      `,
    });

    const styleProps = ['padding'] as const;

    const extra_smallStyle = await computedStyle(page, 'bq-tag[size="xsmall"] >>> [part="wrapper"]', styleProps);
    const smallStyle = await computedStyle(page, 'bq-tag[size="small"] >>> [part="wrapper"]', styleProps);
    const mediumStyle = await computedStyle(page, 'bq-tag[size="medium"] >>> [part="wrapper"]', styleProps);

    expect(extra_smallStyle).toEqual({ padding: '2px 8px' });
    expect(smallStyle).toEqual({ padding: '2px 8px' });
    expect(mediumStyle).toEqual({ padding: '4px 12px' });
  });
});
