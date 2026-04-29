import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

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
});
