import { describe, expect, it } from 'vitest';

import {
  applySelection,
  buildTentativeRange,
  isRangeEnd,
  isRangeInner,
  isRangeStart,
  isSelected,
  parseValue,
  serializeValue,
} from '../helper/selection';

describe('parseValue', () => {
  it('returns [] for empty/missing input', () => {
    expect(parseValue(undefined, 'single')).toEqual([]);
    expect(parseValue(null, 'single')).toEqual([]);
    expect(parseValue('', 'single')).toEqual([]);
    expect(parseValue('   ', 'multi')).toEqual([]);
  });

  it('parses single as a single-element array', () => {
    expect(parseValue('2024-05-30', 'single')).toEqual(['2024-05-30']);
  });

  it('parses multi as sorted, de-duplicated space-separated list', () => {
    expect(parseValue('2024-05-30 2024-05-01 2024-05-30', 'multi')).toEqual(['2024-05-01', '2024-05-30']);
  });

  it('parses range as auto-sorted start/end', () => {
    expect(parseValue('2024-05-30/2024-05-01', 'range')).toEqual(['2024-05-01', '2024-05-30']);
  });

  it('parses a lone date as a pending range start (round-trips with serializeValue)', () => {
    expect(parseValue('2024-05-30', 'range')).toEqual(['2024-05-30']);
  });

  it('returns [] for malformed range', () => {
    expect(parseValue('a/b/c', 'range')).toEqual([]);
  });

  it('rejects malformed single values', () => {
    expect(parseValue('abc', 'single')).toEqual([]);
    expect(parseValue('2024-13-01', 'single')).toEqual([]);
    expect(parseValue('2024-02-30', 'single')).toEqual([]);
    expect(parseValue('2024/05/30', 'single')).toEqual([]);
  });

  it('filters malformed entries from multi selection', () => {
    expect(parseValue('2024-05-01 not-a-date 2024-05-30 2024-99-99', 'multi')).toEqual(['2024-05-01', '2024-05-30']);
  });

  it('rejects malformed endpoints inside a range', () => {
    expect(parseValue('bad/2024-05-30', 'range')).toEqual(['2024-05-30']);
    expect(parseValue('2024-05-01/bad', 'range')).toEqual(['2024-05-01']);
    expect(parseValue('bad/also-bad', 'range')).toEqual([]);
  });
});

describe('serializeValue', () => {
  it('returns "" for empty selection', () => {
    expect(serializeValue([], 'single')).toBe('');
    expect(serializeValue([], 'multi')).toBe('');
    expect(serializeValue([], 'range')).toBe('');
  });

  it('serializes single as the ISO string', () => {
    expect(serializeValue(['2024-05-30'], 'single')).toBe('2024-05-30');
  });

  it('serializes multi as sorted, de-duplicated, space-separated string', () => {
    expect(serializeValue(['2024-05-30', '2024-05-01', '2024-05-30'], 'multi')).toBe('2024-05-01 2024-05-30');
  });

  it('serializes range as auto-sorted "start/end"', () => {
    expect(serializeValue(['2024-05-30', '2024-05-01'], 'range')).toBe('2024-05-01/2024-05-30');
  });

  it('serializes single-value range as just the start', () => {
    expect(serializeValue(['2024-05-01'], 'range')).toBe('2024-05-01');
  });
});

describe('parseValue/serializeValue round trip', () => {
  it('preserves single', () => {
    expect(serializeValue(parseValue('2024-05-30', 'single'), 'single')).toBe('2024-05-30');
  });

  it('preserves multi', () => {
    const value = '2024-05-01 2024-05-30 2024-06-15';
    expect(serializeValue(parseValue(value, 'multi'), 'multi')).toBe(value);
  });

  it('preserves range', () => {
    const value = '2024-05-01/2024-05-30';
    expect(serializeValue(parseValue(value, 'range'), 'range')).toBe(value);
  });
});

describe('isSelected', () => {
  it('returns false for empty selection', () => {
    expect(isSelected('2024-05-30', [], 'single')).toBe(false);
  });

  it('single matches by strict equality', () => {
    expect(isSelected('2024-05-30', ['2024-05-30'], 'single')).toBe(true);
    expect(isSelected('2024-05-31', ['2024-05-30'], 'single')).toBe(false);
  });

  it('multi matches on inclusion', () => {
    expect(isSelected('2024-05-30', ['2024-05-01', '2024-05-30'], 'multi')).toBe(true);
    expect(isSelected('2024-05-15', ['2024-05-01', '2024-05-30'], 'multi')).toBe(false);
  });

  it('range matches inclusive endpoints', () => {
    const range = ['2024-05-01', '2024-05-30'];
    expect(isSelected('2024-05-01', range, 'range')).toBe(true);
    expect(isSelected('2024-05-30', range, 'range')).toBe(true);
    expect(isSelected('2024-05-15', range, 'range')).toBe(true);
    expect(isSelected('2024-04-30', range, 'range')).toBe(false);
    expect(isSelected('2024-05-31', range, 'range')).toBe(false);
  });

  it('range with only a start matches only the start', () => {
    expect(isSelected('2024-05-01', ['2024-05-01'], 'range')).toBe(true);
    expect(isSelected('2024-05-02', ['2024-05-01'], 'range')).toBe(false);
  });
});

describe('isRangeStart / isRangeEnd / isRangeInner', () => {
  const range = ['2024-05-01', '2024-05-30'];

  it('detects start / end only for complete range selections', () => {
    expect(isRangeStart('2024-05-01', range, 'range')).toBe(true);
    expect(isRangeEnd('2024-05-30', range, 'range')).toBe(true);
    expect(isRangeStart('2024-05-01', ['2024-05-01'], 'range')).toBe(false);
    expect(isRangeStart('2024-05-01', range, 'single')).toBe(false);
  });

  it('detects inner dates (strictly between)', () => {
    expect(isRangeInner('2024-05-15', range, 'range')).toBe(true);
    expect(isRangeInner('2024-05-01', range, 'range')).toBe(false);
    expect(isRangeInner('2024-05-30', range, 'range')).toBe(false);
    expect(isRangeInner('2024-05-15', range, 'multi')).toBe(false);
  });
});

describe('applySelection', () => {
  it('single always replaces', () => {
    expect(applySelection('2024-05-30', ['2024-05-01'], 'single')).toEqual(['2024-05-30']);
    expect(applySelection('2024-05-30', [], 'single')).toEqual(['2024-05-30']);
  });

  it('multi toggles inclusion', () => {
    expect(applySelection('2024-05-30', [], 'multi')).toEqual(['2024-05-30']);
    expect(applySelection('2024-05-30', ['2024-05-01'], 'multi')).toEqual(['2024-05-01', '2024-05-30']);
    expect(applySelection('2024-05-01', ['2024-05-01', '2024-05-30'], 'multi')).toEqual(['2024-05-30']);
  });

  it('multi keeps result sorted', () => {
    expect(applySelection('2024-01-01', ['2024-05-30'], 'multi')).toEqual(['2024-01-01', '2024-05-30']);
  });

  it('range: no selection → begins a new range', () => {
    expect(applySelection('2024-05-01', [], 'range')).toEqual(['2024-05-01']);
  });

  it('range: single start → completes the range (auto-sorted)', () => {
    expect(applySelection('2024-05-30', ['2024-05-01'], 'range')).toEqual(['2024-05-01', '2024-05-30']);
    // reverse click order still auto-sorts
    expect(applySelection('2024-05-01', ['2024-05-30'], 'range')).toEqual(['2024-05-01', '2024-05-30']);
  });

  it('range: full range → starts over', () => {
    expect(applySelection('2024-06-15', ['2024-05-01', '2024-05-30'], 'range')).toEqual(['2024-06-15']);
  });
});

describe('buildTentativeRange', () => {
  it('returns [] when either endpoint is missing', () => {
    expect(buildTentativeRange(undefined, '2024-05-30')).toEqual([]);
    expect(buildTentativeRange('2024-05-01', undefined)).toEqual([]);
    expect(buildTentativeRange(undefined, undefined)).toEqual([]);
  });

  it('returns an auto-sorted range', () => {
    expect(buildTentativeRange('2024-05-01', '2024-05-30')).toEqual(['2024-05-01', '2024-05-30']);
    expect(buildTentativeRange('2024-05-30', '2024-05-01')).toEqual(['2024-05-01', '2024-05-30']);
  });
});
