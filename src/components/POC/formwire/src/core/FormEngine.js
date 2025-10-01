/**
 * FormEngine - Ultra-lightweight form state management
 *
 * Features:
 * - Minimal memory footprint
 * - Zero dependencies
 * - Optimized for performance
 * - Simple and maintainable
 */

export default class FormEngine {
  constructor(initialValues = {}) {
    // Core state
    this.values = { ...initialValues };
    this.errors = Object.create(null);
    this.touched = new Set();
    this.active = null;
    this.submitting = false;

    // Optimized event system - NO DATA DUPLICATION
    this.listeners = new Map(); // Primary storage for event emission only
    this.contexts = new WeakMap(); // Track contexts for cleanup (metadata only)

    // WeakMap-based caching for performance
    this.valueCache = new WeakMap();
    this.formStateCache = new WeakMap();

    // Performance tracking
    this.operations = 0;
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
   */
  set(path, value) {
    this.operations++;
    this._setByPath(this.values, path, value);

    // Clear relevant caches
    this.valueCache = new WeakMap();
    this.formStateCache = new WeakMap();

    this._emit('change', { path, value });
    this._emit(`change:${path}`, value);
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
    this._emit('error', { path, error });
    this._emit(`error:${path}`, error);
  }

  /**
   * Clear field error
   * @param {string} path - Field path
   */
  clearError(path) {
    delete this.errors[path];
    this._emit('error', { path, error: null });
    this._emit(`error:${path}`, null);
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
    this._emit('touch', { path });
    this._emit(`touch:${path}`, true);
  }

  /**
   * Focus field
   * @param {string} path - Field path
   */
  focus(path) {
    this.active = path;
    this._emit('focus', { path });
    this._emit(`focus:${path}`, true);
  }

  /**
   * Blur field
   */
  blur() {
    this.active = null;
    this._emit('blur', {});
  }

  /**
   * Get form state with WeakMap caching
   */
  getFormState() {
    // Check cache first
    const cacheKey = {
      values: this.values,
      errors: this.errors,
      touched: this.touched,
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
    };

    // Cache the result
    this.formStateCache.set(cacheKey, formState);

    return formState;
  }

  /**
   * Submit form
   * @param {Function} onSubmit - Submit handler
   */
  async submit(onSubmit) {
    this.submitting = true;
    this._emit('submit', { submitting: true });

    try {
      const values = this.getValues();
      const errors = this.getErrors();

      if (Object.keys(errors).length > 0) {
        this.submitting = false;
        this._emit('submit', { submitting: false, success: false, errors });

        return { success: false, errors, values };
      }

      if (onSubmit) {
        await onSubmit(values);
      }

      this.submitting = false;
      this._emit('submit', { submitting: false, success: true, values });

      return { success: true, values };
    } catch (error) {
      this.submitting = false;
      this._emit('submit', { submitting: false, success: false, error: error.message });

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
    this._emit('reset', this.getFormState());
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
