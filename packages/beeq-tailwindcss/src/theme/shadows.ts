/**
 * Elevation shadows per mode. Spread into every mode object so a nested `[bq-mode]` subtree
 * resets them, and into the root theme as the fallback when no mode is set.
 */
export const LIGHT_BOX_SHADOWS = {
  'bq-box-shadow--xs': '0 2px 0 rgba(0, 0, 0, 0.016)',
  'bq-box-shadow--s': '0 8px 24px rgba(0, 0, 0, 0.04)',
  'bq-box-shadow--m': '0 10px 48px -16px rgba(0, 0, 0, 0.12)',
  'bq-box-shadow--l': '0 20px 58px -16px rgba(0, 0, 0, 0.16)',
};

/** Dark surfaces need a 1px edge ring (`--bq-stroke--primary`) and denser shadows to show elevation */
export const DARK_BOX_SHADOWS = {
  'bq-box-shadow--xs': '0 1px 2px rgba(0, 0, 0, 0.4)',
  'bq-box-shadow--s': '0 0 0 1px var(--bq-stroke--primary), 0 8px 24px rgba(0, 0, 0, 0.4)',
  'bq-box-shadow--m': '0 0 0 1px var(--bq-stroke--primary), 0 10px 48px -16px rgba(0, 0, 0, 0.6)',
  'bq-box-shadow--l': '0 0 0 1px var(--bq-stroke--primary), 0 20px 58px -16px rgba(0, 0, 0, 0.7)',
};
