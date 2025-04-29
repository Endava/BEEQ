import { stringToArray } from '../stringToArray';

describe('stringToArray', () => {
  it('should convert a JSON string array to an array', () => {
    const input = '["a", "b", "c"]';
    const result = stringToArray(input);
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should return the same array when input is already an array', () => {
    const input = ['x', 'y', 'z'];
    const result = stringToArray(input);
    expect(result).toBe(input); // Check reference equality
    expect(result).toEqual(['x', 'y', 'z']);
  });

  it('should handle empty JSON array string', () => {
    const input = '[]';
    const result = stringToArray(input);
    expect(result).toEqual([]);
  });

  it('should handle empty array input', () => {
    const input: string[] = [];
    const result = stringToArray(input);
    expect(result).toEqual([]);
  });

  it('should handle single item JSON array string', () => {
    const input = '["test"]';
    const result = stringToArray(input);
    expect(result).toEqual(['test']);
  });

  it('should handle JSON array string with numbers as strings', () => {
    const input = '["1", "2", "3"]';
    const result = stringToArray(input);
    expect(result).toEqual(['1', '2', '3']);
  });

  it('should handle JSON array string with special characters', () => {
    const input = '["@test", "#test", "$test"]';
    const result = stringToArray(input);
    expect(result).toEqual(['@test', '#test', '$test']);
  });

  it('should handle JSON array string with spaces', () => {
    const input = '["hello world", "test space"]';
    const result = stringToArray(input);
    expect(result).toEqual(['hello world', 'test space']);
  });

  // Error cases
  it('should throw for invalid JSON string', () => {
    const input = 'invalid json';
    expect(() => stringToArray(input)).toThrow();
  });

  it('should throw for malformed JSON array string', () => {
    const input = '[1, 2, 3'; // Missing closing bracket
    expect(() => stringToArray(input)).toThrow();
  });

  // Edge cases
  it('should handle JSON array string with empty strings', () => {
    const input = '["", "", ""]';
    const result = stringToArray(input);
    expect(result).toEqual(['', '', '']);
  });

  // Non-string array elements
  it('should convert non-array JSON to array', () => {
    const input = '{"key": "value"}';
    const result = stringToArray(input);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle array with null values', () => {
    const input = '["a", null, "c"]';
    const result = stringToArray(input);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle array with nested arrays', () => {
    const input = '["a", ["b", "c"], "d"]';
    const result = stringToArray(input);
    expect(Array.isArray(result)).toBe(true);
  });

  // Type checking
  it('should return array type', () => {
    const input = '["test"]';
    const result = stringToArray(input);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should maintain string type for array elements when input is valid', () => {
    const input = '["1", "2", "3"]';
    const result = stringToArray(input);
    result.forEach((item) => {
      expect(typeof item).toBe('string');
    });
  });
});
