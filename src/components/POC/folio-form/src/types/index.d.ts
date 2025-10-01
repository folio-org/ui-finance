/**
 * Folio Form - TypeScript definitions
 */

import { RefObject } from 'react';

// ============================================================================
// CORE TYPES
// ============================================================================

export type FieldValue = any;
export type FieldValues = Record<string, FieldValue>;
export type FieldPath<T extends FieldValues> = string & keyof T;
export type FieldPathValue<T extends FieldValues, TFieldPath extends FieldPath<T>> = T[TFieldPath];

export interface FieldError {
  type: string;
  message?: string;
  ref?: HTMLElement;
}

export interface FieldErrors<T extends FieldValues = FieldValues> {
  [K in keyof T]?: FieldError;
}

export interface Field {
  ref: RefObject<HTMLElement>;
  name: string;
  value?: FieldValue;
  onChange: (event: any) => void;
  onBlur: (event: any) => void;
}

export interface FieldArrayField<T extends FieldValues = FieldValues> {
  id: string;
  name: string;
  value: FieldValue;
}

// ============================================================================
// FORM STATE
// ============================================================================

export interface FormState<T extends FieldValues = FieldValues> {
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  touchedFields: Partial<Record<keyof T, boolean>>;
  dirtyFields: Partial<Record<keyof T, boolean>>;
  errors: FieldErrors<T>;
  values: T;
}

// ============================================================================
// VALIDATION
// ============================================================================

export type ValidationRule<T = any> = {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: T, formValues: FieldValues) => boolean | string | Promise<boolean | string>;
};

export type ValidationRules<T extends FieldValues = FieldValues> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

// ============================================================================
// FORM CONFIGURATION
// ============================================================================

export interface FormOptions<T extends FieldValues = FieldValues> {
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'all';
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
  defaultValues?: Partial<T>;
  resolver?: (values: T) => Promise<{ values: T; errors: FieldErrors<T> }>;
  shouldFocusError?: boolean;
  shouldUnregister?: boolean;
  delayError?: number;
}

// ============================================================================
// HOOKS
// ============================================================================

export interface UseFormReturn<T extends FieldValues = FieldValues> {
  // Form methods
  register: <TFieldName extends FieldPath<T>>(
    name: TFieldName,
    rules?: ValidationRules<T>[TFieldName]
  ) => Field;
  unregister: (name: FieldPath<T>) => void;
  setValue: <TFieldName extends FieldPath<T>>(
    name: TFieldName,
    value: FieldPathValue<T, TFieldName>,
    options?: { shouldValidate?: boolean; shouldDirty?: boolean; shouldTouch?: boolean }
  ) => void;
  getValue: <TFieldName extends FieldPath<T>>(name: TFieldName) => FieldPathValue<T, TFieldName>;
  getValues: (payload?: string | string[]) => T | Partial<T>;
  setError: (name: FieldPath<T>, error: FieldError) => void;
  clearErrors: (name?: FieldPath<T> | FieldPath<T>[]) => void;
  trigger: (name?: FieldPath<T> | FieldPath<T>[]) => Promise<boolean>;
  reset: (values?: Partial<T>) => void;
  handleSubmit: (onSubmit: (data: T) => void | Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  
  // Form state
  formState: FormState<T>;
  watch: <TFieldName extends FieldPath<T>>(name?: TFieldName | TFieldName[]) => FieldPathValue<T, TFieldName> | T;
  
  // Field array methods
  append: (value: FieldValue) => void;
  prepend: (value: FieldValue) => void;
  insert: (index: number, value: FieldValue) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  update: (index: number, value: FieldValue) => void;
  remove: (index: number | number[]) => void;
  replace: (values: FieldValue[]) => void;
}

export interface UseFieldArrayReturn<T extends FieldValues = FieldValues> {
  fields: FieldArrayField<T>[];
  append: (value: FieldValue) => void;
  prepend: (value: FieldValue) => void;
  insert: (index: number, value: FieldValue) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  update: (index: number, value: FieldValue) => void;
  remove: (index: number | number[]) => void;
  replace: (values: FieldValue[]) => void;
}

// ============================================================================
// COMPONENTS
// ============================================================================

export interface ControllerProps<T extends FieldValues = FieldValues> {
  name: FieldPath<T>;
  control?: any;
  rules?: ValidationRules<T>[FieldPath<T>];
  render: ({ field, fieldState, formState }: {
    field: Field;
    fieldState: { error?: FieldError; isTouched: boolean; isDirty: boolean };
    formState: FormState<T>;
  }) => React.ReactElement;
}

export interface FormProviderProps<T extends FieldValues = FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
}

// ============================================================================
// UTILITIES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepMap<T, U> = {
  [K in keyof T]: T[K] extends object ? DeepMap<T[K], U> : U;
};

export type DeepPartialMap<T, U> = {
  [K in keyof T]?: T[K] extends object ? DeepPartialMap<T[K], U> : U;
};
