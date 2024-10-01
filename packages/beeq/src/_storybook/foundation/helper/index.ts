import { getCSSVariableValue } from '../../../shared/utils';

export function capitalize(text: string) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getVariableValue(name: string) {
  return getCSSVariableValue(name, document.body);
}
