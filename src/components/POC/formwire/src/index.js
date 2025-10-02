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
export { default as FormEngine } from './core/FormEngine.js';

// React components
export { default as Form } from './react/Form.js';
export { default as Field } from './react/Field.js';
export { default as FieldArray } from './react/FieldArray.js';

// React hooks
export {
  useField,
  useFormState,
  useWatch,
  useFormSubmit,
  useDebouncedValidation,
} from './react/hooks.js';

// React context
export {
  FormProvider,
  useFormEngine,
  useFormContext,
} from './react/FormContext.js';

// Default export
export { default } from './react/Form.js';
