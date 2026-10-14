import { h } from '@stencil/core';
import { beforeEach, describe, expect, it, render } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

const resolveColor = (value: string): string => {
  const probe = document.createElement('div');
  probe.style.color = value;
  document.body.appendChild(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
};

const getWrapper = (tag: HTMLElement): HTMLElement => tag.shadowRoot.querySelector('[part="wrapper"]');

// Hover/click tests leave the Playwright cursor where they finished, so a freshly rendered element can
// render under it and pick up `:hover` styles. Before each test, park the cursor in the bottom-right corner
// of the top-level page (CDP coordinates), which lies outside the scaled test iframe.
const movePointerOff = () =>
  cdp().send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: window.top.innerWidth - 1,
    y: window.top.innerHeight - 1,
  });

beforeEach(async () => {
  await movePointerOff();
});

describe('bq-tag', () => {
  it('should render', async () => {
    const { root } = await render(<bq-tag />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-tag />);

    expect(root).toHaveShadowRoot();
  });

  it('should render as hidden', async () => {
    const { root } = await render(<bq-tag removable hidden />);

    expect(root).toEqualAttribute('aria-hidden', 'true');
  });

  it('should render as hidden with `hidden="true"`', async () => {
    const { root } = await render(<bq-tag removable hidden={true} />);

    expect(root).toEqualAttribute('aria-hidden', 'true');
  });

  it('should render as open', async () => {
    const { root } = await render(<bq-tag />);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveClass('is-hidden');
  });

  it('should render as open with `hidden="false"`', async () => {
    const { root } = await render(<bq-tag hidden={false} />);

    expect(root).toEqualAttribute('aria-hidden', 'false');
    expect(root).not.toHaveClass('is-hidden');
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

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('hidden');
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

    expect(root).toEqualAttribute('aria-hidden', 'false');
  });

  it('should show and hide via public methods', async () => {
    const { root, waitForChanges } = await render(<bq-tag removable>Tag</bq-tag>);
    const tag = root as HTMLBqTagElement;

    await tag.hide();
    await waitForChanges();
    expect(root).toEqualAttribute('aria-hidden', 'true');

    await tag.show();
    await waitForChanges();
    expect(root).toEqualAttribute('aria-hidden', 'false');
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
    const tag = root as HTMLBqTagElement;
    const wrapper = tag.shadowRoot.querySelector<HTMLButtonElement>('[part="wrapper"]');

    expect(wrapper.disabled).toBe(true);
    expect(tag.selected).toBe(false);

    // userEvent.click refuses to click a disabled button (Playwright actionability check).
    // Dispatch natively to verify the component's own guard (not the browser's).
    wrapper.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(tag.selected).toBe(false);
  });

  it('should render as a button element when clickable', async () => {
    const { root } = await render(<bq-tag clickable>Tag</bq-tag>);
    const tag = root as HTMLBqTagElement;

    const wrapper = tag.shadowRoot.querySelector('[part="wrapper"]');
    expect(wrapper.tagName.toLowerCase()).toBe('button');
  });

  it('should render as a div element when not clickable', async () => {
    const { root } = await render(<bq-tag>Tag</bq-tag>);
    const tag = root as HTMLBqTagElement;

    const wrapper = tag.shadowRoot.querySelector('[part="wrapper"]');
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

  it('should use info tokens (not brand) for the info color', async () => {
    await render(
      <div>
        <bq-tag color="info" variant="filled">
          Filled
        </bq-tag>
        <bq-tag color="info" variant="outline">
          Outline
        </bq-tag>
      </div>,
    );

    const filled = getWrapper(document.querySelector('bq-tag[variant="filled"]'));
    const outline = getWrapper(document.querySelector('bq-tag[variant="outline"]'));

    await expect.poll(() => getComputedStyle(filled).backgroundColor).toBe(resolveColor('var(--bq-ui--info)'));
    expect(getComputedStyle(filled).color).toBe(resolveColor('var(--bq-text--on-info)'));
    expect(getComputedStyle(filled).backgroundColor).not.toBe(resolveColor('var(--bq-ui--brand)'));

    await expect.poll(() => getComputedStyle(outline).backgroundColor).toBe(resolveColor('var(--bq-ui--info-alt)'));
    expect(getComputedStyle(outline).color).toBe(resolveColor('var(--bq-text--info)'));
    expect(getComputedStyle(outline).borderTopColor).toBe(resolveColor('var(--bq-stroke--info)'));
    expect(getComputedStyle(outline).color).not.toBe(resolveColor('var(--bq-text--brand)'));
  });

  it('should apply the success border color for the outline variant', async () => {
    const { root } = await render(
      <bq-tag color="success" variant="outline">
        Success
      </bq-tag>,
    );

    const wrapper = getWrapper(root);

    await expect.poll(() => getComputedStyle(wrapper).borderTopColor).toBe(resolveColor('var(--bq-stroke--success)'));
    expect(getComputedStyle(wrapper).color).toBe(resolveColor('var(--bq-text--success)'));
  });

  it('should use inverse tokens for the gray filled variant', async () => {
    const { root } = await render(
      <bq-tag color="gray" variant="filled">
        Gray
      </bq-tag>,
    );

    const wrapper = getWrapper(root);

    await expect.poll(() => getComputedStyle(wrapper).backgroundColor).toBe(resolveColor('var(--bq-ui--inverse)'));
    expect(getComputedStyle(wrapper).color).toBe(resolveColor('var(--bq-text--inverse)'));
  });

  it('should use the selected color variables when clickable and selected', async () => {
    const { root } = await render(
      <bq-tag clickable selected>
        Selected
      </bq-tag>,
    );

    const wrapper = getWrapper(root);

    await expect.poll(() => getComputedStyle(wrapper).backgroundColor).toBe(resolveColor('var(--bq-ui--brand)'));
    expect(getComputedStyle(wrapper).color).toBe(resolveColor('var(--bq-text--on-brand)'));
  });

  it('should map the default text color variable to text--primary', async () => {
    const { root } = await render(<bq-tag>Tag</bq-tag>);

    expect(resolveColor(getComputedStyle(root).getPropertyValue('--bq-tag--text-color'))).toBe(
      resolveColor('var(--bq-text--primary)'),
    );
    expect(getComputedStyle(getWrapper(root)).color).toBe(resolveColor('var(--bq-text--primary)'));
  });

  it('should set the tag text color variable (not the global token) for custom colors', async () => {
    const { root } = await render(<bq-tag color={'#ff0000' as HTMLBqTagElement['color']}>Custom</bq-tag>);

    expect(root.style.getPropertyValue('--bq-tag--background-color')).toBe('#ff0000');
    expect(root.style.getPropertyValue('--bq-tag--text-color')).toBe('var(--bq-text--alt)');
    expect(root.style.getPropertyValue('--bq-text--primary')).toBe('');
  });

  it('should color the close icon with the tag text color', async () => {
    const { root } = await render(
      <bq-tag color="info" variant="filled" removable>
        Removable
      </bq-tag>,
    );

    const icon = root.shadowRoot.querySelector<HTMLElement>('.bq-tag__close bq-icon');

    expect(resolveColor(getComputedStyle(icon).getPropertyValue('--bq-icon--color'))).toBe(
      resolveColor('var(--bq-text--on-info)'),
    );
  });
});
