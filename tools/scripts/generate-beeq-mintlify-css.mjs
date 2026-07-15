import fs from 'node:fs/promises';
import path from 'node:path';

import postcss from 'postcss';

const workspaceRoot = path.resolve(import.meta.dirname, '../..');
const sourcePath = path.join(workspaceRoot, 'packages/beeq/dist/beeq/beeq.css');
const outputPath = path.join(workspaceRoot, 'apps/beeq-docs/beeq-mintlify.css');

const isThemeSelector = (selector) => {
  const value = selector.trim();

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

const isNamespacedSelector = (selector) => /(^|[\s>+~])(?:bq-[\w-]+|\.bq-[\w-]+)/.test(selector);

const onlyBeeqCustomProperties = (rule) =>
  rule.nodes?.every((node) => node.type !== 'decl' || node.prop.startsWith('--bq-')) ?? false;

const keepRule = (rule) => {
  const selectors = postcss.list.comma(rule.selector);

  if (selectors.every(isNamespacedSelector)) return true;

  return selectors.every(isThemeSelector) && onlyBeeqCustomProperties(rule);
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
  ' * light-DOM helpers. It intentionally omits resets, element styles, and',
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
