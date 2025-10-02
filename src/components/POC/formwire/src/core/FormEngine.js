/**
 * FormEngine - Ultra-lightweight form state management with service injection
 *
 * Features:
 * - Service injection for validation, caching, and events
 * - Minimal memory footprint
 * - Zero dependencies
 * - Optimized for performance
 * - Simple and maintainable
 * - Batched updates
 * - Proper WeakMap caching
 */

import {
  EVENTS,
  DEBOUNCE_DELAYS,
  FORM_ENGINE_OPTIONS,
} from '../constants';
import { getByPath, setByPath } from '../utils/path';
import { ValidationService } from './services/ValidationService';
import { CacheService } from './services/CacheService';
import { EventService } from './services/EventService';
import { BatchService } from './services/BatchService';

export default class FormEngine {
  constructor(services = {}) {
    // Services (injected dependencies)
    this.validationService = services.validationService || new ValidationService();
    this.cacheService = services.cacheService || new CacheService();
    this.eventService = services.eventService || new EventService();
    this.batchService = services.batchService || new BatchService();

    // State (initialized via init method)
    this.values = Object.create(null);
    this.errors = Object.create(null);
    this.touched = new Set();
    this.active = null;
    this.submitting = false;
    this.batchQueue = [];
    this.isBatching = false;

    // Configuration (set via init method)
    this.options = {};

    // Initialization state
    this.isInitialized = false;

    // Performance tracking
    this.operations = 0;
    this.renderCount = 0;
  }

  /**
   * Initialize form with values and configuration
   * @param {Object} initialValues - Initial form values
   * @param {Object} config - Form configuration
   */
  init(initialValues = Object.create(null), config = {}) {
    this._resetState();

    this.values = Object.assign(Object.create(null), initialValues);

    this.options = {
      [FORM_ENGINE_OPTIONS.ENABLE_BATCHING]: true,
      [FORM_ENGINE_OPTIONS.BATCH_DELAY]: DEBOUNCE_DELAYS.DEFAULT,
      [FORM_ENGINE_OPTIONS.ENABLE_VALIDATION]: true,
      [FORM_ENGINE_OPTIONS.VALIDATE_ON_CHANGE]: false,
      [FORM_ENGINE_OPTIONS.VALIDATE_ON_BLUR]: true,
      ...config,
    };

    this._configureServices();

    this.isInitialized = true;

    this.eventService.emit(EVENTS.INIT, { values: this.values, config: this.options });

    return this;
  }

  /**
   * Reset form to initial state
   */
  reset() {
    this._resetState();
    this.isInitialized = false;
    this.eventService.emit(EVENTS.RESET, {});

    return this;
  }

  /**
   * Check if form is initialized
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Get current configuration
   * @returns {Object}
   */
  getConfig() {
    return { ...this.options };
  }

  /**
   * Update configuration (partial update)
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    this.options = { ...this.options, ...newConfig };
    this._configureServices();
    this.eventService.emit(EVENTS.CONFIG_UPDATE, { config: this.options });

    return this;
  }

  // ============================================================================
  // CORE METHODS
  // ============================================================================

  /**
   * Get value by path
   * @param {string} path - Dot notation path (e.g., 'user.name', 'items[0].title')
   */
  get(path) {
    this._ensureInitialized();
    this.operations++;

    return this.cacheService.getValue(
      this.cacheService.createValueKey(path, this.values),
      () => getByPath(this.values, path),
    );
  }

  /**
   * Set value by path
   * @param {string} path - Dot notation path
   * @param {*} value - Value to set
   * @param {Object} options - Options for setting value
   */
  set(path, value, options = {}) {
    this._ensureInitialized();
    this.operations++;

    this.values = setByPath(this.values, path, value);

    this.cacheService.clearForPath(path);

    // Run validation if enabled
    if (this.options.enableValidation && this.options.validateOnChange) {
      this._validateField(path, value);
    }

    // Emit events
    if (this.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING] && !options.immediate) {
      this._queueChange(path, value);
    } else {
      this.eventService.emit(EVENTS.CHANGE, { path, value });
      this.eventService.emit(`${EVENTS.CHANGE}:${path}`, value);
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
          this.values = setByPath(this.values, path, value);
          this.cacheService.clearForPath(path);
        });
      });
      this.eventService.emit(EVENTS.CHANGE, { batch: true, updates });
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
    this.batchService.batch(fn, (operations) => {
      this.eventService.emit(EVENTS.CHANGE, { batch: true, updates: operations });

      operations.forEach(({ path, value }) => {
        this.eventService.emit(`${EVENTS.CHANGE}:${path}`, value);
      });
    });
  }

  /**
   * Queue change for batching
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @private
   */
  _queueChange(path, value) {
    this.batchService.queueOperation({ path, value });
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
    this.eventService.emit(EVENTS.ERROR, { path, error });
    this.eventService.emit(`${EVENTS.ERROR}:${path}`, error);
  }

  /**
   * Clear field error
   * @param {string} path - Field path
   */
  clearError(path) {
    delete this.errors[path];
    this.eventService.emit(EVENTS.ERROR, { path, error: null });
    this.eventService.emit(`${EVENTS.ERROR}:${path}`, null);
  }

  /**
   * Register validator for field
   * @param {string} path - Field path
   * @param {Function} validator - Validation function
   */
  registerValidator(path, validator) {
    this.validationService.registerValidator(path, validator);
  }

  /**
   * Check if validator is registered for field
   * @param {string} path - Field path
   * @returns {boolean}
   */
  hasValidator(path) {
    return this.validationService.validators.has(path);
  }

  /**
   * Validate field
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @private
   */
  async _validateField(path, value) {
    const error = await this.validationService.validateField(path, value, this.values);

    if (error) {
      this.setError(path, error);
    } else {
      this.clearError(path);
    }
  }

  /**
   * Validate all fields
   */
  async validateAll() {
    const errors = await this.validationService.validateAll(this.values);

    // Update errors
    this.errors = errors;
    this.eventService.emit(EVENTS.VALIDATION, { errors });

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
    this.eventService.emit(EVENTS.TOUCH, { path });
    this.eventService.emit(`${EVENTS.TOUCH}:${path}`, true);
  }

  /**
   * Focus field
   * @param {string} path - Field path
   */
  focus(path) {
    this.active = path;
    this.eventService.emit(EVENTS.FOCUS, { path });
    this.eventService.emit(`${EVENTS.FOCUS}:${path}`, true);
  }

  /**
   * Blur field
   */
  blur() {
    this.active = null;
    this.eventService.emit(EVENTS.BLUR, {});
  }

  /**
   * Get form state with improved WeakMap caching
   */
  getFormState() {
    this._ensureInitialized();

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

    return this.cacheService.getFormState(formState, () => formState);
  }

  // ============================================================================
  // SERVICE MANAGEMENT
  // ============================================================================

  /**
   * Replace validation service
   * @param {ValidationService} service - New validation service
   */
  setValidationService(service) {
    this.validationService = service;
    this._configureServices();

    return this;
  }

  /**
   * Replace cache service
   * @param {CacheService} service - New cache service
   */
  setCacheService(service) {
    this.cacheService = service;

    return this;
  }

  /**
   * Replace event service
   * @param {EventService} service - New event service
   */
  setEventService(service) {
    this.eventService = service;

    return this;
  }

  /**
   * Get service statistics
   * @returns {Object} Statistics from all services
   */
  getServiceStats() {
    return {
      cache: this.cacheService.getStats(),
      validation: {
        validatorsCount: this.validationService.validators.size,
        options: this.validationService.options,
      },
      events: this.eventService.getStats(),
      batch: this.batchService.getStats(),
      engine: {
        operations: this.operations,
        renderCount: this.renderCount,
        isInitialized: this.isInitialized,
      },
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Reset form state
   * @private
   */
  _resetState() {
    this.values = {};
    this.errors = Object.create(null);
    this.touched.clear();
    this.active = null;
    this.submitting = false;
    this.batchQueue = [];
    this.isBatching = false;
    this.operations = 0;
    this.renderCount = 0;
  }

  /**
   * Configure services with current config
   * @private
   */
  _configureServices() {
    if (this.validationService && this.validationService.updateConfig) {
      this.validationService.updateConfig({
        debounceDelay: this.options.batchDelay,
        validateOnChange: this.options.validateOnChange,
        validateOnBlur: this.options.validateOnBlur,
      });
    }

    if (this.batchService && this.batchService.updateConfig) {
      this.batchService.updateConfig({
        enableBatching: this.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING],
        batchDelay: this.options[FORM_ENGINE_OPTIONS.BATCH_DELAY],
      });
    }
  }

  /**
   * Ensure form is initialized
   * @private
   */
  _ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('FormEngine must be initialized before use. Call init() first.');
    }
  }

  /**
   * Submit form
   * @param {Function} onSubmit - Submit handler
   */
  async submit(onSubmit) {
    this._ensureInitialized();
    this.submitting = true;
    this.eventService.emit(EVENTS.SUBMIT, { submitting: true });

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
        this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: false, errors });

        return { success: false, errors, values };
      }

      if (onSubmit) {
        await onSubmit(values);
      }

      this.submitting = false;
      this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: true, values });

      return { success: true, values };
    } catch (error) {
      this.submitting = false;
      this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: false, error: error.message });

      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  /**
   * Subscribe to events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @param {Object} context - Context for cleanup (optional)
   * @returns {Function} Unsubscribe function
   */
  on(event, callback, context = null) {
    return this.eventService.on(event, callback, context);
  }
}
