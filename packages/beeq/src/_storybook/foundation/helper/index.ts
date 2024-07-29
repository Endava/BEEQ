import { getCSSVariableValue } from '../../../shared/utils';

export function mapColors(colors: string[]) {
  return Object.fromEntries(colors.map((name: string) => [name, getCSSVariableValue(name, document.body)]));
}

export function capitalize(text: string) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
