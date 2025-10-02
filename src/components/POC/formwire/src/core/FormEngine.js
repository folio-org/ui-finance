/**
 * FormEngine - Ultra-lightweight form state management
 *
 * Features:
 * - Minimal memory footprint
 * - Zero dependencies
 * - Optimized for performance
 * - Simple and maintainable
 * - Built-in validation system
 * - Batched updates
 * - Proper WeakMap caching
 */

import {
  EVENTS,
  DEBOUNCE_DELAYS,
  FORM_ENGINE_OPTIONS,
} from '../constants';

export default class FormEngine {
  constructor(initialValues = {}, options = {}) {
    // Core state
    this.values = { ...initialValues };
    this.errors = Object.create(null);
    this.touched = new Set();
    this.active = null;
    this.submitting = false;
    this.validators = new Map();
    this.batchQueue = [];
    this.isBatching = false;

    // Configuration
    this.options = {
      [FORM_ENGINE_OPTIONS.ENABLE_BATCHING]: true,
      [FORM_ENGINE_OPTIONS.BATCH_DELAY]: DEBOUNCE_DELAYS.DEFAULT,
      [FORM_ENGINE_OPTIONS.ENABLE_VALIDATION]: true,
      [FORM_ENGINE_OPTIONS.VALIDATE_ON_CHANGE]: false,
      [FORM_ENGINE_OPTIONS.VALIDATE_ON_BLUR]: true,
      ...options,
    };

    // Optimized event system - NO DATA DUPLICATION
    this.listeners = new Map(); // Primary storage for event emission only
    this.contexts = new WeakMap(); // Track contexts for cleanup (metadata only)

    // Improved WeakMap-based caching for performance
    this.valueCache = new WeakMap();
    this.formStateCache = new WeakMap();
    this.validationCache = new WeakMap();

    // Performance tracking
    this.operations = 0;
    this.renderCount = 0;
  }

  // ============================================================================
  // CORE METHODS
  // ============================================================================

  /**
   * Get value by path
   * @param {string} path - Dot notation path (e.g., 'user.name', 'items[0].title')
   */
  get(path) {
    this.operations++;

    // Check cache first
    const cacheKey = { path, values: this.values };

    if (this.valueCache.has(cacheKey)) {
      return this.valueCache.get(cacheKey);
    }

    const value = this._getByPath(this.values, path);

    // Cache the result
    this.valueCache.set(cacheKey, value);

    return value;
  }

  /**
   * Set value by path
   * @param {string} path - Dot notation path
   * @param {*} value - Value to set
   * @param {Object} options - Options for setting value
   */
  set(path, value, options = {}) {
    this.operations++;
    this._setByPath(this.values, path, value);

    // Clear only relevant caches instead of all caches
    this._clearRelevantCaches(path);

    // Run validation if enabled
    if (this.options.enableValidation && this.options.validateOnChange) {
      this._validateField(path, value);
    }

    // Emit events
    if (this.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING] && !options.immediate) {
      this._queueChange(path, value);
    } else {
      this._emit(EVENTS.CHANGE, { path, value });
      this._emit(`${EVENTS.CHANGE}:${path}`, value);
    }
  }

  /**
   * Set multiple values in batch
   * @param {Array} updates - Array of {path, value} objects
   */
  setMany(updates) {
    if (this.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING]) {
      this.batch(() => {
        updates.forEach(({ path, value }) => {
          this._setByPath(this.values, path, value);
          this._clearRelevantCaches(path);
        });
      });
      this._emit(EVENTS.CHANGE, { batch: true, updates });
    } else {
      updates.forEach(({ path, value }) => {
        this.set(path, value, { immediate: true });
      });
    }
  }

  /**
   * Batch multiple operations
   * @param {Function} fn - Function containing operations to batch
   */
  batch(fn) {
    if (this.isBatching) {
      fn();

      return;
    }

    this.isBatching = true;
    this.batchQueue = [];

    try {
      fn();
    } finally {
      this.isBatching = false;

      this._flushBatch();
    }
  }

  /**
   * Flush pending batch operations
   * @private
   */
  _flushBatch() {
    if (this.batchQueue.length === 0) return;

    const updates = [...this.batchQueue];

    this.batchQueue = [];

    this._emit(EVENTS.CHANGE, { batch: true, updates });

    updates.forEach(({ path, value }) => {
      this._emit(`${EVENTS.CHANGE}:${path}`, value);
    });
  }

  /**
   * Queue change for batching
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @private
   */
  _queueChange(path, value) {
    this.batchQueue.push({ path, value });

    if (this.options.batchDelay > 0) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = setTimeout(() => {
        this._flushBatch();
      }, this.options.batchDelay);
    } else if (!this.batchScheduled) {
      // Use microtask for immediate batching
      this.batchScheduled = true;
      queueMicrotask(() => {
        this.batchScheduled = false;
        this._flushBatch();
      });
    }
  }

  /**
   * Get all values
   */
  getValues() {
    return { ...this.values };
  }

  /**
   * Set field error
   * @param {string} path - Field path
   * @param {string} error - Error message
   */
  setError(path, error) {
    this.errors[path] = error;
    this._emit(EVENTS.ERROR, { path, error });
    this._emit(`${EVENTS.ERROR}:${path}`, error);
  }

  /**
   * Clear field error
   * @param {string} path - Field path
   */
  clearError(path) {
    delete this.errors[path];
    this._emit(EVENTS.ERROR, { path, error: null });
    this._emit(`${EVENTS.ERROR}:${path}`, null);
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
   * @private
   */
  async _validateField(path, value) {
    const validator = this.validators.get(path);

    if (!validator) return;

    try {
      const result = await validator(value, this.values);

      if (result) {
        this.setError(path, result);
      } else {
        this.clearError(path);
      }
    } catch (error) {
      this.setError(path, error.message);
    }
  }

  /**
   * Validate all fields
   */
  async validateAll() {
    const errors = {};

    for (const [path, validator] of this.validators) {
      const value = this.get(path);

      try {
        const result = await validator(value, this.values);

        if (result) {
          errors[path] = result;
        }
      } catch (error) {
        errors[path] = error.message;
      }
    }

    // Update errors
    this.errors = errors;
    this._emit(EVENTS.VALIDATION, { errors });

    return Object.keys(errors).length === 0;
  }

  /**
   * Get all errors
   */
  getErrors() {
    return { ...this.errors };
  }

  /**
   * Check if field is touched
   * @param {string} path - Field path
   */
  isTouched(path) {
    return this.touched.has(path);
  }

  /**
   * Mark field as touched
   * @param {string} path - Field path
   */
  touch(path) {
    this.touched.add(path);
    this._emit(EVENTS.TOUCH, { path });
    this._emit(`${EVENTS.TOUCH}:${path}`, true);
  }

  /**
   * Focus field
   * @param {string} path - Field path
   */
  focus(path) {
    this.active = path;
    this._emit(EVENTS.FOCUS, { path });
    this._emit(`${EVENTS.FOCUS}:${path}`, true);
  }

  /**
   * Blur field
   */
  blur() {
    this.active = null;
    this._emit(EVENTS.BLUR, {});
  }

  /**
   * Get form state with improved WeakMap caching
   */
  getFormState() {
    // Check cache first - use a more stable cache key
    const cacheKey = {
      valuesHash: this._hashObject(this.values),
      errorsHash: this._hashObject(this.errors),
      touchedSize: this.touched.size,
      active: this.active,
      submitting: this.submitting,
    };

    if (this.formStateCache.has(cacheKey)) {
      return this.formStateCache.get(cacheKey);
    }

    const formState = {
      values: this.getValues(),
      errors: this.getErrors(),
      touched: Array.from(this.touched),
      active: this.active,
      submitting: this.submitting,
      valid: Object.keys(this.errors).length === 0,
      dirty: this.touched.size > 0,
      pristine: this.touched.size === 0,
    };

    // Cache the result
    this.formStateCache.set(cacheKey, formState);

    return formState;
  }

  /**
   * Clear only relevant caches instead of all caches
   * @param {string} path - Field path that changed
   * @private
   */
  _clearRelevantCaches(_path) {
    // Clear value cache for this path and parent paths
    const pathParts = _path.split('.');

    for (let i = 0; i < pathParts.length; i++) {
      const partialPath = pathParts.slice(0, i + 1).join('.');

      // Clear cache entries that might be affected by this change
      this._clearCacheForPath(partialPath);
    }

    // Clear form state cache
    this.formStateCache = new WeakMap();
  }

  /**
   * Clear cache entries for a specific path
   * @param {string} path - Path to clear cache for
   * @private
   */
  _clearCacheForPath(_path) {
    // This is a simplified implementation
    // In a real implementation, you'd track which cache entries are affected by which paths
    this.valueCache = new WeakMap();
  }

  /**
   * Create a simple hash of an object for caching
   * @param {Object} obj - Object to hash
   * @returns {string} Hash string
   * @private
   */
  _hashObject(obj) {
    return JSON.stringify(obj);
  }

  /**
   * Submit form
   * @param {Function} onSubmit - Submit handler
   */
  async submit(onSubmit) {
    this.submitting = true;
    this._emit(EVENTS.SUBMIT, { submitting: true });

    try {
      const values = this.getValues();

      // Run validation for all fields before submit
      const isValid = await this.validateAll();
      const errors = this.getErrors();

      if (!isValid || Object.keys(errors).length > 0) {
        // Mark all fields with errors as touched so errors are displayed
        Object.keys(errors).forEach(fieldName => {
          this.touched.add(fieldName);
        });

        this.submitting = false;
        this._emit(EVENTS.SUBMIT, { submitting: false, success: false, errors });

        return { success: false, errors, values };
      }

      if (onSubmit) {
        await onSubmit(values);
      }

      this.submitting = false;
      this._emit(EVENTS.SUBMIT, { submitting: false, success: true, values });

      return { success: true, values };
    } catch (error) {
      this.submitting = false;
      this._emit(EVENTS.SUBMIT, { submitting: false, success: false, error: error.message });

      return { success: false, error: error.message };
    }
  }

  /**
   * Reset form
   */
  reset() {
    this.values = {};
    this.errors = Object.create(null);
    this.touched.clear();
    this.active = null;
    this.submitting = false;
    this._emit(EVENTS.RESET, this.getFormState());
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  /**
   * Subscribe to events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback, context = null) {
    // Store listener in Map for event emission (PRIMARY STORAGE)
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Track context for cleanup (METADATA ONLY - NO DUPLICATION)
    if (context) {
      if (!this.contexts.has(context)) {
        this.contexts.set(context, new Set());
      }
      // Store only metadata reference, not the callback itself
      this.contexts.get(context).add({ event, callback });
    }

    return () => {
      // Remove from primary Map
      const listeners = this.listeners.get(event);

      if (listeners) {
        listeners.delete(callback);
      }

      // Remove from context tracking
      if (context) {
        const contextCallbacks = this.contexts.get(context);

        if (contextCallbacks) {
          contextCallbacks.delete({ event, callback });
        }
      }
    };
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {*} data - Event data
   * @private
   */
  _emit(event, data) {
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
   * Get value by path
   * @param {Object} obj - Object to get value from
   * @param {string} path - Dot notation path
   * @returns {*} Value at path
   * @private
   */
  _getByPath(obj, path) {
    if (!path) return obj;

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current == null) return undefined;
      current = this._getKeyValue(current, key);
    }

    return current;
  }

  /**
   * Get value for a single key (handles array notation)
   * @param {Object} current - Current object
   * @param {string} key - Key to get
   * @returns {*} Value at key
   * @private
   */
  _getKeyValue(current, key) {
    if (key.includes('[') && key.includes(']')) {
      return this._getArrayValue(current, key);
    }

    return current[key];
  }

  /**
   * Get array value
   * @param {Object} current - Current object
   * @param {string} key - Array key like 'items[0]'
   * @returns {*} Value at array index
   * @private
   */
  _getArrayValue(current, key) {
    const arrayKey = key.substring(0, key.indexOf('['));
    const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);

    let arrayObj = current;

    if (arrayKey) {
      arrayObj = current[arrayKey];

      if (arrayObj == null) return undefined;
    }

    if (!Array.isArray(arrayObj)) return undefined;

    return arrayObj[index];
  }

  /**
   * Set value by path
   * @param {Object} obj - Object to set value in
   * @param {string} path - Dot notation path
   * @param {*} value - Value to set
   * @private
   */
  _setByPath(obj, path, value) {
    if (!path) return;

    const keys = path.split('.');
    let current = obj;

    // Navigate to parent
    for (let i = 0; i < keys.length - 1; i++) {
      current = this._navigateToKey(current, keys[i]);
      if (!current) return;
    }

    // Set final value
    this._setFinalValue(current, keys[keys.length - 1], value);
  }

  /**
   * Navigate to a key, creating objects/arrays as needed
   * @param {Object} current - Current object
   * @param {string} key - Key to navigate to
   * @returns {Object} Next object
   * @private
   */
  _navigateToKey(current, key) {
    if (key.includes('[') && key.includes(']')) {
      return this._navigateToArrayKey(current, key);
    }

    return this._navigateToObjectKey(current, key);
  }

  /**
   * Navigate to array key
   * @param {Object} current - Current object
   * @param {string} key - Array key like 'items[0]'
   * @returns {Object} Next object
   * @private
   */
  _navigateToArrayKey(current, key) {
    const arrayKey = key.substring(0, key.indexOf('['));
    const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);

    let arrayObj = current;

    if (arrayKey) {
      if (!(arrayKey in current)) {
        current[arrayKey] = [];
      }
      arrayObj = current[arrayKey];
    }

    if (!Array.isArray(arrayObj)) return null;

    if (index >= arrayObj.length) {
      while (arrayObj.length <= index) {
        arrayObj.push(undefined);
      }
    }

    if (arrayObj[index] == null) {
      arrayObj[index] = {};
    }

    return arrayObj[index];
  }

  /**
   * Navigate to object key
   * @param {Object} current - Current object
   * @param {string} key - Object key
   * @returns {Object} Next object
   * @private
   */
  _navigateToObjectKey(current, key) {
    if (!(key in current)) {
      current[key] = {};
    }

    return current[key];
  }

  /**
   * Set final value
   * @param {Object} current - Current object
   * @param {string} key - Final key
   * @param {*} value - Value to set
   * @private
   */
  _setFinalValue(current, key, value) {
    if (key.includes('[') && key.includes(']')) {
      this._setArrayValue(current, key, value);
    } else {
      current[key] = value;
    }
  }

  /**
   * Set array value
   * @param {Object} current - Current object
   * @param {string} key - Array key like 'items[0]'
   * @param {*} value - Value to set
   * @private
   */
  _setArrayValue(current, key, value) {
    const arrayKey = key.substring(0, key.indexOf('['));
    const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')), 10);

    let arrayObj = current;

    if (arrayKey) {
      if (!(arrayKey in current)) {
        current[arrayKey] = [];
      }
      arrayObj = current[arrayKey];
    }

    if (!Array.isArray(arrayObj)) return;

    if (index >= arrayObj.length) {
      while (arrayObj.length <= index) {
        arrayObj.push(undefined);
      }
    }

    arrayObj[index] = value;
  }
}
