import { afterEach, describe, expect, it, vi } from 'vitest';

import { updateFormValidity } from '..';

const makeInternals = () => {
  const states = new Set<string>();
  return {
    states: {
      clear: vi.fn(() => states.clear()),
      add: vi.fn((s: string) => states.add(s)),
      has: (s: string) => states.has(s),
    },
    setValidity: vi.fn(),
  } as unknown as ElementInternals;
};

describe(updateFormValidity.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should do nothing when internals is not provided', () => {
    // Should not throw
    expect(() => updateFormValidity({ required: true, value: '' })).not.toThrow();
  });

  it('should set valid state when value is present and field is required', () => {
    const internals = makeInternals();

    updateFormValidity({ internals, required: true, value: 'hello' });

    expect(internals.states.add).toHaveBeenCalledWith('valid');
    expect(internals.setValidity).toHaveBeenCalledWith({});
  });

  it('should set invalid state and valueMissing when required and value is missing', () => {
    const internals = makeInternals();
    const inputElem = document.createElement('input');

    updateFormValidity({ internals, required: true, value: undefined, inputElem });

    expect(internals.states.add).toHaveBeenCalledWith('invalid');
    expect(internals.setValidity).toHaveBeenCalledWith({ valueMissing: true }, 'Please fill out this field', inputElem);
  });

  it('should use a custom validationMessage when provided', () => {
    const internals = makeInternals();
    const inputElem = document.createElement('input');

    updateFormValidity({ internals, required: true, value: undefined, inputElem, validationMessage: 'Custom error' });

    expect(internals.setValidity).toHaveBeenCalledWith({ valueMissing: true }, 'Custom error', inputElem);
  });

  it('should use the defaultMessage when no validationMessage is provided', () => {
    const internals = makeInternals();

    updateFormValidity({ internals, required: true, value: undefined, defaultMessage: 'Field is required' });

    expect(internals.setValidity).toHaveBeenCalledWith({ valueMissing: true }, 'Field is required', undefined);
  });

  it('should set valid state when field is not required', () => {
    const internals = makeInternals();

    updateFormValidity({ internals, required: false });

    expect(internals.states.add).toHaveBeenCalledWith('valid');
    expect(internals.setValidity).toHaveBeenCalledWith({});
  });

  it('should clear previous validity states before updating', () => {
    const internals = makeInternals();

    updateFormValidity({ internals, required: false });

    expect(internals.states.clear).toHaveBeenCalledTimes(1);
  });
});
