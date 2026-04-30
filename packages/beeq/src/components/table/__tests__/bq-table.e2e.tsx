import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

// Minimal table fixture — reused across tests
const mkTable = (extraTableClass = '', extraRowClass = '') => (
  <table class={`bq-table ${extraTableClass}`.trim()}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr class={extraRowClass || undefined}>
        <td>John Doe</td>
        <td>Active</td>
        <td>100 €</td>
      </tr>
      <tr>
        <td>Alice Smith</td>
        <td>Pending</td>
        <td>200 €</td>
      </tr>
    </tbody>
  </table>
);

describe('bq-table', () => {
  it('should render', async () => {
    const { root } = await render(mkTable());
    expect(root).not.toBeNull();
    expect(root.tagName.toLowerCase()).toBe('table');
    expect(root).toHaveClass('bq-table');
  });

  it('should render thead, tbody, th and td elements', async () => {
    const { root } = await render(mkTable());
    expect(root.querySelector('thead')).not.toBeNull();
    expect(root.querySelector('tbody')).not.toBeNull();
    expect(root.querySelector('th')).not.toBeNull();
    expect(root.querySelector('td')).not.toBeNull();
  });

  it('should apply default cell padding', async () => {
    await render(mkTable());
    const style = computedStyle('table.bq-table td', ['paddingBlock', 'paddingInline']);
    // --bq-table--cell-padding-block / inline: var(--bq-spacing-m) = 16px
    expect(style).toEqual({ paddingBlock: '16px', paddingInline: '16px' });
  });

  it('should apply default header padding', async () => {
    await render(mkTable());
    const style = computedStyle('table.bq-table th', ['paddingBlock', 'paddingInline']);
    // --bq-table--header-padding-block: var(--bq-spacing-xs) = 8px
    // --bq-table--header-padding-inline: var(--bq-spacing-m) = 16px
    expect(style).toEqual({ paddingBlock: '8px', paddingInline: '16px' });
  });

  it('should apply compact cell padding when `.compact` is set', async () => {
    await render(mkTable('compact'));
    const style = computedStyle('table.bq-table.compact td', ['paddingBlock', 'paddingInline']);
    // --bq-table--cell-padding-block / inline: var(--bq-spacing-xs2) = 4px
    expect(style).toEqual({ paddingBlock: '4px', paddingInline: '4px' });
  });

  it('should apply compact header padding when `.compact` is set', async () => {
    await render(mkTable('compact'));
    const style = computedStyle('table.bq-table.compact th', ['paddingBlock', 'paddingInline']);
    // --bq-table--header-padding-block / inline: var(--bq-spacing-xs2) = 4px
    expect(style).toEqual({ paddingBlock: '4px', paddingInline: '4px' });
  });

  it('should apply styles to selected row when `.selected` is set', async () => {
    const { root } = await render(mkTable('', 'selected'));
    expect(root.querySelector('tr.selected')).not.toBeNull();
    // Selected rows have border-block-end-width: 0 set directly in the SCSS (no CSS var dependency)
    const style = computedStyle('table.bq-table tr.selected', ['borderBlockEndWidth']);
    expect(style.borderBlockEndWidth).toBe('0px');
  });

  it('should apply border-separate and border on `.bordered` table', async () => {
    await render(mkTable('bordered'));
    const style = computedStyle('table.bq-table.bordered', ['borderCollapse']);
    expect(style.borderCollapse).toBe('separate');
  });

  it('should apply corner radius to first header cell in `.bordered` table', async () => {
    await render(mkTable('bordered'));
    const style = computedStyle('table.bq-table.bordered thead th:first-child', ['borderStartStartRadius']);
    // --bq-table--border-radius: var(--bq-radius--m) = 8px
    expect(parseFloat(style.borderStartStartRadius)).toBeGreaterThan(0);
  });

  it('should apply corner radius to last cell of last row in `.bordered` table', async () => {
    await render(mkTable('bordered'));
    const style = computedStyle('table.bq-table.bordered tbody tr:last-child td:last-child', ['borderEndEndRadius']);
    expect(parseFloat(style.borderEndEndRadius)).toBeGreaterThan(0);
  });

  it('should apply overflow-x auto on `.bq-table--container`', async () => {
    const { root } = await render(<div class="bq-table--container">{mkTable()}</div>);
    expect(root.classList.contains('bq-table--container')).toBe(true);
    const style = computedStyle('.bq-table--container', ['overflowX']);
    expect(style.overflowX).toBe('auto');
  });
});
