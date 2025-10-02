/**
 * Validation utilities for FormWire
 * Centralizes validation logic to eliminate code duplication
 */

/**
 * Validate field with proper error handling
 * @param {Function} validator - Validation function
 * @param {*} value - Field value
 * @param {*} allValues - All form values
 * @param {FormEngine} engine - Form engine instance
 * @param {string} fieldName - Field name
 */
export const validateField = async (validator, value, allValues, engine, fieldName) => {
  if (!validator) return;

  try {
    const result = await validator(value, allValues);

    if (result) {
      engine.setError(fieldName, result);
    } else {
      engine.clearError(fieldName);
    }
  } catch (err) {
    engine.setError(fieldName, err.message);
  }
};
