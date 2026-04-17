import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

describe('bq-tag', () => {
  it('should render', async () => {
    const { root } = await render(<bq-tag />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-tag />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render as hidden', async () => {
    const { root } = await render(<bq-tag removable hidden />);

    expect(root.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render as hidden with `hidden="true"`', async () => {
    const { root } = await render(<bq-tag removable hidden={true} />);

    expect(root.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render as open', async () => {
    const { root } = await render(<bq-tag />);

    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.classList.contains('is-hidden')).toBe(false);
  });

  it('should render as open with `hidden="false"`', async () => {
    const { root } = await render(<bq-tag hidden={false} />);

    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.classList.contains('is-hidden')).toBe(false);
  });

  it('should render a removable tag component', async () => {
    const { root } = await render(<bq-tag removable>Tag</bq-tag>);
    const closeIcon = root.shadowRoot.querySelector('bq-icon[name="x-circle"]');

    expect(closeIcon).not.toBeNull();
  });

  it('should render a basic tag without icon', async () => {
    const { root } = await render(<bq-tag>Tag</bq-tag>);
    const slot = root.shadowRoot.querySelector('slot:not([name])');

    expect(slot).not.toBeNull();
  });

  it('should render a tag with a prefix (icon)', async () => {
    const { root } = await render(
      <bq-tag>
        <bq-icon name="star" slot="prefix" />
        Tag
      </bq-tag>,
    );
    const prefixSlot = root.shadowRoot.querySelector('slot[name="prefix"]');

    expect(prefixSlot).not.toBeNull();
  });

  it('should hide when the close button is clicked', async () => {
    const { root, waitForChanges } = await render(<bq-tag removable>Tag</bq-tag>);
    const closeBtn = root.shadowRoot.querySelector<HTMLElement>('.bq-tag__close');

    await userEvent.click(closeBtn);
    await waitForChanges();

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.hasAttribute('hidden')).toBe(true);
  });

  it('should emit bqClose when close button is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-tag removable>Tag</bq-tag>);
    const bqClose = spyOnEvent('bqClose');
    const closeBtn = root.shadowRoot.querySelector<HTMLElement>('.bq-tag__close');

    await userEvent.click(closeBtn);
    await waitForChanges();

    expect(bqClose).toHaveReceivedEventTimes(1);
  });

  it('should not hide when bqClose is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-tag removable>Tag</bq-tag>);
    root.addEventListener('bqClose', (e: Event) => e.preventDefault(), { once: true });
    const closeBtn = root.shadowRoot.querySelector<HTMLElement>('.bq-tag__close');

    await userEvent.click(closeBtn);
    await waitForChanges();

    expect(root.getAttribute('aria-hidden')).toBe('false');
  });

  it('should show and hide via public methods', async () => {
    const { root, waitForChanges } = await render(<bq-tag removable>Tag</bq-tag>);
    const tag = root as HTMLBqTagElement;

    await tag.hide();
    await waitForChanges();
    expect(root.getAttribute('aria-hidden')).toBe('true');

    await tag.show();
    await waitForChanges();
    expect(root.getAttribute('aria-hidden')).toBe('false');
  });

  it('should emit bqOpen when show() is called', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-tag removable hidden>
        Tag
      </bq-tag>,
    );
    const bqOpen = spyOnEvent('bqOpen');

    await (root as HTMLBqTagElement).show();
    await waitForChanges();

    expect(bqOpen).toHaveReceivedEventTimes(1);
  });

  it('should toggle selected state when clickable tag is clicked', async () => {
    const { root, waitForChanges } = await render(<bq-tag clickable>Tag</bq-tag>);
    const tag = root as HTMLBqTagElement;
    const wrapper = root.shadowRoot.querySelector('[part="wrapper"]');

    expect(wrapper).not.toHaveClass('active');

    await userEvent.click(wrapper);
    await waitForChanges();
    expect(tag.selected).toBe(true);
    expect(wrapper).toHaveClass('active');

    await userEvent.click(wrapper);
    await waitForChanges();
    expect(tag.selected).toBe(false);
    expect(wrapper).not.toHaveClass('active');
  });

  it('should emit bqClick when clickable tag is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-tag clickable>Tag</bq-tag>);
    const bqClick = spyOnEvent('bqClick');
    const wrapper = root.shadowRoot.querySelector('[part="wrapper"]');

    await userEvent.click(wrapper);
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should not toggle when clickable tag is disabled', async () => {
    const { root, waitForChanges } = await render(
      <bq-tag clickable disabled>
        Tag
      </bq-tag>,
    );
    const wrapper = root.shadowRoot.querySelector<HTMLButtonElement>('[part="wrapper"]');

    expect(wrapper.disabled).toBe(true);
    expect((root as HTMLBqTagElement).selected).toBe(false);

    // userEvent.click refuses to click a disabled button (Playwright actionability check).
    // Dispatch natively to verify the component's own guard (not the browser's).
    wrapper.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect((root as HTMLBqTagElement).selected).toBe(false);
  });

  it('should render as a button element when clickable', async () => {
    const { root } = await render(<bq-tag clickable>Tag</bq-tag>);
    const wrapper = root.shadowRoot.querySelector('[part="wrapper"]');

    expect(wrapper.tagName.toLowerCase()).toBe('button');
  });

  it('should render as a div element when not clickable', async () => {
    const { root } = await render(<bq-tag>Tag</bq-tag>);
    const wrapper = root.shadowRoot.querySelector('[part="wrapper"]');

    expect(wrapper.tagName.toLowerCase()).toBe('div');
  });

  it('should respect design style', async () => {
    await render(
      <div>
        <bq-tag size="xsmall">Tag</bq-tag>
        <bq-tag size="small">Tag</bq-tag>
        <bq-tag size="medium">Tag</bq-tag>
      </div>,
    );

    const styleProps = ['padding'] as const;

    // We need to subtract 1px from the padding because of the border
    // that is added to the tag component, in design the paddings are as follows:
    // - xsmall: 2px 8px
    // - small: 2px 8px
    // - medium: 4px 12px
    const xsmallStyle = computedStyle('bq-tag[size="xsmall"] >>> [part="wrapper"]', styleProps);
    const smallStyle = computedStyle('bq-tag[size="small"] >>> [part="wrapper"]', styleProps);
    const mediumStyle = computedStyle('bq-tag[size="medium"] >>> [part="wrapper"]', styleProps);

    expect(xsmallStyle).toEqual({ padding: '1px 7px' });
    expect(smallStyle).toEqual({ padding: '1px 7px' });
    expect(mediumStyle).toEqual({ padding: '3px 11px' });
  });
});
