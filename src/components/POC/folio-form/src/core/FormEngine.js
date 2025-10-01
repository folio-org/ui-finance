/**
 * Folio Form - Core Form Engine
 *
 * Enhanced React Hook Form implementation with:
 * - Uncontrolled inputs for maximum performance
 * - Ref-based field management
 * - Minimal re-renders
 * - JavaScript implementation
 */

import { getByPath, setByPath, setFormValues } from '../utils';

export class FormEngine {
  constructor(defaultValues = {}, options = {}) {
    // Field references
    this.fieldRefs = new Map();
    this.fieldRules = new Map();

    // Form state
    this.defaultValues = { ...defaultValues };
    this.currentValues = { ...defaultValues };
    this.errors = {};
    this.touchedFields = new Set();
    this.dirtyFields = new Set();
    this.isSubmitting = false;
    this.isSubmitted = false;
    this.submitCount = 0;

    // Configuration
    this.options = {
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      defaultValues: { ...defaultValues },
      shouldFocusError: true,
      shouldUnregister: true,
      delayError: 0,
      ...options,
    };

    // Event listeners
    this.listeners = new Map();

    // Performance optimizations
    this._valuesCache = null;
    this._valuesCacheVersion = 0;
    this._valuesVersion = 0;
  }

  // ============================================================================
  // FIELD REGISTRATION
  // ============================================================================

  /**
   * Register a field
   */
  register(name, rules) {
    const ref = { current: null };

    // Store field reference and rules
    this.fieldRefs.set(name, ref);
    if (rules) {
      this.fieldRules.set(name, rules);
    }

    return {
      ref,
      name,
      onChange: (event) => this.handleFieldChange(name, event),
      onBlur: (event) => this.handleFieldBlur(name, event),
    };
  }

  /**
   * Unregister a field
   */
  unregister(name) {
    this.fieldRefs.delete(name);
    this.fieldRules.delete(name);
    this.touchedFields.delete(name);
    this.dirtyFields.delete(name);
    delete this.errors[name];
  }

  // ============================================================================
  // FIELD HANDLERS
  // ============================================================================

  /**
   * Handle field change
   */
  handleFieldChange(name, event) {
    const element = event.target;
    let value;

    if (element.type === 'checkbox') {
      value = element.checked;
    } else if (element.type === 'radio') {
      value = element.checked ? element.value : undefined;
    } else if (element.type === 'file') {
      value = element.files;
    } else {
      value = element.value;
    }

    // Update current values
    setByPath(this.currentValues, name, value);

    // Mark as dirty
    this.dirtyFields.add(name);

    // Clear error if exists
    if (this.errors[name]) {
      delete this.errors[name];
    }

    // Validate if mode is onChange
    if (this.options.mode === 'onChange' || this.options.mode === 'all') {
      this.validateField(name);
    }

    // Emit change event
    this.emit('change', { name, value });
  }

  /**
   * Handle field blur
   */
  handleFieldBlur(name, _event) {
    // Mark as touched
    this.touchedFields.add(name);

    // Validate if mode is onBlur
    if (this.options.mode === 'onBlur' || this.options.mode === 'all') {
      this.validateField(name);
    }

    // Emit blur event
    this.emit('blur', { name });
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  /**
   * Validate a single field
   */
  async validateField(name) {
    const rules = this.fieldRules.get(name);

    if (!rules) return true;

    const { isValid, errors } = await this.validateFormFields(
      this.currentValues,
      { [name]: rules },
      [name],
    );

    if (!isValid) {
      this.errors = { ...this.errors, ...errors };
    } else {
      delete this.errors[name];
    }

    this.emit('validation', { name, isValid, errors });

    return isValid;
  }

  /**
   * Validate all fields
   */
  async validate() {
    const fieldNames = Array.from(this.fieldRefs.keys());
    const rules = {};

    for (const [name, rule] of this.fieldRules) {
      rules[name] = rule;
    }

    const { isValid, errors } = await this.validateFormFields(
      this.currentValues,
      rules,
      fieldNames,
    );

    this.errors = errors;
    this.emit('validation', { isValid, errors });

    return isValid;
  }

  /**
   * Validate form fields
   */
  async validateFormFields(values, rules, fieldNames) {
    const errors = {};
    let isValid = true;

    for (const fieldName of fieldNames) {
      const fieldRules = rules[fieldName];

      if (!fieldRules) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const value = getByPath(values, fieldName);
      const result = await this.validateFieldValue(value, fieldRules, values, fieldName);

      if (!result.isValid && result.error) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  /**
   * Validate a single field value
   */
  async validateFieldValue(value, rules, formValues, _fieldName) {
    // Required validation
    if (rules.required) {
      if (this.isEmpty(value)) {
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
    if (this.isEmpty(value)) {
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
   * Check if value is empty
   */
  isEmpty(value) {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;

    return false;
  }

  // Removed getValueByPath - using utils/getByPath instead

  // ============================================================================
  // VALUE MANAGEMENT
  // ============================================================================

  /**
   * Get value by field name
   */
  getValue(name) {
    return getByPath(this.currentValues, name);
  }

  /**
   * Get all form values - OPTIMIZED
   */
  getValues() {
    // Return reference if no changes, create copy only when needed
    if (this._valuesCache && this._valuesCacheVersion === this._valuesVersion) {
      return this._valuesCache;
    }

    this._valuesCache = { ...this.currentValues };
    this._valuesCacheVersion = this._valuesVersion;

    return this._valuesCache;
  }

  /**
   * Set value by field name
   */
  setValue(name, value, options = {}) {
    setByPath(this.currentValues, name, value);

    // Invalidate cache
    this._valuesVersion++;

    if (options.shouldDirty !== false) {
      this.dirtyFields.add(name);
    }

    if (options.shouldTouch !== false) {
      this.touchedFields.add(name);
    }

    // Update DOM if field is registered
    const ref = this.fieldRefs.get(name);

    if (ref?.current) {
      const element = ref.current;

      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = Boolean(value);
      } else {
        element.value = value;
      }
    }

    // Async validation to avoid blocking UI
    if (options.shouldValidate !== false) {
      Promise.resolve().then(() => this.validateField(name));
    }

    this.emit('change', { name, value });
  }

  // ============================================================================
  // ERROR MANAGEMENT
  // ============================================================================

  /**
   * Set field error
   */
  setError(name, error) {
    this.errors[name] = error;
    this.emit('error', { name, error });
  }

  /**
   * Clear field errors
   */
  clearErrors(name) {
    if (name) {
      const names = Array.isArray(name) ? name : [name];

      for (const fieldName of names) {
        delete this.errors[fieldName];
      }
    } else {
      this.errors = {};
    }
    this.emit('errors', { errors: this.errors });
  }

  /**
   * Get field errors
   */
  getErrors() {
    return { ...this.errors };
  }

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================

  /**
   * Handle form submission
   */
  async handleSubmit(onSubmit) {
    this.isSubmitting = true;
    this.submitCount++;
    this.emit('submit', { isSubmitting: true });

    try {
      // Validate form
      const isValid = await this.validate();

      if (!isValid) {
        this.isSubmitting = false;
        this.emit('submit', { isSubmitting: false, isValid: false, errors: this.errors });

        return;
      }

      // Call submit handler
      await onSubmit(this.getValues());

      this.isSubmitted = true;
      this.isSubmitting = false;
      this.emit('submit', { isSubmitting: false, isValid: true, values: this.getValues() });
    } catch (error) {
      this.isSubmitting = false;
      this.emit('submit', {
        isSubmitting: false,
        isValid: false,
        error: error instanceof Error ? error.message : 'Submission failed',
      });
    }
  }

  // ============================================================================
  // FORM STATE
  // ============================================================================

  /**
   * Get form state
   */
  getFormState() {
    return {
      isDirty: this.dirtyFields.size > 0,
      isValid: Object.keys(this.errors).length === 0,
      isSubmitting: this.isSubmitting,
      isSubmitted: this.isSubmitted,
      submitCount: this.submitCount,
      touchedFields: Object.fromEntries(
        Array.from(this.touchedFields).map(field => [field, true]),
      ),
      dirtyFields: Object.fromEntries(
        Array.from(this.dirtyFields).map(field => [field, true]),
      ),
      errors: this.getErrors(),
      values: this.getValues(),
    };
  }

  /**
   * Reset form
   */
  reset(values) {
    const resetValues = values || this.defaultValues;

    this.currentValues = { ...resetValues };
    this.errors = {};
    this.touchedFields.clear();
    this.dirtyFields.clear();
    this.isSubmitting = false;
    this.isSubmitted = false;
    this.submitCount = 0;

    // Reset DOM values
    setFormValues(this.fieldRefs, resetValues);

    this.emit('reset', { values: resetValues });
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  /**
   * Subscribe to events
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    return () => {
      const listeners = this.listeners.get(event);

      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Emit event
   */
  emit(event, data) {
    const listeners = this.listeners.get(event);

    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Trigger validation for specific fields
   */
  async trigger(name) {
    if (name) {
      const names = Array.isArray(name) ? name : [name];
      const results = await Promise.all(names.map(n => this.validateField(n)));

      return results.every(result => result);
    } else {
      return this.validate();
    }
  }

  /**
   * Watch field values
   */
  watch(name) {
    if (name) {
      if (Array.isArray(name)) {
        const result = {};

        for (const fieldName of name) {
          result[fieldName] = this.getValue(fieldName);
        }

        return result;
      } else {
        return this.getValue(name);
      }
    } else {
      return this.getValues();
    }
  }
}
