#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
// One-off S10 reconciliation: pinned main versus the current working tree.
import fs from 'node:fs';

import ts from 'typescript';

const BASELINE = '1e4f7b0e45a392684cb82cfb771f0317fa06fcf5';
const COMPONENTS = [
  'tag',
  'badge',
  'empty-state',
  'page-title',
  'tab-group',
  'spinner',
  'progress',
  'avatar',
  'steps',
  'button',
  'status',
  'card',
  'divider',
  'panel',
  'breadcrumb',
  'option',
  'select',
];
const README_COMPONENTS = ['card', 'divider', 'panel', 'breadcrumb', 'option', 'select'];

const gitShow = (file) => {
  try {
    return execFileSync('git', ['show', `${BASELINE}:${file}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
};
const worktree = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
const unique = (items) => [...new Set(items)].sort();
const documentedNames = (content, kind) => {
  if (content === null) return [];
  const type = kind === 'attr' ? '(?:\\{[^}]+\\}\\s+)?' : '';
  const expression = new RegExp(`@${kind}\\s+${type}([^\\s:]+)`, 'g');
  return unique([...content.matchAll(expression)].map((match) => match[1]));
};
const declaredVariables = (content) =>
  content === null ? [] : unique([...content.matchAll(/^\s*(--bq-[a-zA-Z0-9-]+)\s*:/gm)].map((match) => match[1]));
const differences = (left, right) => ({
  removed: left.filter((item) => !right.includes(item)),
  added: right.filter((item) => !left.includes(item)),
});
const propContracts = (content, path) => {
  if (content === null) return {};
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  if (source.parseDiagnostics.length) throw new Error(`Unable to parse ${path}`);
  const contracts = {};
  const visit = (node) => {
    if (ts.isPropertyDeclaration(node)) {
      const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) || [] : [];
      const prop = decorators.find(
        (decorator) =>
          ts.isCallExpression(decorator.expression) && decorator.expression.expression.getText(source) === 'Prop',
      );
      if (prop) {
        const text = (value) => value?.getText(source).replace(/\s+/g, ' ').trim() ?? null;
        contracts[node.name.getText(source)] = {
          type: text(node.type),
          optional: !!node.questionToken,
          definite: !!node.exclamationToken,
          default: text(node.initializer),
          decorator: text(prop.expression),
        };
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return contracts;
};

const report = {
  baseline: BASELINE,
  head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  comparison: 'working tree',
  components: {},
  table: {},
  readmes: {},
};
for (const name of COMPONENTS) {
  const root = `packages/beeq/src/components/${name}`;
  const tsx = `${root}/bq-${name}.tsx`;
  const variables = `${root}/scss/bq-${name}.variables.scss`;
  const types = `${root}/bq-${name}.types.ts`;
  const main = gitShow(tsx);
  const current = worktree(tsx);
  if (main === null || current === null) throw new Error(`Missing component source: ${tsx}`);
  const mainVariables = gitShow(variables);
  const currentVariables = worktree(variables);
  const changes = {};
  for (const kind of ['cssprop', 'part', 'slot', 'event', 'method', 'attr']) {
    const delta = differences(documentedNames(main, kind), documentedNames(current, kind));
    if (delta.removed.length || delta.added.length) changes[`@${kind}`] = delta;
  }
  for (const [kind, extract] of [
    ['@prop', (value) => documentedNames(value, 'prop')],
    ['declaredVariables', declaredVariables],
  ]) {
    const delta = differences(extract(mainVariables), extract(currentVariables));
    if (delta.removed.length || delta.added.length) changes[kind] = delta;
  }
  const mainProps = propContracts(main, tsx);
  const currentProps = propContracts(current, tsx);
  const props = {};
  for (const key of unique([...Object.keys(mainProps), ...Object.keys(currentProps)])) {
    if (JSON.stringify(mainProps[key]) !== JSON.stringify(currentProps[key])) {
      props[key] = { main: mainProps[key] ?? null, current: currentProps[key] ?? null };
    }
  }
  if (Object.keys(props).length) changes.propContracts = props;
  const mainTypes = gitShow(types);
  const currentTypes = worktree(types);
  if (mainTypes !== currentTypes) changes.typesFileChanged = true;
  report.components[name] = {
    files: { tsx, variables, mainVariables: mainVariables !== null, currentVariables: currentVariables !== null },
    changes,
  };
}

const mainTable = gitShow('packages/beeq/src/global/styles/_table.scss');
const currentTable = worktree('packages/beeq/src/global/styles/public/_table.scss');
if (mainTable === null || currentTable === null) throw new Error('Missing public table stylesheet');
report.table = {
  paths: ['packages/beeq/src/global/styles/_table.scss', 'packages/beeq/src/global/styles/public/_table.scss'],
  declaredVariables: differences(declaredVariables(mainTable), declaredVariables(currentTable)),
  propDocs: differences(documentedNames(mainTable, 'prop'), documentedNames(currentTable, 'prop')),
};
for (const name of README_COMPONENTS) {
  const file = `packages/beeq/src/components/${name}/readme.md`;
  const main = gitShow(file);
  const current = worktree(file);
  if (main === null || current === null) throw new Error(`Missing inventory README: ${file}`);
  report.readmes[name] = main === current ? 'matches pinned main' : 'differs from pinned main';
}
console.log(JSON.stringify(report, null, 2));
