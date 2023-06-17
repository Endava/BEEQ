import { assertUnreachable } from '..';

type Switch = 'a' | 'b';

describe(assertUnreachable.name, () => {
  it('should throw error if the value is not reachable', () => {
    const type = 'c' as unknown as Switch;
    try {
      switch (type) {
        case 'a': {
          expect(true).toBe(false);
          break;
        }
        case 'b': {
          expect(true).toBe(false);
          break;
        }
        default: {
          assertUnreachable(type);
        }
      }
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError);
    }
  });

  it('should show typescript error', () => {
    const type = 'a' as unknown as Switch;
    switch (type) {
      case 'a': {
        expect(true).toBe(true);
        break;
      }
      default: {
        // @ts-expect-error
        assertUnreachable(type);
      }
    }
  });
});
