// The mechanical checks from the "Verify" step of src/beeq/SKILL.md, as code.
// Every row of the SKILL.md "Searches" table must have a rule here with the same `label`
// (enforced by __tests__/skill-structure.spec.ts).

export type Rule = {
  id: string;
  label: string;
  message: string;
  test: (code: string) => string[];
  /** Languages the rule applies to; every language when omitted. */
  languages?: string[];
  /** `review` hits are reported but do not fail. */
  severity?: 'error' | 'review';
};

export type RuleViolation = { id: string; severity: 'error' | 'review'; message: string; hits: string[] };

const stripMediaQueries = (code: string) => code.replace(/@(?:media|container)[^{]*\{/g, '{');

// Layout dimensions have no BEEQ token; the grid foundations size containers and tracks in rem.
// Each pattern keeps the leading character ($1) and the property ($2), and drops the value.
const SIZING_PATTERNS = [
  // CSS declarations.
  /(^|[\s{;"'`])((?:min-|max-)?(?:width|height|inline-size|block-size))\s*:[^;{}\n"'`]*/g,
  /(^|[\s{;"'`])(flex-basis|grid-(?:template|auto)-(?:columns|rows))\s*:[^;{}\n"'`]*/g,
  // Style objects with string values.
  /(^|[\s{,])((?:min|max)(?:Width|Height|InlineSize|BlockSize))\s*:\s*(['"`])(?:(?!\3).)*\3/g,
  /(^|[\s{,])(width|height|inlineSize|blockSize)\s*:\s*(['"`])(?:(?!\3).)*\3/g,
  /(^|[\s{,])(flexBasis|grid(?:Template|Auto)(?:Columns|Rows))\s*:\s*(['"`])(?:(?!\3).)*\3/g,
];

const stripSizing = (code: string) => SIZING_PATTERNS.reduce((text, pattern) => text.replace(pattern, '$1$2:'), code);

/** CSS rule bodies whose selector ends on a bare `bq-*` host, e.g. `.row bq-button { … }`. */
function hostVisualRules(code: string) {
  const hits: string[] = [];
  for (const match of code.matchAll(/([^{}]*?)\{([^{}]*)\}/g)) {
    const selector = match[1].trim().split(',').pop()?.trim() ?? '';
    if (!/(?:^|[\s>+~])bq-[a-z-]+$/.test(selector)) continue;
    const visual = /(?:^|[;{\s])(background(?:-color)?|color|border(?:-[a-z]+)?|padding(?:-[a-z]+)?)\s*:/.exec(
      match[2],
    );
    if (visual) hits.push(`${selector} { ${visual[1]}: … }`);
  }
  return hits;
}

export const RULES: Rule[] = [
  {
    id: 'hex',
    label: 'Hex colours',
    test: (code) => code.match(/#[0-9a-fA-F]{3,8}\b(?![-\w])/g) ?? [],
    message: 'Hard-coded hex colour; use a semantic token.',
  },
  {
    id: 'px-rem',
    label: 'Pixel or rem literals',
    test: (code) => stripSizing(stripMediaQueries(code)).match(/(?<![\w-])\d*\.?\d+(?:px|rem)\b/g) ?? [],
    message: 'Pixel or rem literal for spacing, radius, type, or stroke; use the token.',
  },
  {
    id: 'palette',
    label: 'Palette primitives',
    test: (code) => code.match(/--bq-(?:blue|grey|red|green|orange|yellow|purple|endava-[a-z]+)-\d+/g) ?? [],
    message: 'Palette primitive in product CSS; use a semantic role token.',
  },
  {
    id: 'self-closed',
    label: 'Self-closed custom elements (HTML)',
    languages: ['html'],
    test: (code) => code.match(/<bq-[a-z-]+(?:\s[^<>]*)?\/>/g) ?? [],
    message: 'Custom elements cannot self-close in HTML.',
  },
  {
    id: 'parts',
    label: 'Shadow parts',
    severity: 'review',
    test: (code) => code.match(/::part\([^)]*\)/g) ?? [],
    message: 'Shadow part used; confirm it is documented and not a layout fix.',
  },
  {
    id: 'host-visual',
    label: 'Host visual rules',
    test: hostVisualRules,
    message: 'Visual property on a bq-* host; use a prop, CSS custom property, or part.',
  },
  {
    id: 'emoji',
    label: 'Emojis',
    test: (code) => code.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) ?? [],
    message: 'Emoji used as an icon; use bq-icon.',
  },
  {
    id: 'element-type-cast',
    label: 'Type-erasing casts',
    test: (code) => code.match(/as\s+ElementType\b/g) ?? [],
    message: 'Type-erasing cast; wrap the BEEQ component directly.',
  },
  {
    id: 'select-readonly',
    label: 'Deprecated select usage',
    test: (code) => code.match(/<(?:bq-select|BqSelect)\b[^>]*\sreadonly\b/g) ?? [],
    message: 'readonly on bq-select is deprecated; use disable-search.',
  },
  {
    id: 'bq-table',
    label: 'Table markup',
    test: (code) => [
      ...(code.match(/<bq-table\b/g) ?? []),
      ...(code.match(/<table\b[^>]*>/g) ?? []).filter((tag) => !/\bbq-table\b/.test(tag)),
    ],
    message: 'BEEQ has no <bq-table>; every native <table> carries class="bq-table".',
  },
  {
    id: 'important',
    label: 'Important declarations',
    test: (code) => code.match(/!important\b/g) ?? [],
    message: '!important declaration; set the value with a normal declaration at the right scope.',
  },
  {
    id: 'node-modules-url',
    label: 'node_modules URLs (HTML)',
    languages: ['html'],
    test: (code) => code.match(/["'(]\/?node_modules\/[^"')\s]*/g) ?? [],
    message: 'HTML links a node_modules URL; use the CDN or import from the bundler entry.',
  },
  {
    id: 'font-family-token',
    label: 'Invented font tokens',
    test: (code) => code.match(/--bq-font-family-[\w-]*/g) ?? [],
    message: '--bq-font-family is the only font-family token.',
  },
  {
    id: 'token-separator',
    label: 'Token separators',
    test: (code) =>
      code.match(
        /--bq-(?:background|text|icon|ui|radius|box-shadow|font-size|font-weight|font-line-height)-[a-z0-9][\w-]*/g,
      ) ?? [],
    message: 'Role and scale tokens take a double dash, e.g. --bq-font-size--s, --bq-text--secondary.',
  },
];

/**
 * Runs every rule over `code`. `language` limits language-specific rules; `allow` skips rule ids.
 * Rules with `severity: 'review'` are reported but do not count as failures.
 */
export function findRuleViolations(
  code: string,
  { language, allow = [] }: { language?: string; allow?: string[] } = {},
) {
  const violations: RuleViolation[] = [];
  for (const rule of RULES) {
    if (allow.includes(rule.id)) continue;
    if (rule.languages && language && !rule.languages.includes(language)) continue;
    const hits = rule.test(code);
    if (hits.length) {
      violations.push({
        id: rule.id,
        severity: rule.severity ?? 'error',
        message: rule.message,
        hits: [...new Set(hits)],
      });
    }
  }
  return violations;
}
