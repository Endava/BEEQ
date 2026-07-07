import { DECADE_GRID_SIZE } from './constants';

/**
 * Advances a focused month cursor by `delta` months, carrying over to the
 * previous or next year as needed. Pure — accepts and returns primitives so
 * it can be unit-tested and reused by keyboard handlers.
 */
export const advanceFocusedMonth = (
  focusedMonth: number,
  focusedYear: number,
  delta: number,
): { month: number; year: number } => {
  let month = focusedMonth + delta;
  let year = focusedYear;
  while (month < 0) {
    month += 12;
    year -= 1;
  }
  while (month > 11) {
    month -= 12;
    year += 1;
  }
  return { month, year };
};

/**
 * Advances a focused year cursor by `delta` years, sliding the visible
 * decade grid so the focused year always stays in view.
 */
export const advanceFocusedYear = (
  focusedYear: number,
  decadeStart: number,
  delta: number,
): { year: number; decadeStart: number } => {
  const year = focusedYear + delta;
  let nextDecadeStart = decadeStart;
  if (year < decadeStart) {
    nextDecadeStart = decadeStart - DECADE_GRID_SIZE;
  } else if (year > decadeStart + DECADE_GRID_SIZE - 1) {
    nextDecadeStart = decadeStart + DECADE_GRID_SIZE;
  }
  return { year, decadeStart: nextDecadeStart };
};

/**
 * Number of columns used to render the months/years grids. The grids widen
 * from 3 → 4 columns when multiple months are visible, so vertical arrow
 * navigation stride must match.
 */
export const getGridColumns = (monthCount: number): number => (monthCount > 1 ? 4 : 3);
