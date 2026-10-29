import plugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  name: string;
  selectors: string[];
  theme: Record<string, string>;
  /** Optional: inherit from another theme */
  extends?: string;
  /**
   * Optional: flags the entry as a mode (dark/light) vs a theme (endava/default).
   * Informational only — it no longer affects specificity, since every selector is emitted inside `:where()`.
   */
  mode?: boolean;
}

/**
 * Theme swapper configuration interface
 */
export interface ThemeSwapperConfig {
  themes: ThemeConfig[];
  /** Optional: custom CSS variable prefix */
  prefix?: string;
  /** Optional: enable development warnings */
  debug?: boolean;
}

// Simple cache for CSS variables
const cache = new Map<string, Record<string, string>>();

/**
 * Processes CSS variables with optional prefix and caching
 *
 * @param {Record<string, string>} theme - The theme to process
 * @param {string} prefix - The prefix to use for the CSS variables
 * @param {string} cacheKey - The cache key to use for the CSS variables
 * @return {Record<string, string>} - The processed CSS variables
 */
const processVariables = (theme: Record<string, string>, prefix: string, cacheKey: string) => {
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const variables = Object.fromEntries(
    Object.entries(theme).map(([key, value]) => {
      const cssVar = key.startsWith('--') ? key : `--${key}`;
      return [prefix && !cssVar.startsWith(`--${prefix}`) ? `--${prefix}-${cssVar.slice(2)}` : cssVar, value];
    }),
  );

  cache.set(cacheKey, variables);
  return variables;
};

/**
 * Resolves theme inheritance
 *
 * @param {ThemeConfig[]} themes - The themes to process
 * @return {ThemeConfig[]} - The themes with resolved inheritance
 */
const resolveInheritance = (themes: ThemeConfig[]): ThemeConfig[] => {
  const themeMap = new Map(themes.map((t) => [t.name, t]));
  const resolved = new Map<string, Record<string, string>>();

  const resolve = (name: string): Record<string, string> => {
    if (resolved.has(name)) return resolved.get(name)!;

    const theme = themeMap.get(name);
    if (!theme) throw new Error(`Theme "${name}" not found`);

    const merged = theme.extends ? { ...resolve(theme.extends), ...theme.theme } : { ...theme.theme };

    resolved.set(name, merged);
    return merged;
  };

  return themes.map((t) => ({ ...t, theme: resolve(t.name) }));
};

/**
 * Creates a theme swapper plugin
 *
 * @param {ThemeSwapperConfig} config - The theme swapper configuration
 */
export function createThemeSwapper({ themes, prefix = '', debug = false }: ThemeSwapperConfig) {
  return ({ addBase }: Pick<PluginAPI, 'addBase'>) => {
    // Minimal validation
    if (!themes?.length) throw new Error('At least one theme required');

    const names = new Set();
    themes.forEach(({ name, selectors }, i) => {
      if (!name) throw new Error(`Theme at index ${i} missing name`);
      if (names.has(name)) throw new Error(`Duplicate theme: "${name}"`);
      if (!selectors?.length) throw new Error(`Theme "${name}" needs selectors`);
      names.add(name);
    });

    if (debug) {
      console.log(`🎨 Processing ${themes.length} themes`);
    }

    // Process themes in one pass
    const cssRules = resolveInheritance(themes).reduce(
      (rules, { name, selectors, theme }) => {
        const variables = processVariables(theme, prefix, `${name}-${prefix}`);
        // Every selector (themes and modes) gets zero specificity, so source order decides precedence
        // and consumer overrides (e.g. a plain `:root { ... }`) always win over BEEQ defaults.
        const selector = selectors.map((s) => `:where(${s})`).join(', ');

        rules[selector] = variables;
        return rules;
      },
      {} as Record<string, Record<string, string>>,
    );

    if (debug) {
      console.log(`🎨 Generated ${Object.keys(cssRules).length} CSS rules`);
    }

    addBase(cssRules);
  };
}

/**
 * BEEQ theme swapper plugin
 *
 * @param {ThemeSwapperConfig | ThemeConfig[]} config - The theme swapper configuration
 */
export const BeeqThemeSwapper = (config: ThemeSwapperConfig | ThemeConfig[]) =>
  plugin(createThemeSwapper(Array.isArray(config) ? { themes: config } : config));

/**
 * Clear cache utility
 */
export const clearThemeCache = () => cache.clear();
