// Builds an index of the real BEEQ API from source, and checks code against it.
// Shared by the skill API-accuracy tests and the behavioural evals.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

export type BeeqComponent = {
  tag: string;
  pascal: string;
  props: Set<string>;
  events: Set<string>;
  parts: Set<string>;
  methods: Set<string>;
  cssProps: Set<string>;
  /** Allowed values of props typed as a union of string literals, keyed by prop name. */
  values: Map<string, string[]>;
};

export type BeeqIndex = {
  components: Map<string, BeeqComponent>;
  pascalToTag: Map<string, string>;
  tokens: Set<string>;
};

type SetField = 'props' | 'events' | 'parts' | 'methods' | 'cssProps';

export type SerializedIndex = {
  components: (Omit<BeeqComponent, SetField | 'values'> &
    Record<SetField, string[]> & { values: Record<string, string[]> })[];
  tokens: string[];
};

export type ApiIssue = {
  kind: 'element' | 'event' | 'prop' | 'value' | 'part' | 'token';
  name: string;
  message: string;
};

type Attribute = { kind: 'ignore' } | { kind: 'event'; name: string } | { kind: 'prop'; name: string; bound: boolean };

type RawAttribute = { name: string; value?: string };

const walk = (dir: string, filter: (file: string) => boolean, out: string[] = []) => {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('_') || entry === '__tests__') continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, filter, out);
    else if (filter(full)) out.push(full);
  }
  return out;
};

export const kebabToCamel = (value: string) => value.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
export const tagToPascal = (tag: string) => kebabToCamel(`-${tag}`).replace(/^./, (c) => c.toUpperCase());

/** Splits a markdown table row on the pipes that are not escaped as `\\|`. */
const tableCells = (row: string) =>
  row
    .split(/(?<!\\)\|/)
    .slice(1, -1)
    .map((cell) => cell.trim());

/**
 * Reads the allowed values of each prop from the component's generated readme, where Stencil writes the resolved
 * type of every prop. Only props typed as a union of string literals get an entry.
 */
function readPropValues(readme: string) {
  const values = new Map<string, string[]>();
  const properties = /^## Properties\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(readme)?.[1] ?? '';
  for (const row of properties.split('\n').filter((line) => line.startsWith('| `'))) {
    const [propCell, , , typeCell] = tableCells(row);
    const prop = /`(\w+)`/.exec(propCell ?? '')?.[1];
    const members = (typeCell ?? '')
      .replace(/^`|`$/g, '')
      .split('\\|')
      .map((member) => member.trim())
      .filter((member) => member !== 'undefined');
    const literals = members.map((member) => /^"([^"]+)"$/.exec(member)?.[1]);
    if (prop && literals.length > 0 && literals.every(Boolean)) values.set(prop, literals as string[]);
  }
  return values;
}

let cached: { repoRoot: string; index: BeeqIndex } | undefined;

/** Reads component tags, props and their allowed values, events, parts, CSS properties, and global tokens from the repo. */
export function loadBeeqIndex(repoRoot: string): BeeqIndex {
  if (cached?.repoRoot === repoRoot) return cached.index;

  const components = new Map<string, BeeqComponent>();
  const tokens = new Set<string>();
  const componentsDir = path.join(repoRoot, 'packages/beeq/src/components');

  for (const file of walk(componentsDir, (f) => /\/bq-[a-z-]+\.tsx$/.test(f))) {
    const source = readFileSync(file, 'utf8');
    const tag = /tag:\s*'(bq-[a-z-]+)'/.exec(source)?.[1];
    if (!tag) continue;
    const props = new Set([...source.matchAll(/@Prop\([^)]*\)\s*(\w+)/g)].map((m) => m[1]));
    const events = new Set([...source.matchAll(/@Event\([^)]*\)\s*(bq\w+)/g)].map((m) => m[1]));
    const parts = new Set([...source.matchAll(/@part\s+([\w-]+)/g)].map((m) => m[1]));
    const methods = new Set([...source.matchAll(/@Method\(\)\s*(?:async\s+)?(\w+)/g)].map((m) => m[1]));
    const cssProps = new Set([...source.matchAll(/@cssprop\s+(--bq-[\w-]+)/g)].map((m) => m[1]));
    for (const token of cssProps) tokens.add(token);
    const readme = path.join(path.dirname(file), 'readme.md');
    const values = existsSync(readme) ? readPropValues(readFileSync(readme, 'utf8')) : new Map<string, string[]>();
    components.set(tag, { tag, pascal: tagToPascal(tag), props, events, parts, methods, cssProps, values });
  }

  const tokenSources = [
    ...walk(path.join(repoRoot, 'packages/beeq-tailwindcss/src'), (f) => /\.(ts|css)$/.test(f)),
    ...walk(componentsDir, (f) => /\.(scss|tsx)$/.test(f)),
  ];
  for (const file of tokenSources) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(?:--|['"])(bq-[a-z0-9]+(?:-{1,2}[a-z0-9]+)*)/g)) tokens.add(`--${match[1]}`);
  }

  const pascalToTag = new Map([...components.values()].map((c) => [c.pascal, c.tag]));
  const index = { components, pascalToTag, tokens };
  cached = { repoRoot, index };
  return index;
}

const sorted = (values: Set<string>) => [...values].sort((a, b) => a.localeCompare(b, 'en'));

/** Converts an index to plain JSON, so graders can load it without reading the BEEQ source. */
export const serializeIndex = (index: BeeqIndex): SerializedIndex => ({
  components: [...index.components.values()].map((component) => ({
    tag: component.tag,
    pascal: component.pascal,
    props: sorted(component.props),
    events: sorted(component.events),
    parts: sorted(component.parts),
    methods: sorted(component.methods),
    cssProps: sorted(component.cssProps),
    values: Object.fromEntries(component.values),
  })),
  tokens: sorted(index.tokens),
});

/** Rebuilds an index from `serializeIndex` output. */
export function reviveIndex(json: SerializedIndex): BeeqIndex {
  const components = new Map<string, BeeqComponent>(
    json.components.map((component) => [
      component.tag,
      {
        tag: component.tag,
        pascal: component.pascal,
        props: new Set(component.props),
        events: new Set(component.events),
        parts: new Set(component.parts),
        methods: new Set(component.methods),
        cssProps: new Set(component.cssProps),
        values: new Map(Object.entries(component.values ?? {})),
      },
    ]),
  );
  const pascalToTag = new Map([...components.values()].map((component) => [component.pascal, component.tag]));
  return { components, pascalToTag, tokens: new Set(json.tokens) };
}

// Attributes that are valid on any element or are framework directives rather than component props.
const GLOBAL_ATTRIBUTES = new Set([
  'slot',
  'class',
  'className',
  'id',
  'style',
  'key',
  'ref',
  'role',
  'hidden',
  'tabindex',
  'tabIndex',
  'title',
  'lang',
  'dir',
  'part',
  'is',
  'inert',
  'popover',
  'v-model',
  'v-if',
  'v-else',
  'v-else-if',
  'v-for',
  'v-show',
  'ngModel',
  'formControlName',
  'formControl',
  'ngDefaultControl',
  'ngIf',
  'ngFor',
]);

const skipSpaces = (source: string, from: number) => {
  let i = from;
  while (/\s/.test(source[i] ?? '')) i++;
  return i;
};

/** Returns the index after a closing quote, or the end of the source when the quote is never closed. */
const skipQuoted = (source: string, from: number) => source.indexOf(source[from], from + 1) + 1 || source.length;

/** Skips a `{…}` expression starting at `from`, such as `{...props}` or `={() => "}"}`. Strings inside are skipped whole. */
function skipExpression(source: string, from: number) {
  let i = from;
  let depth = 0;
  do {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (ch === '"' || ch === "'" || ch === '`') i = skipQuoted(source, i);
    else i++;
  } while (depth > 0 && i < source.length);
  return i;
}

/** Skips an attribute value starting at `from`: quoted, a `{…}` expression, or unquoted. */
function skipValue(source: string, from: number) {
  const first = source[from];
  if (first === '"' || first === "'") return skipQuoted(source, from);
  if (first === '{') return skipExpression(source, from);
  let i = from;
  while (i < source.length && !/[\s>]/.test(source[i])) i++;
  return i;
}

const isTagEnd = (source: string, i: number) => source[i] === '>' || (source[i] === '/' && source[i + 1] === '>');

/** Parses the attributes of an opening tag starting right after its name. Handles quotes and `{…}` expressions. */
function readAttributes(source: string, start: number) {
  const attributes: RawAttribute[] = [];
  let i = skipSpaces(source, start);
  while (i < source.length && !isTagEnd(source, i)) {
    const name = source[i] === '{' ? undefined : /^[^\s=>/]+/.exec(source.slice(i))?.[0];
    if (name) {
      i = skipSpaces(source, i + name.length);
      let value: string | undefined;
      if (source[i] === '=') {
        const from = skipSpaces(source, i + 1);
        i = skipValue(source, from);
        value = source.slice(from, i);
      }
      attributes.push({ name, value });
    } else {
      // A JSX spread such as {...props}, or a stray character.
      i = source[i] === '{' ? skipExpression(source, i) : i + 1;
    }
    i = skipSpaces(source, i);
  }
  return attributes;
}

function classifyAttribute(raw: string): Attribute {
  let name = raw;
  if (name.startsWith('#') || name.startsWith('*')) return { kind: 'ignore' };
  if (name.startsWith('(') && name.endsWith(')')) return { kind: 'event', name: name.slice(1, -1) };
  if (name.startsWith('@')) return { kind: 'event', name: name.slice(1).split('.')[0] };
  if (name.startsWith('v-on:')) return { kind: 'event', name: name.slice(5).split('.')[0] };
  if (name.startsWith('[(') && name.endsWith(')]')) name = name.slice(2, -2);
  else if (name.startsWith('[') && name.endsWith(']')) name = name.slice(1, -1).replace(/^attr\./, '');
  else if (name.startsWith(':')) name = name.slice(1);
  else if (name.startsWith('v-bind:')) name = name.slice(7);
  const bound = name !== raw;
  name = name.replace(/\.prop$/, '');

  if (GLOBAL_ATTRIBUTES.has(name) || /^(aria|data)-/.test(name)) return { kind: 'ignore' };
  const reactEvent = /^on(Bq\w+)$/.exec(name);
  if (reactEvent) return { kind: 'event', name: reactEvent[1].replace(/^B/, 'b') };
  return { kind: 'prop', name, bound };
}

/**
 * The string an attribute value sets, such as `danger` from `type="danger"`, `[type]="'danger'"`, or
 * `type={'danger'}`. Returns undefined for anything computed, since only running the code would tell its value.
 */
function literalValue(value: string | undefined, bound: boolean) {
  if (value === undefined) return undefined;
  let text = value;
  let expression = bound;
  if (text.startsWith('{')) {
    text = text.slice(1, -1);
    expression = true;
  } else if (/^["']/.test(text)) {
    text = text.slice(1, -1);
  }
  if (expression) text = /^\s*(["'`])([^"'`]*)\1\s*$/.exec(text)?.[2] ?? '';
  return /^[\w-]+$/.test(text) ? text : undefined;
}

type Report = (kind: ApiIssue['kind'], name: string, message: string) => void;

const NATIVE_HANDLER = /^on(?:[a-z]+|[A-Z][a-zA-Z]*)$/;

function checkProp(name: string, value: string | undefined, component: BeeqComponent, report: Report) {
  const { tag } = component;
  const prop = kebabToCamel(name);
  if (!component.props.has(prop)) {
    if (!NATIVE_HANDLER.test(name)) report('prop', `${tag}.${name}`, `${tag} has no "${name}" property.`);
    return;
  }
  const allowed = component.values.get(prop);
  if (allowed && value !== undefined && !allowed.includes(value)) {
    report('value', `${tag}.${name}=${value}`, `${tag} ${name}="${value}" is not allowed; use ${allowed.join(', ')}.`);
  }
}

function checkAttribute(raw: RawAttribute, component: BeeqComponent, report: Report) {
  const attribute = classifyAttribute(raw.name);
  const { tag } = component;
  if (attribute.kind === 'event' && attribute.name.startsWith('bq') && !component.events.has(attribute.name)) {
    report('event', `${tag}.${attribute.name}`, `${tag} has no ${attribute.name} event.`);
  }
  if (attribute.kind === 'prop') {
    checkProp(attribute.name, literalValue(raw.value, attribute.bound), component, report);
  }
}

/** Unknown `bq-*` elements, unknown props or events on known elements, and literal prop values outside a prop's type. */
function checkElements(code: string, index: BeeqIndex, report: Report) {
  for (const match of code.matchAll(/<(bq-[a-z-]+|Bq[A-Z][A-Za-z]*)(?=[\s/>])/g)) {
    const [, element] = match;
    const tag = element.startsWith('bq-') ? element : index.pascalToTag.get(element);
    const component = tag && index.components.get(tag);
    if (!component) {
      report('element', element, `<${element}> is not a BEEQ component.`);
      continue;
    }
    for (const raw of readAttributes(code, match.index + match[0].length)) checkAttribute(raw, component, report);
  }
}

function checkParts(code: string, index: BeeqIndex, report: Report) {
  for (const match of code.matchAll(/(bq-[a-z-]+)::part\(\s*([\w-]+)\s*\)/g)) {
    const [, tag, part] = match;
    const component = index.components.get(tag);
    if (component && !component.parts.has(part)) report('part', `${tag}::${part}`, `${tag} has no "${part}" part.`);
  }
}

function checkTokens(code: string, index: BeeqIndex, report: Report) {
  for (const match of code.matchAll(/--bq-[a-z0-9]+(?:-{1,2}[a-z0-9]+)*/g)) {
    const token = match[0];
    // Skip token families written as patterns, e.g. `--bq-spacing-*` or `--bq-text--{primary,secondary}`.
    if (/^-{0,2}[*{<]/.test(code.slice(match.index + token.length, match.index + token.length + 3))) continue;
    if (!index.tokens.has(token)) report('token', token, `${token} is not a BEEQ token or component CSS property.`);
  }
}

/**
 * Finds API mistakes in code: unknown `bq-*` elements, unknown props or events on known elements, literal prop
 * values outside the prop's type, unknown `::part()` names, and unknown `--bq-*` tokens. `allow` is a list of
 * `kind:name` strings, such as `value:bq-alert.type=danger`.
 */
export function findApiIssues(code: string, index: BeeqIndex, { allow = [] }: { allow?: string[] } = {}) {
  const issues: ApiIssue[] = [];
  const allowed = new Set(allow);
  const report: Report = (kind, name, message) => {
    if (!allowed.has(`${kind}:${name}`)) issues.push({ kind, name, message });
  };

  checkElements(code, index, report);
  checkParts(code, index, report);
  checkTokens(code, index, report);
  return issues;
}
