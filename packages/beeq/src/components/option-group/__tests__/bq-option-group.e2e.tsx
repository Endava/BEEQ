import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { aw } from 'node_modules/vitest/dist/chunks/reporters.d.BwkR0iL5';

describe('bq-option-group', () => {
  it('should render', async () => {
    const { root } = await render(<bq-option-group />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-option-group />);

    expect(root.shadowRoot).not.toBeNull();
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

    const slotElement = root.shadowRoot?.querySelector('slot[name="header-prefix"]') as HTMLSlotElement | null;

    const assignedElement = slotElement?.assignedElements({ flatten: true })[0];
    const prefixText = assignedElement?.textContent?.trim();

    expect(prefixText).toBe('Prefix text');
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

    const slotElement = root.shadowRoot?.querySelector('slot[name="header-suffix"]') as HTMLSlotElement | null;

    const assignedElement = slotElement?.assignedElements({ flatten: true })[0];
    const suffixText = assignedElement?.textContent?.trim();

    expect(suffixText).toBe('Suffix text');
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

    const slotElement = root.shadowRoot?.querySelector('slot[name="header-label"]') as HTMLSlotElement | null;

    const assignedElement = slotElement?.assignedElements({ flatten: true })[0];
    const suffixText = assignedElement?.textContent?.trim();

    expect(suffixText).toBe('Food');
  });
});
