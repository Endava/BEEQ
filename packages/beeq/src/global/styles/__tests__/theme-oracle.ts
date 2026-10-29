/** Temporary, test-only migration oracle. Never a runtime dependency of core. */
import { CSS_COLORS } from '../../../../../beeq-tailwindcss/src/theme/colors/base';
import {
  DefaultDarkTheme,
  DefaultLightTheme,
  DefaultRootTheme,
} from '../../../../../beeq-tailwindcss/src/theme/default';
import { EndavaDarkTheme, EndavaLightTheme, EndavaRootTheme } from '../../../../../beeq-tailwindcss/src/theme/endava';

export { CSS_COLORS, DefaultRootTheme, EndavaRootTheme };

export const modeObjects = {
  'beeq-light': DefaultLightTheme,
  'beeq-dark': DefaultDarkTheme,
  'endava-light': EndavaLightTheme,
  'endava-dark': EndavaDarkTheme,
};

export type ThemeMode = keyof typeof modeObjects;

export const roleNames = [
  '--bq-text--primary',
  '--bq-text--danger',
  '--bq-text--on-danger',
  '--bq-icon--brand',
  '--bq-stroke--info',
  '--bq-ui--info',
  '--bq-focus',
] as const;

// Concrete hex expectations traced to the preset's role -> root -> primitive
// definitions. Browser tests also validate these against the pinned preset CSS.
// No CSS custom-property resolver is implemented here.
export const roleHex: Record<ThemeMode, readonly string[]> = {
  'beeq-light': ['#2a2c35', '#b41226', '#ffffff', '#4f46e5', '#1158bc', '#156eeb', '#4f46e5'],
  'beeq-dark': ['#f1f2f4', '#f3a2ac', '#ffffff', '#b2c0fe', '#a1c5f7', '#156eeb', '#b2c0fe'],
  'endava-light': ['#192b37', '#a72925', '#ffffff', '#ff5640', '#3b6684', '#417191', '#ff5640'],
  'endava-dark': ['#ffffff', '#e84641', '#14222c', '#ff5640', '#9dcff0', '#9dcff0', '#ff5640'],
};
