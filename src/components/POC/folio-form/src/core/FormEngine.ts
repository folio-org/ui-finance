/**
 * Folio Form - Core Form Engine
 * 
 * Enhanced React Hook Form implementation with:
 * - Uncontrolled inputs for maximum performance
 * - Ref-based field management
 * - Minimal re-renders
 * - TypeScript-first design
 */

import { RefObject } from 'react';
import { 
  FieldValues, 
  FieldPath, 
  FieldPathValue, 
  FieldError, 
  FieldErrors, 
  FormState, 
  ValidationRules,
  FormOptions 
} from '../types';
import { getByPath, setByPath, getFormValues, setFormValues, clearFormValues, deepEqual } from '../utils';
import { validateForm } from '../utils/validation';

export class FormEngine<T extends FieldValues = FieldValues> {
  // Field references
  private fieldRefs = new Map<string, RefObject<HTMLElement>>();
  private fieldRules = new Map<string, ValidationRules<T>[keyof T]>();
  
  // Form state
  private defaultValues: Partial<T>;
  private currentValues: T;
  private errors: FieldErrors<T> = {};
  private touchedFields = new Set<string>();
  private dirtyFields = new Set<string>();
  private isSubmitting = false;
  private isSubmitted = false;
  private submitCount = 0;
  
  // Configuration
  private options: Required<FormOptions<T>>;
  
  // Event listeners
  private listeners = new Map<string, Set<Function>>();

  constructor(defaultValues: Partial<T> = {}, options: FormOptions<T> = {}) {
    this.defaultValues = { ...defaultValues };
    this.currentValues = { ...defaultValues } as T;
    
    this.options = {
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      defaultValues: { ...defaultValues },
      shouldFocusError: true,
      shouldUnregister: true,
      delayError: 0,
      ...options,
    };
  }

  // ============================================================================
  // FIELD REGISTRATION
  // ============================================================================

  /**
   * Register a field
   */
  register<K extends FieldPath<T>>(
    name: K,
    rules?: ValidationRules<T>[K]
  ): {
    ref: RefObject<HTMLElement>;
    name: string;
    onChange: (event: any) => void;
    onBlur: (event: any) => void;
  } {
    const ref: RefObject<HTMLElement> = { current: null };
    
    // Store field reference and rules
    this.fieldRefs.set(name, ref);
    if (rules) {
      this.fieldRules.set(name, rules);
    }

    return {
      ref,
      name,
      onChange: (event: any) => this.handleFieldChange(name, event),
      onBlur: (event: any) => this.handleFieldBlur(name, event),
    };
  }

  /**
   * Unregister a field
   */
  unregister(name: FieldPath<T>): void {
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
  private handleFieldChange(name: FieldPath<T>, event: any): void {
    const element = event.target;
    let value: any;

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
  private handleFieldBlur(name: FieldPath<T>, event: any): void {
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
  private async validateField(name: FieldPath<T>): Promise<boolean> {
    const rules = this.fieldRules.get(name);
    if (!rules) return true;

    const value = getByPath(this.currentValues, name);
    const fieldNames = Array.from(this.fieldRefs.keys());
    
    const { isValid, errors } = await validateForm(
      this.currentValues,
      { [name]: rules },
      [name]
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
  async validate(): Promise<boolean> {
    const fieldNames = Array.from(this.fieldRefs.keys());
    const rules: Record<string, ValidationRules<T>[keyof T]> = {};
    
    for (const [name, rule] of this.fieldRules) {
      rules[name] = rule;
    }

    const { isValid, errors } = await validateForm(
      this.currentValues,
      rules,
      fieldNames
    );

    this.errors = errors;
    this.emit('validation', { isValid, errors });
    return isValid;
  }

  // ============================================================================
  // VALUE MANAGEMENT
  // ============================================================================

  /**
   * Get value by field name
   */
  getValue<K extends FieldPath<T>>(name: K): FieldPathValue<T, K> {
    return getByPath(this.currentValues, name);
  }

  /**
   * Get all form values
   */
  getValues(): T {
    return { ...this.currentValues };
  }

  /**
   * Set value by field name
   */
  setValue<K extends FieldPath<T>>(
    name: K,
    value: FieldPathValue<T, K>,
    options: { shouldValidate?: boolean; shouldDirty?: boolean; shouldTouch?: boolean } = {}
  ): void {
    setByPath(this.currentValues, name, value);
    
    if (options.shouldDirty !== false) {
      this.dirtyFields.add(name);
    }
    
    if (options.shouldTouch !== false) {
      this.touchedFields.add(name);
    }

    // Update DOM if field is registered
    const ref = this.fieldRefs.get(name);
    if (ref?.current) {
      const element = ref.current as any;
      if (element.type === 'checkbox' || element.type === 'radio') {
        element.checked = Boolean(value);
      } else {
        element.value = value;
      }
    }

    if (options.shouldValidate !== false) {
      this.validateField(name);
    }

    this.emit('change', { name, value });
  }

  // ============================================================================
  // ERROR MANAGEMENT
  // ============================================================================

  /**
   * Set field error
   */
  setError(name: FieldPath<T>, error: FieldError): void {
    this.errors[name] = error;
    this.emit('error', { name, error });
  }

  /**
   * Clear field errors
   */
  clearErrors(name?: FieldPath<T> | FieldPath<T>[]): void {
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
  getErrors(): FieldErrors<T> {
    return { ...this.errors };
  }

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================

  /**
   * Handle form submission
   */
  async handleSubmit(onSubmit: (data: T) => void | Promise<void>): Promise<void> {
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
        error: error instanceof Error ? error.message : 'Submission failed' 
      });
    }
  }

  // ============================================================================
  // FORM STATE
  // ============================================================================

  /**
   * Get form state
   */
  getFormState(): FormState<T> {
    return {
      isDirty: this.dirtyFields.size > 0,
      isValid: Object.keys(this.errors).length === 0,
      isSubmitting: this.isSubmitting,
      isSubmitted: this.isSubmitted,
      submitCount: this.submitCount,
      touchedFields: Object.fromEntries(
        Array.from(this.touchedFields).map(field => [field, true])
      ),
      dirtyFields: Object.fromEntries(
        Array.from(this.dirtyFields).map(field => [field, true])
      ),
      errors: this.getErrors(),
      values: this.getValues(),
    };
  }

  /**
   * Reset form
   */
  reset(values?: Partial<T>): void {
    const resetValues = values || this.defaultValues;
    this.currentValues = { ...resetValues } as T;
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
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

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
  private emit(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
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
  async trigger(name?: FieldPath<T> | FieldPath<T>[]): Promise<boolean> {
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
  watch<K extends FieldPath<T>>(name?: K | K[]): FieldPathValue<T, K> | T {
    if (name) {
      if (Array.isArray(name)) {
        const result: any = {};
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
