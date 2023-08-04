import { FloatingUIPlacement } from '../../services/interfaces';

export const PANEL_PLACEMENT: ReadonlyArray<FloatingUIPlacement> = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
] as const;
