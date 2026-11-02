import fs from 'node:fs/promises';
import path from 'node:path';

import postcss from 'postcss';

const workspaceRoot = path.resolve(import.meta.dirname, '../..');
// `nx build beeq` writes to the workspace dist; a standalone Stencil build writes to the package dist
const sourceCandidates = ['dist/beeq/dist/beeq/beeq.css', 'packages/beeq/dist/beeq/beeq.css'].map((file) =>
  path.join(workspaceRoot, file),
);
const sourcePath = await (async () => {
  for (const candidate of sourceCandidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }
  const searchedPaths = sourceCandidates.map((candidate) => path.relative(workspaceRoot, candidate)).join('\n- ');
  throw new Error(`beeq.css not found. Run \`pnpm nx run beeq:build\` first. Looked in:\n- ${searchedPaths}`);
})();
const outputPath = path.join(workspaceRoot, 'apps/beeq-docs/beeq-mintlify.css');

// Theme selectors are wrapped in `:where()` (zero specificity), so match against the inner selector
const unwrapWhere = (selector) => {
  const value = selector.trim();
  const match = /^:where\((.*)\)$/.exec(value);

  return match ? match[1].trim() : value;
};

const isThemeSelector = (selector) => {
  const value = unwrapWhere(selector);

  return (
    value === ':root' ||
    value === '::backdrop' ||
    value.startsWith(':root') ||
    value.startsWith(':where(:root)') ||
    value.startsWith('[bq-') ||
    value.startsWith('.beeq') ||
    value.startsWith('.endava') ||
    value === '.dark' ||
    value === '.light' ||
    value.startsWith('[dir=rtl]')
  );
};

const isNamespacedSelector = (selector) => /(^|[\s>+~])(?:bq-[\w-]+|(?:body)?\.bq-[\w-]+)/.test(selector);

const onlyBeeqThemeDeclarations = (rule) =>
  rule.nodes?.every(
    (node) =>
      node.type !== 'decl' ||
      node.prop.startsWith('--bq-') ||
      (node.prop === 'font-family' && node.value === 'var(--bq-font-family)'),
  ) ?? false;

const keepRule = (rule) => {
  const selectors = postcss.list.comma(rule.selector);

  if (selectors.every(isNamespacedSelector)) return true;

  return selectors.every(isThemeSelector) && onlyBeeqThemeDeclarations(rule);
};

const filterContainer = (container) => {
  container.each((node) => {
    if (node.type === 'rule') {
      if (!keepRule(node)) node.remove();
      return;
    }

    if (node.type !== 'atrule') return;

    if (node.name === 'font-face') return;

    if (node.nodes) {
      filterContainer(node);
      if (!node.nodes.length) node.remove();
      return;
    }

    node.remove();
  });
};

const input = await fs.readFile(sourcePath, 'utf8');
const root = postcss.parse(input, { from: sourcePath });

filterContainer(root);

const output = [
  '/*',
  ' * Generated from @beeq/core/dist/beeq/beeq.css.',
  ' *',
  ' * This host-safe bundle retains BEEQ fonts, tokens, themes, and .bq-*',
  ' * light-DOM helpers. It intentionally omits resets, unscoped element styles, and',
  ' * unprefixed utility classes so it can coexist with Mintlify.',
  ' *',
  ' * Regenerate with: node tools/scripts/generate-beeq-mintlify-css.mjs',
  ' */',
  '',
  root.toString(),
  '',
].join('\n');

await fs.writeFile(outputPath, output);

console.log(`Generated ${path.relative(workspaceRoot, outputPath)}`);
