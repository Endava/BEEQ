export const DOCS_ORIGIN = 'https://www.beeq.design';

export type FrontmatterValue = string | boolean | Record<string, string | boolean>;

export type Frontmatter = {
  data: Record<string, FrontmatterValue> | null;
  frontmatter: string;
  body: string;
};

export type LinkKind = 'skill' | 'reference';

function parseScalar(raw: string): string | boolean {
  const value = raw.replace(/\s+#.*$/, '').trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  const quoted = /^(['"])(.*)\1$/.exec(value);
  return quoted ? quoted[2] : value;
}

const BLOCK_STYLES = new Set(['>', '|', '>-', '|-']);
const isIndented = (line: string) => line.startsWith('  ');

type Read<T> = { value: T; next: number };

/** A folded (`>`) or literal (`|`) block: the indented or blank lines from `start`. */
function readBlock(lines: string[], start: number, style: string): Read<string> {
  let next = start;
  while (next < lines.length && (isIndented(lines[next]) || lines[next].trim() === '')) next++;
  const block = lines.slice(start, next).map((line) => line.trim());
  const value = style === '|' ? block.join('\n').trim() : block.join(' ').replace(/\s+/g, ' ').trim();
  return { value, next };
}

/** A nested map: the indented `key: value` lines from `start`. */
function readMap(lines: string[], start: number): Read<Record<string, string | boolean>> {
  const value: Record<string, string | boolean> = {};
  let next = start;
  for (; next < lines.length && isIndented(lines[next]); next++) {
    const child = /^\s+([A-Za-z][\w-]*):\s*(.*)$/.exec(lines[next]);
    if (child) value[child[1]] = parseScalar(child[2]);
  }
  return { value, next };
}

/** The value of a top-level key whose line ends with `rest`; block and map values continue on the lines from `start`. */
function readValue(lines: string[], start: number, rest: string): Read<FrontmatterValue> {
  if (BLOCK_STYLES.has(rest)) return readBlock(lines, start, rest[0]);
  if (rest === '') return readMap(lines, start);
  return { value: parseScalar(rest), next: start };
}

/**
 * Parses the YAML subset used by skill frontmatter: scalars, folded (`>`) and literal (`|`) blocks,
 * and one level of nested maps. `data` is `null` when the document has no frontmatter.
 */
export function parseFrontmatter(text: string): Frontmatter {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: null, frontmatter: '', body: text };

  const lines = match[1].split('\n');
  const data: Record<string, FrontmatterValue> = {};
  let i = 0;

  while (i < lines.length) {
    const top = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(lines[i]);
    i++;
    if (top) {
      const { value, next } = readValue(lines, i, top[2]);
      data[top[1]] = value;
      i = next;
    }
  }

  return { data, frontmatter: match[0], body: text.slice(match[0].length) };
}

type Segment = { code: boolean; text: string };

// A fenced block: an opening fence at the start of a line, up to the same fence on its own line.
const FENCE_PATTERN = /(?<![^\n])[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n[ \t]*\1[ \t]*(?![^\n])/g;
const INLINE_CODE_PATTERN = /`[^`\n]+`/g;

/** The first code match at or after `from`. A fence wins over inline code that starts at the same place. */
function nextCode(markdown: string, from: number) {
  let first: RegExpExecArray | null = null;
  for (const pattern of [FENCE_PATTERN, INLINE_CODE_PATTERN]) {
    pattern.lastIndex = from;
    const match = pattern.exec(markdown);
    if (match && (!first || match.index < first.index)) first = match;
  }
  return first;
}

/**
 * Splits markdown into code segments (fenced blocks and inline spans) and prose segments,
 * so link rewriting and MDX checks only touch prose.
 */
export function splitCode(markdown: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;

  for (let match = nextCode(markdown, 0); match; match = nextCode(markdown, last)) {
    const end = match.index + match[0].length;
    if (match.index > last) segments.push({ code: false, text: markdown.slice(last, match.index) });
    segments.push({ code: true, text: markdown.slice(match.index, end) });
    last = end;
  }

  if (last < markdown.length) segments.push({ code: false, text: markdown.slice(last) });
  return segments;
}

const LINK_PATTERN = /\]\(([^)\s]+)\)/g;

export const isRelativeTarget = (target: string) => !/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(target);

const lineAt = (text: string, index: number) => text.slice(0, index).split('\n').length;

function scanProse<T>(markdown: string, pattern: RegExp, map: (match: RegExpMatchArray, line: number) => T | null) {
  const results: T[] = [];
  let offset = 0;
  for (const segment of splitCode(markdown)) {
    if (!segment.code) {
      for (const match of segment.text.matchAll(pattern)) {
        const item = map(match, lineAt(markdown, offset + (match.index ?? 0)));
        if (item) results.push(item);
      }
    }
    offset += segment.text.length;
  }
  return results;
}

/** Lists relative markdown link targets found in prose, with 1-based line numbers. */
export const findRelativeLinks = (markdown: string) =>
  scanProse(markdown, LINK_PATTERN, (match, line) => (isRelativeTarget(match[1]) ? { target: match[1], line } : null));

/** Finds `<` and `{` in prose, which MDX would parse as JSX or expressions. */
export const findMdxUnsafe = (markdown: string) =>
  scanProse(markdown, /[<{]/g, (match, line) => ({ char: match[0], line }));

/** Maps a relative link in the skill source to its published docs URL. */
export function toDocsUrl(target: string, kind: LinkKind): string {
  const [file, hash] = target.split('#');
  const suffix = hash ? `#${hash}` : '';

  if (kind === 'skill') {
    const ref = /^(?:\.\/)?references\/([a-z0-9-]+)\.md$/.exec(file);
    if (ref) return `${DOCS_ORIGIN}/skill/references/${ref[1]}.md${suffix}`;
  } else {
    if (file === '../SKILL.md') return `${DOCS_ORIGIN}/skill.md${suffix}`;
    const ref = /^(?:\.\/)?([a-z0-9-]+)\.md$/.exec(file);
    if (ref) return `${DOCS_ORIGIN}/skill/references/${ref[1]}.md${suffix}`;
  }

  throw new Error(`Cannot publish relative link "${target}" from a ${kind} file.`);
}

/** Rewrites every relative link in prose to its absolute docs URL. Code is left untouched. */
export const rewriteLinks = (markdown: string, kind: LinkKind) =>
  splitCode(markdown)
    .map((segment) =>
      segment.code
        ? segment.text
        : segment.text.replace(LINK_PATTERN, (whole, target) =>
            isRelativeTarget(target) ? `](${toDocsUrl(target, kind)})` : whole,
          ),
    )
    .join('');
