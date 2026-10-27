import { h } from '@stencil/core';
import { beforeEach, describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';

const getWrapper = (tag: HTMLElement): HTMLElement => tag.shadowRoot.querySelector('[part="wrapper"]');

const resolveRadius = (name: string, scope: HTMLElement): string => {
  const probe = document.createElement('span');
  probe.style.borderRadius = `var(${name})`;
  scope.appendChild(probe);
  try {
    return getComputedStyle(probe).borderRadius;
  } finally {
    probe.remove();
  }
};

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

  it('should render the close icon with alt text color for custom color removable tags', async () => {
    const customColor = '#ff5733' as HTMLBqTagElement['color'];
    const { root } = await render(
      <bq-tag color={customColor} removable>
        Tag
      </bq-tag>,
    );
    const closeIcon = root.shadowRoot.querySelector('bq-icon[name="x-circle"]');

    await waitForStable(root);
    const iconBase = closeIcon.shadowRoot.querySelector<HTMLElement>('[part="base"]');
    expect(getComputedStyle(iconBase).color).toBe(resolveColorToken('--bq-text--alt', root));
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

    expect(tag).not.toHaveAttribute('selected');

    await userEvent.click(wrapper);
    await waitForChanges();
    expect(tag.selected).toBe(true);
    expect(tag).toHaveAttribute('selected');

    await userEvent.click(wrapper);
    await waitForChanges();
    expect(tag.selected).toBe(false);
    expect(tag).not.toHaveAttribute('selected');
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
    const { root } = await render(
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

    await expect.poll(() => getComputedStyle(filled).backgroundColor).toBe(resolveColorToken('--bq-ui--info', root));
    expect(getComputedStyle(filled).color).toBe(resolveColorToken('--bq-text--on-info', root));
    expect(getComputedStyle(filled).backgroundColor).not.toBe(resolveColorToken('--bq-ui--brand', root));

    await expect
      .poll(() => getComputedStyle(outline).backgroundColor)
      .toBe(resolveColorToken('--bq-ui--info-alt', root));
    expect(getComputedStyle(outline).color).toBe(resolveColorToken('--bq-text--info', root));
    expect(getComputedStyle(outline).borderTopColor).toBe(resolveColorToken('--bq-stroke--info', root));
    expect(getComputedStyle(outline).color).not.toBe(resolveColorToken('--bq-text--brand', root));
  });

  it('should apply the success border color for the outline variant', async () => {
    const { root } = await render(
      <bq-tag color="success" variant="outline">
        Success
      </bq-tag>,
    );

    const wrapper = getWrapper(root);

    await expect
      .poll(() => getComputedStyle(wrapper).borderTopColor)
      .toBe(resolveColorToken('--bq-stroke--success', root));
    expect(getComputedStyle(wrapper).color).toBe(resolveColorToken('--bq-text--success', root));
  });

  it('should use inverse tokens for the gray filled variant', async () => {
    const { root } = await render(
      <bq-tag color="gray" variant="filled">
        Gray
      </bq-tag>,
    );

    const wrapper = getWrapper(root);

    await expect
      .poll(() => getComputedStyle(wrapper).backgroundColor)
      .toBe(resolveColorToken('--bq-ui--inverse', root));
    expect(getComputedStyle(wrapper).color).toBe(resolveColorToken('--bq-text--inverse', root));
  });

  it('should use the selected color variables when clickable and selected', async () => {
    const { root } = await render(
      <bq-tag clickable selected>
        Selected
      </bq-tag>,
    );

    const wrapper = getWrapper(root);

    await expect.poll(() => getComputedStyle(wrapper).backgroundColor).toBe(resolveColorToken('--bq-ui--brand', root));
    expect(getComputedStyle(wrapper).color).toBe(resolveColorToken('--bq-text--on-brand', root));
  });

  it('should map the default text color variable to text--primary', async () => {
    const { root } = await render(<bq-tag>Tag</bq-tag>);

    expect(resolveColorToken('--bq-tag--text-color', root)).toBe(resolveColorToken('--bq-text--primary', root));
    expect(getComputedStyle(getWrapper(root)).color).toBe(resolveColorToken('--bq-text--primary', root));
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

    await waitForStable(root);
    const iconBase = icon.shadowRoot.querySelector<HTMLElement>('[part="base"]');
    expect(getComputedStyle(iconBase).color).toBe(resolveColorToken('--bq-text--on-info', root));
  });

  it('should apply public background, text and radius overrides', async () => {
    const { root } = await render(<bq-tag>Customised</bq-tag>);
    root.style.setProperty('--bq-tag--background-color', '#123456');
    root.style.setProperty('--bq-tag--text-color', '#fedcba');
    root.style.setProperty('--bq-tag--border-radius', '13px');
    const wrapper = getWrapper(root);

    await expect
      .poll(() => getComputedStyle(wrapper).backgroundColor)
      .toBe(resolveColorToken('--bq-tag--background-color', root));
    expect(getComputedStyle(wrapper).color).toBe(resolveColorToken('--bq-tag--text-color', root));
    expect(getComputedStyle(wrapper).borderRadius).toBe('13px');
  });

  it('should apply public selected background and text overrides', async () => {
    const { root } = await render(
      <bq-tag clickable selected>
        Selected
      </bq-tag>,
    );
    root.style.setProperty('--bq-tag--background-selected', '#123456');
    root.style.setProperty('--bq-tag--text-selected', '#fedcba');
    const wrapper = getWrapper(root);

    await expect
      .poll(() => getComputedStyle(wrapper).backgroundColor)
      .toBe(resolveColorToken('--bq-tag--background-selected', root));
    expect(getComputedStyle(wrapper).color).toBe(resolveColorToken('--bq-tag--text-selected', root));
  });

  it.each(['small', 'xsmall'] as const)(
    'should restore the %s radius after an explicit border is removed',
    async (size) => {
      const { root, setProps, waitForChanges } = await render(<bq-tag size={size}>Tag</bq-tag>);
      const wrapper = getWrapper(root);
      const smallRadius = resolveRadius('--bq-tag--small-border-radius', root);
      expect(getComputedStyle(wrapper).borderRadius).toBe(smallRadius);

      await setProps({ border: 'l' });
      await waitForChanges();
      await waitForStable(root);
      expect(root.style.getPropertyValue('--bq-tag--border-radius')).toBe('var(--bq-radius--l)');
      expect(getComputedStyle(wrapper).borderRadius).toBe(resolveRadius('--bq-radius--l', root));

      await setProps({ border: undefined });
      await waitForChanges();
      await waitForStable(root);
      expect(root.style.getPropertyValue('--bq-tag--border-radius')).toBe('');
      expect(getComputedStyle(wrapper).borderRadius).toBe(smallRadius);
    },
  );

  it('should clear custom colour mappings when the colour changes to info or is removed', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-tag color={'#ff0000' as HTMLBqTagElement['color']}>Tag</bq-tag>,
    );
    const wrapper = getWrapper(root);
    await expect
      .poll(() => getComputedStyle(wrapper).backgroundColor)
      .toBe(resolveColorToken('--bq-tag--background-color', root));
    expect(getComputedStyle(wrapper).color).toBe(resolveColorToken('--bq-text--alt', root));

    await setProps({ color: 'info' });
    await waitForChanges();
    await waitForStable(root);
    expect(root.style.getPropertyValue('--bq-tag--background-color')).toBe('');
    expect(root.style.getPropertyValue('--bq-tag--text-color')).toBe('');
    await expect.poll(() => getComputedStyle(wrapper).backgroundColor).toBe(resolveColorToken('--bq-ui--info', root));
    expect(getComputedStyle(wrapper).color).toBe(resolveColorToken('--bq-text--on-info', root));

    await setProps({ color: undefined });
    await waitForChanges();
    await waitForStable(root);
    await expect
      .poll(() => getComputedStyle(wrapper).backgroundColor)
      .toBe(resolveColorToken('--bq-ui--secondary', root));
    expect(getComputedStyle(wrapper).color).toBe(resolveColorToken('--bq-text--primary', root));
  });

  it('should restore medium sizing when size is removed', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-tag size="small">
        <bq-icon name="star" slot="prefix" />
        Tag
      </bq-tag>,
    );
    const icon = root.querySelector('bq-icon');
    await waitForStable(root);
    const iconBase = icon.shadowRoot.querySelector<HTMLElement>('[part="base"]');
    expect(root.style.getPropertyValue('--bq-tag--icon-prefix-size')).toBe('20px');
    expect(getComputedStyle(iconBase).inlineSize).toBe('20px');

    await setProps({ size: undefined });
    await waitForChanges();
    await waitForStable(root);
    // Prop validation restores the public medium default; the old small mapping must disappear.
    expect(root).toEqualAttribute('size', 'medium');
    expect(root.style.getPropertyValue('--bq-tag--icon-prefix-size')).toBe('24px');
    expect(getComputedStyle(iconBase).inlineSize).toBe('24px');
    expect(getComputedStyle(getWrapper(root)).borderRadius).toBe(resolveRadius('--bq-tag--border-radius', root));
  });
});
