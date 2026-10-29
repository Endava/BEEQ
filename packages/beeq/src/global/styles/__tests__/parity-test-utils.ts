import { fileURLToPath } from 'node:url';

import postcss, { type Root, type Rule } from 'postcss';
import { compile } from 'sass';

export const compileFoundation = (path: string): Root => {
  const filename = fileURLToPath(new URL(`../foundations/${path}`, import.meta.url));
  return postcss.parse(compile(filename, { silenceDeprecations: ['import'] }).css, { from: filename });
};

export const normalizeValue = (value: string): string =>
  value
    .replace(/#([\da-f]{3}|[\da-f]{6})\b/gi, (_, hex: string) =>
      `#${hex.length === 3 ? [...hex].map((character) => character.repeat(2)).join('') : hex}`.toLowerCase(),
    )
    .replace(/\s+/g, ' ')
    .replace(/\(\s*/g, '(')
    .replace(/\s*\)/g, ')')
    .replace(/\s*,\s*/g, ',')
    // Equivalent legacy/modern RGB syntax occurs in existing native shadows.
    .replace(
      /rgba?\(([\d.]+),([\d.]+),([\d.]+)(?:,([\d.]+))?\)/g,
      (_, r, g, b, alpha) =>
        `rgb(${r} ${g} ${b}${alpha === undefined ? '' : ` / ${Number((Number(alpha) * 100).toFixed(8))}%`})`,
    )
    .replace(/"/g, "'")
    .trim();

export const declarations = (rule: Rule): Record<string, string> => {
  const entries: [string, string][] = [];
  rule.each((node) => {
    if (node.type === 'decl') entries.push([node.prop, normalizeValue(node.value)]);
  });
  return Object.fromEntries(entries);
};

export const cssNames = (tokens: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [name.startsWith('--') ? name : `--${name}`, normalizeValue(value)]),
  );

// PostCSS's list parser respects parentheses and quoted commas. Do not split
// selectors with regex or String.split(',') (both break :where() arguments).
export const selectors = (selector: string): string[] => postcss.list.comma(selector);

export const whereArguments = (selector: string): string[] =>
  selectors(selector).flatMap((part) =>
    part.startsWith(':where(') && part.endsWith(')') ? selectors(part.slice(7, -1)) : [part],
  );
