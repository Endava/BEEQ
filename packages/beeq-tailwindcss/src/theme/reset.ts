/* -------------------------------------------------------------------------- */
/*                  BEEQ's opinionated reset for TailwindCSS                  */
/* -------------------------------------------------------------------------- */

import type { CSSRuleObject } from 'tailwindcss/types/config';

import { RESET } from '../generated/reset';

/**
 * Generated from `@beeq/core` `foundations/reset.scss`.
 * Selectors are wrapped in `:where()` (zero specificity) so any consumer style overrides the reset.
 * `html` and `body` are not wrapped, so these defaults still win over Tailwind CSS preflight by source order.
 */
export const reset: CSSRuleObject | CSSRuleObject[] = RESET;
