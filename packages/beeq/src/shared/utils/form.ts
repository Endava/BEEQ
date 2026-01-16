type FormValidityOptions = {
  /** The ElementInternals instance */
  internals?: ElementInternals;
  /** Whether the field is required */
  required?: boolean;
  /** Current field value */
  value?: string | string[] | number;
  /** Reference to the input element */
  inputElem?: HTMLInputElement | HTMLTextAreaElement;
  /** Custom validation message */
  validationMessage?: string;
  /** Default validation message */
  defaultMessage?: string;
};

/**
 * Updates form validity state for form-associated custom elements.
 * Handles the required field validation and sets appropriate validity states.
 *
 * @param {TFormValidityOptions} options - Validation options
 * @param options.internals - The ElementInternals instance
 * @param {boolean} options.required - Whether the field is required
 * @param {string | string[] | number} options.value - The current field value
 * @param {HTMLInputElement | HTMLTextAreaElement} options.inputElem - The input element
 * @param {string} options.validationMessage - The custom validation message
 * @param {string} options.defaultMessage - The default validation message
 */
const updateFormValidity = ({
  internals,
  required,
  value,
  inputElem,
  validationMessage,
  defaultMessage = 'Please fill out this field',
}: FormValidityOptions): void => {
  if (!internals) return;

  // Clear the validity state
  internals.states.clear();

  // Check if value is required but missing
  const isEmpty = !value || (typeof value === 'string' && value.trim() === '');

  if (required && isEmpty) {
    // Set validity state to invalid
    internals.states.add('invalid');
    internals.setValidity({ valueMissing: true }, validationMessage ?? defaultMessage, inputElem);
    return;
  }

  // Set validity state to valid if the input has value or is not required
  internals.states.add('valid');
  internals.setValidity({});
};

export { updateFormValidity, type FormValidityOptions };
