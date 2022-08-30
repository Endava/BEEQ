import { getColorCSSVariable } from './';

describe('cssVariables - getColorCSSVariable()', () => {
  it('should return the correct CSS Custom Property string', () => {
    const token = 'ui--primary';
    const result = `var(--bq-${token})`;

    expect(getColorCSSVariable(token)).toEqual(result);
  });
});
