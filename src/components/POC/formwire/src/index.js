/**
 * FormWire - Ultra-lightweight form state management
 *
 * Exports:
 * - FormEngine: Core form engine with batching and validation
 * - Form: Main form component
 * - Field: High-performance field with debouncing and selective subscriptions
 * - FieldArray: Array field component with enhanced methods
 * - Hooks: useField, useFormState, useWatch, useFormSubmit, useDebouncedValidation
 * - Context: FormProvider, useFormEngine, useFormContext
 */

// Core
export { default as FormEngine } from './core/FormEngine';

// Services
export { ValidationService } from './core/services/ValidationService';
export { CacheService } from './core/services/CacheService';
export { EventService } from './core/services/EventService';
export { BatchService } from './core/services/BatchService';

// React components
export { default as Form } from './react/Form';
export { default as Field } from './react/Field';
export { default as FieldArray } from './react/FieldArray';

// React hooks
export {
  useField,
  useFormState,
  useWatch,
  useFormSubmit,
} from './react/hooks';

// React context
export {
  FormProvider,
  useFormEngine,
  useFormContext,
} from './react/FormContext';

// Utilities
export * from './utils/index';

// Default export
export { default } from './react/Form';
