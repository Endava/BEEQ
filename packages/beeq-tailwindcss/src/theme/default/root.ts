import { LIGHT_BOX_SHADOWS } from '../shadows';

export const DefaultRootTheme = {
  'bq-white': '#ffffff',
  'bq-black': '#060708',
  // Neutrals
  'bq-neutral-50': 'var(--bq-grey-50)',
  'bq-neutral-100': 'var(--bq-grey-100)',
  'bq-neutral-200': 'var(--bq-grey-200)',
  'bq-neutral-300': 'var(--bq-grey-300)',
  'bq-neutral-400': 'var(--bq-grey-400)',
  'bq-neutral-500': 'var(--bq-grey-500)',
  'bq-neutral-600': 'var(--bq-grey-600)',
  'bq-neutral-700': 'var(--bq-grey-700)',
  'bq-neutral-800': 'var(--bq-grey-800)',
  'bq-neutral-900': 'var(--bq-grey-900)',
  'bq-neutral-950': 'var(--bq-grey-950)',
  'bq-neutral-1000': 'var(--bq-grey-1000)',
  /**
   * Intents. Each intent exposes five tokens:
   * - `-light`: subtle tint for light mode (read by `ui--{intent}-alt`)
   * - base: solid fill (read by `ui--{intent}`)
   * - `-dark`: subtle tint for dark mode (read by `ui--{intent}-alt`)
   * - `-strong`: text, icon and stroke on light surfaces (>= 4.5:1)
   * - `-bright`: text, icon and stroke on dark surfaces (>= 4.5:1 and APCA Lc >= 60)
   * The focus ring color lives at mode level (`--bq-focus`).
   */
  // Brand
  'bq-brand-light': 'var(--bq-iris-100)',
  'bq-brand': 'var(--bq-iris-600)',
  'bq-brand-dark': 'var(--bq-iris-950)',
  'bq-brand-strong': 'var(--bq-iris-600)',
  'bq-brand-bright': 'var(--bq-iris-300)',
  // Accent
  'bq-accent-light': 'var(--bq-purple-100)',
  'bq-accent': 'var(--bq-purple-600)',
  'bq-accent-dark': 'var(--bq-purple-950)',
  'bq-accent-strong': 'var(--bq-purple-600)',
  'bq-accent-bright': 'var(--bq-purple-300)',
  // Success
  'bq-success-light': 'var(--bq-teal-100)',
  'bq-success': 'var(--bq-teal-600)',
  'bq-success-dark': 'var(--bq-teal-950)',
  'bq-success-strong': 'var(--bq-teal-800)',
  'bq-success-bright': 'var(--bq-teal-400)',
  // Danger
  'bq-danger-light': 'var(--bq-red-100)',
  'bq-danger': 'var(--bq-red-600)',
  'bq-danger-dark': 'var(--bq-red-950)',
  'bq-danger-strong': 'var(--bq-red-700)',
  'bq-danger-bright': 'var(--bq-red-300)',
  // Warning
  'bq-warning-light': 'var(--bq-gold-100)',
  'bq-warning': 'var(--bq-gold-600)',
  'bq-warning-dark': 'var(--bq-gold-950)',
  'bq-warning-strong': 'var(--bq-gold-800)',
  'bq-warning-bright': 'var(--bq-gold-400)',
  // Info
  'bq-info-light': 'var(--bq-blue-100)',
  'bq-info': 'var(--bq-blue-600)',
  'bq-info-dark': 'var(--bq-blue-950)',
  'bq-info-strong': 'var(--bq-blue-700)',
  'bq-info-bright': 'var(--bq-blue-300)',
  // Data
  'bq-data-01': 'var(--bq-brand)',
  'bq-data-02': 'var(--bq-purple-600)',
  'bq-data-03': 'var(--bq-magenta-600)',
  'bq-data-04': 'var(--bq-cyan-600)',
  'bq-data-05': 'var(--bq-teal-600)',
  'bq-data-06': 'var(--bq-orange-600)',
  'bq-data-07': 'var(--bq-yellow-600)',
  'bq-data-08': 'var(--bq-red-600)',
  'bq-data-09': 'var(--bq-blue-600)',
  'bq-data-10': 'var(--bq-grey-600)',
  'bq-data-11': 'var(--bq-black)',
  'bq-data-12': 'var(--bq-white)',
  // Border Radius
  'bq-radius--none': '0', // 0px
  'bq-radius--xs2': '0.125rem', // 2px
  'bq-radius--xs': '0.25rem', // 4px
  'bq-radius--s': '0.5rem', // 8px
  'bq-radius--m': '0.75rem', // 12px
  'bq-radius--l': '1.5rem', // 24px
  'bq-radius--full': '9999px',
  // Box Shadow (light values; mode objects override them)
  ...LIGHT_BOX_SHADOWS,
  // Fonts
  'bq-font-family': "'Outfit', sans-serif",
  'bq-font-size--xs': '0.75rem', // 12px
  'bq-font-size--s': '0.875rem', // 14px
  'bq-font-size--m': '1rem', // 16px
  'bq-font-size--l': '1.125rem', // 18px
  'bq-font-size--xl': '1.5rem', // 24px
  'bq-font-size--xxl': '2rem', // 32px
  'bq-font-size--xxl2': '2.5rem', // 40px
  'bq-font-size--xxl3': '3rem', // 48px
  'bq-font-size--xxl4': '3.5rem', // 56px
  'bq-font-size--xxl5': '4rem', // 64px
  'bq-font-weight--thin': '100',
  'bq-font-weight--light': '300',
  'bq-font-weight--regular': '400',
  'bq-font-weight--medium': '500',
  'bq-font-weight--semibold': '600',
  'bq-font-weight--bold': '700',
  'bq-font-line-height--small': '1.2',
  'bq-font-line-height--regular': '1.5',
  'bq-font-line-height--large': '1.5',
  // Spacing
  'bq-spacing-xs3': '0.125rem', // 2px
  'bq-spacing-xs2': '0.25rem', // 4px
  'bq-spacing-xs': '0.5rem', // 8px
  'bq-spacing-s': '0.75rem', // 12px
  'bq-spacing-m': '1rem', // 16px
  'bq-spacing-l': '1.5rem', // 24px
  'bq-spacing-xl': '2rem', // 32px
  'bq-spacing-xxl': '2.5rem', // 40px
  'bq-spacing-xxl2': '3.5rem', // 56px
  'bq-spacing-xxl3': '4rem', // 64px
  'bq-spacing-xxl4': '4.5rem', // 72px
  // Stroke width
  'bq-stroke-s': '1px',
  'bq-stroke-m': '2px',
  'bq-stroke-l': '3px',
};
