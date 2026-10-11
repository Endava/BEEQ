/* -------------------------------------------------------------------------- */
/*            Token resolver and WCAG color math for the theme tests           */
/* -------------------------------------------------------------------------- */
/**
 * The resolver works on a flat `{ '--bq-x': 'value | var(--bq-y)' }` map, so the same assertions can run
 * against the TS theme objects today and against a compiled native `tokens.css` later.
 */

export type TokenMap = Record<string, string>;

export type Rgb = { r: number; g: number; b: number };

export type TokenResolver = {
  /** Whether the token is defined in the map */
  has: (name: string) => boolean;
  /** The raw (unresolved) value of a token */
  raw: (name: string) => string | undefined;
  /** Follows `var()` chains and returns the final color as lowercase `#rrggbb` */
  resolve: (name: string) => string;
  /** The chain of custom property names visited while resolving `name` (including `name` itself) */
  trace: (name: string) => string[];
};

/** Normalizes a token name to its CSS custom property form (`bq-x` → `--bq-x`) */
export const toCssVar = (name: string): string => (name.startsWith('--') ? name : `--${name}`);

/**
 * Merges token maps in cascade order (later maps win) and normalizes every key to a leading `--`.
 */
export const mergeTokenMaps = (...maps: Record<string, string>[]): TokenMap =>
  Object.assign({}, ...maps.map((map) => Object.fromEntries(Object.entries(map).map(([k, v]) => [toCssVar(k), v]))));

type VarReference = { name: string; fallback?: string };

/**
 * Parses `var(--name)` or `var(--name, fallback)`. Returns `undefined` when the value is not a single `var()`.
 */
export const parseVar = (value: string): VarReference | undefined => {
  const trimmed = value.trim();
  if (!trimmed.startsWith('var(') || !trimmed.endsWith(')')) return undefined;

  const inner = trimmed.slice(4, -1);
  let depth = 0;
  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === ',' && depth === 0) {
      return { name: inner.slice(0, i).trim(), fallback: inner.slice(i + 1).trim() };
    }
  }
  return { name: inner.trim() };
};

/** Parses `#rgb` or `#rrggbb` (case-insensitive) */
export const parseHex = (value: string): Rgb => {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) throw new Error(`Not a hex color: "${value}"`);

  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1];
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
};

const channelToHex = (value: number) => value.toString(16).padStart(2, '0');

export const toHex = ({ r, g, b }: Rgb): string => `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;

/** Normalizes any supported hex notation to lowercase `#rrggbb` */
export const normalizeHex = (value: string): string => toHex(parseHex(value));

/** WCAG 2.x relative luminance */
export const relativeLuminance = (color: string): number => {
  const { r, g, b } = parseHex(color);
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

/** WCAG 2.x contrast ratio (1–21) */
export const contrastRatio = (foreground: string, background: string): number => {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Replicates `color-mix(in srgb, <fill>, <base> <percentage>%)`, i.e. what `blendColor()` emits for hover/active.
 * Linear interpolation of the gamma-encoded sRGB channels (0–255), rounded to integers.
 */
export const mix = (fill: string, base: string, percentage: number): string => {
  const a = parseHex(fill);
  const b = parseHex(base);
  const p = percentage / 100;
  const lerp = (x: number, y: number) => Math.round(x * (1 - p) + y * p);
  return toHex({ r: lerp(a.r, b.r), g: lerp(a.g, b.g), b: lerp(a.b, b.b) });
};

/**
 * Creates a resolver for a flat token map (keys with or without leading `--`).
 * Throws on cycles, undefined references without fallback, and non-hex final values.
 */
export const createResolver = (tokens: Record<string, string>): TokenResolver => {
  const map = mergeTokenMaps(tokens);

  const walk = (value: string, chain: string[]): { color: string; chain: string[] } => {
    const ref = parseVar(value);
    if (!ref) return { color: normalizeHex(value), chain };

    if (chain.includes(ref.name)) throw new Error(`Cycle detected: ${[...chain, ref.name].join(' → ')}`);

    const next = map[ref.name];
    if (next !== undefined) return walk(next, [...chain, ref.name]);
    if (ref.fallback !== undefined) return walk(ref.fallback, chain);

    throw new Error(`Unresolved token ${ref.name} (chain: ${chain.join(' → ')})`);
  };

  const start = (name: string) => {
    const key = toCssVar(name);
    const value = map[key];
    if (value === undefined) throw new Error(`Token ${key} is not defined`);
    return walk(value, [key]);
  };

  return {
    has: (name) => map[toCssVar(name)] !== undefined,
    raw: (name) => map[toCssVar(name)],
    resolve: (name) => start(name).color,
    trace: (name) => start(name).chain,
  };
};
