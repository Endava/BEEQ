import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import { getTextContent } from '../../../shared/utils/slot';

describe('bq-option-group', () => {
  it('should render', async () => {
    const { root } = await render(<bq-option-group />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-option-group />);

    expect(root).toHaveShadowRoot();
  });

  it('should render prefix element', async () => {
    const { root } = await render(
      <bq-option-group>
        <span slot="header-prefix">Prefix text</span>
        <span slot="header-label">Food</span>
        <bq-option value="pizza">
          <bq-icon name="pizza" size="16" slot="prefix"></bq-icon>
          <span>Pizza</span>
        </bq-option>
      </bq-option-group>,
    );

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="header-prefix"]');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Prefix text');
  });

  it('should render suffix element', async () => {
    const { root } = await render(
      <bq-option-group>
        <span slot="header-label">Food</span>
        <span slot="header-suffix">Suffix text</span>
        <bq-option value="pizza">
          <bq-icon name="pizza" size="16" slot="prefix"></bq-icon>
          <span>Pizza</span>
        </bq-option>
      </bq-option-group>,
    );

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="header-suffix"]');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Suffix text');
  });

  it('should render label text', async () => {
    const { root } = await render(
      <bq-option-group>
        <bq-icon name="fork-knife" size="16" slot="header-prefix"></bq-icon>
        <span slot="header-label">Food</span>
        <bq-option value="pizza">
          <bq-icon name="pizza" size="16" slot="prefix"></bq-icon>
          <span>Pizza</span>
        </bq-option>
      </bq-option-group>,
    );

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="header-label"]');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Food');
  });

  it('should render default slot with option items', async () => {
    const { root } = await render(
      <bq-option-group>
        <span slot="header-label">Food</span>
        <bq-option value="pizza">Pizza</bq-option>
        <bq-option value="burger">Burger</bq-option>
      </bq-option-group>,
    );

    const defaultSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    const assignedElements = defaultSlot?.assignedElements({ flatten: true });

    expect(assignedElements?.length).toBe(2);
  });

  it('should have group role and aria-label on the container', async () => {
    const { root } = await render(<bq-option-group />);

    const container = root.shadowRoot?.querySelector<HTMLElement>('.bq-option-group__container');

    expect(container).toEqualAttribute('role', 'group');
    expect(container).toEqualAttribute('aria-label', 'Options');
  });

  it('should use the public background color variable', async () => {
    const { root } = await render(
      <bq-option-group>
        <span slot="header-label">Food</span>
        <bq-option value="pizza">Pizza</bq-option>
      </bq-option-group>,
    );

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-option-group--background').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--primary').trim(),
    );

    root.style.setProperty('--bq-option-group--background', 'rgb(12, 34, 56)');

    const wrapper = root.shadowRoot?.querySelector<HTMLElement>('.bq-option-group');
    const header = root.shadowRoot?.querySelector<HTMLElement>('.bq-option-group__header');
    const expectedColor = resolveColorToken('--bq-option-group--background', root);

    expect(getComputedStyle(wrapper).backgroundColor).toBe(expectedColor);
    expect(getComputedStyle(header).backgroundColor).toBe(expectedColor);
    expect(wrapper).toHaveClass('bq-option-group');
  });

  it('should use the public logical header padding variables', async () => {
    const { root } = await render(
      <bq-option-group>
        <span slot="header-label">Food</span>
      </bq-option-group>,
    );

    root.style.setProperty('--bq-option-group--label-padding-start', '3px');
    root.style.setProperty('--bq-option-group--label-padding-end', '7px');

    const header = root.shadowRoot?.querySelector<HTMLElement>('.bq-option-group__header');
    const headerStyle = getComputedStyle(header);

    expect(headerStyle.paddingInlineStart).toBe('3px');
    expect(headerStyle.paddingInlineEnd).toBe('7px');

    root.dir = 'rtl';

    const rtlHeaderStyle = getComputedStyle(header);

    expect(rtlHeaderStyle.paddingRight).toBe('3px');
    expect(rtlHeaderStyle.paddingLeft).toBe('7px');
  });
});
