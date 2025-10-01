/**
 * Folio Form - Validation utilities
 */

import { isEmpty } from './index';

// ============================================================================
// VALIDATION RULES
// ============================================================================

/**
 * Validate a single field value against rules
 */
export async function validateField(value, rules, formValues, _fieldName) {
  if (!rules) {
    return { isValid: true };
  }

  // Required validation
  if (rules.required) {
    if (isEmpty(value)) {
      return {
        isValid: false,
        error: {
          type: 'required',
          message: typeof rules.required === 'string' ? rules.required : 'This field is required',
        },
      };
    }
  }

  // Skip other validations if value is empty and not required
  if (isEmpty(value)) {
    return { isValid: true };
  }

  // Min validation
  if (rules.min !== undefined) {
    const minValue = typeof rules.min === 'number' ? rules.min : rules.min.value;
    const message = typeof rules.min === 'object' ? rules.min.message : `Value must be at least ${minValue}`;

    if (typeof value === 'number' && value < minValue) {
      return {
        isValid: false,
        error: { type: 'min', message },
      };
    }
  }

  // Max validation
  if (rules.max !== undefined) {
    const maxValue = typeof rules.max === 'number' ? rules.max : rules.max.value;
    const message = typeof rules.max === 'object' ? rules.max.message : `Value must be at most ${maxValue}`;

    if (typeof value === 'number' && value > maxValue) {
      return {
        isValid: false,
        error: { type: 'max', message },
      };
    }
  }

  // MinLength validation
  if (rules.minLength !== undefined) {
    const minLength = typeof rules.minLength === 'number' ? rules.minLength : rules.minLength.value;
    const message = typeof rules.minLength === 'object' ? rules.minLength.message : `Value must be at least ${minLength} characters`;

    if (typeof value === 'string' && value.length < minLength) {
      return {
        isValid: false,
        error: { type: 'minLength', message },
      };
    }
  }

  // MaxLength validation
  if (rules.maxLength !== undefined) {
    const maxLength = typeof rules.maxLength === 'number' ? rules.maxLength : rules.maxLength.value;
    const message = typeof rules.maxLength === 'object' ? rules.maxLength.message : `Value must be at most ${maxLength} characters`;

    if (typeof value === 'string' && value.length > maxLength) {
      return {
        isValid: false,
        error: { type: 'maxLength', message },
      };
    }
  }

  // Pattern validation
  if (rules.pattern !== undefined) {
    const pattern = typeof rules.pattern === 'object' ? rules.pattern.value : rules.pattern;
    const message = typeof rules.pattern === 'object' ? rules.pattern.message : 'Value does not match required pattern';

    if (typeof value === 'string' && !pattern.test(value)) {
      return {
        isValid: false,
        error: { type: 'pattern', message },
      };
    }
  }

  // Custom validation
  if (rules.validate) {
    try {
      const result = await rules.validate(value, formValues);

      if (result === false) {
        return {
          isValid: false,
          error: { type: 'validate', message: 'Invalid value' },
        };
      }

      if (typeof result === 'string') {
        return {
          isValid: false,
          error: { type: 'validate', message: result },
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: { type: 'validate', message: error instanceof Error ? error.message : 'Validation failed' },
      };
    }
  }

  return { isValid: true };
}

/**
 * Validate all fields in a form
 */
export async function validateForm(values, rules, fieldNames) {
  const errors = {};
  let isValid = true;

  for (const fieldName of fieldNames) {
    const fieldRules = rules[fieldName];

    if (!fieldRules) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const value = getValueByPath(values, fieldName);
    const result = await validateField(value, fieldRules, values, fieldName);

    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Get value by path from object
 */
function getValueByPath(obj, path) {
  if (!path || !obj) return undefined;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current == null) return undefined;

    if (key.includes('[') && key.includes(']')) {
      const arrayKey = key.substring(0, key.indexOf('['));
      const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);

      if (arrayKey) {
        current = current[arrayKey];
        if (current == null) return undefined;
      }

      if (!Array.isArray(current)) return undefined;
      current = current[index];
    } else {
      current = current[key];
    }
  }

  return current;
}

// ============================================================================
// COMMON VALIDATION RULES
// ============================================================================

export const commonRules = {
  required: (message) => ({
    required: message || 'This field is required',
  }),

  email: (message) => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: message || 'Invalid email address',
    },
  }),

  minLength: (min, message) => ({
    minLength: {
      value: min,
      message: message || `Must be at least ${min} characters`,
    },
  }),

  maxLength: (max, message) => ({
    maxLength: {
      value: max,
      message: message || `Must be at most ${max} characters`,
    },
  }),

  min: (min, message) => ({
    min: {
      value: min,
      message: message || `Must be at least ${min}`,
    },
  }),

  max: (max, message) => ({
    max: {
      value: max,
      message: message || `Must be at most ${max}`,
    },
  }),

  pattern: (pattern, message) => ({
    pattern: {
      value: pattern,
      message: message || 'Invalid format',
    },
  }),
};
