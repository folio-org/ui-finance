/**
 * Constants for formwire library
 */

// Field state action types
export const FIELD_ACTIONS = {
  SET_VALUE: 'SET_VALUE',
  SET_ERROR: 'SET_ERROR',
  SET_TOUCHED: 'SET_TOUCHED',
  SET_ACTIVE: 'SET_ACTIVE',
  UPDATE_MULTIPLE: 'UPDATE_MULTIPLE',
};

// Form state action types
export const FORM_ACTIONS = {
  UPDATE_FORM_STATE: 'UPDATE_FORM_STATE',
};

// Validation modes
export const VALIDATION_MODES = {
  CHANGE: 'change',
  BLUR: 'blur',
  SUBMIT: 'submit',
};

// Default subscription settings
export const DEFAULT_SUBSCRIPTION = {
  value: true,
  error: true,
  touched: true,
  active: false,
};

// Default form state subscription
export const DEFAULT_FORM_SUBSCRIPTION = {
  values: true,
  errors: true,
  touched: true,
  active: true,
  submitting: true,
  valid: true,
};

// Event types
export const EVENTS = {
  CHANGE: 'change',
  ERROR: 'error',
  TOUCH: 'touch',
  FOCUS: 'focus',
  BLUR: 'blur',
  SUBMIT: 'submit',
  VALIDATION: 'validation',
  RESET: 'reset',
};

// Field event prefixes
export const FIELD_EVENT_PREFIXES = {
  CHANGE: 'change:',
  ERROR: 'error:',
  TOUCH: 'touch:',
};

// Debounce delays
export const DEBOUNCE_DELAYS = {
  DEFAULT: 0,
  TEXT: 300,
  NUMBER: 200,
};

// Form engine options
export const FORM_ENGINE_OPTIONS = {
  ENABLE_BATCHING: 'enableBatching',
  BATCH_DELAY: 'batchDelay',
  ENABLE_VALIDATION: 'enableValidation',
  VALIDATE_ON_CHANGE: 'validateOnChange',
  VALIDATE_ON_BLUR: 'validateOnBlur',
};
