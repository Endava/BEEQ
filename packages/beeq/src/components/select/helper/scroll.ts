const getFirstVisibleChildRect = (option: HTMLBqOptionElement): DOMRect | undefined => {
  const children = option.querySelectorAll<HTMLBqOptionElement>('bq-option[slot="options"]');
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (child.hidden || child.parentElement?.closest('bq-option') !== option) continue;

    const row = child.shadowRoot?.querySelector<HTMLElement>('[part="item"]');
    const rect = row?.getBoundingClientRect();
    if (rect?.height) return rect;
  }

  return undefined;
};

/** Reveals an expanded branch without scrolling the surrounding page. */
export const revealOptionChildren = (
  panel: HTMLElement,
  parentRow: HTMLElement,
  group: HTMLElement,
  option: HTMLBqOptionElement,
): void => {
  const { clientHeight } = panel;
  if (group.hidden || !clientHeight) return;

  const panelRect = panel.getBoundingClientRect();
  const viewportTop = panelRect.top + panel.clientTop;
  const viewportBottom = viewportTop + clientHeight;
  const groupRect = group.getBoundingClientRect();
  if (groupRect.top >= viewportTop && groupRect.bottom <= viewportBottom) return;

  const firstChildRect = getFirstVisibleChildRect(option);
  if (!firstChildRect) return;

  const parentRect = parentRow.getBoundingClientRect();
  const branchFits = groupRect.bottom - parentRect.top <= clientHeight;
  const targetBottom = branchFits ? groupRect.bottom : firstChildRect.bottom;
  if (!branchFits && parentRect.top >= viewportTop && targetBottom <= viewportBottom) return;

  const minimumScroll = targetBottom - viewportBottom;
  const maximumScroll = parentRect.top - viewportTop;
  const delta = Math.min(Math.max(0, minimumScroll), Math.max(0, maximumScroll));
  if (delta > 0) panel.scrollTop += delta;
  else if (parentRect.top < viewportTop) panel.scrollTop += parentRect.top - viewportTop;
};
