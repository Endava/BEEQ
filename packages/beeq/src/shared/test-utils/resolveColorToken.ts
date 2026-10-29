/**
 * Resolves a colour token in its actual theme scope, failing on missing or
 * unresolved values instead of accepting an inherited colour as the expectation.
 * Intended for colour tokens only; the sentinel colour is reserved for failure.
 */
export const resolveColorToken = (name: string, scope: HTMLElement = document.documentElement): string => {
  const value = getComputedStyle(scope).getPropertyValue(name).trim();
  if (!value) {
    throw new Error(`Missing or unresolved colour token ${name}`);
  }
  // A defined non-colour (e.g. 12px) invalidates `color: var(...)` without
  // invoking its fallback. Reject it before it can inherit a plausible colour.
  if (!CSS.supports('color', value)) throw new Error(`Invalid colour token ${name}: ${value}`);

  const probe = document.createElement('span');
  probe.style.setProperty('color', `var(${name}, rgb(1, 2, 3))`, 'important');
  scope.appendChild(probe);

  try {
    const { color } = getComputedStyle(probe);
    if (!color || color === 'rgb(1, 2, 3)') {
      throw new Error(`Unresolved colour token ${name}`);
    }
    return color;
  } finally {
    probe.remove();
  }
};
