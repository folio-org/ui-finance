/**
 * Validation Service - External validation logic
 * Can be injected into FormEngine for custom validation behavior
 */

import { getByPath } from '../../utils/path';

export class ValidationService {
  constructor(options = {}) {
    this.validators = new Map();
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
   */
  registerValidator(path, validator) {
    this.validators.set(path, validator);
  }

  /**
   * Validate field
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @param {*} allValues - All form values
   * @returns {Promise<string|null>} Error message or null
   */
  async validateField(path, value, allValues) {
    const validator = this.validators.get(path);

    if (!validator) return null;

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
