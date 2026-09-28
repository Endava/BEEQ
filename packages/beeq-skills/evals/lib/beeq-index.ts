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
};

export type BeeqIndex = {
  components: Map<string, BeeqComponent>;
  pascalToTag: Map<string, string>;
  tokens: Set<string>;
};

type SetField = 'props' | 'events' | 'parts' | 'methods' | 'cssProps';

export type SerializedIndex = {
  components: (Omit<BeeqComponent, SetField> & Record<SetField, string[]>)[];
  tokens: string[];
};

export type ApiIssue = { kind: 'element' | 'event' | 'prop' | 'part' | 'token'; name: string; message: string };

type Attribute = { kind: 'ignore' } | { kind: 'event' | 'prop'; name: string };

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

let cached: { repoRoot: string; index: BeeqIndex } | undefined;

/** Reads component tags, props, events, parts, CSS properties, and global tokens from the repo. */
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
    components.set(tag, { tag, pascal: tagToPascal(tag), props, events, parts, methods, cssProps });
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

const sorted = (values: Set<string>) => [...values].sort();

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

/** Parses the attributes of an opening tag starting right after its name. Handles quotes and `{…}` expressions. */
function readAttributes(source: string, start: number) {
  const attributes: string[] = [];
  let i = start;
  while (i < source.length) {
    while (/\s/.test(source[i] ?? '')) i++;
    if (source[i] === '>' || (source[i] === '/' && source[i + 1] === '>')) break;
    if (i >= source.length) break;

    if (source[i] === '{') {
      // JSX spread, e.g. {...props}
      let depth = 0;
      do {
        if (source[i] === '{') depth++;
        else if (source[i] === '}') depth--;
        i++;
      } while (depth > 0 && i < source.length);
      continue;
    }

    const nameMatch = /^[^\s=>/]+/.exec(source.slice(i));
    if (!nameMatch) {
      i++;
      continue;
    }
    const name = nameMatch[0];
    i += name.length;
    while (/\s/.test(source[i] ?? '')) i++;

    if (source[i] === '=') {
      i++;
      while (/\s/.test(source[i] ?? '')) i++;
      const quote = source[i];
      if (quote === '"' || quote === "'") {
        i = source.indexOf(quote, i + 1) + 1 || source.length;
      } else if (quote === '{') {
        let depth = 0;
        do {
          const ch = source[i];
          if (ch === '{') depth++;
          else if (ch === '}') depth--;
          else if (ch === '"' || ch === "'" || ch === '`') i = source.indexOf(ch, i + 1);
          i++;
        } while (depth > 0 && i < source.length && i > 0);
      } else {
        while (i < source.length && !/[\s>]/.test(source[i])) i++;
      }
    }
    attributes.push(name);
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
  name = name.replace(/\.prop$/, '');

  if (GLOBAL_ATTRIBUTES.has(name) || /^(aria|data)-/.test(name)) return { kind: 'ignore' };
  const reactEvent = /^on(Bq\w+)$/.exec(name);
  if (reactEvent) return { kind: 'event', name: reactEvent[1].replace(/^B/, 'b') };
  return { kind: 'prop', name };
}

/**
 * Finds API mistakes in code: unknown `bq-*` elements, unknown props or events on known elements,
 * unknown `::part()` names, and unknown `--bq-*` tokens. `allow` is a list of `kind:name` strings.
 */
export function findApiIssues(code: string, index: BeeqIndex, { allow = [] }: { allow?: string[] } = {}) {
  const issues: ApiIssue[] = [];
  const allowed = new Set(allow);
  const report = (kind: ApiIssue['kind'], name: string, message: string) => {
    if (!allowed.has(`${kind}:${name}`)) issues.push({ kind, name, message });
  };

  for (const match of code.matchAll(/<(bq-[a-z-]+|Bq[A-Z][A-Za-z]*)(?=[\s/>])/g)) {
    const [, element] = match;
    const tag = element.startsWith('bq-') ? element : index.pascalToTag.get(element);
    const component = tag && index.components.get(tag);
    if (!component) {
      report('element', element, `<${element}> is not a BEEQ component.`);
      continue;
    }

    for (const raw of readAttributes(code, match.index + match[0].length)) {
      const attribute = classifyAttribute(raw);
      if (attribute.kind === 'ignore') continue;
      if (attribute.kind === 'event' && attribute.name.startsWith('bq') && !component.events.has(attribute.name)) {
        report('event', `${tag}.${attribute.name}`, `${tag} has no ${attribute.name} event.`);
      }
      const isNativeHandler = /^on(?:[a-z]+|[A-Z][a-zA-Z]*)$/.test(attribute.name);
      if (attribute.kind === 'prop' && !component.props.has(kebabToCamel(attribute.name)) && !isNativeHandler) {
        report('prop', `${tag}.${attribute.name}`, `${tag} has no "${attribute.name}" property.`);
      }
    }
  }

  for (const match of code.matchAll(/(bq-[a-z-]+)::part\(\s*([\w-]+)\s*\)/g)) {
    const [, tag, part] = match;
    const component = index.components.get(tag);
    if (component && !component.parts.has(part)) report('part', `${tag}::${part}`, `${tag} has no "${part}" part.`);
  }

  for (const match of code.matchAll(/--bq-[a-z0-9]+(?:-{1,2}[a-z0-9]+)*/g)) {
    const token = match[0];
    // Skip token families written as patterns, e.g. `--bq-spacing-*` or `--bq-text--{primary,secondary}`.
    if (/^-{0,2}[*{<]/.test(code.slice(match.index + token.length, match.index + token.length + 3))) continue;
    if (!index.tokens.has(token)) report('token', token, `${token} is not a BEEQ token or component CSS property.`);
  }

  return issues;
}
