/* -------------------------------------------------------------------------- */
/*        Generates src/generated/* from the @beeq/core SCSS foundations      */
/* -------------------------------------------------------------------------- */
/**
 * The SCSS foundations in `packages/beeq` are the single source of truth for BEEQ tokens, the CSS reset and the
 * typography classes. This script compiles them with Sass, reads the CSS with PostCSS and writes plain TS modules
 * that the preset bundles, so the published package keeps no runtime dependency on `@beeq/core`, Sass or PostCSS.
 *
 * Run it with `pnpm exec nx run beeq-tailwindcss:generate` after changing any foundation file.
 * `src/__tests__/generated.spec.ts` fails when the committed files are stale.
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import postcss, { type AtRule, type ChildNode, type Declaration, type Node, type Root, type Rule } from 'postcss';
import * as sass from 'sass';

type TokenMap = Record<string, string>;
type CssDeclarations = Record<string, string>;
type CssRuleMap = Record<string, CssDeclarations>;
type CssRules = Record<string, CssDeclarations | CssRuleMap>;

type ThemeSlot = 'root' | 'light' | 'dark';

export type ThemeTokens = {
  /** Selectors of the theme or mode block, without the `:where()` wrapper */
  selectors: string[];
  /** Custom properties without the leading `--` (`bq-white`) */
  tokens: TokenMap;
};

export type ExtractedFoundations = {
  primitives: { selector: string; tokens: TokenMap };
  shared: { selector: string; tokens: TokenMap };
  themes: Record<'default' | 'endava', Record<ThemeSlot, ThemeTokens>>;
  reset: CssRules;
  typography: CssRuleMap;
};

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKSPACE_ROOT = path.resolve(PACKAGE_ROOT, '../..');
export const FOUNDATIONS_DIR = path.resolve(PACKAGE_ROOT, '../beeq/src/global/styles/foundations');
export const GENERATED_DIR = path.resolve(PACKAGE_ROOT, 'src/generated');

const SOURCES = {
  primitives: 'tokens/primitives.scss',
  default: 'themes/beeq.scss',
  endava: 'themes/endava.scss',
  shared: 'themes/shared.scss',
  reset: 'reset.scss',
  typography: 'typography.scss',
} as const;

/* -------------------------------------------------------------------------- */
/*                                   Parsing                                  */
/* -------------------------------------------------------------------------- */

const compile = (file: string): Root => {
  const { css } = sass.compile(path.join(FOUNDATIONS_DIR, file), {
    style: 'expanded',
    silenceDeprecations: ['import'],
  });
  return postcss.parse(css, { from: file });
};

const fail = (file: string, node: Node, message: string): never => {
  throw new Error(`[generate-tokens] ${file}:${node.source?.start?.line ?? '?'} ${message}`);
};

const isAtRule = (node: ChildNode, name: string, params?: string): node is AtRule =>
  node.type === 'atrule' && node.name === name && (params === undefined || node.params === params);

/** Children of a node, without comments */
const childrenOf = (node: Root | AtRule | Rule): ChildNode[] =>
  (node.nodes ?? []).filter((child) => child.type !== 'comment');

const rulesOf = (file: string, node: Root | AtRule): Rule[] =>
  childrenOf(node).map((child) =>
    child.type === 'rule' ? child : fail(file, child, `unexpected ${child.type}, expected only style rules`),
  );

const declarationsOf = (file: string, rule: Rule): Declaration[] =>
  childrenOf(rule).map((child) =>
    child.type === 'decl' ? child : fail(file, child, `unexpected ${child.type} inside "${rule.selector}"`),
  );

/** Rules of a file whose top level holds only `@layer <layer>` blocks */
const layeredRules = (file: string, root: Root, layer: string): Rule[] =>
  childrenOf(root).flatMap((node) =>
    isAtRule(node, 'layer', layer)
      ? rulesOf(file, node)
      : fail(file, node, `expected only @layer ${layer} blocks at the top level`),
  );

const singleRule = (file: string, root: Root, layer: string): Rule => {
  const rules = layeredRules(file, root, layer);
  if (rules.length !== 1)
    throw new Error(`[generate-tokens] ${file} must define exactly one rule, found ${rules.length}`);
  return rules[0];
};

/** Splits a selector list on top-level commas (ignores commas inside `()` and `[]`) */
const splitSelectorList = (selector: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of selector) {
    if (char === '(' || char === '[') depth++;
    else if (char === ')' || char === ']') depth--;
    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts.map((part) => part.replace(/\s+/g, ' ').trim()).filter(Boolean);
};

/** Sass drops the quotes of identifier attribute values (`[bq-mode=dark]`); restore them for stable selectors */
const normalizeSelector = (selector: string): string =>
  selector.replace(/\[([\w-]+)([~|^$*]?=)([^\]"'\s]+)\]/g, '[$1$2"$3"]');

const selectorKey = (rule: Rule): string => splitSelectorList(rule.selector).map(normalizeSelector).join(', ');

/** `:where(a, b)` → `['a', 'b']` */
const unwrapWhere = (selector: string): string[] => {
  const match = /^:where\((.*)\)$/s.exec(selector);
  return (match ? splitSelectorList(match[1]) : [selector]).map(normalizeSelector);
};

const readCustomProperties = (file: string, rule: Rule, stripDashes: boolean): TokenMap => {
  const tokens: TokenMap = {};
  for (const decl of declarationsOf(file, rule)) {
    if (!decl.prop.startsWith('--bq-')) fail(file, decl, `expected a --bq-* custom property, got "${decl.prop}"`);
    if (decl.important) fail(file, decl, `tokens must not use !important ("${decl.prop}")`);
    const key = stripDashes ? decl.prop.slice(2) : decl.prop;
    if (key in tokens) fail(file, decl, `duplicate token "${decl.prop}"`);
    tokens[key] = decl.value.trim();
  }
  return tokens;
};

const readDeclarations = (file: string, rule: Rule, important: boolean): CssDeclarations => {
  const declarations: CssDeclarations = {};
  for (const decl of declarationsOf(file, rule)) {
    if (decl.prop in declarations) fail(file, decl, `duplicate declaration "${decl.prop}"`);
    const value = decl.value.trim();
    declarations[decl.prop] = important || decl.important ? `${value} !important` : value;
  }
  return declarations;
};

const readRuleMap = (file: string, rules: Rule[], important: boolean): CssRuleMap => {
  const map: CssRuleMap = {};
  for (const rule of rules) {
    const key = selectorKey(rule);
    if (key in map) fail(file, rule, `duplicate selector "${key}"`);
    map[key] = readDeclarations(file, rule, important);
  }
  return map;
};

const slotOf = (selectors: string[]): ThemeSlot => {
  const joined = selectors.join(' ');
  if (/\[bq-mode="dark"\]|\.dark\b/.test(joined)) return 'dark';
  if (/\[bq-mode="light"\]|\.light\b|:not\(\[bq-mode\]\)/.test(joined)) return 'light';
  return 'root';
};

const readTheme = (file: string): Record<ThemeSlot, ThemeTokens> => {
  const slots: Partial<Record<ThemeSlot, ThemeTokens>> = {};
  for (const rule of layeredRules(file, compile(file), 'bq.themes')) {
    const parts = splitSelectorList(rule.selector);
    if (parts.length !== 1) fail(file, rule, `theme blocks need a single :where() selector, got "${rule.selector}"`);
    const selectors = unwrapWhere(parts[0]);
    const slot = slotOf(selectors);
    if (slots[slot]) fail(file, rule, `more than one ${slot} block`);
    slots[slot] = { selectors, tokens: readCustomProperties(file, rule, true) };
  }
  const { root, light, dark } = slots;
  if (!root || !light || !dark) throw new Error(`[generate-tokens] ${file} needs a root, a light and a dark block`);
  return { root, light, dark };
};

/**
 * Tailwind adapter for the reset: `addBase` puts every rule in Tailwind's base layer, so the rules that SCSS keeps
 * unlayered on purpose (hidden state, reduced motion) get `!important` to keep winning over utilities.
 */
const readReset = (file: string): CssRules => {
  const rules: CssRules = {};
  const assign = (node: Node, key: string, value: CssDeclarations | CssRuleMap) => {
    if (key in rules) fail(file, node, `duplicate "${key}"`);
    rules[key] = value;
  };

  for (const node of childrenOf(compile(file))) {
    if (node.type === 'rule') {
      assign(node, selectorKey(node), readDeclarations(file, node, true));
    } else if (isAtRule(node, 'layer', 'bq.reset')) {
      for (const [key, value] of Object.entries(readRuleMap(file, rulesOf(file, node), false)))
        assign(node, key, value);
    } else if (isAtRule(node, 'media')) {
      assign(node, `@media ${node.params}`, readRuleMap(file, rulesOf(file, node), true));
    } else {
      fail(file, node, `unexpected top-level ${node.type}`);
    }
  }
  return rules;
};

export const extractFoundations = (): ExtractedFoundations => {
  const primitives = singleRule(SOURCES.primitives, compile(SOURCES.primitives), 'bq.tokens');
  const shared = singleRule(SOURCES.shared, compile(SOURCES.shared), 'bq.themes');

  return {
    primitives: {
      selector: selectorKey(primitives),
      tokens: readCustomProperties(SOURCES.primitives, primitives, false),
    },
    shared: {
      selector: selectorKey(shared),
      tokens: readCustomProperties(SOURCES.shared, shared, false),
    },
    themes: {
      default: readTheme(SOURCES.default),
      endava: readTheme(SOURCES.endava),
    },
    reset: readReset(SOURCES.reset),
    typography: readRuleMap(
      SOURCES.typography,
      layeredRules(SOURCES.typography, compile(SOURCES.typography), 'bq.base'),
      false,
    ),
  };
};

/* -------------------------------------------------------------------------- */
/*                                  Rendering                                 */
/* -------------------------------------------------------------------------- */

type Literal = string | string[] | { [key: string]: Literal };

/** Serializes a value as a TS literal; Biome takes care of the final layout */
const toLiteral = (value: Literal): string => {
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(toLiteral).join(', ')}]`;
  const entries = Object.entries(value).map(([key, entry]) => `\n${JSON.stringify(key)}: ${toLiteral(entry)},`);
  return `{${entries.join('')}\n}`;
};

const header = (sources: string[]): string =>
  [
    '/**',
    ' * AUTO-GENERATED by `scripts/generate-tokens.ts`. Do not edit by hand.',
    ' *',
    ' * Source of truth (packages/beeq/src/global/styles/foundations/):',
    ...sources.map((source) => ` * - ${source}`),
    ' *',
    ' * Regenerate with `pnpm exec nx run beeq-tailwindcss:generate`.',
    ' */',
    '',
  ].join('\n');

const exportConst = (name: string, value: Literal, docs: string): string =>
  `/** ${docs} */\nexport const ${name} = ${toLiteral(value)};\n`;

const renderFiles = ({
  primitives,
  shared,
  themes,
  reset,
  typography,
}: ExtractedFoundations): Record<string, string> => ({
  'tokens.ts': [
    header([SOURCES.primitives, SOURCES.default, SOURCES.endava, SOURCES.shared]),
    exportConst('CSS_COLORS_SELECTOR', primitives.selector, 'Selector of the primitive color block'),
    exportConst('CSS_COLORS', primitives.tokens, 'Primitive colors (`--bq-{color}-{step}`)'),
    exportConst('SHARED_TOKENS_SELECTOR', shared.selector, 'Selector of the shared interaction tokens block'),
    exportConst('SHARED_TOKENS', shared.tokens, 'Interaction aliases shared by every theme and mode'),
    exportConst('DefaultRootTheme', themes.default.root.tokens, 'BEEQ default theme, root semantics'),
    exportConst('DefaultLightTheme', themes.default.light.tokens, 'BEEQ default theme, light mode roles'),
    exportConst('DefaultDarkTheme', themes.default.dark.tokens, 'BEEQ default theme, dark mode roles'),
    exportConst('EndavaRootTheme', themes.endava.root.tokens, 'Endava theme, root semantics'),
    exportConst('EndavaLightTheme', themes.endava.light.tokens, 'Endava theme, light mode roles'),
    exportConst('EndavaDarkTheme', themes.endava.dark.tokens, 'Endava theme, dark mode roles'),
    exportConst(
      'THEME_SELECTORS',
      {
        base: themes.default.root.selectors,
        light: themes.default.light.selectors,
        dark: themes.default.dark.selectors,
        endava: themes.endava.root.selectors,
        'endava-light': themes.endava.light.selectors,
        'endava-dark': themes.endava.dark.selectors,
      },
      'Theme and mode selectors in cascade order. Each one is wrapped in `:where()` when emitted',
    ),
  ].join('\n'),
  'reset.ts': [
    header([SOURCES.reset]),
    exportConst(
      'RESET',
      reset,
      'CSS reset. Rules that SCSS keeps unlayered carry `!important`, since Tailwind emits every rule in its base layer',
    ),
  ].join('\n'),
  'typography.ts': [
    header([SOURCES.typography]),
    exportConst('TYPOGRAPHY', typography, 'Typography classes and heading defaults'),
  ].join('\n'),
});

const BIOME_BIN = createRequire(import.meta.url).resolve('@biomejs/biome/bin/biome');

const formatWithBiome = (file: string, contents: string): string => {
  const { status, stdout, stderr } = spawnSync(
    process.execPath,
    [BIOME_BIN, 'format', `--stdin-file-path=${path.relative(WORKSPACE_ROOT, file)}`],
    { cwd: WORKSPACE_ROOT, encoding: 'utf8', input: contents },
  );
  if (status !== 0) throw new Error(`[generate-tokens] biome could not format ${file}:\n${stderr}`);
  return stdout;
};

/** Returns the formatted contents of every generated file, keyed by absolute path */
export const generate = (): Record<string, string> =>
  Object.fromEntries(
    Object.entries(renderFiles(extractFoundations())).map(([name, contents]) => {
      const file = path.join(GENERATED_DIR, name);
      return [file, formatWithBiome(file, contents)];
    }),
  );

/* -------------------------------------------------------------------------- */
/*                                     CLI                                    */
/* -------------------------------------------------------------------------- */

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  mkdirSync(GENERATED_DIR, { recursive: true });
  for (const [file, contents] of Object.entries(generate())) {
    writeFileSync(file, contents);
    console.log(`✔ ${path.relative(WORKSPACE_ROOT, file)}`);
  }
}
