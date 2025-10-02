/**
 * Validation Service - External validation logic
 * Can be injected into FormEngine for custom validation behavior
 */

import { getByPath } from '../../utils/path';

export class ValidationService {
  constructor(options = {}) {
    this.validators = new Map(); // Map<path, {validator, validateOn}>
    this.options = {
      debounceDelay: 300,
      validateOnChange: false,
      validateOnBlur: true,
      ...options,
    };
  }

  /**
   * Register validator for field
   * @param {string} path - Field path
   * @param {Function} validator - Validation function
   * @param {string} validateOn - Validation mode ('blur', 'change', 'submit')
   */
  registerValidator(path, validator, validateOn = 'blur') {
    this.validators.set(path, { validator, validateOn });
  }

  /**
   * Validate field
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @param {*} allValues - All form values
   * @returns {Promise<string|null>} Error message or null
   */
  async validateField(path, value, allValues) {
    const validatorData = this.validators.get(path);

    if (!validatorData) return null;

    const { validator } = validatorData;

    try {
      const result = await validator(value, allValues);

      return result || null;
    } catch (error) {
      return error.message;
    }
  }

  /**
   * Validate all fields
   * @param {*} allValues - All form values
   * @returns {Promise<Object>} Errors object
   */
  async validateAll(allValues) {
    const errors = {};

    for (const [path] of this.validators) {
      const value = getByPath(allValues, path);
      const error = await this.validateField(path, value, allValues);

      if (error) {
        errors[path] = error;
      }
    }

    return errors;
  }

  /**
   * Validate field with mode check
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @param {*} allValues - All form values
   * @param {string} mode - Validation mode ('blur', 'change', 'submit')
   * @returns {Promise<string|null>} Error message or null
   */
  async validateFieldWithMode(path, value, allValues, mode) {
    const validatorData = this.validators.get(path);

    if (!validatorData) {
      return null;
    }

    const { validateOn } = validatorData;

    // Check if field should be validated in this mode
    if (validateOn !== mode) {
      return null;
    }

    return this.validateField(path, value, allValues);
  }

  /**
   * Create debounced validator
   * @param {Function} validator - Validation function
   * @param {number} delay - Debounce delay
   * @returns {Function} Debounced validator
   */
  createDebouncedValidator(validator, delay = this.options.debounceDelay) {
    let timeoutId = null;
    let lastValue = null;

    const debouncedValidator = (value, allValues, onResult) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (lastValue === value) {
        return;
      }

      lastValue = value;

      timeoutId = setTimeout(async () => {
        try {
          const result = await validator(value, allValues);

          onResult(result || null);
        } catch (error) {
          onResult(error.message);
        }
      }, delay);
    };

    debouncedValidator.cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    return debouncedValidator;
  }
}
